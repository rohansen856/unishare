use std::error::Error;
use std::fs;
use std::path::PathBuf;
use tempfile::tempdir;
use tokio::task;
use tokio::time::{sleep, Duration};

// Import the functions to test.
use unishare::protocols::bluetooth::{send_file, start_receiver};

#[tokio::test]
async fn test_bluetooth_send_receive() -> Result<(), Box<dyn Error>> {
    // Create a temporary directory.
    let temp_dir = tempdir()?;
    
    // Set the current working directory to the temporary directory.
    std::env::set_current_dir(&temp_dir)?;

    // Create a test file with known content.
    let test_content = b"Test content for Bluetooth transfer";
    let test_file_path: PathBuf = temp_dir.path().join("test.txt");
    fs::write(&test_file_path, test_content)?;

    // Spawn the receiver in a background task.
    let receiver_handle = task::spawn(async {
        start_receiver().await
    });

    // Wait a bit to ensure the receiver is listening.
    sleep(Duration::from_secs(1)).await;

    // Call send_file to send the test file to 127.0.0.1.
    send_file(test_file_path.to_str().unwrap(), "127.0.0.1").await?;

    // Wait for the receiver to finish.
    receiver_handle.await??;

    // Look for a file whose name starts with "received_bt_file_" and ends with ".bin".
    let mut received_files: Vec<PathBuf> = fs::read_dir(temp_dir.path())?
        .filter_map(|entry| {
            entry.ok().and_then(|e| {
                let file_name = e.file_name().into_string().ok()?;
                if file_name.starts_with("received_bt_file_") && file_name.ends_with(".bin") {
                    Some(e.path())
                } else {
                    None
                }
            })
        })
        .collect();

    assert_eq!(
        received_files.len(),
        1,
        "Expected one received file, found {}",
        received_files.len()
    );

    let received_file = received_files.pop().unwrap();
    let received_content = fs::read(&received_file)?;

    // Verify that the content of the received file matches the test file.
    assert_eq!(
        received_content, test_content,
        "Received file content does not match expected content"
    );

    Ok(())
}
