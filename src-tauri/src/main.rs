#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod protocols;
use protocols::protocol_manager::{send_file_via_best, start_receiver};

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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![send_file, receive_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
