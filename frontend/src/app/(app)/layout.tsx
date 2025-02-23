import { Toaster } from "sonner";
import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import AuthMiddleware from "@/components/auth-middleware";
import { LinkBreadcrumbs } from "@/components/link-breadcrumbs";
import { SwEventsHandler } from "@/components/sw-events-handler";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthMiddleware />
      <SidebarProvider>
        <AppSidebar />
        <SwEventsHandler />
        <main className="flex flex-col gap-4 w-full max-w-xl mx-auto">
          <div className="flex items-center px-4 py-1 gap-2 bg-background/75">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-full mr-2" />
            <LinkBreadcrumbs />
          </div>
          <div className="p-4">{children}</div>
        </main>
      </SidebarProvider>
      <Toaster />
    </>
  );
}
