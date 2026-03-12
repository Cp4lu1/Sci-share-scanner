
"use client";

import { Copy, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="group relative overflow-hidden transition-all border-border/50 bg-white">
      <CardContent className="p-0">
        <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
          <img
            src={url}
            alt={description || "Scanned image"}
            className="object-cover w-full h-full"
          />
          
          {isDuplicate && (
            <div className="absolute inset-0 bg-destructive/60 flex flex-col items-center justify-center">
              <Copy className="h-5 w-5 text-white mb-1" />
              <p className="text-white font-bold text-[9px] uppercase tracking-tighter">
                Duplicate
              </p>
            </div>
          )}

          {isTransformed && (
            <div className="absolute inset-0 bg-yellow-500/60 flex flex-col items-center justify-center">
              <Maximize2 className="h-5 w-5 text-white mb-1" />
              <p className="text-white font-bold text-[9px] uppercase tracking-tighter">
                Modification
              </p>
            </div>
          )}
        </div>

        <div className="p-2 space-y-1">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[8px] font-mono text-muted-foreground shrink-0">
              {width}×{height}
            </span>
            {isDuplicate && <Badge variant="destructive" className="h-3 px-1 text-[7px] font-bold">FLAGGED</Badge>}
            {isTransformed && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 h-3 px-1 text-[7px] font-bold">REVIEW</Badge>}
          </div>
          <p className="text-[9px] font-medium truncate text-foreground/80">
            {description || "Asset ID: " + url.split('seed/')[1]?.split('/')[0]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
