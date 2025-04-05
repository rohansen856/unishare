// components/file-transfer-controls.tsx
"use client";

import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const FileTransferControls = () => {
  const [message, setMessage] = useState("");
  const [destination, setDestination] = useState("127.0.0.1");

  async function sendFile() {
    try {
      const response = await invoke("send_file", {
        filePath: "../test.txt", // Or dynamically select using a file picker
        destination,
      });
      setMessage(`Send response: ${response}`);
    } catch (error: any) {
      setMessage(`Error sending file: ${error.message}`);
    }
  }

  async function receiveFile() {
    try {
      const response = await invoke("receive_file");
      setMessage(`Receive response: ${response}`);
    } catch (error: any) {
      setMessage(`Error receiving file: ${error.message}`);
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <Input
        type="text"
        placeholder="Destination IP"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <div className="flex space-x-2">
        <Button onClick={sendFile}>Send File</Button>
        <Button variant="outline" onClick={receiveFile}>
          Receive File
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};
