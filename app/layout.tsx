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
  title: "Ucchas | Shopify, e-commerce & web development",
  description:
    "Ucchas builds Shopify and e-commerce stores from A to Z, hires and manages remote teams, and engineers web, mobile and cloud software.",
};

export const viewport: Viewport = {
  themeColor: "#07070b",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable}`}>
      {/* browser extensions (Grammarly, ColorZilla…) add attributes to <body>; don't flag that as a hydration error */}
      <body suppressHydrationWarning>
        {/* scroll reveals start hidden and are shown by the scroll engine; without JavaScript, show them */}
        <noscript>
          <style>{".rise{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
