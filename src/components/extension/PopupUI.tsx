
"use client";

import { ImageScanner } from "@/components/scanner/ImageScanner";
import { Shield, Settings, ExternalLink, Globe } from "lucide-react";
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
      
      {/* Extension Header */}
      <header className="px-4 py-3 bg-slate-900 flex items-center justify-between shrink-0 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary p-1.5 rounded-md shadow-[0_0_15px_rgba(var(--primary),0.3)]">
            <Shield className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-black tracking-tight text-[11px] leading-none">
              SCI-SHARE <span className="text-primary">SCANNER</span>
            </h1>
            <p className="text-[8px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Integrity Verification</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/5">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50/30">
        <div className="p-4 space-y-4">
          
          {/* Active Context Info */}
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm ring-1 ring-black/[0.02]">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                <Globe className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight leading-none">Scanning Context</span>
                <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[160px]">Active Browser Tab</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-[9px] px-2.5 font-bold bg-white border-slate-200 hover:bg-slate-50 rounded-lg">
              <ExternalLink className="h-3 w-3 mr-1.5" />
              PORTAL
            </Button>
          </div>

          {/* Scanner Component */}
          <ImageScanner />
          
        </div>
      </main>

      {/* Extension Footer */}
      <footer className="px-4 py-3 border-t bg-white shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">System Ready</span>
        </div>
        
        <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
          <button className="hover:text-primary transition-colors">Docs</button>
          <Separator orientation="vertical" className="h-3" />
          <button className="hover:text-primary transition-colors">v1.0.0</button>
        </div>
      </footer>
    </div>
  );
}
