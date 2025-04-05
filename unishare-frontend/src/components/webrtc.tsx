import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy } from "lucide-react";

export function WebRTC() {
    const [destinationIp, setDestinationIp] = useState("");
    const [tcpMessage, setTcpMessage] = useState("");
    const [filePath, setFilePath] = useState("../test.txt");
    const [webrtcOffer, setWebrtcOffer] = useState("");
    const [webrtcAnswer, setWebrtcAnswer] = useState("");
    const [webrtcStatus, setWebrtcStatus] = useState("");

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

    async function startWebrtcOffer() {
        try {
            const offer = await invoke("start_webrtc_sending", { filePath });
            setWebrtcOffer(offer as string);
            setWebrtcStatus("Offer created. Copy it and send it to the receiver.");
        } catch (error) {
            setWebrtcStatus(`Error creating offer: ${error}`);
        }
    }

    async function completeWebrtcSend() {
        if (!webrtcAnswer) {
            setWebrtcStatus("Please paste the receiver's answer in the designated field.");
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

    async function generateWebrtcAnswer() {
        if (!webrtcOffer) {
            setWebrtcStatus("For the receiver, please paste the sender's offer in the designated field.");
            return;
        }
        try {
            const answer = await invoke("receive_webrtc_file", {
                offerSdpJson: webrtcOffer,
            });
            setWebrtcAnswer(answer as string);
            setWebrtcStatus("Answer generated. Copy it and send it back to the sender.");
        } catch (error) {
            setWebrtcStatus(`❌ Error generating answer: ${error}`);
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Unishare File Transfer</h1>

            <Tabs defaultValue="tcp" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="tcp">TCP (Wi-Fi) Transfer</TabsTrigger>
                    <TabsTrigger value="webrtc-sender">WebRTC Sender</TabsTrigger>
                    <TabsTrigger value="webrtc-receiver">WebRTC Receiver</TabsTrigger>
                </TabsList>

                <TabsContent value="tcp">
                    <Card>
                        <CardHeader>
                            <CardTitle>TCP (Wi-Fi) Transfer</CardTitle>
                            <CardDescription>
                                Send or receive files directly over your local network
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Destination IP:</label>
                                <Input
                                    type="text"
                                    placeholder="e.g., 192.168.0.101"
                                    value={destinationIp}
                                    onChange={(e) => setDestinationIp(e.target.value)}
                                />
                            </div>
                            <div className="flex space-x-2">
                                <Button onClick={sendFileTCP} className="flex-1">Send File</Button>
                                <Button onClick={receiveFileTCP} variant="outline" className="flex-1">
                                    Receive File
                                </Button>
                            </div>
                        </CardContent>
                        {tcpMessage && (
                            <CardFooter>
                                <Alert variant={tcpMessage.includes("❌") ? "destructive" : "default"}>
                                    <AlertDescription>{tcpMessage}</AlertDescription>
                                </Alert>
                            </CardFooter>
                        )}
                    </Card>
                </TabsContent>

                <TabsContent value="webrtc-sender">
                    <Card>
                        <CardHeader>
                            <CardTitle>WebRTC Sender</CardTitle>
                            <CardDescription>
                                Generate an offer and send files to any device
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">File Path:</label>
                                <Input
                                    type="text"
                                    value={filePath}
                                    onChange={(e) => setFilePath(e.target.value)}
                                    placeholder="Path to the file you want to send"
                                />
                            </div>
                            <Button onClick={startWebrtcOffer} className="w-full">
                                Generate WebRTC Offer
                            </Button>

                            {webrtcOffer && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium">Offer (send this to receiver):</label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(webrtcOffer)}
                                            className="h-8 px-2"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Textarea
                                        value={webrtcOffer}
                                        readOnly
                                        rows={4}
                                        className="font-mono text-xs"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Paste Receiver's Answer:</label>
                                <Textarea
                                    value={webrtcAnswer}
                                    onChange={(e) => setWebrtcAnswer(e.target.value)}
                                    rows={4}
                                    placeholder="Paste the receiver's answer here"
                                    className="font-mono text-xs"
                                />
                            </div>

                            <Button
                                onClick={completeWebrtcSend}
                                disabled={!webrtcAnswer}
                                variant="default"
                            >
                                Complete File Transfer
                            </Button>
                        </CardContent>
                        {webrtcStatus && (
                            <CardFooter>
                                <Alert variant={webrtcStatus.includes("❌") ? "destructive" : "default"}>
                                    <AlertDescription>{webrtcStatus}</AlertDescription>
                                </Alert>
                            </CardFooter>
                        )}
                    </Card>
                </TabsContent>

                <TabsContent value="webrtc-receiver">
                    <Card>
                        <CardHeader>
                            <CardTitle>WebRTC Receiver</CardTitle>
                            <CardDescription>
                                Receive files by generating an answer to a sender's offer
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Paste Sender's Offer:</label>
                                <Textarea
                                    value={webrtcOffer}
                                    onChange={(e) => setWebrtcOffer(e.target.value)}
                                    rows={4}
                                    placeholder="Paste the sender's offer here"
                                    className="font-mono text-xs"
                                />
                            </div>

                            <Button
                                onClick={generateWebrtcAnswer}
                                disabled={!webrtcOffer}
                                className="w-full"
                            >
                                Generate Answer
                            </Button>

                            {webrtcAnswer && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium">Answer (send this to sender):</label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(webrtcAnswer)}
                                            className="h-8 px-2"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Textarea
                                        value={webrtcAnswer}
                                        readOnly
                                        rows={4}
                                        className="font-mono text-xs"
                                    />
                                </div>
                            )}
                        </CardContent>
                        {webrtcStatus && (
                            <CardFooter>
                                <Alert variant={webrtcStatus.includes("❌") ? "destructive" : "default"}>
                                    <AlertDescription>{webrtcStatus}</AlertDescription>
                                </Alert>
                            </CardFooter>
                        )}
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}