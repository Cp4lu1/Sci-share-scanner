"use client";

import { PopupUI } from "@/components/extension/PopupUI";

/**
 * The main entry point for the Chrome Extension Popup.
 * In a Next.js static build (output: 'export'), this page 
 * becomes index.html, which is referenced in manifest.json.
 */
export default function ExtensionPopupPage() {
  return (
    <div className="min-h-screen flex items-start justify-center bg-transparent">
      <PopupUI />
    </div>
  );
}