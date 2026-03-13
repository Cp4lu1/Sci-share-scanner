
"use client";

import { ImageScanner } from "@/components/scanner/ImageScanner";
import { Shield, Settings, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function PopupUI() {
  return (
    /* 
      The extension popup container. 
      Width: 380px (Standard optimized width)
      Height: 600px (Max standard height)
    */
    <div className="w-[380px] h-[600px] flex flex-col overflow-hidden bg-white shadow-none">
      
      {/* Extension Header / Logo Section */}
      <header className="px-5 py-4 bg-slate-900 flex items-center justify-between shrink-0 border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg shadow-[0_0_20px_rgba(var(--primary),0.4)]">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-black tracking-tighter text-[14px] leading-none">
              SCI-SHARE <span className="text-primary-foreground/80">SCANNER</span>
            </h1>
            <p className="text-[9px] text-slate-400 font-bold mt-0.5 uppercase tracking-[0.2em]">Integrity Shield</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/5 rounded-full">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <div className="p-4 space-y-5">
          
          {/* Active Context Card */}
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-primary/5 p-2 rounded-lg shrink-0 border border-primary/10">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none">Scanning Target</span>
                <span className="text-[12px] font-bold text-slate-800 truncate max-w-[160px]">Current Browser Tab</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-[10px] px-3 font-black bg-white border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm">
              <ExternalLink className="h-3.5 w-3.5 mr-2 text-primary" />
              PORTAL
            </Button>
          </div>

          {/* Scanner Core Component */}
          <ImageScanner />
          
        </div>
      </main>

      {/* Extension Footer */}
      <footer className="px-5 py-3.5 border-t bg-white shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Engine v1.0.0</span>
        </div>
        
        <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-tight">
          <button className="hover:text-primary transition-colors">Support</button>
          <Separator orientation="vertical" className="h-3.5" />
          <button className="hover:text-primary transition-colors">Privacy</button>
        </div>
      </footer>
    </div>
  );
}
