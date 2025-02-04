import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from "@/components/ui/toaster";
import "simplebar-react/dist/simplebar.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "tempest ai.",
  description: "Chat with PDFs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="light">
          <body
            className={cn(
              "min-h-screen font-sans antialiased grainy",
              inter.className
            )}
          >
            <Toaster />
            <Navbar />
            {children}
          </body>
      </html>
    </ClerkProvider>
  );
}
