use std::collections::HashMap;

#[cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod protocols;
use protocols::protocol_manager::{send_file_via_best, start_receiver};
mod tools;
use tools::connectivity::{check_bluetooth, check_wifi_direct, check_internet};

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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![send_file, receive_file, check_connectivity_status])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
