use std::error::Error;
use tokio::time::{sleep, Duration};

/// Dummy check for Mobile Data availability.
pub fn is_available() -> bool {
    // For simulation, assume mobile data is available as a fallback.
    true
}

/// Simulates sending a file via Mobile Data.
pub async fn send_file(file_path: &str, destination: &str) -> Result<(), Box<dyn Error>> {
    println!("Simulating sending file '{}' to '{}' via Mobile Data.", file_path, destination);
    sleep(Duration::from_secs(5)).await;
    Ok(())
}

/// Simulates starting a receiver for incoming files via Mobile Data.
pub async fn start_receiver() -> Result<(), Box<dyn Error>> {
    println!("Simulating starting receiver for Mobile Data.");
    sleep(Duration::from_secs(1)).await;
    Ok(())
}
