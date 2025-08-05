'use client'
import React, { useState } from 'react'
import Link from 'next/link'

interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  icon: string
  rating: number
  reviewCount: number
  tags: string[]
}

export default function HomePage() {
  const [products] = useState<Product[]>([
    {
      id: 1,
      title: 'スマート文章校正AI Pro',
      description: '日本語の文章を自動で校正・改善してくれる高性能AIツール。ビジネス文書からブログ記事まで幅広く対応。',
      price: 2980,
      category: '文章作成',
      icon: '🧠',
      rating: 4.8,
      reviewCount: 234,
      tags: ['文章作成', '校正', 'ビジネス']
    },
    {
      id: 2,
      title: 'データ分析アシスタント',
      description: 'CSVファイルをアップロードするだけで、美しいグラフと詳細な統計分析を自動生成。データサイエンスの知識不要。',
      price: 4500,
      category: 'データ分析',
      icon: '📊',
      rating: 4.6,
      reviewCount: 189,
      tags: ['データ分析', 'グラフ', '統計']
    },
    {
      id: 3,
      title: 'プロロゴ生成AI Studio',
      description: '会社名やキーワードを入力するだけで、プロデザイナー級のロゴデザインを複数パターン自動生成。商用利用可能。',
      price: 1980,
      category: 'デザイン',
      icon: '🎨',
      rating: 4.9,
      reviewCount: 456,
      tags: ['デザイン', 'ロゴ', 'ブランディング']
    },
    {
      id: 4,
      title: 'AI学習プランナー',
      description: '目標と現在のレベルを入力すると、最適化された学習スケジュールを自動作成。進捗管理機能付き。',
      price: 2200,
      category: '教育',
      icon: '📚',
      rating: 4.7,
      reviewCount: 167,
      tags: ['教育', '学習', '計画']
    },
    {
      id: 5,
      title: 'SEO最適化アナライザー',
      description: 'WebサイトのSEO状況を詳細分析し、具体的な改善提案を提供。検索順位向上のための戦略的アドバイス付き。',
      price: 5980,
      category: 'マーケティング',
      icon: '🔍',
      rating: 4.4,
      reviewCount: 123,
      tags: ['SEO', '分析', 'マーケティング']
    },
    {
      id: 6,
      title: 'AIチャットボット構築ツール',
      description: 'ノーコードで高性能なチャットボットを構築。自然な日本語対話で顧客満足度を大幅向上。',
      price: 3500,
      category: 'チャットボット',
      icon: '💬',
      rating: 4.5,
      reviewCount: 298,
      tags: ['チャットボット', 'サポート', 'ノーコード']
    }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* プレミアムヘッダー */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🤖</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Marketplace Pro</h1>
                <div className="text-xs text-blue-600 font-medium">Premium Edition</div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                ホーム
              </Link>
              <Link href="/sell" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                出品する
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                ダッシュボード
              </Link>
              <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all hover:shadow-lg transform hover:-translate-y-0.5">
                ログイン
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            1,000+ のAIツールが利用可能
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            AIツールの
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              プレミアム
            </span>
            <br />マーケットプレイス
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            厳選された高品質なAIツールを発見し、あなたのビジネスを次のレベルへ。
            プロフェッショナルが開発した信頼できるソリューションをお届けします。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all hover:shadow-xl transform hover:-translate-y-1">
              🚀 ツールを探す
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all">
              💡 出品について
            </button>
          </div>
          
          {/* 統計 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{products.length}+</div>
              <div className="text-gray-600 font-medium">AIツール</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">4.7★</div>
              <div className="text-gray-600 font-medium">平均評価</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">10K+</div>
              <div className="text-gray-600 font-medium">利用者数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">99.9%</div>
              <div className="text-gray-600 font-medium">稼働率</div>
            </div>
          </div>
        </div>
      </section>

      {/* 商品一覧 */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">🔥 注目のAIツール</h2>
              <p className="text-gray-600">プロフェッショナルが厳選した高品質ツール</p>
            </div>
            <div className="hidden md:flex gap-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-blue-600 transition-colors">
                すべて
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-blue-600 transition-colors">
                人気順
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-blue-600 transition-colors">
                新着順
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
              >
                {/* 商品画像エリア */}
                <div className="relative h-48 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center group-hover:from-blue-100 group-hover:via-purple-100 group-hover:to-pink-100 transition-all duration-300">
                  <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                    {product.icon}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {product.category}
                  </div>
                  {index < 3 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      HOT
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5-Math.floor(product.rating))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {product.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({product.reviewCount}件)
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        ¥{product.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">買い切り価格</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all hover:shadow-md transform hover:-translate-y-0.5 font-medium">
                        購入する
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors">
                        詳細
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* プレミアム特徴セクション */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">なぜ選ばれるのか？</h2>
          <p className="text-xl text-blue-100 mb-12">プロフェッショナルに愛される理由</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">厳格な品質審査</h3>
              <p className="text-blue-100">すべてのツールは専門家による厳しい審査を通過</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-2">即座に利用開始</h3>
              <p className="text-blue-100">購入後すぐに使える。複雑な設定は一切不要</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold mb-2">充実サポート</h3>
              <p className="text-blue-100">24時間365日の技術サポートでいつでも安心</p>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🤖</span>
            <span className="text-xl font-bold">AI Marketplace Pro</span>
          </div>
          <p className="text-gray-400 mb-6">
            プロフェッショナルのためのAIツールプラットフォーム
          </p>
          <div className="bg-green-900 text-green-200 px-6 py-3 rounded-lg inline-block">
            <strong>🎉 プレミアム版デプロイ成功！</strong> 
            <br />高品質なAIマーケットプレイスが稼働中
          </div>
        </div>
      </footer>
    </div>
  )
}