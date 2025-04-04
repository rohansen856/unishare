"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowDown,
  ArrowUp,
  Clock,
  Download,
  FileText,
  MoreVertical,
  Trash2,
} from "lucide-react";

type Transfer = {
  id: string;
  filename: string;
  size: string;
  date: string;
  device: string;
  direction: "sent" | "received";
  status: "completed" | "failed" | "cancelled";
};

export function TransferHistory() {
  const [transfers, setTransfers] = useState<Transfer[]>([
    {
      id: "1",
      filename: "presentation.pptx",
      size: "4.2 MB",
      date: "Today, 2:30 PM",
      device: "MacBook Pro",
      direction: "sent",
      status: "completed",
    },
    {
      id: "2",
      filename: "vacation-photos.zip",
      size: "128 MB",
      date: "Today, 11:15 AM",
      device: "iPhone 13",
      direction: "received",
      status: "completed",
    },
    {
      id: "3",
      filename: "project-report.pdf",
      size: "2.8 MB",
      date: "Yesterday, 4:45 PM",
      device: "Windows PC",
      direction: "sent",
      status: "completed",
    },
    {
      id: "4",
      filename: "design-mockups.sketch",
      size: "18.5 MB",
      date: "Yesterday, 2:10 PM",
      device: "MacBook Pro",
      direction: "sent",
      status: "failed",
    },
    {
      id: "5",
      filename: "meeting-notes.docx",
      size: "1.2 MB",
      date: "Apr 2, 2023",
      device: "Android Tablet",
      direction: "received",
      status: "cancelled",
    },
  ]);

  const deleteTransfer = (id: string) => {
    setTransfers(transfers.filter((transfer) => transfer.id !== id));
  };

  const clearHistory = () => {
    setTransfers([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Showing {transfers.length} recent transfers
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearHistory}
          disabled={transfers.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>

      {transfers.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="font-medium">{transfer.filename}</div>
                      {transfer.direction === "sent" ? (
                        <ArrowUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{transfer.size}</TableCell>
                  <TableCell>{transfer.date}</TableCell>
                  <TableCell>{transfer.device}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transfer.status === "completed"
                          ? "default"
                          : transfer.status === "failed"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {transfer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {transfer.status === "completed" &&
                          transfer.direction === "received" && (
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Open file
                            </DropdownMenuItem>
                          )}
                        <DropdownMenuItem
                          onClick={() => deleteTransfer(transfer.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove from history
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No transfer history</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your file transfer history will appear here.
          </p>
        </Card>
      )}
    </div>
  );
}
