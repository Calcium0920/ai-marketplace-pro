'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, Package, CreditCard, Star, Calendar, Eye, Edit, Trash2, Plus, User } from 'lucide-react'

// Tool型を定義
interface Tool {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  creator: string;
  createdAt: string;
  endpointUrl: string;
  tags: string[];
  status?: string;
}

// Purchase関連の型を定義
interface PurchaseItem {
  id: string;
  title: string;
  price: number;
  icon?: string;
  category?: string;
}

interface Purchase {
  id: string;
  purchasedAt: string;
  total: number;
  items: PurchaseItem[];
}

// Review型を定義
interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  toolId: string;
  verified: boolean;
  helpful: number;
}

type ActiveTab = 'overview' | 'tools' | 'purchases' | 'reviews';

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [pendingTools, setPendingTools] = useState<Tool[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [receivedReviews, setReceivedReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview')

  useEffect(() => {
    if (session) {
      loadData()
      loadReceivedReviews()
    }
  }, [session])

  const loadData = (): void => {
    try {
      // 出品したツールを読み込み
      const tools: Tool[] = JSON.parse(localStorage.getItem('pendingTools') || '[]')
      const userTools = tools.filter((tool: Tool) => tool.creator === session?.user?.name)
      setPendingTools(userTools)

      // 購入履歴を読み込み
      const purchaseHistory: Purchase[] = JSON.parse(localStorage.getItem('purchases') || '[]')
      setPurchases(purchaseHistory)
    } catch (error) {
      console.error('データ読み込みエラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadReceivedReviews = (): void => {
    try {
      const allReviews: Review[] = JSON.parse(localStorage.getItem('reviews') || '[]')
      const allTools: Tool[] = JSON.parse(localStorage.getItem('pendingTools') || '[]')
      const approvedTools: Tool[] = JSON.parse(localStorage.getItem('approvedTools') || '[]')
      
      // 自分のツールを特定
      const myTools = [...allTools, ...approvedTools].filter((tool: Tool) => 
        tool.creator === session?.user?.name
      )
      const myToolIds = myTools.map((tool: Tool) => tool.id.toString())
      
      // 自分のツールに対するレビューを取得
      const myReviews = allReviews.filter((review: Review) => 
        myToolIds.includes(review.toolId)
      )
      
      setReceivedReviews(myReviews)
    } catch (error) {
      console.error('レビュー読み込みエラー:', error)
    }
  }

  const deleteTool = (toolId: string): void => {
    if (confirm('このツールを削除しますか？')) {
      try {
        const tools: Tool[] = JSON.parse(localStorage.getItem('pendingTools') || '[]')
        const updatedTools = tools.filter((tool: Tool) => tool.id !== toolId)
        localStorage.setItem('pendingTools', JSON.stringify(updatedTools))
        loadData()
        alert('ツールを削除しました')
      } catch (error) {
        console.error('削除エラー:', error)
        alert('削除に失敗しました')
      }
    }
  }

  // 統計データの計算
  const totalRevenue = pendingTools.reduce((sum: number, tool: Tool) => sum + (tool.price * 0), 0) // 実際の売上はここで計算
  const totalSales = 0 // 実際の販売数
  const averageRating = receivedReviews.length > 0 
    ? receivedReviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / receivedReviews.length
    : 0

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">🔒 ログインが必要です</h1>
          <p className="text-gray-600 mb-6">
            ダッシュボードにアクセスするには、まずログインしてください。
          </p>
          <Link 
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ログインする
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
            🤖 AI Marketplace
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden md:block">こんにちは、{session.user?.name}さん</span>
            <Link href="/" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400 transition-colors">
              ホームに戻る
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 ダッシュボード</h1>
          <p className="text-gray-600">あなたの出品状況と売上を確認できます</p>
        </div>

        {/* タブナビゲーション */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview' as ActiveTab, label: '概要', icon: TrendingUp },
                { id: 'tools' as ActiveTab, label: '出品ツール', icon: Package },
                { id: 'purchases' as ActiveTab, label: '購入履歴', icon: CreditCard },
                { id: 'reviews' as ActiveTab, label: '受信レビュー', icon: Star }
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                    {tab.id === 'reviews' && receivedReviews.length > 0 && (
                      <span className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        {receivedReviews.length}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600">データを読み込み中...</div>
          </div>
        ) : (
          <>
            {/* 概要タブ */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* 統計カード */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">出品中のツール</p>
                        <p className="text-3xl font-bold text-blue-600">{pendingTools.length}</p>
                      </div>
                      <Package className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">総売上</p>
                        <p className="text-3xl font-bold text-green-600">¥{totalRevenue.toLocaleString()}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">購入履歴</p>
                        <p className="text-3xl font-bold text-purple-600">{purchases.length}</p>
                      </div>
                      <CreditCard className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">平均評価</p>
                        <p className="text-3xl font-bold text-yellow-600">
                          {averageRating > 0 ? averageRating.toFixed(1) : '-'}
                        </p>
                      </div>
                      <Star className="h-8 w-8 text-yellow-500" />
                    </div>
                  </div>
                </div>

                {/* クイックアクション */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    クイックアクション
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                      href="/sell"
                      className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
                    >
                      <Package className="h-8 w-8 mx-auto mb-2" />
                      新しいツールを出品
                    </Link>
                    <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                      売上レポート
                    </button>
                    <Link
                      href="/"
                      className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
                    >
                      <Eye className="h-8 w-8 mx-auto mb-2" />
                      ツールを探す
                    </Link>
                  </div>
                </div>

                {/* 最近の活動 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    最近の活動
                  </h2>
                  <div className="space-y-4">
                    {pendingTools.length === 0 && purchases.length === 0 && receivedReviews.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">まだ活動履歴がありません</p>
                    ) : (
                      <>
                        {pendingTools.slice(0, 3).map((tool: Tool) => (
                          <div key={tool.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">「{tool.title}」を出品申請</p>
                              <p className="text-sm text-gray-600">
                                {new Date(tool.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                              審査待ち
                            </span>
                          </div>
                        ))}
                        {purchases.slice(0, 2).map((purchase: Purchase) => (
                          <div key={purchase.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{purchase.items.length}個のツールを購入</p>
                              <p className="text-sm text-gray-600">
                                {new Date(purchase.purchasedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="font-bold text-green-600">
                              ¥{purchase.total.toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {receivedReviews.slice(0, 2).map((review: Review) => (
                          <div key={review.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <Star className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">新しいレビューを受信</p>
                              <p className="text-sm text-gray-600">
                                {review.userName}さんから {review.rating}つ星評価
                              </p>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 出品ツールタブ */}
            {activeTab === 'tools' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">出品したツール</h2>
                  <Link
                    href="/sell"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    新規出品
                  </Link>
                </div>

                {pendingTools.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">まだツールを出品していません</h3>
                    <p className="text-gray-600 mb-6">
                      あなたが開発したAIツールを出品して、収益を得ましょう
                    </p>
                    <Link
                      href="/sell"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      初回出品する
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {pendingTools.map((tool: Tool) => (
                      <div key={tool.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-800">{tool.title}</h3>
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                                審査待ち
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{tool.description}</p>
                            <div className="flex items-center gap-4">
                              <span className="text-2xl font-bold text-blue-600">¥{tool.price.toLocaleString()}</span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                {tool.category}
                              </span>
                              <span className="text-sm text-gray-500">
                                出品日: {new Date(tool.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => deleteTool(tool.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-1">タグ</h4>
                            <div className="flex flex-wrap gap-1">
                              {tool.tags && tool.tags.map((tag: string, index: number) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-1">エンドポイント</h4>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">
                              {tool.endpointUrl}
                            </code>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-2xl font-bold text-blue-600">0</p>
                              <p className="text-sm text-gray-600">販売数</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-green-600">¥0</p>
                              <p className="text-sm text-gray-600">売上</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-yellow-600">-</p>
                              <p className="text-sm text-gray-600">評価</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 購入履歴タブ */}
            {activeTab === 'purchases' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">購入履歴</h2>

                {purchases.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">まだ購入履歴がありません</h3>
                    <p className="text-gray-600 mb-6">
                      便利なAIツールを見つけて購入してみましょう
                    </p>
                    <Link
                      href="/"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      ツールを探す
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase: Purchase) => (
                      <div key={purchase.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">注文 #{purchase.id}</h3>
                            <p className="text-sm text-gray-600">
                              購入日: {new Date(purchase.purchasedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-green-600">
                              ¥{purchase.total.toLocaleString()}
                            </span>
                            <p className="text-sm text-gray-600">{purchase.items.length}個のツール</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {purchase.items.map((item: PurchaseItem) => (
                            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.icon || '🤖'}</span>
                                <div>
                                  <h4 className="font-medium">{item.title}</h4>
                                  <p className="text-sm text-gray-600">{item.category || 'AI ツール'}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-blue-600">¥{item.price.toLocaleString()}</span>
                                <div className="flex gap-2 mt-1">
                                  <Link
                                    href={`/tools/${item.id}`}
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                                  >
                                    利用開始
                                  </Link>
                                  <button className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700">
                                    レビュー
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 受信レビュータブ */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">あなたのツールに対するレビュー</h2>
                
                {receivedReviews.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">まだレビューがありません</h3>
                    <p className="text-gray-600">
                      ツールが購入されてレビューが投稿されると、ここに表示されます
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {receivedReviews.map((review: Review) => {
                      const allTools = [...pendingTools];
                      const approvedTools: Tool[] = JSON.parse(localStorage.getItem('approvedTools') || '[]');
                      const tool = [...allTools, ...approvedTools].find((t: Tool) => 
                        t.id.toString() === review.toolId
                      );
                      return (
                        <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-medium">{review.userName}</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star: number) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= review.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="mb-2">
                                <span className="text-sm text-blue-600 font-medium">
                                  「{tool?.title || '不明なツール'}」への評価
                                </span>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                              <div className="mt-3 flex gap-2">
                                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                                  返信
                                </button>
                                <Link
                                  href={`/tools/${review.toolId}`}
                                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                                >
                                  ツール詳細
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}