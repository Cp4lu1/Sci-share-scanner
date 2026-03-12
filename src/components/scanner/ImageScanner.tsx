
"use client";

import { useState } from "react";
import { Search, Loader2, Grid, Filter, RefreshCcw, LayoutGrid, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCard, ImageStatus } from "./ImageCard";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { generatePHash, compareHashes } from "@/lib/phash";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ScannedImage {
  id: string;
  url: string;
  width: number;
  height: number;
  description: string;
  pHash?: string;
  status: ImageStatus;
  similarity?: number;
}

export function ImageScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [images, setImages] = useState<ScannedImage[]>([]);
  const [progress, setProgress] = useState(0);

  const startScan = async () => {
    setIsScanning(true);
    setProgress(0);
    setImages([]);

    const initialImages: ScannedImage[] = PlaceHolderImages.map((img) => ({
      id: img.id,
      url: img.imageUrl,
      description: img.description,
      width: 0,
      height: 0,
      status: "normal",
    }));

    const processed: ScannedImage[] = [];
    for (let i = 0; i < initialImages.length; i++) {
      const imgData = initialImages[i];
      setProgress(((i + 1) / initialImages.length) * 50);

      try {
        const hash = await generatePHash(imgData.url);
        const size = await new Promise<{ w: number; h: number }>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ w: img.width, h: img.height });
          img.src = imgData.url;
        });

        processed.push({
          ...imgData,
          pHash: hash,
          width: size.w,
          height: size.h,
        });
      } catch (err) {
        processed.push(imgData);
      }
    }

    const analyzed = [...processed];
    for (let i = 0; i < analyzed.length; i++) {
      setProgress(50 + ((i + 1) / analyzed.length) * 50);
      for (let j = 0; j < analyzed.length; j++) {
        if (i === j) continue;
        const imgA = analyzed[i];
        const imgB = analyzed[j];

        if (imgA.pHash && imgB.pHash) {
          const similarity = compareHashes(imgA.pHash, imgB.pHash);
          if (similarity > 0.9) {
            const ratioA = imgA.width / imgA.height;
            const ratioB = imgB.width / imgB.height;
            const ratioDiff = Math.abs(ratioA - ratioB);

            if (ratioDiff > 0.1 || imgA.width !== imgB.width) {
              if (analyzed[i].status !== "duplicate") {
                analyzed[i].status = "transformed";
              }
            } else {
              analyzed[i].status = "duplicate";
              analyzed[i].similarity = similarity;
            }
          }
        }
      }
    }

    setImages(analyzed);
    setIsScanning(false);
  };

  const duplicatesCount = images.filter(img => img.status === 'duplicate').length;
  const transformedCount = images.filter(img => img.status === 'transformed').length;

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="space-y-3">
        <div className="flex flex-col gap-2">
          <Button
            onClick={startScan}
            disabled={isScanning}
            className="w-full bg-primary hover:bg-primary/90 shadow-md py-6 text-sm font-bold"
          >
            {isScanning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            {isScanning ? "Analyzing Page Content..." : "Scan Active Tab"}
          </Button>
          {images.length > 0 && !isScanning && (
            <Button
              variant="outline"
              onClick={() => setImages([])}
              className="w-full h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              <RefreshCcw className="mr-2 h-3 w-3" />
              Reset Results
            </Button>
          )}
        </div>
      </div>

      {isScanning && (
        <div className="space-y-2 p-3 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-primary">
            <span>pHash Comparison</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}

      {images.length > 0 && !isScanning && (
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 border border-border/50">
            <LayoutGrid className="h-3 w-3 text-muted-foreground mb-1" />
            <span className="text-lg font-bold leading-none">{images.length}</span>
            <span className="text-[8px] uppercase font-bold text-muted-foreground mt-1">Found</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-destructive/5 border border-destructive/10">
            <Filter className="h-3 w-3 text-destructive mb-1" />
            <span className="text-lg font-bold text-destructive leading-none">{duplicatesCount}</span>
            <span className="text-[8px] uppercase font-bold text-destructive mt-1">Duplicates</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-yellow-50 border border-yellow-200">
            <Grid className="h-3 w-3 text-yellow-600 mb-1" />
            <span className="text-lg font-bold text-yellow-600 leading-none">{transformedCount}</span>
            <span className="text-[8px] uppercase font-bold text-yellow-700 mt-1">Transformed</span>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
              Asset Gallery
            </span>
            <div className="h-px bg-border flex-1" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {images.map((img) => (
              <ImageCard key={img.id} {...img} />
            ))}
          </div>
        </div>
      )}

      {!isScanning && images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 px-4 rounded-xl border border-dashed border-border bg-muted/10">
          <Search className="h-8 w-8 text-muted-foreground/30 mb-3" />
          <h3 className="text-sm font-bold text-foreground/80 text-center leading-tight">No data detected</h3>
          <p className="text-[11px] text-muted-foreground text-center mt-2 max-w-[200px]">
            The scanner will analyze all visual assets in the current tab for integrity.
          </p>
        </div>
      )}
    </div>
  );
}
