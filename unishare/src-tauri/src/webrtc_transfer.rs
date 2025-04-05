use std::sync::Arc;
use std::error::Error;

use tokio::fs::File;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

use webrtc::api::APIBuilder;

use webrtc::api::media_engine::MediaEngine;
// Import Registry directly from the inner module.
use webrtc::data_channel::data_channel_init::RTCDataChannelInit;
use webrtc::data_channel::RTCDataChannel;
use webrtc::peer_connection::configuration::RTCConfiguration;
use webrtc::peer_connection::peer_connection_state::RTCPeerConnectionState;
use webrtc::peer_connection::sdp::session_description::RTCSessionDescription;
use webrtc::peer_connection::RTCPeerConnection;

use bytes::Bytes;
use serde_json;

// Global storage for demonstration purposes.
static mut SENDER_PC: Option<Arc<RTCPeerConnection>> = None;
static mut RECEIVER_PC: Option<Arc<RTCPeerConnection>> = None;
static mut SENDER_DC: Option<Arc<RTCDataChannel>> = None;

/// Creates a WebRTC offer on the sender side and returns the SDP offer as a JSON string.
pub async fn create_webrtc_offer() -> Result<String, Box<dyn Error>> {
    let mut m = MediaEngine::default();
    m.register_default_codecs()?;
    let api = Arc::new(
        APIBuilder::new()
            .with_media_engine(m)
            .build(),
    );

    let config = RTCConfiguration {
        ice_servers: vec![], // Add STUN/TURN servers as needed.
        ..Default::default()
    };

    let pc: Arc<RTCPeerConnection> = Arc::new(api.new_peer_connection(config).await?);

    let dci = RTCDataChannelInit::default();
    let dc = pc.create_data_channel("file-transfer", Some(dci)).await?;
    
    // Store the data channel globally.
    unsafe {
        SENDER_DC = Some(dc.clone());
    }
    
    // Set up an on_open callback for the data channel.
    let dc_clone = dc.clone();
    dc.on_open(Box::new(move || {
        Box::pin(async move {
            println!("[Sender] DataChannel is open: {}", dc_clone.label());
        })
    }));
    
    let offer = pc.create_offer(None).await?;
    pc.set_local_description(offer.clone()).await?;
    
    unsafe {
        SENDER_PC = Some(pc);
    }

    let offer_json = serde_json::to_string(&offer)?;
    Ok(offer_json)
}

/// Once the sender receives the SDP answer from the receiver, this function sets the remote
/// description and then sends the file data over the DataChannel.
pub async fn set_remote_description_and_send_file(
    file_path: &str,
    answer_sdp_json: &str,
) -> Result<(), Box<dyn Error>> {
    let answer: RTCSessionDescription = serde_json::from_str(answer_sdp_json)?;
    let pc = unsafe {
        SENDER_PC
            .as_ref()
            .ok_or("Sender PC not initialized")?
            .clone()
    };

    pc.set_remote_description(answer).await?;

    // Wait until the connection is established.
    while pc.connection_state() != RTCPeerConnectionState::Connected {
        tokio::time::sleep(std::time::Duration::from_millis(100)).await;
    }

    // Read the file data.
    let mut file = File::open(file_path).await?;
    let mut file_data = Vec::new();
    file.read_to_end(&mut file_data).await?;

    // Retrieve the DataChannel from global storage.
    let dc = unsafe {
        SENDER_DC
            .as_ref()
            .ok_or("DataChannel not initialized")?
            .clone()
    };

    // Convert file_data to Bytes and send over the data channel.
    dc.send(&Bytes::from(file_data)).await?;
    println!("[Sender] File sent via WebRTC data channel.");

    Ok(())
}

/// On the receiver side, this function accepts the sender's SDP offer,
/// creates an answer, sets up callbacks for the data channel, and returns the answer as JSON.
pub async fn create_webrtc_answer(offer_sdp_json: &str) -> Result<String, Box<dyn Error>> {
    let mut m = MediaEngine::default();
    m.register_default_codecs()?;
    let api = Arc::new(APIBuilder::new().with_media_engine(m).build());

    let config = RTCConfiguration {
        ice_servers: vec![], // Adjust as necessary.
        ..Default::default()
    };

    let pc: Arc<RTCPeerConnection> = Arc::new(api.new_peer_connection(config).await?);
    let offer: RTCSessionDescription = serde_json::from_str(offer_sdp_json)?;
    pc.set_remote_description(offer).await?;

    // Set up the on_data_channel callback.
    pc.on_data_channel(Box::new(move |dc| {
        println!("[Receiver] New DataChannel: {}", dc.label());
        // Clone the data channel for use in callbacks.
        let dc_open = dc.clone();
        dc.on_open(Box::new(move || {
            let dc_open_clone = dc_open.clone();
            Box::pin(async move {
                println!("[Receiver] DataChannel is open: {}", dc_open_clone.label());
            })
        }));
        let dc_for_msg = dc.clone();
        dc.on_message(Box::new(move |msg| {
            Box::pin(async move {
                println!("[Receiver] Received file data of size {}", msg.data.len());
                let filename = format!("webrtc_received_{}.bin", chrono::Utc::now().timestamp());
                if let Ok(mut f) = File::create(&filename).await {
                    if f.write_all(&msg.data).await.is_ok() {
                        println!("[Receiver] File saved as {}", filename);
                    }
                }
            })
        }));
        Box::pin(async {})
    }));

    let answer = pc.create_answer(None).await?;
    pc.set_local_description(answer.clone()).await?;
    
    unsafe {
        RECEIVER_PC = Some(pc);
    }
    
    let answer_json = serde_json::to_string(&answer)?;
    Ok(answer_json)
}
