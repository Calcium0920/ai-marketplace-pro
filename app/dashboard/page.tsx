'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, Order } from '@/lib/types';

export default function DashboardPage() {
  const [user, setUser] = useState<{name: string; email: string} | null>(null);
  const [submittedTools, setSubmittedTools] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalEarnings: 0,
    approvedTools: 0,
    pendingTools: 0
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'sales' | 'analytics'>('overview');

  useEffect(() => {
    loadUserData();
    loadSubmittedTools();
    loadOrders();
  }, []);

  const loadUserData = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const loadSubmittedTools = () => {
    const tools = JSON.parse(localStorage.getItem('submittedTools') || '[]');
    setSubmittedTools(tools);
    
    // 統計計算
    const approved = tools.filter((tool: Product) => tool.status === 'approved').length;
    const pending = tools.filter((tool: Product) => tool.status === 'pending').length;
    
    setStats(prev => ({
      ...prev,
      approvedTools: approved,
      pendingTools: pending
    }));
  };

  const loadOrders = () => {
    const orderData = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(orderData);
    
    // 売上統計計算
    const totalSales = orderData.length;
    const totalEarnings = orderData.reduce((sum: number, order: Order) => sum + order.total, 0);
    
    setStats(prev => ({
      ...prev,
      totalSales,
      totalEarnings
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">承認済み</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">審査中</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">却下</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">不明</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const TabButton = ({ tab, label, icon }: { tab: string; label: string; icon: string }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === tab
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <Link href="/" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">
              ← ホームに戻る
            </Link>
            <h1 className="text-xl font-bold">📊 ダッシュボード</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">ログインが必要です</h2>
            <p className="text-gray-600 mb-6">ダッシュボードにアクセスするにはログインしてください。</p>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ログインページへ
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">
            ← ホームに戻る
          </Link>
          <h1 className="text-xl font-bold">📊 ダッシュボード</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* ユーザー情報 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                おかえりなさい、{user.name}さん
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton tab="overview" label="概要" icon="📊" />
          <TabButton tab="tools" label="出品ツール" icon="🛠️" />
          <TabButton tab="sales" label="売上" icon="💰" />
          <TabButton tab="analytics" label="分析" icon="📈" />
        </div>

        {/* 概要タブ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 統計カード */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">総売上</h3>
                <p className="text-2xl font-bold text-green-600">
                  ¥{stats.totalEarnings.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl mb-2">📦</div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">販売数</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalSales}件</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">承認済みツール</h3>
                <p className="text-2xl font-bold text-purple-600">{stats.approvedTools}個</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl mb-2">⏳</div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">審査中ツール</h3>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingTools}個</p>
              </div>
            </div>

            {/* クイックアクション */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🚀 クイックアクション</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/sell"
                  className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  <div className="text-2xl mb-2">🛠️</div>
                  <div className="font-bold">新しいツールを出品</div>
                </Link>
                
                <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-bold">売上レポート作成</div>
                </button>
                
                <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center">
                  <div className="text-2xl mb-2">💡</div>
                  <div className="font-bold">改善提案を確認</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 出品ツールタブ */}
        {activeTab === 'tools' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">🛠️ 出品ツール一覧</h3>
              <Link
                href="/sell"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                新規出品
              </Link>
            </div>

            {submittedTools.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📦</div>
                <h4 className="text-lg font-bold text-gray-600 mb-2">出品ツールがありません</h4>
                <p className="text-gray-500 mb-4">最初のAIツールを出品してみませんか？</p>
                <Link
                  href="/sell"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  出品する
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {submittedTools.map((tool) => (
                  <div key={tool.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{tool.icon || '🤖'}</span>
                          <h4 className="text-lg font-bold text-gray-800">{tool.title}</h4>
                          {getStatusBadge(tool.status || 'pending')}
                        </div>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{tool.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>カテゴリ: {tool.category}</span>
                          <span>価格: ¥{tool.price?.toLocaleString()}</span>
                          <span>出品日: {formatDate(tool.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors">
                          編集
                        </button>
                        <button className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors">
                          削除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 売上タブ */}
        {activeTab === 'sales' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">💰 売上履歴</h3>
            
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💸</div>
                <h4 className="text-lg font-bold text-gray-600 mb-2">売上履歴がありません</h4>
                <p className="text-gray-500">まだ購入されたツールがありません。</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800">注文 #{order.id}</h4>
                        <p className="text-gray-600 text-sm">
                          購入者: {order.customerInfo.name} ({order.customerInfo.email})
                        </p>
                        <p className="text-gray-500 text-sm">
                          注文日: {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ¥{order.total.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          手数料込み
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 分析タブ */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">📈 分析データ</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-800 mb-4">月別売上推移</h4>
                  <div className="bg-gray-50 rounded-lg p-4 h-32 flex items-center justify-center">
                    <span className="text-gray-500">グラフエリア（今後実装予定）</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-800 mb-4">カテゴリ別売上</h4>
                  <div className="bg-gray-50 rounded-lg p-4 h-32 flex items-center justify-center">
                    <span className="text-gray-500">グラフエリア（今後実装予定）</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-4">📊 詳細統計</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">平均注文金額</div>
                  <div className="text-xl font-bold text-blue-800">
                    ¥{stats.totalSales > 0 ? Math.round(stats.totalEarnings / stats.totalSales).toLocaleString() : 0}
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">承認率</div>
                  <div className="text-xl font-bold text-green-800">
                    {submittedTools.length > 0 
                      ? Math.round((stats.approvedTools / submittedTools.length) * 100) 
                      : 0}%
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">今月の売上</div>
                  <div className="text-xl font-bold text-purple-800">
                    ¥{Math.floor(stats.totalEarnings * 0.7).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}