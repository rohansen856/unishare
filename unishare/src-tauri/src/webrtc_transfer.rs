use std::sync::Arc;
use std::error::Error;
use std::time::Instant;

use tokio::fs::File;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

use webrtc::api::APIBuilder;
use webrtc::api::media_engine::MediaEngine;
use webrtc::data_channel::data_channel_init::RTCDataChannelInit;
use webrtc::data_channel::RTCDataChannel;
use webrtc::ice_transport::ice_server::RTCIceServer;
use webrtc::peer_connection::configuration::RTCConfiguration;
use webrtc::peer_connection::peer_connection_state::RTCPeerConnectionState;
use webrtc::peer_connection::sdp::session_description::RTCSessionDescription;
use webrtc::peer_connection::RTCPeerConnection;

use bytes::Bytes;
use serde_json;

static mut SENDER_PC: Option<Arc<RTCPeerConnection>> = None;
static mut RECEIVER_PC: Option<Arc<RTCPeerConnection>> = None;
static mut SENDER_DC: Option<Arc<RTCDataChannel>> = None;

/// Creates a WebRTC offer on the sender side and returns the SDP offer as a JSON string.
pub async fn create_webrtc_offer() -> Result<String, Box<dyn Error>> {
    println!("\n📡 [Sender] Initializing WebRTC offer...");

    let mut m = MediaEngine::default();
    m.register_default_codecs()?;
    let api = Arc::new(APIBuilder::new().with_media_engine(m).build());

    let config = RTCConfiguration {
        ice_servers: vec![RTCIceServer {
            urls: vec!["stun:stun.l.google.com:19302".to_string()],
            ..Default::default()
        }],
        ..Default::default()
    };

    let pc = Arc::new(api.new_peer_connection(config).await?);

    pc.on_peer_connection_state_change(Box::new(move |state| {
        println!("🔄 [Sender] PeerConnection state changed: {:?}", state);
        Box::pin(async {})
    }));

    pc.on_ice_candidate(Box::new(|candidate| {
        if let Some(c) = candidate {
            println!("📶 [Sender] ICE Candidate: {:?}", c.to_json());
        } else {
            println!("✅ [Sender] ICE Gathering Complete");
        }
        Box::pin(async {})
    }));

    println!("📡 [Sender] Creating data channel...");
    let dci = RTCDataChannelInit::default();
    let dc = pc.create_data_channel("file-transfer", Some(dci)).await?;

    unsafe {
        SENDER_DC = Some(dc.clone());
    }

    let dc_clone = dc.clone();
    dc.on_open(Box::new(move || {
        Box::pin(async move {
            println!("✅ [Sender] DataChannel is open: {}", dc_clone.label());
        })
    }));

    let offer = pc.create_offer(None).await?;
    pc.set_local_description(offer.clone()).await?;
    println!("📝 [Sender] Offer created and set as local description.");

    unsafe {
        SENDER_PC = Some(pc);
    }

    let offer_json = serde_json::to_string(&offer)?;
    println!("📤 [Sender] Returning SDP offer JSON.");
    Ok(offer_json)
}

/// Sets remote description on sender and sends file.
pub async fn set_remote_description_and_send_file(
    file_path: &str,
    answer_sdp_json: &str,
) -> Result<(), Box<dyn Error>> {
    println!("\n📨 [Sender] Applying remote answer...");

    let answer: RTCSessionDescription = serde_json::from_str(answer_sdp_json)?;
    let pc = unsafe {
        SENDER_PC
            .as_ref()
            .ok_or("❌ [Sender] Error: Sender PC not initialized")?
            .clone()
    };

    pc.set_remote_description(answer).await?;
    println!("🔗 [Sender] Remote description set successfully.");

    println!("⏳ [Sender] Waiting for connection to establish...");
    let start = Instant::now();
    while pc.connection_state() != RTCPeerConnectionState::Connected {
        println!("⏳ [Sender] Waiting... current state: {:?}", pc.connection_state());
        tokio::time::sleep(std::time::Duration::from_millis(500)).await;

        if start.elapsed().as_secs() > 15 {
            println!("❌ [Sender] Timeout waiting for connection. Connection failed.");
            return Err("WebRTC connection timeout".into());
        }
    }
    println!("✅ [Sender] PeerConnection state: Connected.");

    println!("📂 [Sender] Reading file from path: {}", file_path);
    let mut file = File::open(file_path).await?;
    let mut file_data = Vec::new();
    file.read_to_end(&mut file_data).await?;
    println!("📦 [Sender] File size: {} bytes", file_data.len());

    let dc = unsafe {
        SENDER_DC
            .as_ref()
            .ok_or("❌ [Sender] DataChannel not initialized")?
            .clone()
    };

    dc.send(&Bytes::from(file_data)).await?;
    println!("🚀 [Sender] File sent via WebRTC data channel.");

    Ok(())
}

/// Handles the receiver logic and returns an answer.
pub async fn create_webrtc_answer(offer_sdp_json: &str) -> Result<String, Box<dyn Error>> {
    println!("\n📡 [Receiver] Initializing WebRTC answer...");

    let mut m = MediaEngine::default();
    m.register_default_codecs()?;
    let api = Arc::new(APIBuilder::new().with_media_engine(m).build());

    let config = RTCConfiguration {
        ice_servers: vec![RTCIceServer {
            urls: vec!["stun:stun.l.google.com:19302".to_string()],
            ..Default::default()
        }],
        ..Default::default()
    };

    let pc = Arc::new(api.new_peer_connection(config).await?);

    pc.on_peer_connection_state_change(Box::new(move |state| {
        println!("🔄 [Receiver] PeerConnection state changed: {:?}", state);
        Box::pin(async {})
    }));

    pc.on_ice_candidate(Box::new(|candidate| {
        if let Some(c) = candidate {
            println!("📶 [Receiver] ICE Candidate: {:?}", c.to_json());
        } else {
            println!("✅ [Receiver] ICE Gathering Complete");
        }
        Box::pin(async {})
    }));

    let offer: RTCSessionDescription = serde_json::from_str(offer_sdp_json)?;
    pc.set_remote_description(offer).await?;
    println!("📝 [Receiver] Offer set as remote description.");

    pc.on_data_channel(Box::new(move |dc| {
        println!("📥 [Receiver] DataChannel received: {}", dc.label());

        let dc_open = dc.clone();
        dc.on_open(Box::new(move || {
            let dc_open_clone = dc_open.clone();
            Box::pin(async move {
                println!("✅ [Receiver] DataChannel is open: {}", dc_open_clone.label());
            })
        }));

        let dc_for_msg = dc.clone();
        dc.on_message(Box::new(move |msg| {
            Box::pin(async move {
                println!("📨 [Receiver] Received file data of size {} bytes", msg.data.len());
                let filename = format!("webrtc_received_{}.bin", chrono::Utc::now().timestamp());

                match File::create(&filename).await {
                    Ok(mut file) => {
                        match file.write_all(&msg.data).await {
                            Ok(_) => println!("✅ [Receiver] File saved as {}", filename),
                            Err(e) => println!("❌ [Receiver] Failed to write file: {}", e),
                        }
                    }
                    Err(e) => println!("❌ [Receiver] Could not create file: {}", e),
                }
            })
        }));

        Box::pin(async {})
    }));

    let answer = pc.create_answer(None).await?;
    pc.set_local_description(answer.clone()).await?;
    println!("📤 [Receiver] Returning SDP answer JSON.");

    // Give ICE time to complete
    tokio::time::sleep(std::time::Duration::from_secs(2)).await;

    unsafe {
        RECEIVER_PC = Some(pc);
    }

    let answer_json = serde_json::to_string(&answer)?;
    Ok(answer_json)
}
