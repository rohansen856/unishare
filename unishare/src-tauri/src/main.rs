#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod protocols;
use protocols::protocol_manager::{send_file_via_best, start_receiver};
use protocols::bluetooth; // Import the bluetooth module

#[tauri::command]
async fn send_file(file_path: String, destination: String) -> Result<String, String> {
    match send_file_via_best(&file_path, &destination).await {
        Ok(msg) => Ok(msg),
        Err(e) => Err(e.to_string()),
    }
}

/// Specifically uses Bluetooth to send a file (simulated or real in bluetooth.rs)
#[tauri::command]
async fn send_file_bluetooth(file_path: String, destination: String) -> Result<String, String> {
    match bluetooth::send_file(&file_path, &destination).await {
        Ok(_) => Ok("Sent via Bluetooth".into()),
        Err(e) => Err(format!("Bluetooth error: {}", e)),
    }
}

/// Specifically uses Bluetooth to start a receiver (simulated)
#[tauri::command]
async fn receive_file_bluetooth() -> Result<String, String> {
    match bluetooth::start_receiver().await {
        Ok(_) => Ok("Receiver started via Bluetooth".into()),
        Err(e) => Err(format!("Bluetooth error: {}", e)),
    }
}

#[tauri::command]
async fn receive_file() -> Result<String, String> {
    match start_receiver().await {
        Ok(msg) => Ok(msg),
        Err(e) => Err(e.to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            send_file,
            receive_file,
            send_file_bluetooth,
            receive_file_bluetooth
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
