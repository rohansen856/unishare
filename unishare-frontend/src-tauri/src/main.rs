use std::collections::HashMap;

#[cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod protocols;
use protocols::protocol_manager::{send_file_via_best, start_receiver};
mod tools;
use tools::connectivity::{check_bluetooth, check_wifi_direct, check_internet};

mod device_discovery;
use device_discovery::{start_hotspot_discovery, start_hotspot};
use protocols::bluetooth;

mod webrtc_transfer;
use webrtc_transfer::{
    create_webrtc_offer,
    set_remote_description_and_send_file,
    create_webrtc_answer,
};

#[tauri::command]
async fn send_file(file_path: String, destination: String) -> Result<String, String> {
    match send_file_via_best(&file_path, &destination).await {
        Ok(msg) => Ok(msg),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
async fn receive_file() -> Result<String, String> {
    match start_receiver().await {
        Ok(msg) => Ok(msg),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
async fn check_connectivity_status() -> Result<HashMap<String, bool>, String> {
    let bluetooth_enabled = check_bluetooth().unwrap_or(false);
    let wifi_direct_enabled = check_wifi_direct().unwrap_or(false);
    let internet_connected = check_internet().unwrap_or(false);

    let mut status = HashMap::new();
    status.insert("bluetooth".to_string(), bluetooth_enabled);
    status.insert("wifiDirect".to_string(), wifi_direct_enabled);
    status.insert("internet".to_string(), internet_connected);

    Ok(status)
}

#[tauri::command]
async fn send_file_bluetooth(file_path: String, destination: String) -> Result<String, String> {
    match bluetooth::send_file(&file_path, &destination).await {
        Ok(_) => Ok("Sent via Bluetooth".into()),
        Err(e) => Err(format!("Bluetooth error: {}", e)),
    }
}

#[tauri::command]
async fn receive_file_bluetooth() -> Result<String, String> {
    match bluetooth::start_receiver().await {
        Ok(_) => Ok("Receiver started via Bluetooth".into()),
        Err(e) => Err(format!("Bluetooth error: {}", e)),
    }
}

#[tauri::command]
async fn start_webrtc_sending(file_path: String) -> Result<String, String> {
    match create_webrtc_offer().await {
        Ok(offer_sdp_json) => Ok(offer_sdp_json),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
async fn complete_webrtc_sending(file_path: String, answer_sdp_json: String) -> Result<String, String> {
    match set_remote_description_and_send_file(&file_path, &answer_sdp_json).await {
        Ok(_) => Ok("File sent via WebRTC successfully".into()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
async fn receive_webrtc_file(offer_sdp_json: String) -> Result<String, String> {
    match create_webrtc_answer(&offer_sdp_json).await {
        Ok(answer_sdp_json) => Ok(answer_sdp_json),
        Err(e) => Err(e.to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            send_file,
            receive_file,
            send_file_bluetooth,
            receive_file_bluetooth,
            check_connectivity_status,
            start_hotspot,
            start_hotspot_discovery,
            start_webrtc_sending,
            complete_webrtc_sending,
            receive_webrtc_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}