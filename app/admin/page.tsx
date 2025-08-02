'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Tool {
  id: string
  title: string
  description: string
  price: number
  category: string
  creator: string
  status: string
  submittedBy: string
  createdAt: string
}

export default function AdminPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [pendingTools, setPendingTools] = useState<Tool[]>([])
  const [approvedTools, setApprovedTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session || (session.user?.name !== 'admin' && session.user?.name !== '管理者')) {
      router.push('/')
      return
    }
    loadData()
  }, [session, router])

  const loadData = () => {
    try {
      const pending = JSON.parse(localStorage.getItem('pendingTools') || '[]')
      const approved = JSON.parse(localStorage.getItem('approvedTools') || '[]')
      setPendingTools(pending)
      setApprovedTools(approved)
    } catch (error) {
      console.error('データ読み込みエラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveTool = (toolId: string) => {
    const toolIndex = pendingTools.findIndex(t => t.id === toolId)
    if (toolIndex === -1) return

    const tool = pendingTools[toolIndex]
    const updatedPending = pendingTools.filter(t => t.id !== toolId)
    const updatedApproved = [...approvedTools, { ...tool, status: 'approved' }]

    setPendingTools(updatedPending)
    setApprovedTools(updatedApproved)

    localStorage.setItem('pendingTools', JSON.stringify(updatedPending))
    localStorage.setItem('approvedTools', JSON.stringify(updatedApproved))

    alert(`${tool.title} を承認しました！`)
  }

  const rejectTool = (toolId: string) => {
    const updatedPending = pendingTools.filter(t => t.id !== toolId)
    setPendingTools(updatedPending)
    localStorage.setItem('pendingTools', JSON.stringify(updatedPending))
    alert('ツールを却下しました')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          🔧 管理画面
        </h1>

        {/* 承認待ちツール */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            承認待ちツール ({pendingTools.length}件)
          </h2>
          
          {pendingTools.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">承認待ちのツールはありません</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingTools.map((tool) => (
                <div key={tool.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{tool.title}</h3>
                      <p className="text-gray-600 mt-2">{tool.description}</p>
                      <div className="mt-3 space-y-1 text-sm text-gray-500">
                        <p>価格: ¥{tool.price.toLocaleString()}</p>
                        <p>カテゴリ: {tool.category}</p>
                        <p>作成者: {tool.creator}</p>
                        <p>申請者: {tool.submittedBy}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveTool(tool.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        承認
                      </button>
                      <button
                        onClick={() => rejectTool(tool.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        却下
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 承認済みツール */}
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            承認済みツール ({approvedTools.length}件)
          </h2>
          
          {approvedTools.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">承認済みのツールはありません</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {approvedTools.map((tool) => (
                <div key={tool.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800">{tool.title}</h3>
                  <p className="text-gray-600 mt-2">{tool.description}</p>
                  <div className="mt-3 space-y-1 text-sm text-gray-500">
                    <p>価格: ¥{tool.price.toLocaleString()}</p>
                    <p>カテゴリ: {tool.category}</p>
                    <p>作成者: {tool.creator}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}