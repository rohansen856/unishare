"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Shield, FolderOpen, HardDrive, RefreshCw } from "lucide-react";

export function Settings() {
  const [deviceName, setDeviceName] = useState("My Device");
  const [downloadPath, setDownloadPath] = useState("/Users/username/Downloads");
  const [autoLaunch, setAutoLaunch] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [maxBandwidth, setMaxBandwidth] = useState([50]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">General Settings</h3>
        <Separator />

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="device-name">Device Name</Label>
            <Input
              id="device-name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This name will be visible to other devices when connecting
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="download-path">Download Location</Label>
            <div className="flex gap-2">
              <Input
                id="download-path"
                value={downloadPath}
                onChange={(e) => setDownloadPath(e.target.value)}
                readOnly
              />
              <Button variant="outline" size="icon">
                <FolderOpen className="h-4 w-4" />
                <span className="sr-only">Browse</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Start on System Boot</Label>
              <p className="text-sm text-muted-foreground">
                Launch Unishare automatically when your device starts
              </p>
            </div>
            <Switch checked={autoLaunch} onCheckedChange={setAutoLaunch} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for file transfers
              </p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          {/* Removed the dark mode toggle since we now have a theme toggle in the header */}
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="advanced">
          <AccordionTrigger className="text-lg font-medium">
            Advanced Settings
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Maximum Bandwidth</Label>
                  <span className="text-sm text-muted-foreground">
                    ({maxBandwidth}%)
                  </span>
                </div>
                <Slider
                  value={maxBandwidth}
                  onValueChange={setMaxBandwidth}
                  max={100}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">
                  Limit the bandwidth used for file transfers
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="connection-timeout">Connection Timeout</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="connection-timeout">
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="120">2 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="log-level">Log Level</Label>
                <Select defaultValue="info">
                  <SelectTrigger id="log-level">
                    <SelectValue placeholder="Select log level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="security">
          <AccordionTrigger className="text-lg font-medium">
            Security & Privacy
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>End-to-End Encryption</Label>
                  <p className="text-sm text-muted-foreground">
                    All transfers are encrypted end-to-end
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">
                    Enabled
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Confirmation</Label>
                  <p className="text-sm text-muted-foreground">
                    Ask for confirmation before accepting transfers
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Remember Devices</Label>
                  <p className="text-sm text-muted-foreground">
                    Save previously connected devices
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Trusted Devices
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="storage">
          <AccordionTrigger className="text-lg font-medium">
            Storage
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Storage Usage</Label>
                  <span className="text-sm font-medium">128 MB</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[15%]" />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Cache: 128 MB</span>
                  <span>Available: 24.8 GB</span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <HardDrive className="h-4 w-4 mr-2" />
                Clear Cache
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
