use std::error::Error;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{TcpListener, TcpStream};
use tokio::fs::File;
use chrono::Utc;

/// Checks for Wi‑Fi Direct connectivity.
/// For this simplified proof‑of‑concept, we assume that Wi‑Fi Direct is available.
/// In a real implementation, you would check for native Wi‑Fi Direct support.
pub fn is_available() -> bool {
    true
}

/// Sends a file via a direct TCP connection (simulating Wi‑Fi Direct).
///
/// - Reads the file from disk.
/// - Connects to the destination IP on port 9000.
/// - Sends the file size (8 bytes, big‑endian) followed by the file data.
///
/// This approach does not rely on the internet if both devices are connected via a direct Wi‑Fi or Wi‑Fi Direct connection.
pub async fn send_file(file_path: &str, destination: &str) -> Result<(), Box<dyn Error>> {
    // Open the file and read its contents.
    let mut file = File::open(file_path).await?;
    let mut file_data = Vec::new();
    file.read_to_end(&mut file_data).await?;
    
    // Connect to the destination on port 9000.
    let dest_addr = format!("{}:9000", destination);
    let mut stream = TcpStream::connect(dest_addr).await?;
    println!("Connected to destination. Sending file...");
    
    // Send the file size (8 bytes, big‑endian).
    let file_size = file_data.len() as u64;
    stream.write_all(&file_size.to_be_bytes()).await?;
    
    // Send the file contents.
    stream.write_all(&file_data).await?;
    println!("File sent successfully.");
    
    Ok(())
}

/// Starts a receiver that listens on port 9000 for an incoming file transfer (simulating Wi‑Fi Direct).
///
/// - Binds a TCP listener on port 9000.
/// - Accepts an incoming connection.
/// - Reads the file size (8 bytes) and then the file data.
/// - Writes the received data to a new file with a timestamp in the filename.
pub async fn start_receiver() -> Result<(), Box<dyn Error>> {
    // Bind a TCP listener on port 9000 (all interfaces).
    let listener = TcpListener::bind("0.0.0.0:9000").await?;
    println!("Receiver listening on port 9000...");
    
    // Accept an incoming connection.
    let (mut socket, addr) = listener.accept().await?;
    println!("Received connection from {}", addr);
    
    // Read the file size (first 8 bytes).
    let mut size_buf = [0u8; 8];
    socket.read_exact(&mut size_buf).await?;
    let file_size = u64::from_be_bytes(size_buf);
    
    // Read the file data.
    let mut file_data = vec![0u8; file_size as usize];
    socket.read_exact(&mut file_data).await?;
    
    // Create a new file with a timestamped name.
    let file_name = format!("received_file_{}.bin", Utc::now().timestamp());
    let mut file = File::create(&file_name).await?;
    file.write_all(&file_data).await?;
    
    println!("File received and saved as {}", file_name);
    
    Ok(())
}
