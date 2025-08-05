'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { Product } from '@/lib/types'

export default function CartPage() {
  const [cart, setCart] = useState<Product[]>([])
  
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter(item => item.id !== productId)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🛒 ショッピングカート</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-600 mb-2">カートは空です</h2>
            <p className="text-gray-500 mb-8">素晴らしいAIツールを探しに行きましょう</p>
            <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              ツールを探す
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm border"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{item.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        ¥{item.price.toLocaleString()}
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 mt-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border h-fit">
              <h3 className="text-lg font-bold text-gray-900 mb-4">注文概要</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>小計</span>
                  <span>¥{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>手数料</span>
                  <span>¥0</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>合計</span>
                  <span className="text-blue-600">¥{total.toLocaleString()}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors block text-center font-medium"
              >
                購入手続きへ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}