use std::error::Error;
use tokio::time::{sleep, Duration};

/// Dummy check for Wi‑Fi Direct availability.
pub fn is_available() -> bool {
    true
}

/// Simulates sending a file via Wi‑Fi Direct.
pub async fn send_file(file_path: &str, destination: &str) -> Result<(), Box<dyn Error>> {
    println!("Simulating sending file '{}' to '{}' via Wi‑Fi Direct.", file_path, destination);
    // Simulate file transfer delay
    sleep(Duration::from_secs(2)).await;
    Ok(())
}

/// Simulates starting a receiver for incoming files via Wi‑Fi Direct.
pub async fn start_receiver() -> Result<(), Box<dyn Error>> {
    println!("Simulating starting receiver for Wi‑Fi Direct.");
    sleep(Duration::from_secs(1)).await;
    Ok(())
}
