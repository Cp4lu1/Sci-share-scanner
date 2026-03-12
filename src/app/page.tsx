import { ImageScanner } from "@/components/scanner/ImageScanner";
import { Shield, Database, Microscope, Menu, Settings, Bell, User } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r border-border/50 bg-white">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-primary font-headline">
                SCI-SHARE
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3">
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 text-[10px] font-bold uppercase tracking-widest opacity-50">
                Analysis Tools
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive className="bg-primary/5 text-primary">
                    <Microscope className="h-4 w-4" />
                    <span>Image Scanner</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Database className="h-4 w-4" />
                    <span>Integrity Log</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 mt-auto">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-primary">Lab Admin</span>
                <span className="text-[10px] text-muted-foreground">Premium Account</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-y-auto">
          {/* Header Bar */}
          <header className="sticky top-0 z-10 h-16 border-b border-border/40 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Scientific Assets</span>
              <span className="opacity-40">/</span>
              <span className="text-primary font-medium">Scanner</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-accent rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="max-w-7xl mx-auto p-6 lg:p-10">
            <ImageScanner />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
