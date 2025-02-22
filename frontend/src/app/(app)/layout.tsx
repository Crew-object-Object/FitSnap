import { Toaster } from "sonner";
import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { LinkBreadcrumbs } from "@/components/link-breadcrumbs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SwEventsHandler } from "@/components/sw-events-handler";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SwEventsHandler />
        <main className="p-4 flex flex-col gap-4 w-full max-w-xl mx-auto">
          <div className="flex items-center h-6 gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-full mr-2" />
            <LinkBreadcrumbs />
          </div>
          {children}
        </main>
      </SidebarProvider>
      <Toaster />
    </>
  );
}
