use crate::protocols::{wifi_direct, webrtc, bluetooth, mobiledata};


pub async fn send_file_via_best(file_path: &str, destination: &str) -> Result<String, Box<dyn std::error::Error>> {
    if wifi_direct::is_available() {
        println!("Using Wi‑Fi Direct for file transfer.");
        wifi_direct::send_file(file_path, destination).await?;
        return Ok("File sent via Wi‑Fi Direct".to_string());
    }
    if webrtc::is_available() {
        println!("Using WebRTC for file transfer.");
        webrtc::send_file(file_path, destination).await?;
        return Ok("File sent via WebRTC".to_string());
    }
    if bluetooth::is_available().await {
        println!("Using Bluetooth for file transfer.");
        bluetooth::send_file(file_path, destination).await?;
        return Ok("File sent via Bluetooth".to_string());
    }
    if mobiledata::is_available() {
        println!("Using Mobile Data for file transfer.");
        mobiledata::send_file(file_path, destination).await?;
        return Ok("File sent via Mobile Data".to_string());
    }
    Err("No available protocol found for file transfer.".into())
}

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
    if bluetooth::is_available().await {
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
