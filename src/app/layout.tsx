import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider, SocketProvider, ChatProvider } from "@/components/providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BackForge",
  description: "Full-stack application with modern architecture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <SocketProvider>
            <ChatProvider>
              {children}
              <Toaster
                position="top-right"
                richColors
                closeButton
                duration={4000}
              />
            </ChatProvider>
          </SocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
