import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  // Default file path for testing, adjust if needed.
  const [filePath, setFilePath] = useState("../test.txt");
  // For Wi-Fi file transfer, enter the receiver's IP.
  // For Bluetooth, you can enter a Bluetooth identifier or use a dummy value if simulated.
  const [destinationIp, setDestinationIp] = useState("");
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
      setMessage(`✅ Wi-Fi Sent: ${response}`);
    } catch (error) {
      setMessage(`❌ Error sending file via Wi-Fi: ${error}`);
    }
  }

  async function receiveFile() {
    try {
      const response = await invoke("receive_file");
      setMessage(`📥 Wi-Fi Receiver: ${response}`);
    } catch (error) {
      setMessage(`❌ Error starting Wi-Fi receiver: ${error}`);
    }
  }

  async function sendFileBluetooth() {
    if (!destinationIp) {
      setMessage("Please enter the receiver's Bluetooth identifier/IP.");
      return;
    }
    try {
      const response = await invoke("send_file_bluetooth", {
        filePath,
        destination: destinationIp,
      });
      setMessage(`✅ Bluetooth Sent: ${response}`);
    } catch (error) {
      setMessage(`❌ Error sending file via Bluetooth: ${error}`);
    }
  }

  async function receiveFileBluetooth() {
    try {
      const response = await invoke("receive_file_bluetooth");
      setMessage(`📥 Bluetooth Receiver: ${response}`);
    } catch (error) {
      setMessage(`❌ Error starting Bluetooth receiver: ${error}`);
    }
  }

  return (
    <div className="App">
      <h1>Unishare File Transfer</h1>

      <div className="section">
        <label>Destination IP/Identifier:</label>
        <input
          type="text"
          placeholder="e.g., 192.168.0.101 or BT-ID"
          value={destinationIp}
          onChange={(e) => setDestinationIp(e.target.value)}
        />
      </div>

      <div className="section">
        <button onClick={sendFile}>Send File (Wi-Fi)</button>
        <button onClick={receiveFile}>Receive File (Wi-Fi)</button>
      </div>

      <div className="section">
        <button onClick={sendFileBluetooth}>Send File (Bluetooth)</button>
        <button onClick={receiveFileBluetooth}>Receive File (Bluetooth)</button>
      </div>

      <p className="status">{message}</p>
    </div>
  );
}

export default App;
