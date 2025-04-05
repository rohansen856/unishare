use std::fs::File;
use std::io::{BufReader, Read};
use std::str;

fn convert_encoding(file_path: String) -> std::io::Result<()> {
    let file = File::open(file_path)?;
    let mut reader = BufReader::new(file);

    let mut buffer = [0u8; 1024];
    let mut leftover = Vec::new();

    while let Ok(n) = reader.read(&mut buffer) {
        if n == 0 {
            break;
        }

        let mut chunk = leftover.clone();
        chunk.extend_from_slice(&buffer[..n]);

        let valid_up_to = match std::str::from_utf8(&chunk) {
            Ok(_) => chunk.len(),
            Err(e) => e.valid_up_to(),
        };

        let (valid_utf8, remaining) = chunk.split_at(valid_up_to);

        let utf16_chunk: Vec<u16> = valid_utf8.encode_utf16().collect();
        println!("UTF-16 chunk: {:?}", utf16_chunk);

        leftover = remaining.to_vec();
    }

    Ok(())
}
