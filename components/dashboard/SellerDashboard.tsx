// components/dashboard/SellerDashboard.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Package, 
  Eye, 
  DollarSign, 
  Users, 
  Star,
  Edit,
  Trash2,
  Plus,
  Download,
  Calendar,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { Product, Order } from '@/lib/types';

export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalProducts: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // サンプルデータ
      const sampleProducts: Product[] = [
        {
          id: 1,
          title: 'スマート文章校正AI Pro',
          description: '文章校正AIツール',
          price: 2980,
          category: '文章作成',
          icon: '🧠',
          rating: 4.8,
          reviewCount: 234,
          tags: ['文章作成', '校正'],
          createdAt: '2024-01-15',
          status: 'approved'
        },
        {
          id: 2,
          title: 'データ分析アシスタント',
          description: 'データ分析ツール',
          price: 4500,
          category: 'データ分析',
          icon: '📊',
          rating: 4.6,
          reviewCount: 89,
          tags: ['データ分析'],
          createdAt: '2024-01-20',
          status: 'pending'
        }
      ];

      const sampleOrders: Order[] = [
        {
          id: 1,
          user_id: 'user1',
          product_id: 1,
          amount: 2980,
          stripe_payment_id: 'pi_123',
          status: 'completed',
          created_at: '2024-02-01'
        },
        {
          id: 2,
          user_id: 'user2',
          product_id: 1,
          amount: 2980,
          stripe_payment_id: 'pi_456',
          status: 'completed',
          created_at: '2024-02-03'
        }
      ];

      setProducts(sampleProducts);
      setOrders(sampleOrders);
      
      // 統計計算
      const totalRevenue = sampleOrders.reduce((sum, order) => sum + order.amount, 0);
      const avgRating = sampleProducts.reduce((sum, product) => sum + product.rating, 0) / sampleProducts.length;
      
      setStats({
        totalRevenue,
        totalSales: sampleOrders.length,
        totalProducts: sampleProducts.length,
        avgRating
      });
      
    } catch (error) {
      console.error('ダッシュボードデータ読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, change, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 mt-1`}>{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% 前月比
            </p>
          )}
        </div>
        <div className={`text-3xl text-${color}-600`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📊 出品者ダッシュボード</h1>
            <p className="text-gray-600 mt-1">売上状況と商品管理</p>
          </div>
          <Link
            href="/sell"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            新規出品
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<DollarSign />}
            title="総売上"
            value={`¥${stats.totalRevenue.toLocaleString()}`}
            change={12}
            color="blue"
          />
          <StatCard
            icon={<TrendingUp />}
            title="販売数"
            value={stats.totalSales}
            change={8}
            color="green"
          />
          <StatCard
            icon={<Package />}
            title="出品中"
            value={stats.totalProducts}
            color="purple"
          />
          <StatCard
            icon={<Star />}
            title="平均評価"
            value={stats.avgRating.toFixed(1)}
            color="yellow"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'overview', name: '概要', icon: TrendingUp },
                { id: 'products', name: '商品管理', icon: Package },
                { id: 'orders', name: '注文履歴', icon: Users },
                { id: 'analytics', name: '分析', icon: Eye }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Sales Chart */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">📈 売上推移</h3>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p>売上データを可視化中...</p>
                      <p className="text-sm">（実装予定: Chart.js/Recharts）</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    href="/sell"
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🚀</div>
                      <div>
                        <h4 className="font-medium text-blue-900">新規出品</h4>
                        <p className="text-sm text-blue-700">新しいAIツールを出品</p>
                      </div>
                    </div>
                  </Link>
                  
                  <button className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">💰</div>
                      <div>
                        <h4 className="font-medium text-green-900">売上確認</h4>
                        <p className="text-sm text-green-700">詳細な売上レポート</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📝</div>
                      <div>
                        <h4 className="font-medium text-purple-900">レビュー管理</h4>
                        <p className="text-sm text-purple-700">顧客からのフィードバック</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">商品一覧</h3>
                  <button className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
                    <Download size={16} />
                    CSV出力
                  </button>
                </div>
                
                <div className="space-y-4">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{product.icon}</div>
                        <div>
                          <h4 className="font-medium text-gray-900">{product.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              product.status === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : product.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.status === 'approved' ? '公開中' : 
                               product.status === 'pending' ? '審査中' : '非公開'}
                            </span>
                            <span>¥{product.price.toLocaleString()}</span>
                            <span className="flex items-center gap-1">
                              <Star size={14} className="text-yellow-400" />
                              {product.rating} ({product.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">注文履歴</h3>
                  <div className="flex gap-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>すべての期間</option>
                      <option>今月</option>
                      <option>先月</option>
                    </select>
                    <button className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
                      <Download size={16} />
                      CSV出力
                    </button>
                  </div>
                </div>

                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">注文ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金額</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日時</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">#{order.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {products.find(p => p.id === order.product_id)?.title || '商品名'}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            ¥{order.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              完了
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('ja-JP')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">分析レポート</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Traffic Chart */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">商品別アクセス数</h4>
                    <div className="h-40 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-3xl mb-2">👁️</div>
                        <p>分析データを可視化中...</p>
                      </div>
                    </div>
                  </div>

                  {/* Conversion Chart */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">コンバージョン率</h4>
                    <div className="h-40 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-3xl mb-2">📊</div>
                        <p>コンバージョン分析中...</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">パフォーマンス指標</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">2.4%</div>
                      <div className="text-sm text-gray-600">平均コンバージョン率</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">¥2,400</div>
                      <div className="text-sm text-gray-600">平均注文金額</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">4.2</div>
                      <div className="text-sm text-gray-600">平均レビュー評価</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

