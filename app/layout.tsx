import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Marketplace Pro - AIツール売買プラットフォーム",
  description: "便利なAIツールを見つけて購入、または自分のツールを販売できるプラットフォーム",
  keywords: ["AI", "ツール", "マーケットプレイス", "人工知能", "販売", "購入"],
  authors: [{ name: "AI Marketplace Pro" }],
  creator: "AI Marketplace Pro",
  publisher: "AI Marketplace Pro",
  metadataBase: new URL("https://ai-marketplace-pro.vercel.app"),
  openGraph: {
    title: "AI Marketplace Pro - AIツール売買プラットフォーム",
    description: "便利なAIツールを見つけて購入、または自分のツールを販売できるプラットフォーム",
    url: "https://ai-marketplace-pro.vercel.app",
    siteName: "AI Marketplace Pro",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Marketplace Pro - AIツール売買プラットフォーム",
    description: "便利なAIツールを見つけて購入、または自分のツールを販売できるプラットフォーム",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}