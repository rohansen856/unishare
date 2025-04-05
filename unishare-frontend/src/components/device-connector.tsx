"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Wifi,
  Bluetooth,
  Globe,
  Laptop,
  Smartphone,
  ComputerIcon as Desktop,
  QrCode,
} from "lucide-react";

type Device = {
  id: string;
  name: string;
  type: "desktop" | "laptop" | "mobile";
  connectionType: "wifi" | "bluetooth" | "internet";
  status: "available" | "connected" | "offline";
};

export function DeviceConnector() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "MacBook Pro",
      type: "laptop",
      connectionType: "wifi",
      status: "available",
    },
    {
      id: "2",
      name: "iPhone 13",
      type: "mobile",
      connectionType: "wifi",
      status: "available",
    },
    {
      id: "3",
      name: "Windows PC",
      type: "desktop",
      connectionType: "internet",
      status: "available",
    },
    {
      id: "4",
      name: "Android Tablet",
      type: "mobile",
      connectionType: "bluetooth",
      status: "offline",
    },
  ]);

  const [connectionCode, setConnectionCode] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);

  const connectToDevice = (id: string) => {
    setDevices(
      devices.map((device) =>
        device.id === id
          ? {
            ...device,
            status: device.status === "connected" ? "available" : "connected",
          }
          : device
      )
    );
  };

  const getDeviceIcon = (type: "desktop" | "laptop" | "mobile") => {
    switch (type) {
      case "desktop":
        return <Desktop className="h-5 w-5" />;
      case "laptop":
        return <Laptop className="h-5 w-5" />;
      case "mobile":
        return <Smartphone className="h-5 w-5" />;
    }
  };

  const getConnectionIcon = (type: "wifi" | "bluetooth" | "internet") => {
    switch (type) {
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "bluetooth":
        return <Bluetooth className="h-4 w-4" />;
      case "internet":
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <Tabs defaultValue="nearby">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="nearby">Nearby Devices</TabsTrigger>
        <TabsTrigger value="code">Connection Code</TabsTrigger>
        <TabsTrigger value="options">Connection Options</TabsTrigger>
      </TabsList>

      <TabsContent value="nearby" className="space-y-4 pt-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {devices.map((device) => (
            <Card key={device.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getDeviceIcon(device.type)}
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {getConnectionIcon(device.connectionType)}
                      <span className="capitalize">
                        {device.connectionType}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      device.status === "connected"
                        ? "default"
                        : device.status === "available"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {device.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant={
                      device.status === "connected" ? "destructive" : "default"
                    }
                    disabled={device.status === "offline"}
                    onClick={() => connectToDevice(device.id)}
                  >
                    {device.status === "connected" ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Button variant="outline" className="w-full">
          Refresh Devices
        </Button>
      </TabsContent>

      <TabsContent value="code" className="space-y-6 pt-4">
        <div className="space-y-2">
          <Label htmlFor="connection-code">Enter Connection Code</Label>
          <div className="flex gap-2">
            <Input
              id="connection-code"
              placeholder="Enter 6-digit code"
              value={connectionCode}
              onChange={(e) => setConnectionCode(e.target.value)}
            />
            <Button disabled={connectionCode.length !== 6}>Connect</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter the 6-digit code displayed on the other device
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-qr">Show QR Code</Label>
            <Switch
              id="show-qr"
              checked={showQRCode}
              onCheckedChange={setShowQRCode}
            />
          </div>

          {showQRCode && (
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <QrCode className="h-32 w-32 text-primary" />
              <p className="mt-2 text-sm font-medium">
                Scan with another device
              </p>
              <p className="text-xs text-muted-foreground">
                Connection code: 123456
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="options" className="space-y-4 pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Wi-Fi Direct</Label>
              <p className="text-sm text-muted-foreground">
                Connect directly without internet
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Bluetooth</Label>
              <p className="text-sm text-muted-foreground">
                Use Bluetooth for nearby connections
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Internet (WebRTC)</Label>
              <p className="text-sm text-muted-foreground">
                Use internet for remote connections
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Auto-Accept Transfers</Label>
              <p className="text-sm text-muted-foreground">
                Automatically accept incoming transfers
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
