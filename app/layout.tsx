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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ai-marketplace-pro.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Marketplace Pro - AIツール売買プラットフォーム",
    description: "便利なAIツールを見つけて購入、または自分のツールを販売できるプラットフォーム",
    url: "https://ai-marketplace-pro.vercel.app",
    siteName: "AI Marketplace Pro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Marketplace Pro",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Marketplace Pro - AIツール売買プラットフォーム",
    description: "便利なAIツールを見つけて購入、または自分のツールを販売できるプラットフォーム",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
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
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "AI Marketplace Pro",
              description: "AIツール売買プラットフォーム",
              url: "https://ai-marketplace-pro.vercel.app",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://ai-marketplace-pro.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        {/* Skip to content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          メインコンテンツにスキップ
        </a>
        
        {/* Main Content */}
        <div id="main-content" className="min-h-full">
          {children}
        </div>
        
        {/* Global Scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Global error handler
              window.addEventListener('error', function(e) {
                console.error('Global error:', e.error);
              });
              
              // Performance monitoring
              window.addEventListener('load', function() {
                setTimeout(function() {
                  const perfData = performance.getEntriesByType('navigation')[0];
                  console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
                }, 0);
              });
              
              // Theme detection
              if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            `,
          }}
        />
      </body>
    </html>
  );
}