import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  const [filePath, setFilePath] = useState("../test.txt"); // default test file
  const [destinationIp, setDestinationIp] = useState("");  // user inputs IP
  const [message, setMessage] = useState("");

  async function sendFile() {
    if (!destinationIp) {
      setMessage("Please enter the receiver's IP address.");
      return;
    }

    try {
      const response = await invoke("send_file", {
        filePath,
        destination: destinationIp,
      });
      setMessage(`✅ Sent: ${response}`);
    } catch (error) {
      setMessage(`❌ Error sending file: ${error}`);
    }
  }

  async function receiveFile() {
    try {
      const response = await invoke("receive_file");
      setMessage(`📥 Ready: ${response}`);
    } catch (error) {
      setMessage(`❌ Error starting receiver: ${error}`);
    }
  }

  return (
    <div className="App">
      <h1>Unishare File Transfer</h1>

      <div className="section">
        <label>Destination IP:</label>
        <input
          type="text"
          placeholder="e.g., 192.168.0.101"
          value={destinationIp}
          onChange={(e) => setDestinationIp(e.target.value)}
        />
      </div>

      <div className="section">
        <button onClick={sendFile}>Send File</button>
        <button onClick={receiveFile}>Receive File</button>
      </div>

      <p className="status">{message}</p>
    </div>
  );
}

export default App;
