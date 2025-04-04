"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  X,
  File,
  FileText,
  FileImage,
  FileAudio,
  FileVideo,
  Upload,
} from "lucide-react";

type FileWithPreview = {
  file: File;
  id: string;
  progress: number;
  preview?: string;
  type: string;
};

export function FileUploader() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substring(2),
      progress: 0,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
      type: file.type,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const simulateUpload = () => {
    if (files.length === 0) return;

    setUploading(true);

    // Simulate progress updates
    const interval = setInterval(() => {
      setFiles((prevFiles) => {
        const allDone = prevFiles.every((file) => file.progress >= 100);

        if (allDone) {
          clearInterval(interval);
          setUploading(false);
          return prevFiles;
        }

        return prevFiles.map((file) => ({
          ...file,
          progress: Math.min(file.progress + Math.random() * 10, 100),
        }));
      });
    }, 200);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <FileImage className="h-8 w-8" />;
    if (type.startsWith("audio/")) return <FileAudio className="h-8 w-8" />;
    if (type.startsWith("video/")) return <FileVideo className="h-8 w-8" />;
    if (type.startsWith("text/")) return <FileText className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <>
              <p className="text-lg font-medium">Drag & drop files here</p>
              <p className="text-sm text-muted-foreground">
                or click to select files
              </p>
            </>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <Card key={file.id} className="p-3 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => removeFile(file.id)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
                <div className="flex items-center gap-3">
                  {file.preview ? (
                    <img
                      src={file.preview || "/placeholder.svg"}
                      alt={file.file.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    getFileIcon(file.type)
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {file.progress > 0 && (
                      <Progress value={file.progress} className="h-1 mt-2" />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={simulateUpload} disabled={uploading}>
              {uploading ? "Uploading..." : "Share Files"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
