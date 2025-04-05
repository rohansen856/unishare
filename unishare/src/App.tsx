import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  // TCP (Wi‑Fi) state
  const [destinationIp, setDestinationIp] = useState("");
  const [tcpMessage, setTcpMessage] = useState("");

  // WebRTC state
  const [filePath, setFilePath] = useState("../test.txt"); // default test file
  const [webrtcOffer, setWebrtcOffer] = useState("");
  const [webrtcAnswer, setWebrtcAnswer] = useState("");
  const [webrtcStatus, setWebrtcStatus] = useState("");

  // ----- TCP (Wi‑Fi) Functions -----
  async function sendFileTCP() {
    if (!destinationIp) {
      setTcpMessage("Please enter the receiver's IP address.");
      return;
    }
    try {
      const response = await invoke("send_file", {
        filePath,
        destination: destinationIp,
      });
      setTcpMessage(`✅ TCP Sent: ${response}`);
    } catch (error) {
      setTcpMessage(`❌ Error sending file: ${error}`);
    }
  }

  async function receiveFileTCP() {
    try {
      const response = await invoke("receive_file");
      setTcpMessage(`📥 TCP Ready: ${response}`);
    } catch (error) {
      setTcpMessage(`❌ Error starting receiver: ${error}`);
    }
  }

  // ----- WebRTC (Manual Signaling) Functions -----
  // Sender: Create Offer
  async function startWebrtcOffer() {
    try {
      const offer = await invoke("start_webrtc_sending", { filePath });
      setWebrtcOffer(offer as string);
      setWebrtcStatus("Offer created. Copy it and send it to the receiver.");
    } catch (error) {
      setWebrtcStatus(`Error creating offer: ${error}`);
    }
  }

  // Sender: Complete sending once receiver's answer is pasted
  async function completeWebrtcSend() {
    if (!webrtcAnswer) {
      setWebrtcStatus(
        "Please paste the receiver's answer in the designated field."
      );
      return;
    }
    try {
      const response = await invoke("complete_webrtc_sending", {
        filePath,
        answerSdpJson: webrtcAnswer,
      });
      setWebrtcStatus(`✅ WebRTC file sent: ${response}`);
    } catch (error) {
      setWebrtcStatus(`❌ Error sending via WebRTC: ${error}`);
    }
  }

  // Receiver: Generate Answer from Sender's Offer
  async function generateWebrtcAnswer() {
    if (!webrtcOffer) {
      setWebrtcStatus(
        "For the receiver, please paste the sender's offer in the designated field."
      );
      return;
    }
    try {
      const answer = await invoke("receive_webrtc_file", {
        offerSdpJson: webrtcOffer,
      });
      setWebrtcAnswer(answer as string);
      setWebrtcStatus("Answer generated. Copy it and send back to the sender.");
    } catch (error) {
      setWebrtcStatus(`❌ Error generating answer: ${error}`);
    }
  }

  return (
    <div className="App" style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Unishare File Transfer</h1>

      {/* ----- TCP (Wi‑Fi) Transfer Section ----- */}
      <section
        style={{
          marginBottom: "2rem",
          borderBottom: "1px solid #ccc",
          paddingBottom: "1rem",
        }}
      >
        <h2>TCP (Wi‑Fi) Transfer</h2>
        <div className="section">
          <label>Destination IP:</label>
          <input
            type="text"
            placeholder="e.g., 192.168.0.101"
            value={destinationIp}
            onChange={(e) => setDestinationIp(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
        </div>
        <div className="section">
          <button onClick={sendFileTCP} style={{ marginRight: "0.5rem" }}>
            Send File via TCP
          </button>
          <button onClick={receiveFileTCP}>Receive File via TCP</button>
        </div>
        <p className="status">{tcpMessage}</p>
      </section>

      {/* ----- WebRTC Transfer Section ----- */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>WebRTC Transfer (Manual Signaling)</h2>

        {/* Sender's File Path */}
        <div className="section">
          <label>File Path (Sender):</label>
          <input
            type="text"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
        </div>

        {/* Sender: Generate Offer */}
        <div className="section">
          <button onClick={startWebrtcOffer}>
            Generate WebRTC Offer (Sender)
          </button>
          {webrtcOffer && (
            <>
              <label style={{ display: "block", marginTop: "1rem" }}>
                Sender's Offer (copy and send this to the receiver):
              </label>
              <textarea
                value={webrtcOffer}
                readOnly
                rows={4}
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </>
          )}
        </div>

        {/* Sender: Paste Receiver's Answer */}
        <div className="section" style={{ marginTop: "1rem" }}>
          <label>
            Paste Receiver's Answer (Sender should paste the answer here):
          </label>
          <textarea
            value={webrtcAnswer}
            onChange={(e) => setWebrtcAnswer(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "0.5rem" }}
          />
          <button onClick={completeWebrtcSend} style={{ marginTop: "0.5rem" }}>
            Complete WebRTC Send (Sender)
          </button>
        </div>

        <hr style={{ margin: "1rem 0" }} />

        {/* Receiver: Paste Sender's Offer */}
        <div className="section">
          <label>
            For Receiver: Paste Sender's Offer (copy the offer from sender
            here):
          </label>
          <textarea
            value={webrtcOffer}
            onChange={(e) => setWebrtcOffer(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "0.5rem" }}
          />
          <button
            onClick={generateWebrtcAnswer}
            style={{ marginTop: "0.5rem" }}
          >
            Generate WebRTC Answer (Receiver)
          </button>
          {webrtcAnswer && (
            <>
              <label style={{ display: "block", marginTop: "1rem" }}>
                Receiver's Answer (copy and send this back to the sender):
              </label>
              <textarea
                value={webrtcAnswer}
                readOnly
                rows={4}
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </>
          )}
        </div>

        <p className="status">{webrtcStatus}</p>
      </section>
    </div>
  );
}

export default App;
