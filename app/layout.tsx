import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Syne } from "next/font/google";
import "./globals.css";

const display = Syne({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumen | Real-time 3D studio",
  description:
    "A lightweight, scroll-driven 3D experience. Every frame is rendered live with WebGL, with no videos or image sequences to download.",
};

export const viewport: Viewport = {
  themeColor: "#07070b",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable}`}>
      {/* browser extensions (Grammarly, ColorZilla…) add attributes to <body>; don't flag that as a hydration error */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
