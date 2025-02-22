import { AppSidebar } from "@/components/app-sidebar";
import { LinkBreadcrumbs } from "@/components/link-breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
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
