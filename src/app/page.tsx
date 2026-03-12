"use client";

import { ImageScanner } from "@/components/scanner/ImageScanner";
import { Shield, Settings, ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    /* 
      The root container is designed to fill the extension popup's viewport (400x600).
    */
    <div className="w-[400px] h-[600px] flex flex-col overflow-hidden bg-white">
      
      {/* Extension Header */}
      <header className="p-4 border-b bg-slate-900 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg shadow-inner">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-extrabold tracking-tight text-xs leading-none">
              SCI-SHARE <span className="text-primary">SCANNER</span>
            </h1>
            <p className="text-[9px] text-slate-400 font-medium mt-0.5 uppercase tracking-tighter">Integrity Suite</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white hover:bg-white/5">
            <Settings className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      {/* Extension Content - Scrollable area */}
      <main className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
        <div className="space-y-4">
          {/* Active Context Status */}
          <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="bg-green-100 p-1 rounded-md shrink-0">
                <Globe className="h-3 w-3 text-green-600" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter leading-none">Scanning Site</span>
                <span className="text-[11px] font-medium text-slate-700 truncate">nature.com/articles/s41586...</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-6 text-[9px] px-2 font-bold bg-slate-50 border-slate-200">
              <ExternalLink className="h-2.5 w-2.5 mr-1" />
              DASHBOARD
            </Button>
          </div>

          <ImageScanner />
        </div>
      </main>

      {/* Extension Footer */}
      <footer className="p-3 border-t bg-white shrink-0">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span>v1.0.0-PRO</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="hover:text-primary transition-colors">Docs</button>
            <Separator orientation="vertical" className="h-3" />
            <button className="hover:text-primary transition-colors">Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
