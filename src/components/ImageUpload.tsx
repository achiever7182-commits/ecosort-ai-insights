import React, { useCallback, useState } from "react";
import { Upload, Camera, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelected: (base64: string, preview: string) => void;
  isAnalyzing: boolean;
}

export function ImageUpload({ onImageSelected, isAnalyzing }: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      const base64 = result.split(",")[1];
      onImageSelected(base64, result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleCamera = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) processFile(file);
    };
    input.click();
  }, [processFile]);

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 cursor-pointer",
          dragOver
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-muted/50",
          isAnalyzing && "pointer-events-none opacity-60"
        )}
        onClick={() => document.getElementById("waste-file-input")?.click()}
      >
        {preview ? (
          <div className="space-y-3">
            <img src={preview} alt="Uploaded waste" className="mx-auto max-h-64 rounded-xl object-contain shadow-card" />
            <p className="text-sm text-muted-foreground">Click or drop to replace</p>
          </div>
        ) : (
          <div className="space-y-4 py-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-eco">
              <Upload className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-foreground">
                Drop your waste image here
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                PNG, JPG, or WEBP up to 10MB
              </p>
            </div>
          </div>
        )}
        <input
          id="waste-file-input"
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => document.getElementById("waste-file-input")?.click()}
          disabled={isAnalyzing}
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          Browse Files
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleCamera}
          disabled={isAnalyzing}
        >
          <Camera className="mr-2 h-4 w-4" />
          Use Camera
        </Button>
      </div>
    </div>
  );
}
