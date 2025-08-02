'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

// Supabaseクライアントの初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default function SellPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    tags: '',
    endpointUrl: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = [
    { value: '文章作成', label: '文章作成', icon: '🧠' },
    { value: 'データ分析', label: 'データ分析', icon: '📊' },
    { value: 'デザイン', label: 'デザイン', icon: '🎨' },
    { value: 'チャットボット', label: 'チャットボット', icon: '💬' },
    { value: '教育', label: '教育', icon: '📚' },
    { value: 'SEO', label: 'SEO', icon: '🔍' },
  ]

  // 🔥 新機能: フォームバリデーション
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'ツール名は必須です'
    } else if (formData.title.length > 100) {
      newErrors.title = 'ツール名は100文字以内で入力してください'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'ツールの説明は必須です'
    } else if (formData.description.length > 500) {
      newErrors.description = 'ツールの説明は500文字以内で入力してください'
    }

    if (!formData.price) {
      newErrors.price = '価格は必須です'
    } else {
      const price = parseInt(formData.price)
      if (isNaN(price) || price < 100 || price > 100000) {
        newErrors.price = '価格は100円〜100,000円の範囲で設定してください'
      }
    }

    if (!formData.category) {
      newErrors.category = 'カテゴリは必須です'
    }

    if (!formData.endpointUrl.trim()) {
      newErrors.endpointUrl = 'APIエンドポイントURLは必須です'
    } else {
      try {
        const url = new URL(formData.endpointUrl)
        if (url.protocol !== 'https:') {
          newErrors.endpointUrl = 'HTTPSのURLを入力してください'
        }
      } catch {
        newErrors.endpointUrl = '有効なURLを入力してください'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 🔥 新機能: より安全で一意なID生成
  const generateUniqueToolId = (): string => {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const userPrefix = session?.user?.name?.substring(0, 3).toLowerCase().replace(/[^a-z]/g, '') || 'usr'
    return `tool_${userPrefix}_${timestamp}_${randomString}`
  }

  // 🔥 新機能: Supabase接続テスト
  const testSupabaseConnection = async (): Promise<boolean> => {
    try {
      console.log('🔍 Supabase接続テスト開始...')
      console.log('Supabase URL:', supabaseUrl)
      console.log('Supabase Key exists:', !!supabaseKey)

      const { data, error } = await supabase
        .from('tools')
        .select('count')
        .limit(1)

      if (error) {
        console.error('❌ Supabase接続テストエラー:', error)
        return false
      }

      console.log('✅ Supabase接続テスト成功')
      return true
    } catch (error) {
      console.error('❌ Supabase接続テスト例外:', error)
      return false
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">🔒 ログインが必要です</h1>
          <p className="text-gray-600 mb-6">
            AIツールを出品するには、まずログインしてください。
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

  // 🔥 修正: 詳細デバッグ機能付きの出品処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('=== 出品処理開始 ===')
    console.log('フォームデータ:', formData)
    console.log('セッション情報:', {
      user: session?.user?.name,
      email: session?.user?.email
    })

    if (!validateForm()) {
      alert('入力内容に問題があります。エラーメッセージを確認してください。')
      return
    }

    setSubmitting(true)
    
    try {
      // 🔍 Supabase接続テスト
      const isConnected = await testSupabaseConnection()
      if (!isConnected) {
        throw new Error('Supabaseに接続できません。設定を確認してください。')
      }

      let toolId = generateUniqueToolId()
      console.log('生成されたツールID:', toolId)
      
      const newTool = {
        id: toolId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseInt(formData.price),
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        endpoint_url: formData.endpointUrl.trim(),
        creator: session?.user?.name || 'Unknown User',
        status: 'pending',
        created_at: new Date().toISOString(),
        submitted_by: session?.user?.email || 'unknown@example.com',
      }
      
      console.log('=== Supabaseに出品データ保存 ===')
      console.log('保存するツールデータ:', newTool)
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('データサイズ:', JSON.stringify(newTool).length, 'bytes')
      
      // 🔥 重要: 詳細エラー確認のためのSupabase保存
      const { data, error } = await supabase
        .from('tools')
        .insert([newTool])
        .select()
      
      // 🔍 詳細デバッグ情報
      console.log('Supabaseレスポンス:', { data, error })
      
      if (error) {
        // 🔍 詳細エラー情報をログ出力
        console.error('🔴 Supabaseエラー詳細:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          originalError: error
        })
        
        // 🔍 テーブル構造チェック
        console.log('📋 テーブル構造確認を実行中...')
        try {
          const { data: tableInfo, error: tableError } = await supabase
            .from('tools')
            .select('*')
            .limit(1)
          
          if (tableError) {
            console.error('テーブル確認エラー:', tableError)
          } else {
            console.log('テーブル確認成功。最初の1件:', tableInfo)
          }
        } catch (tableCheckError) {
          console.error('テーブル確認中の例外:', tableCheckError)
        }
        
        // ユーザーにも詳細エラーを表示
        const errorMessage = `Supabase保存エラー詳細:
        
📝 メッセージ: ${error.message}
🔍 詳細: ${error.details || 'なし'}
💡 ヒント: ${error.hint || 'なし'}
🔢 コード: ${error.code || 'なし'}

🛠️ 対処方法:
${error.code === 'PGRST106' ? '- テーブルが存在しません。管理者に連絡してください。' : ''}
${error.message.includes('violates') ? '- データの制約違反です。入力内容を確認してください。' : ''}
${error.message.includes('permission') ? '- データベースの権限がありません。管理者に連絡してください。' : ''}
${!error.code ? '- ネットワーク接続を確認してください。' : ''}`

        alert(errorMessage)
        
        // 🔄 フォールバック: LocalStorageに保存
        console.log('🔄 フォールバック: LocalStorageに保存します')
        try {
          const existingPendingTools = JSON.parse(localStorage.getItem('pendingTools') || '[]')
          existingPendingTools.push(newTool)
          localStorage.setItem('pendingTools', JSON.stringify(existingPendingTools))
          
          alert(`⚠️ Supabaseへの保存に失敗しましたが、LocalStorageに保存しました。
          
管理者に以下の情報をお伝えください:
• ツールID: ${toolId}
• エラーコード: ${error.code}
• 保存場所: LocalStorage (一時的)`)
          
        } catch (localStorageError) {
          console.error('LocalStorage保存もエラー:', localStorageError)
        }
        
        throw new Error(`Supabase保存エラー: ${error.message}`)
      }
      
      if (!data || data.length === 0) {
        throw new Error('データは保存されましたが、レスポンスが空です')
      }
      
      console.log('✅ Supabase保存成功:', data[0])
      console.log('保存されたレコードID:', data[0].id)
      
      // 🔍 保存確認テスト
      console.log('🔍 保存確認テスト実行中...')
      const { data: savedData, error: verifyError } = await supabase
        .from('tools')
        .select('*')
        .eq('id', toolId)
        .single()
      
      if (verifyError) {
        console.warn('保存確認エラー:', verifyError)
      } else {
        console.log('✅ 保存確認成功:', savedData)
      }
      
      // 成功処理
      const successMessage = `✅ 出品申請が完了しました！

📋 ツール情報:
• タイトル: ${newTool.title}
• ID: ${toolId}
• カテゴリ: ${newTool.category}
• 価格: ¥${newTool.price.toLocaleString()}

💾 Supabaseデータベースに保存されました
⏳ 管理者の審査後に公開されます
🔗 詳細ページ: /tools/${toolId}`

      alert(successMessage)
      
      // フォームリセット
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        tags: '',
        endpointUrl: '',
      })
      setErrors({})
      
      // 🔥 開発環境では詳細ページプレビュー
      if (process.env.NODE_ENV === 'development') {
        const previewOption = confirm(
          `🚀 開発モード: 出品したツールの詳細ページをプレビューしますか？\n\nツールID: ${toolId}\n\n※ 承認前でもプレビューできます`
        )
        
        if (previewOption) {
          console.log(`🔗 詳細ページに移動: /tools/${toolId}`)
          router.push(`/tools/${toolId}`)
          return
        }
      }
      
      router.push('/dashboard')
      
    } catch (error) {
      console.error('❌ 出品処理エラー:', error)
      
      // エラーの種類に応じた詳細メッセージ
      let userMessage = '出品申請に失敗しました。'
      
      if (error instanceof Error) {
        if (error.message.includes('Supabase')) {
          userMessage += '\n\n🔴 データベース接続エラー\n管理者に連絡してください。'
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          userMessage += '\n\n🌐 ネットワークエラー\nインターネット接続を確認してください。'
        } else {
          userMessage += `\n\n詳細: ${error.message}`
        }
      }
      
      userMessage += `\n\n🆘 サポートが必要な場合は、以下の情報をお伝えください:
• 時刻: ${new Date().toLocaleString()}
• ユーザー: ${session?.user?.email}
• エラー: ${error instanceof Error ? error.message : '不明なエラー'}`
      
      alert(userMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-blue-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">🤖 AI Marketplace</Link>
          <div className="flex items-center gap-4">
            <span>こんにちは、{session.user?.name}さん</span>
            <Link href="/" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400">
              ホームに戻る
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🚀 AIツールを出品</h1>
            <p className="text-gray-600">
              あなたが開発したAIツールを販売して、収益を得ましょう
            </p>
          </div>

          {/* 🔥 開発環境でのデバッグ情報 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-blue-800 mb-2">🔧 デバッグ情報</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• 出品者: {session.user?.name} ({session.user?.email})</div>
                <div>• Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 設定済み' : '❌ 未設定'}</div>
                <div>• Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 設定済み' : '❌ 未設定'}</div>
                <div>• 環境: {process.env.NODE_ENV}</div>
              </div>
              <button
                type="button"
                onClick={testSupabaseConnection}
                className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                🔍 Supabase接続テスト
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ツール名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ツール名 *
              </label>
              <input
                type="text"
                required
                maxLength={100}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="例：スマート文章校正AI"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              <p className="text-xs text-gray-500 mt-1">
                最大100文字 (現在: {formData.title.length}/100)
              </p>
            </div>

            {/* 説明 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ツールの説明 *
              </label>
              <textarea
                required
                rows={4}
                maxLength={500}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="ツールの機能、特徴、使用方法などを詳しく説明してください"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              <p className="text-xs text-gray-500 mt-1">
                最大500文字 (現在: {formData.description.length}/500)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 価格 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  価格（円）*
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  max="100000"
                  step="10"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="2980"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  100円〜100,000円の範囲で設定（10円単位）
                </p>
              </div>

              {/* カテゴリ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カテゴリ *
                </label>
                <select
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">カテゴリを選択</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
            </div>

            {/* タグ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タグ（カンマ区切り）
              </label>
              <input
                type="text"
                maxLength={200}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="文章作成, 校正, ビジネス, 自動化"
              />
              <p className="text-xs text-gray-500 mt-1">
                検索しやすくするためのキーワードを入力（最大200文字）
              </p>
            </div>

            {/* エンドポイントURL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API エンドポイント URL *
              </label>
              <input
                type="url"
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endpointUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.endpointUrl}
                onChange={(e) => setFormData({...formData, endpointUrl: e.target.value})}
                placeholder="https://your-api.com/endpoint"
              />
              {errors.endpointUrl && <p className="text-red-500 text-sm mt-1">{errors.endpointUrl}</p>}
              <p className="text-xs text-gray-500 mt-1">
                購入者がアクセスできるAPIのURL（HTTPS必須）
              </p>
            </div>

            {/* 利用規約同意 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">📋 出品に関する注意事項</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 出品されたツールは管理者による審査があります</li>
                <li>• 販売手数料として売上の15%を差し引かせていただきます</li>
                <li>• APIエンドポイントは24時間稼働している必要があります</li>
                <li>• 著作権を侵害するツールは出品できません</li>
                <li>• 審査には1-3営業日かかる場合があります</li>
              </ul>
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {submitting ? '申請中...' : '出品申請する'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}