"use client";

import { Check, Copy, Maximize2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ImageStatus = "normal" | "duplicate" | "transformed";

interface ImageCardProps {
  id: string;
  url: string;
  width: number;
  height: number;
  status: ImageStatus;
  similarity?: number;
  description?: string;
}

export function ImageCard({ url, width, height, status, similarity, description }: ImageCardProps) {
  const isDuplicate = status === "duplicate";
  const isTransformed = status === "transformed";

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md border-muted">
      <CardContent className="p-0">
        <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
          <img
            src={url}
            alt={description || "Scanned image"}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
          
          {/* Status Overlays */}
          {isDuplicate && (
            <div className="absolute inset-0 bg-destructive/40 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
              <div className="bg-destructive text-destructive-foreground p-2 rounded-full shadow-lg mb-2">
                <Copy className="h-6 w-6" />
              </div>
              <p className="text-white font-bold text-xs uppercase tracking-wider drop-shadow-sm">
                Potential Duplicate
              </p>
              {similarity !== undefined && (
                <p className="text-white text-[10px] font-medium opacity-90">
                  {Math.round(similarity * 100)}% Match
                </p>
              )}
            </div>
          )}

          {isTransformed && (
            <div className="absolute inset-0 bg-yellow-500/40 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
              <div className="bg-yellow-500 text-white p-2 rounded-full shadow-lg mb-2">
                <Maximize2 className="h-6 w-6" />
              </div>
              <p className="text-white font-bold text-xs uppercase tracking-wider drop-shadow-sm">
                Potential Transformation
              </p>
              <p className="text-white text-[10px] font-medium opacity-90">
                {width} × {height}
              </p>
            </div>
          )}
        </div>

        <div className="p-3 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">
              {width}px × {height}px
            </span>
            {isDuplicate && <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">Flagged</Badge>}
            {isTransformed && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 h-5 px-1.5 text-[10px]">Review</Badge>}
          </div>
          <p className="text-xs font-medium truncate text-foreground/80">
            {description || "No description"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
