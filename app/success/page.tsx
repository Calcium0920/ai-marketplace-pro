'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function SuccessPage() {
  useEffect(() => {
    // カートをクリア
    localStorage.removeItem('cart')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">購入完了！</h1>
        <p className="text-gray-600 mb-8">
          AIツールの購入が完了しました。<br />
          ダッシュボードから利用を開始できます。
        </p>
        
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors block font-medium"
          >
            ダッシュボードへ
          </Link>
          <Link
            href="/"
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors block"
          >
            ホームに戻る
          </Link>
        </div>
      </motion.div>
    </div>
  )
}