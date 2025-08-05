import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Marketplace Pro - AIツール売買プラットフォーム",
  description: "便利なAIツールを見つけて購入、または自分のツールを販売できるプラットフォーム",
  keywords: ["AI", "ツール", "マーケットプレイス", "人工知能", "販売", "購入", "機械学習", "自動化", "ビジネス", "開発"],
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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Marketplace Pro - AIツール売買プラットフォーム",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "AI Marketplace Pro - AIツール売買プラットフォーム",
    description: "便利なAIツールを見つけて購入、または自分のツールを販売できるプラットフォーム",
    images: ["/og-image.png"],
    creator: "@ai_marketplace",
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
  
  manifest: "/manifest.json",
  
  other: {
    "google-site-verification": "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full scroll-smooth">
      <head>
        {/* ファビコン */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* PWA設定 */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AI Marketplace Pro" />
        
        {/* ビューポート設定 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        
        {/* セキュリティヘッダー */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* プリロード重要リソース */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* 構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "AI Marketplace Pro",
              "description": "便利なAIツールを見つけて購入、または自分のツールを販売できるプラットフォーム",
              "url": "https://ai-marketplace-pro.vercel.app",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "category": "AI Tools",
                "availability": "https://schema.org/InStock"
              },
              "author": {
                "@type": "Organization",
                "name": "AI Marketplace Pro"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} h-full antialiased bg-gray-50`}>
        {/* スキップリンク（アクセシビリティ） */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
        >
          メインコンテンツにスキップ
        </a>
        
        {/* メインコンテナ */}
        <div className="min-h-full flex flex-col">
          <main id="main-content" className="flex-1">
            {children}
          </main>
          
          {/* フッター（全ページ共通） */}
          <footer className="bg-gray-800 text-white py-8 mt-auto">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-4">🤖 AI Marketplace Pro</h3>
                  <p className="text-gray-300 text-sm">
                    AIツールの売買ができる革新的なプラットフォーム
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold mb-3">サービス</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li><a href="#" className="hover:text-white transition-colors">ツール検索</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">ツール出品</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">売上管理</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">API連携</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold mb-3">サポート</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li><a href="#" className="hover:text-white transition-colors">ヘルプセンター</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">利用規約</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">お問い合わせ</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold mb-3">フォロー</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Twitter">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="GitHub">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                <p className="text-gray-300 text-sm">
                  © 2024 AI Marketplace Pro. All rights reserved.
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Made with ❤️ using Next.js 14, TypeScript & Tailwind CSS
                </p>
              </div>
            </div>
          </footer>
        </div>
        
        {/* バックトゥトップボタン */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 z-40 opacity-0 invisible"
          id="back-to-top"
          aria-label="ページトップに戻る"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
        
        {/* バックトゥトップ表示制御スクリプト */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('scroll', function() {
                const backToTop = document.getElementById('back-to-top');
                if (window.pageYOffset > 300) {
                  backToTop.classList.remove('opacity-0', 'invisible');
                  backToTop.classList.add('opacity-100', 'visible');
                } else {
                  backToTop.classList.add('opacity-0', 'invisible');
                  backToTop.classList.remove('opacity-100', 'visible');
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}