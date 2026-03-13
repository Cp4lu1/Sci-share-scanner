"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Grid, Filter, RefreshCcw, LayoutGrid, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCard, ImageStatus } from "./ImageCard";
import { generatePHash, compareHashes } from "@/lib/phash";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

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
  const [isExtension, setIsExtension] = useState(false);

  useEffect(() => {
    setIsExtension(typeof chrome !== 'undefined' && !!chrome.tabs);
  }, []);

  const startScan = async () => {
    setIsScanning(true);
    setProgress(0);
    setImages([]);

    let detectedAssets: { url: string; width: number; height: number }[] = [];

    if (isExtension) {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab.id) throw new Error("No active tab found");

        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const imgs = Array.from(document.querySelectorAll('img'));
            return imgs.map(img => ({
              url: img.src,
              width: img.naturalWidth || img.width,
              height: img.naturalHeight || img.height,
            })).filter(img => (img.width > 150 && img.height > 150) && img.url.startsWith('http'));
          }
        });

        detectedAssets = results[0].result as any;
      } catch (err) {
        console.error("Extension scan failed:", err);
        toast({
          variant: "destructive",
          title: "Scan Failed",
          description: "Make sure you have granted permissions and are on a valid webpage."
        });
        setIsScanning(false);
        return;
      }
    } else {
      // Mock data for development preview if not in extension context
      detectedAssets = [
        { url: "https://picsum.photos/seed/sci1/800/600", width: 800, height: 600 },
        { url: "https://picsum.photos/seed/sci1/800/600", width: 800, height: 600 },
        { url: "https://picsum.photos/seed/sci2/600/400", width: 600, height: 400 },
        { url: "https://picsum.photos/seed/sci2/1200/400", width: 1200, height: 400 },
      ];
    }

    if (detectedAssets.length === 0) {
      toast({
        title: "No Figures Found",
        description: "Could not detect any scientific figures on this page."
      });
      setIsScanning(false);
      return;
    }

    const processed: ScannedImage[] = [];
    for (let i = 0; i < detectedAssets.length; i++) {
      const asset = detectedAssets[i];
      setProgress(((i + 1) / detectedAssets.length) * 50);

      try {
        const hash = await generatePHash(asset.url);
        processed.push({
          id: `img-${i}`,
          url: asset.url,
          width: asset.width,
          height: asset.height,
          description: `Asset ${i + 1}`,
          pHash: hash,
          status: "normal",
        });
      } catch (err) {
        console.warn(`Could not hash image ${asset.url}:`, err);
      }
    }

    // Similarity Cross-Analysis
    const analyzed = [...processed];
    for (let i = 0; i < analyzed.length; i++) {
      setProgress(50 + ((i + 1) / analyzed.length) * 50);
      for (let j = 0; j < analyzed.length; j++) {
        if (i === j) continue;
        const imgA = analyzed[i];
        const imgB = analyzed[j];

        if (imgA.pHash && imgB.pHash) {
          const similarity = compareHashes(imgA.pHash, imgB.pHash);
          if (similarity > 0.95) {
            const ratioA = imgA.width / imgA.height;
            const ratioB = imgB.width / imgB.height;
            const ratioDiff = Math.abs(ratioA - ratioB);

            if (ratioDiff > 0.05 || imgA.width !== imgB.width) {
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
        <Button
          onClick={startScan}
          disabled={isScanning}
          className="w-full bg-primary hover:bg-primary/90 shadow-md py-6 text-sm font-bold h-12"
        >
          {isScanning ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          {isScanning ? "Processing Tab Assets..." : "Analyze Current Tab"}
        </Button>
        
        {images.length > 0 && !isScanning && (
          <Button
            variant="outline"
            onClick={() => setImages([])}
            className="w-full h-8 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-slate-200"
          >
            <RefreshCcw className="mr-2 h-3 w-3" />
            Clear Analysis
          </Button>
        )}
      </div>

      {isScanning && (
        <div className="space-y-2 p-3 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary">
            <span>Perceptual Hashing</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}

      {images.length > 0 && !isScanning && (
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 rounded-lg bg-slate-100/50 border border-slate-200">
            <LayoutGrid className="h-3 w-3 text-slate-500 mb-1" />
            <span className="text-lg font-bold leading-none">{images.length}</span>
            <span className="text-[8px] uppercase font-bold text-slate-400 mt-1">Found</span>
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
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
              Asset Map
            </span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {images.map((img) => (
              <ImageCard key={img.id} {...img} />
            ))}
          </div>
        </div>
      )}

      {!isScanning && images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Globe className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-xs font-bold text-slate-600 text-center leading-tight uppercase tracking-widest">Awaiting Analysis</h3>
          <p className="text-[10px] text-slate-400 text-center mt-3 leading-relaxed">
            Open a scientific journal or data-rich page, then click scan to analyze visual integrity.
          </p>
        </div>
      )}
    </div>
  );
}