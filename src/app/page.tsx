
"use client";

import { ImageScanner } from "@/components/scanner/ImageScanner";
import { Shield, Settings, Bell, ExternalLink, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="flex items-start justify-center min-h-screen bg-slate-100/50 p-4 md:p-8">
      {/* Simulation of a Chrome Extension Popup Window */}
      <Card className="w-full max-w-[400px] h-[600px] flex flex-col shadow-2xl border-border/50 overflow-hidden bg-white">
        
        {/* Extension Header */}
        <header className="p-4 border-b bg-primary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-md">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-white font-bold tracking-tight text-sm">
              SCI-SHARE <span className="font-normal opacity-80">SCANNER</span>
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Extension Content - Scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border border-border/40">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                <span className="text-[11px] font-medium text-muted-foreground">Active Tab: Research Journal...</span>
              </div>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2">
                <ExternalLink className="h-3 w-3 mr-1" />
                Details
              </Button>
            </div>

            <ImageScanner />
          </div>
        </main>

        {/* Extension Footer */}
        <footer className="p-3 border-t bg-muted/20">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
            <span>V1.0.0 Stable</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                Connected
              </span>
              <Separator orientation="vertical" className="h-3" />
              <button className="hover:text-primary transition-colors">Help Center</button>
            </div>
          </div>
        </footer>
      </Card>
    </div>
  );
}
