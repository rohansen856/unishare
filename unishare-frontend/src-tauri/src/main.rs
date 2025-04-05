#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod protocols;
mod device_discovery;

use protocols::protocol_manager::{send_file_via_best, start_receiver};

use device_discovery::{start_hotspot_discovery, start_hotspot};

use tauri::Manager;

#[tauri::command]
async fn send_file(file_path: String, destination: String) -> Result<String, String> {
    match send_file_via_best(&file_path, &destination).await {
        Ok(_) => Ok("File sent successfully".to_string()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
async fn receive_file() -> Result<String, String> {
    match start_receiver().await {
        Ok(_) => Ok("Receiver started successfully".to_string()),
        Err(e) => Err(e.to_string()),
    }
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            send_file,
            receive_file,
            start_hotspot,
            start_hotspot_discovery,
            start_hotspot,
        ])
        .run(tauri::generate_context!())
        .expect("❌ Error while running Tauri application");
}
