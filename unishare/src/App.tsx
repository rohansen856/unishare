import  { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  // Function to send a file using the Tauri command "send_file"
  async function sendFile() {
    try {
      // The test file is assumed to be at the project root.
      // Since the working directory of the tauri binary is "src-tauri",
      // the relative path to the test file should be "../test.txt"
      const response = await invoke("send_file", {
        filePath: "../test.txt",
        destination: "127.0.0.1"
      });
      setMessage(`Send response: ${response}`);
    } catch (error) {
      setMessage(`Error sending file: ${error}`);
    }
  }

  // Function to start the receiver using the Tauri command "receive_file"
  async function receiveFile() {
    try {
      const response = await invoke("receive_file");
      setMessage(`Receive response: ${response}`);
    } catch (error) {
      setMessage(`Error receiving file: ${error}`);
    }
  }

  return (
    <div className="App">
      <h1>Unishare File Transfer</h1>
      <div style={{ margin: "20px" }}>
        <button onClick={sendFile}>Send File</button>
        <button onClick={receiveFile} style={{ marginLeft: "10px" }}>
          Receive File
        </button>
      </div>
      <p>{message}</p>
    </div>
  );
}

export default App;
