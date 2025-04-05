#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod protocols;
mod webrtc_transfer;

use protocols::protocol_manager::{send_file_via_best, start_receiver};
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

/// WebRTC Commands
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
            start_webrtc_sending,
            complete_webrtc_sending,
            receive_webrtc_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
