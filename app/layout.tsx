import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ViewTransition } from "react";
import SystemClock from "@/components/SystemClock";
import CommandPalette from "@/components/CommandPalette";
import CursorAura from "@/components/CursorAura";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "slate.",
  description: "Fatigue-aware execution operating system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CursorAura />
        <SystemClock />
        <CommandPalette />
        <ViewTransition>{children}</ViewTransition>
      </body>
    </html>
  );
}
