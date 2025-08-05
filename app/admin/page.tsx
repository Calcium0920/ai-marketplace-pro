'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, XCircle, Clock, Eye, Trash2, Star, User, AlertTriangle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

// 型定義を統一（Supabase対応）
interface Tool {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  creator: string;
  created_at: string; // Supabaseカラム名
  endpoint_url: string; // Supabaseカラム名
  tags: string[];
  status?: 'pending' | 'approved' | 'rejected';
  submitted_by?: string;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
}

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

// 🔧 修正: データ整合性チェック結果の型定義
interface IntegrityStatus {
  isHealthy: boolean;
  duplicateIds: string[]; // never[] ではなく string[] に修正
  invalidPurchases: number;
  totalTools: number;
}

type ActiveTab = 'pending' | 'approved' | 'reviews' | 'analytics';

export default function AdminPage() {
  const { data: session } = useSession()
  const [pendingTools, setPendingTools] = useState<Tool[]>([])
  const [approvedTools, setApprovedTools] = useState<Tool[]>([])
  const [allReviews, setAllReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<ActiveTab>('pending')
  const [processingToolId, setProcessingToolId] = useState<string | null>(null)
  // 🔧 修正: 正しい型でintegrityStatusを初期化
  const [integrityStatus, setIntegrityStatus] = useState<IntegrityStatus>({
    isHealthy: true,
    duplicateIds: [],
    invalidPurchases: 0,
    totalTools: 0
  })

  useEffect(() => {
    loadTools()
    loadAllReviews()
  }, [])

  // 🔧 修正: データ整合性チェック（戻り値の型を明確化）
  const checkDataIntegrity = async (): Promise<IntegrityStatus> => {
    try {
      const { data: allTools, error } = await supabase
        .from('tools')
        .select('id, status')
      
      if (error) {
        console.warn('整合性チェックエラー:', error)
        return { isHealthy: false, duplicateIds: [], invalidPurchases: 0, totalTools: 0 }
      }

      const allToolIds: string[] = allTools?.map((t: any) => t.id) || []
      const duplicateIds: string[] = allToolIds.filter((id: string, index: number) => allToolIds.indexOf(id) !== index)
      
      // 購入履歴の無効IDチェック（localStorage）
      const purchases = JSON.parse(localStorage.getItem('purchases') || '[]')
      let invalidPurchaseCount = 0
      purchases.forEach((purchase: any) => {
        if (purchase.items) {
          purchase.items.forEach((item: any) => {
            if (!allToolIds.includes(item.id?.toString())) {
              invalidPurchaseCount++
            }
          })
        }
      })
      
      return {
        totalTools: allToolIds.length,
        duplicateIds: duplicateIds,
        invalidPurchases: invalidPurchaseCount,
        isHealthy: duplicateIds.length === 0 && invalidPurchaseCount === 0
      }
    } catch (error) {
      console.error('整合性チェックエラー:', error)
      return { isHealthy: false, duplicateIds: [], invalidPurchases: 0, totalTools: 0 }
    }
  }

  // 🔥 Supabase対応: ツール読み込み
  const loadTools = async (): Promise<void> => {
    try {
      // 🔥 重要: Supabaseからデータを取得
      const { data: allTools, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`ツール取得エラー: ${error.message}`)
      }

      // ステータス別に分類
      const pending = allTools?.filter((tool: Tool) => tool.status === 'pending') || []
      const approved = allTools?.filter((tool: Tool) => tool.status === 'approved') || []

      setPendingTools(pending)
      setApprovedTools(approved)

      console.log('=== Supabaseからデータ読み込み完了 ===')
      console.log('承認待ち:', pending.length, '件')
      console.log('承認済み:', approved.length, '件')

    } catch (error) {
      console.error('ツール読み込みエラー:', error)
      // フォールバック: localStorageから読み込み
      const pending = JSON.parse(localStorage.getItem('pendingTools') || '[]')
      const approved = JSON.parse(localStorage.getItem('approvedTools') || '[]')
      setPendingTools(pending)
      setApprovedTools(approved)
    } finally {
      setLoading(false)
    }
  }

  const loadAllReviews = (): void => {
    try {
      // レビューは引き続きlocalStorageから取得（将来的にSupabase対応予定）
      const reviews: Review[] = JSON.parse(localStorage.getItem('reviews') || '[]')
      setAllReviews(reviews)
    } catch (error) {
      console.error('レビュー読み込みエラー:', error)
    }
  }

  // 🔥 Supabase対応: 承認処理
  const approveTool = async (toolId: string): Promise<void> => {
    if (processingToolId) return
    setProcessingToolId(toolId)

    try {
      console.log('=== Supabaseで承認処理 ===')
      console.log('対象ツールID:', toolId)

      // 🔥 重要: Supabaseでステータス更新
      const { data, error } = await supabase
        .from('tools')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', toolId)
        .select()

      if (error) {
        throw new Error(`承認エラー: ${error.message}`)
      }

      if (!data || data.length === 0) {
        throw new Error(`ツール（ID: ${toolId}）が見つかりません`)
      }

      console.log('✅ Supabase承認完了:', data[0])

      // UIを更新
      await loadTools()
      // 整合性チェックも更新
      const newIntegrityStatus = await checkDataIntegrity()
      setIntegrityStatus(newIntegrityStatus)

      const approvedTool = data[0]
      alert(`✅ ツール承認完了

- タイトル: ${approvedTool.title}
- ID: ${toolId}

🚀 ユーザーがアクセス可能になりました`)

    } catch (error) {
      console.error('承認エラー:', error)
      alert(`承認に失敗しました\n\nエラー: ${error instanceof Error ? error.message : '不明なエラー'}`)
    } finally {
      setProcessingToolId(null)
    }
  }

  // 🔥 Supabase対応: 却下処理
  const rejectTool = async (toolId: string): Promise<void> => {
    const reason = prompt('却下理由を入力してください:')
    
    if (!reason?.trim()) {
      alert('却下理由は必須です')
      return
    }

    if (!confirm(`このツールを却下しますか？\n\nID: ${toolId}\n理由: ${reason}`)) {
      return
    }

    if (processingToolId) return
    setProcessingToolId(toolId)

    try {
      // 🔥 重要: Supabaseでステータス更新
      const { data, error } = await supabase
        .from('tools')
        .update({ 
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejection_reason: reason.trim()
        })
        .eq('id', toolId)
        .select()

      if (error) {
        throw new Error(`却下エラー: ${error.message}`)
      }

      console.log('✅ Supabase却下完了:', data[0])

      // UIを更新
      await loadTools()
      // 整合性チェックも更新
      const newIntegrityStatus = await checkDataIntegrity()
      setIntegrityStatus(newIntegrityStatus)

      alert(`ツールを却下しました\n\n却下理由: ${reason}`)

    } catch (error) {
      console.error('却下エラー:', error)
      alert(`却下に失敗しました\n\nエラー: ${error instanceof Error ? error.message : '不明なエラー'}`)
    } finally {
      setProcessingToolId(null)
    }
  }

  // 🔧 修正: データ修復機能（Supabase + localStorage対応）
  const repairData = async (): Promise<void> => {
    if (!confirm('データの自動修復を実行しますか？\n\n⚠️ この操作は元に戻せません')) {
      return
    }

    try {
      // Supabaseからツールデータを取得
      const { data: allTools, error } = await supabase
        .from('tools')
        .select('id')

      if (error) {
        throw new Error(`Supabaseデータ取得エラー: ${error.message}`)
      }

      const validToolIds: string[] = allTools?.map((t: any) => t.id) || []
      
      // localStorageの購入履歴を修復
      const purchases = JSON.parse(localStorage.getItem('purchases') || '[]')
      const repairedPurchases = purchases.map((purchase: any) => {
        if (!purchase.items) return purchase
        
        const validItems = purchase.items.filter((item: any) => 
          validToolIds.includes(item.id?.toString())
        )
        
        return { ...purchase, items: validItems }
      }).filter((purchase: any) => purchase.items && purchase.items.length > 0)

      // 修復されたデータを保存
      localStorage.setItem('purchases', JSON.stringify(repairedPurchases))

      // 整合性チェックを更新
      const newIntegrityStatus = await checkDataIntegrity()
      setIntegrityStatus(newIntegrityStatus)

      const report = `データ修復完了！

📊 修復結果:
- 有効ツール: ${validToolIds.length}件
- 購入履歴: ${purchases.length} → ${repairedPurchases.length}件

✅ 無効な購入履歴を除去しました`

      alert(report)
      
    } catch (error) {
      console.error('データ修復エラー:', error)
      alert('データ修復に失敗しました')
    }
  }

  const deleteReview = (reviewId: string): void => {
    if (confirm('このレビューを削除しますか？')) {
      try {
        const reviews: Review[] = JSON.parse(localStorage.getItem('reviews') || '[]')
        const updatedReviews = reviews.filter((review: Review) => review.id !== reviewId)
        localStorage.setItem('reviews', JSON.stringify(updatedReviews))
        loadAllReviews()
        alert('レビューを削除しました')
      } catch (error) {
        console.error('レビュー削除エラー:', error)
        alert('削除に失敗しました')
      }
    }
  }

  // 管理者チェック
  const isAdmin = session?.user?.name === 'admin' || session?.user?.name === '管理者'

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">🔒 管理者専用ページ</h1>
          <p className="text-gray-600 mb-6">
            このページは管理者のみアクセス可能です。
          </p>
          <Link 
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    )
  }

  // 🔧 修正: useEffectで整合性チェックを実行
  useEffect(() => {
    if (pendingTools.length > 0 || approvedTools.length > 0) {
      checkDataIntegrity().then(setIntegrityStatus)
    }
  }, [pendingTools, approvedTools])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-red-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-red-200 transition-colors">
            🛡️ 管理画面
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm">管理者: {session.user?.name}</span>
            <Link href="/" className="bg-red-500 px-4 py-2 rounded hover:bg-red-400 transition-colors">
              ホームに戻る
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🛡️ 管理画面</h1>
          <p className="text-gray-600">ツールの承認・管理とレビューの管理 (Supabase連携)</p>
        </div>

        {/* データ整合性ステータス */}
        {!integrityStatus.isHealthy && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">データ整合性の問題を検出</span>
              </div>
              <button
                onClick={repairData}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                自動修復
              </button>
            </div>
            {integrityStatus.duplicateIds.length > 0 && (
              <p className="text-sm text-yellow-700 mt-2">
                重複ID: {integrityStatus.duplicateIds.join(', ')}
              </p>
            )}
            {integrityStatus.invalidPurchases > 0 && (
              <p className="text-sm text-yellow-700 mt-1">
                無効な購入履歴: {integrityStatus.invalidPurchases}件
              </p>
            )}
          </div>
        )}

        {/* Supabase接続状態表示 */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Supabase連携中</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            データベースからリアルタイムでツール情報を取得しています
          </p>
        </div>

        {/* タブナビゲーション */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Clock className="inline w-4 h-4 mr-2" />
                承認待ち ({pendingTools.length})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'approved'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CheckCircle className="inline w-4 h-4 mr-2" />
                承認済み ({approvedTools.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Star className="inline w-4 h-4 mr-2" />
                レビュー管理 ({allReviews.length})
              </button>
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <div className="text-gray-600">Supabaseからデータを読み込み中...</div>
          </div>
        ) : (
          <>
            {/* 承認待ちタブ */}
            {activeTab === 'pending' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">承認待ちツール</h2>
                {pendingTools.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">承認待ちのツールはありません</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingTools.map((tool: Tool) => (
                      <div key={tool.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-gray-800">{tool.title}</h3>
                              {processingToolId === tool.id && (
                                <div className="flex items-center gap-1 text-blue-600">
                                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-sm">処理中...</span>
                                </div>
                              )}
                            </div>
                            <p className="text-gray-600 mt-2">{tool.description}</p>
                            <div className="flex items-center gap-4 mt-4">
                              <span className="text-lg font-bold text-blue-600">¥{tool.price.toLocaleString()}</span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{tool.category}</span>
                              <span className="text-sm text-gray-500">出品者: {tool.creator}</span>
                              <span className="text-sm text-gray-500">
                                申請日: {new Date(tool.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="mt-3">
                              <div className="flex flex-wrap gap-2">
                                {tool.tags && tool.tags.map((tag: string, index: number) => (
                                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="mt-3">
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">
                                {tool.endpoint_url}
                              </code>
                            </div>
                            <div className="mt-3 text-xs text-gray-500 space-y-1">
                              <div>ツールID: {tool.id}</div>
                              {tool.submitted_by && <div>申請者: {tool.submitted_by}</div>}
                              <div className="text-green-600">📡 Supabaseから取得</div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button 
                              onClick={() => approveTool(tool.id)}
                              disabled={processingToolId !== null}
                              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <CheckCircle className="w-4 h-4" />
                              承認
                            </button>
                            <button 
                              onClick={() => rejectTool(tool.id)}
                              disabled={processingToolId !== null}
                              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <XCircle className="w-4 h-4" />
                              却下
                            </button>
                            <Link
                              href={`/tools/${tool.id}`}
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              詳細
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 承認済みタブ */}
            {activeTab === 'approved' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">承認済みツール</h2>
                {approvedTools.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">承認済みのツールはありません</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approvedTools.map((tool: Tool) => (
                      <div key={tool.id} className="bg-white border border-green-200 rounded-lg p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-gray-800">{tool.title}</h3>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">承認済み</span>
                            </div>
                            <p className="text-gray-600 mt-2">{tool.description}</p>
                            <div className="flex items-center gap-4 mt-4">
                              <span className="text-lg font-bold text-blue-600">¥{tool.price.toLocaleString()}</span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{tool.category}</span>
                              <span className="text-sm text-gray-500">出品者: {tool.creator}</span>
                              <span className="text-sm text-gray-500">
                                承認日: {tool.approved_at ? new Date(tool.approved_at).toLocaleDateString() : new Date(tool.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="mt-3 text-xs text-gray-500 space-y-1">
                              <div>ツールID: {tool.id}</div>
                              {tool.submitted_by && <div>申請者: {tool.submitted_by}</div>}
                              <div>ステータス: {tool.status || '承認済み'}</div>
                              <div className="text-green-600">📡 Supabaseから取得</div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Link
                              href={`/tools/${tool.id}`}
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              詳細
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* レビュー管理タブ */}
            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">レビュー管理</h2>
                {allReviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">レビューはまだありません</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allReviews.map((review: Review) => {
                      // パラメーター t に Tool 型を明示的に指定
                      const tool = [...pendingTools, ...approvedTools].find((t: Tool) => 
                        t.id.toString() === review.toolId
                      );
                      return (
                        <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <span className="font-semibold">{review.userName}</span>
                                  <div className="flex items-center gap-2">
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
                                </div>
                              </div>
                              <div className="mb-2">
                                <span className="text-blue-600 font-medium">
                                  ツール: {tool?.title || '不明'}
                                </span>
                                {review.verified && (
                                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                    購入済み
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-700 mb-2">{review.comment}</p>
                              <div className="text-sm text-gray-500">
                                参考になった: {review.helpful || 0}回
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Link
                                href={`/tools/${review.toolId}`}
                               className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
                             >
                               ツール詳細
                             </Link>
                             <button 
                               onClick={() => deleteReview(review.id)}
                               className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-300 rounded hover:bg-red-50 transition-colors flex items-center gap-1"
                             >
                               <Trash2 className="w-3 h-3" />
                               削除
                             </button>
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