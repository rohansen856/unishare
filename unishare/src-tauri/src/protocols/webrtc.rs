use std::error::Error;
use tokio::time::{sleep, Duration};

/// Dummy check for WebRTC availability.
pub fn is_available() -> bool {
    // For simulation, mark WebRTC as unavailable.
    false
}

/// Simulates sending a file via WebRTC.
pub async fn send_file(file_path: &str, destination: &str) -> Result<(), Box<dyn Error>> {
    println!("Simulating sending file '{}' to '{}' via WebRTC.", file_path, destination);
    sleep(Duration::from_secs(3)).await;
    Ok(())
}

/// Simulates starting a receiver for incoming files via WebRTC.
pub async fn start_receiver() -> Result<(), Box<dyn Error>> {
    println!("Simulating starting receiver for WebRTC.");
    sleep(Duration::from_secs(1)).await;
    Ok(())
}
