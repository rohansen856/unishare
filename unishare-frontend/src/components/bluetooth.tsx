"use client"

import { useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Download, Wifi, Bluetooth } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function BluetoothSend() {
    const [filePath, setFilePath] = useState("../test.txt") // default test file
    const [destinationIp, setDestinationIp] = useState("127.0.0.1") // default for local testing
    const [message, setMessage] = useState("")
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

    async function sendFile() {
        if (!destinationIp) {
            setMessage("Please enter the receiver's IP address.")
            setStatus("error")
            return
        }

        try {
            const response = await invoke("send_file", {
                filePath,
                destination: destinationIp,
            })
            setMessage(`✅ Wi-Fi Sent: ${response}`)
            setStatus("success")
        } catch (error) {
            setMessage(`❌ Error sending file via Wi-Fi: ${error}`)
            setStatus("error")
        }
    }

    async function receiveFile() {
        try {
            const response = await invoke("receive_file")
            setMessage(`📥 Wi-Fi Receiver: ${response}`)
            setStatus("success")
        } catch (error) {
            setMessage(`❌ Error starting Wi-Fi receiver: ${error}`)
            setStatus("error")
        }
    }

    async function sendFileBluetooth() {
        if (!destinationIp) {
            setMessage("Please enter the receiver's Bluetooth identifier/IP.")
            setStatus("error")
            return
        }
        try {
            const response = await invoke("send_file_bluetooth", {
                filePath,
                destination: destinationIp,
            })
            setMessage(`✅ Bluetooth Sent: ${response}`)
            setStatus("success")
        } catch (error) {
            setMessage(`❌ Error sending file via Bluetooth: ${error}`)
            setStatus("error")
        }
    }

    async function receiveFileBluetooth() {
        try {
            const response = await invoke("receive_file_bluetooth")
            setMessage(`📥 Bluetooth Receiver: ${response}`)
            setStatus("success")
        } catch (error) {
            setMessage(`❌ Error starting Bluetooth receiver: ${error}`)
            setStatus("error")
        }
    }

    return (
        <div className="flex items-center justify-center bg-secondary p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                        <Wifi className="h-6 w-6" />
                        Unishare File Transfer
                    </CardTitle>
                    <CardDescription className="text-center">Send and receive files directly between devices</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="file-path">
                            File Path
                        </label>
                        <Input
                            id="file-path"
                            value={filePath}
                            onChange={(e) => setFilePath(e.target.value)}
                            placeholder="Path to file"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="destination-ip">
                            Destination IP/Identifier
                        </label>
                        <Input
                            id="destination-ip"
                            type="text"
                            placeholder="e.g., 192.168.0.101 or BT-ID"
                            value={destinationIp}
                            onChange={(e) => setDestinationIp(e.target.value)}
                        />
                    </div>

                    {message && (
                        <Alert variant={status === "error" ? "destructive" : "default"} className="mt-4">
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={sendFileBluetooth} className="w-full sm:w-1/2" variant="default">
                        <Send className="mr-2 h-4 w-4" /> <Bluetooth className="mr-2 h-4 w-4" /> Send File
                    </Button>
                    <Button onClick={receiveFileBluetooth} className="w-full sm:w-1/2" variant="outline">
                        <Download className="mr-2 h-4 w-4" /> <Bluetooth className="mr-2 h-4 w-4" /> Receive File
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}