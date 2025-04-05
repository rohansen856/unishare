use std::error::Error;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{TcpListener, TcpStream};
use tokio::fs::File;
use chrono::Utc;

pub fn is_available() -> bool {
    true
}

pub async fn send_file(file_path: &str, destination: &str) -> Result<(), Box<dyn Error>> {
    let mut file = File::open(file_path).await?;
    let mut file_data = Vec::new();
    file.read_to_end(&mut file_data).await?;
    
    let dest_addr = format!("{}:9000", destination);
    let mut stream = TcpStream::connect(dest_addr).await?;
    println!("Connected to destination. Sending file...");
    
    let file_size = file_data.len() as u64;
    stream.write_all(&file_size.to_be_bytes()).await?;
    
    stream.write_all(&file_data).await?;
    println!("File sent successfully.");
    
    Ok(())
}

pub async fn start_receiver() -> Result<(), Box<dyn Error>> {
    let listener = TcpListener::bind("0.0.0.0:9000").await?;
    println!("Receiver listening on port 9000...");
    
    let (mut socket, addr) = listener.accept().await?;
    println!("Received connection from {}", addr);
    
    let mut size_buf = [0u8; 8];
    socket.read_exact(&mut size_buf).await?;
    let file_size = u64::from_be_bytes(size_buf);
    
    let mut file_data = vec![0u8; file_size as usize];
    socket.read_exact(&mut file_data).await?;
    
    let file_name = format!("received_file_{}.bin", Utc::now().timestamp());
    let mut file = File::create(&file_name).await?;
    file.write_all(&file_data).await?;
    
    println!("File received and saved as {}", file_name);
    
    Ok(())
}
