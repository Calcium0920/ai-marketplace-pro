'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabase'
import { 
  Star, 
  ShoppingCart, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  Tag, 
  User, 
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  ArrowLeft,
  Zap,
  Shield,
  Globe
} from 'lucide-react'
import Link from 'next/link'

// 型定義
interface ToolDetail {
  id: string
  title: string
  description: string
  longDescription: string
  price: number
  category: string
  icon: string
  rating: number
  reviewCount: number
  tags: string[]
  createdAt: string
  creator: string
  apiEndpoint: string
  features: string[]
  compatibility: string[]
  status?: 'pending' | 'approved' | 'rejected'
}

interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
  toolId: string
  verified: boolean
  helpful: number
}

// カテゴリアイコン取得関数
const getCategoryIcon = (category: string): string => {
  const iconMap: { [key: string]: string } = {
    'データ分析': '📊',
    '画像処理': '🖼️',
    'テキスト処理': '📝',
    '機械学習': '🤖',
    'API連携': '🔗',
    'その他': '⚡'
  }
  return iconMap[category] || '⚡'
}

export default function ToolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const toolId = params?.id as string

  const [tool, setTool] = useState<ToolDetail | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    if (toolId) {
      loadToolDetail()
      loadReviews()
    }
  }, [toolId])

  // 🔥 Supabase対応: ツール詳細読み込み
  const loadToolDetail = async (): Promise<void> => {
    try {
      console.log('=== Supabaseからツール詳細取得 ===')
      console.log('ツールID:', toolId)

      // 🔥 重要: Supabaseからツールデータを取得
      const { data: supabaseTools, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', toolId)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = データが見つからない（正常なケース）
        throw new Error(`Supabase取得エラー: ${error.message}`)
      }

      let foundTool: ToolDetail | null = null

      if (supabaseTools) {
        // Supabaseから取得したデータを変換
        foundTool = {
          id: supabaseTools.id,
          title: supabaseTools.title,
          description: supabaseTools.description,
          longDescription: supabaseTools.description + '\n\n' + 
            (supabaseTools.status === 'approved' 
              ? '管理者により承認された信頼できるツールです。' 
              : '⚠️ このツールは現在審査中です。'),
          price: supabaseTools.price,
          category: supabaseTools.category,
          icon: getCategoryIcon(supabaseTools.category),
          rating: supabaseTools.rating || 5,
          reviewCount: supabaseTools.review_count || 0,
          tags: supabaseTools.tags || [],
          createdAt: supabaseTools.created_at,
          creator: supabaseTools.creator,
          apiEndpoint: supabaseTools.endpoint_url,
          features: [
            'AI機能',
            supabaseTools.status === 'approved' ? '管理者承認済み' : '審査中',
            'サポート対応'
          ],
          compatibility: ['Web', 'API'],
          status: supabaseTools.status
        }
        console.log('✅ Supabaseからツール取得成功:', foundTool)
      } else {
        // フォールバック: デフォルトツールから検索
        console.log('⚠️ Supabaseにデータなし、デフォルトツールを確認...')
        const defaultTools: ToolDetail[] = [
          {
            id: "1",
            title: 'スマート文章校正AI',
            description: '自然言語処理を活用した高精度な文章校正・推敲支援ツール',
            longDescription: `スマート文章校正AIは、最新の自然言語処理技術を活用して、あなたの文章をより良いものに変える革新的なツールです。

            主な機能：
            • 文法・表現の自動校正
            • 文体の統一と推敲提案
            • 読みやすさの分析と改善案
            • 専門用語の適切性チェック
            • SEO対応のキーワード最適化

            このツールは、ライター、ブロガー、学生、ビジネスパーソンなど、文章を書くすべての人に役立ちます。AI が瞬時に分析し、より効果的で読みやすい文章への改善提案を行います。`,
            price: 2980,
            category: 'テキスト処理',
            icon: '📝',
            rating: 4.8,
            reviewCount: 342,
            tags: ['自然言語処理', '文章校正', 'AI', 'ライティング'],
            createdAt: new Date().toISOString(),
            creator: 'AI Solutions Inc.',
            apiEndpoint: 'https://api.example.com/text-correction',
            features: ['高精度AI校正', 'リアルタイム分析', '多言語対応', 'API連携'],
            compatibility: ['Web', 'API', 'Chrome拡張'],
            status: 'approved'
          },
          {
            id: "2",
            title: 'データ分析アシスタント',
            description: 'ビジネスデータを自動分析し、視覚的なレポートを生成するAIツール',
            longDescription: `データ分析アシスタントは、複雑なビジネスデータを誰でも簡単に分析できる革新的なAIツールです。

            主な機能：
            • 自動データクレンジング
            • 統計分析とトレンド予測
            • 美しいグラフ・チャートの自動生成
            • 異常値検出とアラート
            • カスタムダッシュボード作成

            Excel、CSV、SQL データベースなど様々な形式に対応し、AIが自動的にデータの特徴を理解して最適な分析を実行します。専門知識がなくても、プロレベルの分析結果を得ることができます。`,
            price: 4980,
            category: 'データ分析',
            icon: '📊',
            rating: 4.9,
            reviewCount: 156,
            tags: ['データ分析', 'ビジュアライゼーション', 'AI', 'ビジネス'],
            createdAt: new Date().toISOString(),
            creator: 'DataTech Solutions',
            apiEndpoint: 'https://api.example.com/data-analysis',
            features: ['自動分析', 'リアルタイム更新', 'カスタムレポート', 'API連携'],
            compatibility: ['Web', 'Excel', 'API'],
            status: 'approved'
          },
          {
            id: "3",
            title: 'AI画像生成スタジオ',
            description: '高品質なAI画像を簡単なプロンプトから生成する次世代クリエイティブツール',
            longDescription: `AI画像生成スタジオは、テキストプロンプトから高品質な画像を生成する最先端のAIツールです。

            主な機能：
            • テキストから画像生成
            • スタイル転送と画像編集
            • 高解像度出力（4K対応）
            • バッチ処理機能
            • 商用利用可能な画像生成

            デザイナー、マーケター、コンテンツクリエイターの創作活動を革新します。専門的な画像編集スキルがなくても、プロレベルの画像を瞬時に作成できます。`,
            price: 6980,
            category: '画像処理',
            icon: '🖼️',
            rating: 4.7,
            reviewCount: 89,
            tags: ['画像生成', 'AI', 'デザイン', 'クリエイティブ'],
            createdAt: new Date().toISOString(),
            creator: 'Creative AI Lab',
            apiEndpoint: 'https://api.example.com/image-generation',
            features: ['高品質生成', '多様なスタイル', 'バッチ処理', 'API連携'],
            compatibility: ['Web', 'API', 'Photoshop Plugin'],
            status: 'approved'
          },
          {
            id: "4",
            title: 'チャットボット自動構築',
            description: 'ノーコードでAIチャットボットを構築・デプロイできるプラットフォーム',
            longDescription: `チャットボット自動構築は、プログラミング知識なしでAIチャットボットを作成できる革新的なプラットフォームです。

            主な機能：
            • ドラッグ&ドロップでボット作成
            • 自然言語理解エンジン内蔵
            • 多言語対応チャットボット
            • Webサイト・アプリ連携
            • 分析ダッシュボード付き

            カスタマーサポート、営業支援、FAQ対応など、様々な用途に活用できます。AIが自動的に回答を学習し、どんどん賢くなります。`,
            price: 8980,
            category: 'API連携',
            icon: '🔗',
            rating: 4.6,
            reviewCount: 234,
            tags: ['チャットボット', 'ノーコード', 'AI', '自動化'],
            createdAt: new Date().toISOString(),
            creator: 'Bot Builder Co.',
            apiEndpoint: 'https://api.example.com/chatbot',
            features: ['ノーコード構築', '多言語対応', '学習機能', 'API連携'],
            compatibility: ['Web', 'Slack', 'Discord', 'API'],
            status: 'approved'
          },
          {
            id: "5",
            title: '音声認識・合成API',
            description: '高精度な音声認識と自然な音声合成を提供するAI音声処理プラットフォーム',
            longDescription: `音声認識・合成APIは、最先端のAI技術を活用した包括的な音声処理プラットフォームです。

            主な機能：
            • 高精度音声認識（98%以上）
            • 自然な音声合成
            • リアルタイム処理対応
            • 多言語・方言サポート
            • 感情・ニュアンス解析

            アプリ開発、動画制作、アクセシビリティ向上など、様々な用途で活用できます。シンプルなAPIで簡単に導入できます。`,
            price: 3980,
            category: 'API連携',
            icon: '🔗',
            rating: 4.5,
            reviewCount: 67,
            tags: ['音声認識', '音声合成', 'AI', 'API'],
            createdAt: new Date().toISOString(),
            creator: 'Voice AI Technologies',
            apiEndpoint: 'https://api.example.com/voice',
            features: ['高精度認識', '自然な合成', 'リアルタイム', 'API連携'],
            compatibility: ['Web', 'iOS', 'Android', 'API'],
            status: 'approved'
          },
          {
            id: "6",
            title: 'コード自動生成AI',
            description: '自然言語からプログラムコードを自動生成する開発者向けAIアシスタント',
            longDescription: `コード自動生成AIは、開発者の生産性を劇的に向上させる革新的なAIアシスタントです。

            主な機能：
            • 自然言語からコード生成
            • バグ検出と修正提案
            • コードレビューと最適化
            • 多言語プログラミング対応
            • ドキュメント自動生成

            Python、JavaScript、Java、C++など主要な言語に対応。初心者からエキスパートまで、すべての開発者の強力なパートナーです。`,
            price: 5980,
            category: '機械学習',
            icon: '🤖',
            rating: 4.9,
            reviewCount: 445,
            tags: ['コード生成', 'プログラミング', 'AI', '開発'],
            createdAt: new Date().toISOString(),
            creator: 'Dev AI Solutions',
            apiEndpoint: 'https://api.example.com/code-generation',
            features: ['多言語対応', 'バグ検出', '最適化提案', 'API連携'],
            compatibility: ['VS Code', 'IntelliJ', 'Web', 'API'],
            status: 'approved'
          }
        ]

        foundTool = defaultTools.find((t: ToolDetail) => t.id === toolId) || null
      }

      if (foundTool) {
        setTool(foundTool)
        console.log('🎯 ツール詳細設定完了:', foundTool.title)
      } else {
        console.error('❌ ツールが見つかりません:', toolId)
        setTool(null)
      }

    } catch (error) {
      console.error('ツール詳細読み込みエラー:', error)
      setTool(null)
    } finally {
      setLoading(false)
    }
  }

  const loadReviews = (): void => {
    try {
      const allReviews: Review[] = JSON.parse(localStorage.getItem('reviews') || '[]')
      const toolReviews = allReviews.filter((review: Review) => review.toolId === toolId)
      setReviews(toolReviews)
    } catch (error) {
      console.error('レビュー読み込みエラー:', error)
    }
  }

  const handlePurchase = async (): Promise<void> => {
    if (!session || !tool) {
      alert('購入するにはログインが必要です')
      return
    }

    // 既に購入済みかチェック
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]')
    const alreadyPurchased = purchases.some((purchase: any) => 
      purchase.userId === session.user?.email && 
      purchase.items?.some((item: any) => item.id === toolId)
    )

    if (alreadyPurchased) {
      alert('このツールは既に購入済みです')
      return
    }

    if (!confirm(`${tool.title}を¥${tool.price.toLocaleString()}で購入しますか？`)) {
      return
    }

    setPurchasing(true)

    try {
      // 購入処理をシミュレート
      await new Promise(resolve => setTimeout(resolve, 2000))

      const purchase = {
        id: `purchase_${Date.now()}`,
        userId: session.user?.email,
        userName: session.user?.name,
        items: [{
          id: tool.id,
          title: tool.title,
          price: tool.price
        }],
        total: tool.price,
        purchaseDate: new Date().toISOString(),
        status: 'completed'
      }

      const updatedPurchases = [...purchases, purchase]
      localStorage.setItem('purchases', JSON.stringify(updatedPurchases))

      alert(`🎉 購入完了！\n\n${tool.title}をご購入いただき、ありがとうございます。\n\nAPIエンドポイント:\n${tool.apiEndpoint}`)
      
    } catch (error) {
      console.error('購入エラー:', error)
      alert('購入処理でエラーが発生しました。もう一度お試しください。')
    } finally {
      setPurchasing(false)
    }
  }

  const handleReviewSubmit = async (): Promise<void> => {
    if (!session) {
      alert('レビューを投稿するにはログインが必要です')
      return
    }

    if (!newReview.comment.trim()) {
      alert('コメントを入力してください')
      return
    }

    setSubmittingReview(true)

    try {
      const review: Review = {
        id: `review_${Date.now()}`,
        userId: session.user?.email || '',
        userName: session.user?.name || '匿名ユーザー',
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        createdAt: new Date().toISOString(),
        toolId: toolId,
        verified: true, // 簡易実装では常にtrue
        helpful: 0
      }

      const allReviews: Review[] = JSON.parse(localStorage.getItem('reviews') || '[]')
      const updatedReviews = [...allReviews, review]
      localStorage.setItem('reviews', JSON.stringify(updatedReviews))

      setReviews([...reviews, review])
      setNewReview({ rating: 5, comment: '' })
      alert('レビューを投稿しました！')

    } catch (error) {
      console.error('レビュー投稿エラー:', error)
      alert('レビューの投稿に失敗しました')
    } finally {
      setSubmittingReview(false)
    }
  }

  const markReviewHelpful = (reviewId: string): void => {
    try {
      const allReviews: Review[] = JSON.parse(localStorage.getItem('reviews') || '[]')
      const updatedReviews = allReviews.map((review: Review) => 
        review.id === reviewId 
          ? { ...review, helpful: (review.helpful || 0) + 1 }
          : review
      )
      localStorage.setItem('reviews', JSON.stringify(updatedReviews))
      loadReviews()
    } catch (error) {
      console.error('役立ち度更新エラー:', error)
    }
  }

  // 購入済みかチェック
  const isPurchased = (): boolean => {
    if (!session) return false
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]')
    return purchases.some((purchase: any) => 
      purchase.userId === session.user?.email && 
      purchase.items?.some((item: any) => item.id === toolId)
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">ツール詳細を読み込み中...</div>
        </div>
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ツールが見つかりません</h1>
          <p className="text-gray-600 mb-6">
            指定されたツールは存在しないか、削除された可能性があります。
          </p>
          <Link 
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ホームに戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              AI Marketplace
            </Link>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <span className="text-sm text-gray-600">👋 {session.user?.name}</span>
                  <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
                    ダッシュボード
                  </Link>
                </>
              ) : (
                <Link href="/api/auth/signin" className="text-blue-600 hover:text-blue-700">
                  ログイン
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* パンくずリスト */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/" className="text-gray-400 hover:text-gray-500">
                ホーム
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <Link href="/" className="text-gray-400 hover:text-gray-500">
                ツール一覧
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">{tool.title}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-8">
            {/* ツール基本情報 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <span className="text-4xl mr-4">{tool.icon}</span>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{tool.title}</h1>
                    <p className="text-gray-600 text-lg">{tool.description}</p>
                  </div>
                </div>
                {tool.status === 'approved' && (
                  <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    承認済み
                  </div>
                )}
                {tool.status === 'pending' && (
                  <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    審査中
                  </div>
                )}
              </div>

              {/* 評価とカテゴリ */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= tool.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {tool.rating.toFixed(1)} ({tool.reviewCount}レビュー)
                  </span>
                </div>
                <div className="flex items-center">
                  <Tag className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-gray-600">{tool.category}</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-gray-600">{tool.creator}</span>
                </div>
              </div>

              {/* タグ */}
              <div className="flex flex-wrap gap-2 mb-6">
                {tool.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              {/* 詳細説明 */}
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">詳細説明</h3>
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {tool.longDescription}
                </div>
              </div>
            </div>

            {/* 機能・特徴 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                主な機能・特徴
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tool.features.map((feature, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 対応環境 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-500" />
                対応環境
              </h3>
              <div className="flex flex-wrap gap-3">
                {tool.compatibility.map((platform, index) => (
                  <div key={index} className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                    <Shield className="w-4 h-4 mr-2" />
                    {platform}
                  </div>
                ))}
              </div>
            </div>

            {/* レビューセクション */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-purple-500" />
                レビュー ({reviews.length})
              </h3>

              {/* レビュー投稿フォーム */}
              {session && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-4">レビューを投稿</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        評価
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 ${
                               star <= newReview.rating 
                                 ? 'text-yellow-400 fill-current' 
                                 : 'text-gray-300'
                             } hover:text-yellow-400 transition-colors`}
                           />
                         </button>
                       ))}
                       <span className="ml-2 text-sm text-gray-600">
                         {newReview.rating}つ星
                       </span>
                     </div>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       コメント
                     </label>
                     <textarea
                       value={newReview.comment}
                       onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                       rows={4}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="このツールについての感想やご意見をお聞かせください..."
                     />
                   </div>
                   <button
                     onClick={handleReviewSubmit}
                     disabled={submittingReview}
                     className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                   >
                     {submittingReview ? (
                       <>
                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                         投稿中...
                       </>
                     ) : (
                       '投稿する'
                     )}
                   </button>
                 </div>
               </div>
             )}

             {/* レビュー一覧 */}
             <div className="space-y-6">
               {reviews.length === 0 ? (
                 <div className="text-center py-8 text-gray-500">
                   <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                   <p>まだレビューがありません</p>
                   <p className="text-sm">最初のレビューを投稿してみませんか？</p>
                 </div>
               ) : (
                 reviews.map((review) => (
                   <div key={review.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                     <div className="flex items-start justify-between mb-3">
                       <div className="flex items-center">
                         <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                           <User className="w-5 h-5 text-blue-600" />
                         </div>
                         <div>
                           <div className="flex items-center gap-2">
                             <span className="font-medium">{review.userName}</span>
                             {review.verified && (
                               <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                 購入済み
                               </span>
                             )}
                           </div>
                           <div className="flex items-center mt-1">
                             <div className="flex mr-2">
                               {[1, 2, 3, 4, 5].map((star) => (
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
                         </div>
                       </div>
                     </div>
                     <p className="text-gray-700 mb-3 ml-13">{review.comment}</p>
                     <div className="flex items-center ml-13">
                       <button
                         onClick={() => markReviewHelpful(review.id)}
                         className="flex items-center text-gray-500 hover:text-blue-600 transition-colors text-sm"
                       >
                         <ThumbsUp className="w-4 h-4 mr-1" />
                         参考になった ({review.helpful || 0})
                       </button>
                     </div>
                   </div>
                 ))
               )}
             </div>
           </div>
         </div>

         {/* サイドバー */}
         <div className="space-y-6">
           {/* 購入パネル */}
           <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
             <div className="text-center mb-6">
               <div className="text-3xl font-bold text-blue-600 mb-2">
                 ¥{tool.price.toLocaleString()}
               </div>
               <div className="text-sm text-gray-500">税込価格</div>
             </div>

             {isPurchased() ? (
               <div className="space-y-4">
                 <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                   <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                   <p className="text-green-800 font-medium">購入済み</p>
                   <p className="text-green-600 text-sm">ご利用ありがとうございます</p>
                 </div>
                 
                 <div className="bg-gray-50 rounded-lg p-4">
                   <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                     <ExternalLink className="w-4 h-4 mr-2" />
                     APIエンドポイント
                   </h4>
                   <code className="text-sm bg-white p-2 rounded border block break-all">
                     {tool.apiEndpoint}
                   </code>
                   <p className="text-xs text-gray-500 mt-2">
                     このURLを使用してAPIにアクセスできます
                   </p>
                 </div>
                 
                 <Link
                   href="/dashboard"
                   className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                 >
                   <User className="w-4 h-4 mr-2" />
                   ダッシュボードで管理
                 </Link>
               </div>
             ) : (
               <div className="space-y-4">
                 <button
                   onClick={handlePurchase}
                   disabled={purchasing}
                   className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                 >
                   {purchasing ? (
                     <>
                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                       購入処理中...
                     </>
                   ) : (
                     <>
                       <ShoppingCart className="w-4 h-4 mr-2" />
                       今すぐ購入
                     </>
                   )}
                 </button>
                 
                 {!session && (
                   <p className="text-sm text-gray-500 text-center">
                     購入するには
                     <Link href="/api/auth/signin" className="text-blue-600 hover:text-blue-700">
                       ログイン
                     </Link>
                     が必要です
                   </p>
                 )}
               </div>
             )}

             {/* ツール情報 */}
             <div className="mt-6 pt-6 border-t border-gray-200">
               <h4 className="font-medium text-gray-900 mb-4">ツール情報</h4>
               <div className="space-y-3 text-sm">
                 <div className="flex justify-between">
                   <span className="text-gray-500">カテゴリ</span>
                   <span className="text-gray-900">{tool.category}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-500">作成者</span>
                   <span className="text-gray-900">{tool.creator}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-500">公開日</span>
                   <span className="text-gray-900">
                     {new Date(tool.createdAt).toLocaleDateString()}
                   </span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-500">評価</span>
                   <span className="text-gray-900">
                     ⭐ {tool.rating.toFixed(1)} ({tool.reviewCount})
                   </span>
                 </div>
               </div>
             </div>

             {/* 注意事項 */}
             <div className="mt-6 pt-6 border-t border-gray-200">
               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                 <div className="flex items-start">
                   <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                   <div className="text-sm">
                     <p className="font-medium text-yellow-800 mb-1">ご注意</p>
                     <ul className="text-yellow-700 space-y-1">
                       <li>• 購入後の返金は承っておりません</li>
                       <li>• APIの利用には別途従量課金が発生する場合があります</li>
                       <li>• サポートは購入者のみ対象です</li>
                     </ul>
                   </div>
                 </div>
               </div>
             </div>
           </div>

           {/* 関連ツール */}
           <div className="bg-white rounded-lg shadow-md p-6">
             <h4 className="font-medium text-gray-900 mb-4">同じカテゴリのツール</h4>
             <div className="space-y-3">
               <div className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                 <h5 className="font-medium text-sm mb-1">AI画像生成スタジオ</h5>
                 <p className="text-gray-600 text-xs mb-2">高品質なAI画像を生成</p>
                 <div className="flex justify-between items-center">
                   <span className="text-blue-600 font-medium">¥6,980</span>
                   <div className="flex items-center text-xs text-gray-500">
                     <Star className="w-3 h-3 fill-current text-yellow-400 mr-1" />
                     4.7
                   </div>
                 </div>
               </div>
               
               <div className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                 <h5 className="font-medium text-sm mb-1">チャットボット自動構築</h5>
                 <p className="text-gray-600 text-xs mb-2">ノーコードでボット作成</p>
                 <div className="flex justify-between items-center">
                   <span className="text-blue-600 font-medium">¥8,980</span>
                   <div className="flex items-center text-xs text-gray-500">
                     <Star className="w-3 h-3 fill-current text-yellow-400 mr-1" />
                     4.6
                   </div>
                 </div>
               </div>
               
               <Link
                 href="/"
                 className="block text-center text-blue-600 hover:text-blue-700 text-sm pt-2"
               >
                 他のツールを見る →
               </Link>
             </div>
           </div>
         </div>
       </div>
     </main>
   </div>
 )
}