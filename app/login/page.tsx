'use client'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    setLoading(true)
    try {
      const result = await signIn('credentials', {
        name,
        redirect: false,
      })

      if (result?.ok) {
        router.push('/')
      } else {
        alert('ログインに失敗しました')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('ログインエラーが発生しました')
    }
    setLoading(false)
  }

  if (session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p>ログイン済みです。リダイレクト中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🤖</h1>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">テストログイン</h2>
          <p className="text-gray-600 mt-2">AI Marketplaceにアクセス</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              お名前
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田太郎"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>名前を入力するだけで</p>
          <p>ログインできます（開発版）</p>
        </div>
      </div>
    </div>
  )
}