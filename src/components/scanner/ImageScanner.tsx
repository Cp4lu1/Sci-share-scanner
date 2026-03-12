"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Grid, Filter, RefreshCcw, LayoutGrid, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCard, ImageStatus } from "./ImageCard";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { generatePHash, compareHashes } from "@/lib/phash";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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

    // Simulate scanning and hashing
    const processed: ScannedImage[] = [];
    for (let i = 0; i < initialImages.length; i++) {
      const imgData = initialImages[i];
      setProgress(((i + 1) / initialImages.length) * 50); // First 50% for loading/hashing

      try {
        const hash = await generatePHash(imgData.url);
        
        // Get dimensions
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
        console.error("Error hashing image:", imgData.id);
        processed.push(imgData);
      }
    }

    // Similarity Analysis (Next 50% of progress)
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
            // Check for transformations
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Scanner Overview</h1>
          <p className="text-muted-foreground mt-1">
            Analyzing page assets for scientific data integrity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setImages([])}
            disabled={isScanning || images.length === 0}
            className="border-primary/20 text-primary hover:bg-primary/5"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Button
            onClick={startScan}
            disabled={isScanning}
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            {isScanning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            {isScanning ? "Scanning Assets..." : "Scan Active Page"}
          </Button>
        </div>
      </div>

      {isScanning && (
        <div className="space-y-3 bg-white p-6 rounded-xl border border-primary/10 shadow-sm">
          <div className="flex justify-between text-sm font-medium">
            <span className="flex items-center text-primary">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Image Perceptual Hashes
            </span>
            <span className="font-mono">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {images.length > 0 && !isScanning && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Alert className="bg-white border-primary/10">
            <LayoutGrid className="h-4 w-4 text-primary" />
            <AlertTitle className="text-xs uppercase font-bold text-muted-foreground">Scanned Assets</AlertTitle>
            <AlertDescription className="text-2xl font-bold text-primary">{images.length}</AlertDescription>
          </Alert>
          <Alert className="bg-destructive/5 border-destructive/10">
            <Filter className="h-4 w-4 text-destructive" />
            <AlertTitle className="text-xs uppercase font-bold text-destructive">Duplicates Detected</AlertTitle>
            <AlertDescription className="text-2xl font-bold text-destructive">{duplicatesCount}</AlertDescription>
          </Alert>
          <Alert className="bg-yellow-50 border-yellow-200">
            <Grid className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-xs uppercase font-bold text-yellow-700">Transformations</AlertTitle>
            <AlertDescription className="text-2xl font-bold text-yellow-600">{transformedCount}</AlertDescription>
          </Alert>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-4">
              Results Gallery
            </span>
            <Separator className="flex-1" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((img) => (
              <ImageCard key={img.id} {...img} />
            ))}
          </div>
        </div>
      )}

      {!isScanning && images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-6 rounded-3xl border-2 border-dashed border-primary/10 bg-white/50">
          <div className="p-4 rounded-full bg-primary/5 mb-4">
            <Search className="h-10 w-10 text-primary/30" />
          </div>
          <h3 className="text-xl font-bold text-primary/80">No scan results found</h3>
          <p className="text-muted-foreground text-center max-w-sm mt-2">
            Click the "Scan Active Page" button to begin analyzing images for duplicates and modifications.
          </p>
          <div className="mt-8 flex items-center gap-4 text-xs text-muted-foreground bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
            <Info className="h-3 w-3" />
            <span>Scanning uses pHash analysis for robust detection</span>
          </div>
        </div>
      )}
    </div>
  );
}
