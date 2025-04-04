use std::error::Error;
use tokio::time::{sleep, Duration};

use btleplug::api::{Peripheral, WriteType};
use btleplug::platform::Manager;

/// Checks whether Bluetooth is available.
/// Returns true if we can find at least one Bluetooth adapter.
/// This function is now async.
pub async fn is_available() -> bool {
    match Manager::new().await {
        Ok(manager) => match manager.adapters().await {
            Ok(adapters) => !adapters.is_empty(),
            Err(_) => false,
        },
        Err(_) => false,
    }
}

/// Tries to send a file using Bluetooth (simulated here).
/// In a real implementation, you would extend this to use OBEX or another protocol.
pub async fn send_file(file_path: &str, _destination: &str) -> Result<(), Box<dyn Error>> {
    println!("🔵 Scanning for Bluetooth devices...");

    let manager = Manager::new().await?;
    let adapters = manager.adapters().await?;

    if adapters.is_empty() {
        return Err("❌ No Bluetooth adapters found.".into());
    }

    // Use the first available adapter
    let central = adapters.into_iter().next().unwrap();
    central.start_scan().await?;

    sleep(Duration::from_secs(3)).await;

    let peripherals = central.peripherals().await?;
    if peripherals.is_empty() {
        println!("❌ No Bluetooth devices found.");
        return Err("No Bluetooth devices found.".into());
    }

    println!("✅ Found {} Bluetooth devices. (Simulated)", peripherals.len());

    // Simulate file sending process
    println!("📤 Sending file '{}' via Bluetooth to first available device...", file_path);
    sleep(Duration::from_secs(5)).await;

    println!("✅ File sent (simulated).");
    Ok(())
}

/// Starts a receiver that listens for incoming files via Bluetooth (simulated).
/// For a real implementation, integrate with platform-specific APIs (e.g., DBus on Linux or CoreBluetooth on macOS).
pub async fn start_receiver() -> Result<(), Box<dyn Error>> {
    println!("📥 Listening for incoming Bluetooth file transfers...");
    sleep(Duration::from_secs(2)).await;
    println!("✅ File received (simulated).");
    Ok(())
}
