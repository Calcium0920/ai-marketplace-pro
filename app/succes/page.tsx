'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, ArrowRight, Star, MessageSquare } from 'lucide-react'

interface PurchasedItem {
  id: number | string;
  title: string;
  description: string;
  price: number;
  icon: string;
  category?: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState<boolean>(true)
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([])

  useEffect(() => {
    if (sessionId) {
      // 購入完了処理
      const cart: PurchasedItem[] = JSON.parse(localStorage.getItem('cart') || '[]')
      setPurchasedItems(cart)
      
      // カートをクリア
      localStorage.removeItem('cart')
      
      // 購入履歴を保存
      const purchases = JSON.parse(localStorage.getItem('purchases') || '[]')
      const newPurchase = {
        id: Date.now(),
        sessionId,
        items: cart,
        total: cart.reduce((sum: number, item: PurchasedItem) => sum + item.price, 0),
        purchasedAt: new Date().toISOString(),
        status: 'completed' // ここが重要！レビュー機能で使用
      }
      purchases.push(newPurchase)
      localStorage.setItem('purchases', JSON.stringify(purchases))
      
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <div className="text-xl">購入処理を完了しています...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-green-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">🤖 AI Marketplace</Link>
          <Link href="/" className="bg-green-500 px-4 py-2 rounded hover:bg-green-400">
            ホームに戻る
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🎉 購入完了！
          </h1>
          <p className="text-gray-600 mb-8">
            AIツールの購入が正常に完了しました。ありがとうございます！
          </p>

          {/* 購入したアイテム */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">購入したツール</h2>
            <div className="space-y-4">
              {purchasedItems.map((item: PurchasedItem) => (
                <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="text-left">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description?.slice(0, 60)}...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">¥{item.price.toLocaleString()}</div>
                    <div className="flex gap-2 mt-2">
                      <Link
                        href={`/tools/${item.id}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        利用開始
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* レビュー案内 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Star className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-bold text-yellow-800">レビューをお聞かせください！</h3>
            </div>
            <p className="text-yellow-700 mb-4">
              購入したツールの使用感をレビューして、他のユーザーに役立つ情報を共有しませんか？
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {purchasedItems.map((item: PurchasedItem) => (
                <Link
                  key={item.id}
                  href={`/tools/${item.id}#reviews`}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  「{item.title}」をレビュー
                </Link>
              ))}
            </div>
          </div>

          {/* 次のアクション */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              ダッシュボードで管理
            </Link>
            <Link
              href="/"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              他のツールを探す
            </Link>
          </div>

          {/* 重要な情報 */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-2">📧 重要なお知らせ</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• 購入確認メールをお送りしました</li>
              <li>• ツールのアクセス情報はダッシュボードで確認できます</li>
              <li>• 技術サポートが必要な場合はお気軽にお問い合わせください</li>
              <li>• レビュー投稿で他のユーザーをサポートできます</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}