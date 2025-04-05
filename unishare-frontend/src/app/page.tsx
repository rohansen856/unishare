"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "@/components/file-uploader";
import { DeviceConnector } from "@/components/device-connector";
import { TransferHistory } from "@/components/transfer-history";
import { Settings } from "@/components/settings";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

import { Wifi, Bluetooth, Globe, Shield, ArrowUpDown } from "lucide-react";
import { WifiDirect } from "@/components/wifi-direct";

import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";


export default function Home() {
  const [status, setStatus] = useState({
    wifiDirect: false,
    bluetooth: false,
    internet: false,
  });

  useEffect(() => {
    invoke("check_connectivity_status")
      .then((res) => {
        setStatus(res as typeof status);
      })
      .catch((err) => {
        console.error("Failed to check status:", err);
      });
  }, []);

  const formatStatus = (value: boolean) => (value ? "Available" : "Unavailable");
  const formatInternet = (value: boolean) => (value ? "Enabled" : "Disabled");
  return (
    <main className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center">
          <div className="flex items-center gap-2 font-semibold">
            <ArrowUpDown className="h-5 w-5" />
            <span>Unishare</span>
            <Badge variant="outline" className="ml-2">
              Beta
            </Badge>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
              <Link href="/docs" passHref>
                <Button variant="ghost" size="sm">
                  Docs
                </Button>
              </Link>
              <Link href="/about" passHref>
                <Button variant="ghost" size="sm">
                  About
                </Button>
              </Link>
              <ThemeToggle></ThemeToggle>
            </nav>
          </div>
        </div>
      </header>
      <div className="container mx-auto flex-1 py-6">
        <Tabs defaultValue="share" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="share">Share Files</TabsTrigger>
            <TabsTrigger value="connect">Connect</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="wifi-direct">Wifi Direct</TabsTrigger>
          </TabsList>
          <TabsContent value="share" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Share Files</CardTitle>
                <CardDescription>
                  Drag and drop files to share them with connected devices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Wi-Fi Direct</CardTitle>
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatStatus(status.wifiDirect)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Truly offline transfers without internet
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bluetooth</CardTitle>
                  <Bluetooth className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatStatus(status.bluetooth)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Slower but reliable fallback option
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Internet</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatInternet(status.internet)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    WebRTC and cloud fallback options
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="connect" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Connect Devices</CardTitle>
                <CardDescription>
                  Connect to other devices to start sharing files.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceConnector />
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  <Shield className="inline-block h-4 w-4 mr-1" />
                  All connections are secure and encrypted end-to-end.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transfer History</CardTitle>
                <CardDescription>
                  View your recent file transfers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransferHistory />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Configure your Unishare preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Settings />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="wifi-direct" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Wifi Direct</CardTitle>
                <CardDescription>
                  Share via wifi network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WifiDirect />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <footer className="border-t mx-auto py-4">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Unishare. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
