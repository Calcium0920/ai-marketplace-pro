'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  DollarSign, 
  Tag, 
  Globe, 
  FileText, 
  User,
  Upload,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import Link from 'next/link'

interface FormData {
  title: string
  description: string
  price: string
  category: string
  tags: string
  endpointUrl: string
}

const categories = [
  'データ分析',
  '画像処理',
  'テキスト処理',
  '機械学習',
  'API連携',
  'その他'
]

export default function SellPage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    category: '',
    tags: '',
    endpointUrl: '',
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  // ユニークID生成（Supabase対応）
  const generateUniqueToolId = (): string => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `tool_${timestamp}_${random}`
  }

  // バリデーション
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'ツール名は必須です'
    } else if (formData.title.length < 3) {
      newErrors.title = 'ツール名は3文字以上で入力してください'
    }

    if (!formData.description.trim()) {
      newErrors.description = '説明は必須です'
    } else if (formData.description.length < 10) {
      newErrors.description = '説明は10文字以上で入力してください'
    }

    if (!formData.price) {
      newErrors.price = '価格は必須です'
    } else if (parseInt(formData.price) < 100) {
      newErrors.price = '価格は100円以上で設定してください'
    }

    if (!formData.category) {
      newErrors.category = 'カテゴリは必須です'
    }

    if (!formData.endpointUrl.trim()) {
      newErrors.endpointUrl = 'API エンドポイントは必須です'
    } else if (!formData.endpointUrl.startsWith('http')) {
      newErrors.endpointUrl = '有効なURLを入力してください（http://またはhttps://で始まる）'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 🔥 Supabase対応のhandleSubmit関数
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      alert('入力内容に問題があります。エラーメッセージを確認してください。')
      return
    }

    setSubmitting(true)
    
    try {
      // ID生成（既存のロジック）
      let toolId = generateUniqueToolId()
      
      const newTool = {
        id: toolId,
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        endpoint_url: formData.endpointUrl, // ← Supabaseのカラム名に合わせる
        creator: session?.user?.name || 'Unknown User',
        status: 'pending',
        created_at: new Date().toISOString(), // ← Supabaseのカラム名
        submitted_by: session?.user?.email || 'unknown@example.com',
      }
      
      console.log('=== Supabaseに出品データ保存 ===')
      console.log('ツールデータ:', newTool)
      
      // 🔥 重要: Supabaseに保存
      const { data, error } = await supabase
        .from('tools')
        .insert([newTool])
        .select()
      
      if (error) {
        throw new Error(`Supabase保存エラー: ${error.message}`)
      }
      
      console.log('✅ Supabase保存成功:', data)
      
      // 🔥 重要: localStorageではなくSupabaseに保存されました
      const successMessage = `出品申請が完了しました！

📋 ツール情報:
- タイトル: ${newTool.title}
- ID: ${toolId}
- カテゴリ: ${newTool.category}
- 価格: ¥${newTool.price.toLocaleString()}

💾 データベースに保存されました
⏳ 管理者の審査後に公開されます`

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
      
      // 開発環境では詳細ページプレビュー
      if (process.env.NODE_ENV === 'development') {
        const previewOption = confirm(
          `出品したツールの詳細ページをプレビューしますか？\n\nツールID: ${toolId}`
        )
        
        if (previewOption) {
          router.push(`/tools/${toolId}`)
          return
        }
      }
      
      router.push('/dashboard')
      
    } catch (error) {
      console.error('出品エラー:', error)
      alert(`出品申請に失敗しました。\n\nエラー: ${error instanceof Error ? error.message : '不明なエラー'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
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
            href="/api/auth/signin"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ログイン
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
              <span className="text-sm text-gray-600">出品者: {session.user?.name}</span>
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
                ダッシュボード
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* タイトルセクション */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <Plus className="inline w-8 h-8 mr-2 text-blue-600" />
            AIツールを出品
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            あなたのAIツールを世界中のユーザーと共有しましょう。
            審査完了後、マーケットプレイスで販売開始されます。
          </p>
        </div>

        {/* 出品の流れ */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            出品の流れ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                1
              </div>
              <span className="text-blue-800">フォーム入力</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                2
              </div>
              <span className="text-blue-800">管理者審査</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                3
              </div>
              <span className="text-blue-800">販売開始</span>
            </div>
          </div>
        </div>

        {/* 出品フォーム */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          {/* ツール名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              ツール名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="例: AIチャットボット生成ツール"
              maxLength={100}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.title}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {formData.title.length}/100文字
            </p>
          </div>

          {/* 説明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              詳細説明 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="ツールの機能、使用方法、期待できる結果などを詳しく説明してください..."
              maxLength={1000}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {formData.description.length}/1000文字
            </p>
          </div>

          {/* 価格とカテゴリ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 価格 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline w-4 h-4 mr-1" />
                価格（円） <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1000"
                min="100"
                max="1000000"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.price}
                </p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                最低価格: ¥100
              </p>
            </div>

            {/* カテゴリ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline w-4 h-4 mr-1" />
                カテゴリ <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">カテゴリを選択</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.category}
                </p>
              )}
            </div>
          </div>

          {/* タグ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline w-4 h-4 mr-1" />
              タグ（オプション）
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="例: 自然言語処理, チャットボット, API"
            />
            <p className="text-gray-500 text-sm mt-1">
              カンマ区切りで入力してください（例: AI, 機械学習, 自動化）
            </p>
          </div>

          {/* API エンドポイント */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="inline w-4 h-4 mr-1" />
              API エンドポイント <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.endpointUrl}
              onChange={(e) => handleInputChange('endpointUrl', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.endpointUrl ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="https://your-api-endpoint.com/api/v1/process"
            />
            {errors.endpointUrl && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.endpointUrl}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              ユーザーがツールにアクセスするためのAPIエンドポイントURL
            </p>
          </div>

          {/* 出品者情報 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <User className="w-4 h-4 mr-1" />
              出品者情報
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>名前: {session.user?.name}</p>
              <p>メール: {session.user?.email}</p>
            </div>
          </div>

          {/* 注意事項 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              ご注意
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>出品されたツールは管理者による審査が行われます</li>
              <li>不適切なコンテンツや機能しないツールは却下される場合があります</li>
              <li>APIエンドポイントは常時稼働している必要があります</li>
              <li>価格は後から変更可能ですが、審査が必要になる場合があります</li>
            </ul>
          </div>

          {/* 送信ボタン */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  出品申請中...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  出品申請する
                </>
              )}
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              キャンセル
            </Link>
          </div>
        </form>

        {/* 成功時のプレビューリンク */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800 mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              開発者向け情報
            </h3>
            <p className="text-sm text-green-700">
              出品後、ツールの詳細ページをプレビューできます
            </p>
          </div>
        )}
      </main>
    </div>
  )
}