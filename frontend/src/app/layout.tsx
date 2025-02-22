import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Created by create-next-app",
};

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          inter.className,
          "min-h-screen min-w-full overflow-y-auto overflow-x-hidden shadow-md relative"
        )}
      >
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/30 via-transparent to-background">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster reverseOrder={false} position="bottom-right" />
            {children}
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
