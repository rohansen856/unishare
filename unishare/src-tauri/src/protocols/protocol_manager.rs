use crate::protocols::{wifi_direct, webrtc, bluetooth, mobiledata};

/// Selects the best available protocol and sends the file.
/// This simulation checks in order: Wi‑Fi Direct, WebRTC, Bluetooth, Mobile Data.
pub async fn send_file_via_best(file_path: &str, destination: &str) -> Result<String, Box<dyn std::error::Error>> {
    // 1) Wi‑Fi Direct
    if wifi_direct::is_available() {
        println!("Using Wi‑Fi Direct for file transfer.");
        wifi_direct::send_file(file_path, destination).await?;
        return Ok("File sent via Wi‑Fi Direct".to_string());
    }
    // 2) WebRTC
    if webrtc::is_available() {
        println!("Using WebRTC for file transfer.");
        webrtc::send_file(file_path, destination).await?;
        return Ok("File sent via WebRTC".to_string());
    }
    // 3) Bluetooth
    if bluetooth::is_available() {
        println!("Using Bluetooth for file transfer.");
        bluetooth::send_file(file_path, destination).await?;
        return Ok("File sent via Bluetooth".to_string());
    }
    // 4) Mobile Data
    if mobiledata::is_available() {
        println!("Using Mobile Data for file transfer.");
        mobiledata::send_file(file_path, destination).await?;
        return Ok("File sent via Mobile Data".to_string());
    }
    Err("No available protocol found for file transfer.".into())
}

/// Starts the receiver on the best available protocol.
pub async fn start_receiver() -> Result<String, Box<dyn std::error::Error>> {
    if wifi_direct::is_available() {
        println!("Starting Wi‑Fi Direct receiver.");
        wifi_direct::start_receiver().await?;
        return Ok("Receiver started using Wi‑Fi Direct".to_string());
    }
    if webrtc::is_available() {
        println!("Starting WebRTC receiver.");
        webrtc::start_receiver().await?;
        return Ok("Receiver started using WebRTC".to_string());
    }
    if bluetooth::is_available() {
        println!("Starting Bluetooth receiver.");
        bluetooth::start_receiver().await?;
        return Ok("Receiver started using Bluetooth".to_string());
    }
    if mobiledata::is_available() {
        println!("Starting Mobile Data receiver.");
        mobiledata::start_receiver().await?;
        return Ok("Receiver started using Mobile Data".to_string());
    }
    Err("No available protocol found for receiving file.".into())
}
