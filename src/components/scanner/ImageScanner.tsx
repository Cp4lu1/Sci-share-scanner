
"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Grid, Filter, RefreshCcw, LayoutGrid, Globe, ArrowRight } from "lucide-react";
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
          description: "Make sure permissions are granted."
        });
        setIsScanning(false);
        return;
      }
    } else {
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
        description: "Could not detect scientific assets on this page."
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
    <div className="space-y-4 animate-in fade-in duration-700 slide-in-from-bottom-2">
      <div className="space-y-4">
        <Button
          onClick={startScan}
          disabled={isScanning}
          className="w-full bg-primary hover:bg-primary/90 shadow-lg py-7 text-sm font-black h-14 rounded-xl group transition-all"
        >
          {isScanning ? (
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
          ) : (
            <Search className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
          )}
          {isScanning ? "Processing Assets..." : "Analyze Current Tab"}
        </Button>

        {/* Discover Link Requested by User */}
        <div className="flex flex-col items-center">
          <a 
            href="https://sci-share.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-primary transition-colors group uppercase tracking-widest"
          >
            Discover more features at sci-share.com
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
        
        {images.length > 0 && !isScanning && (
          <Button
            variant="ghost"
            onClick={() => setImages([])}
            className="w-full h-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:bg-slate-100/80"
          >
            <RefreshCcw className="mr-2 h-3 w-3" />
            Reset Analysis
          </Button>
        )}
      </div>

      {isScanning && (
        <div className="space-y-3 p-4 rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-sm">
          <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.15em] text-primary">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Perceptual Hashing
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 rounded-full overflow-hidden bg-primary/10" />
        </div>
      )}

      {images.length > 0 && !isScanning && (
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-100/40 border border-slate-200/60 shadow-sm">
            <LayoutGrid className="h-4 w-4 text-slate-400 mb-1.5" />
            <span className="text-xl font-black text-slate-800 leading-none">{images.length}</span>
            <span className="text-[9px] uppercase font-black text-slate-400 mt-1.5 tracking-tight">Assets</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-destructive/5 border border-destructive/10 shadow-sm">
            <Filter className="h-4 w-4 text-destructive/70 mb-1.5" />
            <span className="text-xl font-black text-destructive leading-none">{duplicatesCount}</span>
            <span className="text-[9px] uppercase font-black text-destructive/60 mt-1.5 tracking-tight">Dupes</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-amber-50 border border-amber-200/50 shadow-sm">
            <Grid className="h-4 w-4 text-amber-600/70 mb-1.5" />
            <span className="text-xl font-black text-amber-600 leading-none">{transformedCount}</span>
            <span className="text-[9px] uppercase font-black text-amber-600/60 mt-1.5 tracking-tight">Transf</span>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">
              Asset Discovery
            </span>
            <div className="h-px bg-slate-200/60 flex-1" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {images.map((img) => (
              <ImageCard key={img.id} {...img} />
            ))}
          </div>
        </div>
      )}

      {!isScanning && images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-8 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 shadow-inner">
          <div className="bg-white p-5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] mb-6">
            <Globe className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-[11px] font-black text-slate-600 text-center leading-tight uppercase tracking-[0.25em]">Awaiting Analysis</h3>
          <p className="text-[11px] text-slate-400 text-center mt-4 leading-relaxed font-medium">
            Open a scientific article and click the button above to verify visual data integrity across the entire page.
          </p>
        </div>
      )}
    </div>
  );
}
