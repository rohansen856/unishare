use std::error::Error;
use tokio::time::{sleep, Duration};

/// Dummy check for Bluetooth availability.
pub fn is_available() -> bool {
    // For simulation, mark Bluetooth as unavailable.
    false
}

/// Simulates sending a file via Bluetooth.
pub async fn send_file(file_path: &str, destination: &str) -> Result<(), Box<dyn Error>> {
    println!("Simulating sending file '{}' to '{}' via Bluetooth.", file_path, destination);
    sleep(Duration::from_secs(4)).await;
    Ok(())
}

/// Simulates starting a receiver for incoming files via Bluetooth.
pub async fn start_receiver() -> Result<(), Box<dyn Error>> {
    println!("Simulating starting receiver for Bluetooth.");
    sleep(Duration::from_secs(1)).await;
    Ok(())
}
