'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, Order, User } from '@/lib/types';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'users' | 'orders' | 'analytics'>('overview');
  const [pendingTools, setPendingTools] = useState<Product[]>([]);
  const [allTools, setAllTools] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    pendingApprovals: 0,
    totalOrders: 0
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = () => {
    // 出品ツールを読み込み
    const submittedTools = JSON.parse(localStorage.getItem('submittedTools') || '[]');
    const pending = submittedTools.filter((tool: Product) => tool.status === 'pending');
    setPendingTools(pending);
    setAllTools(submittedTools);

    // 注文データを読み込み
    const orderData = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(orderData);

    // ユーザーデータを模擬作成
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'デモユーザー',
        email: 'demo@example.com',
        role: 'user',
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        name: '管理者',
        email: 'admin@example.com',
        role: 'admin',
        createdAt: '2024-01-01'
      }
    ];
    setUsers(mockUsers);

    // 統計を計算
    const totalRevenue = orderData.reduce((sum: number, order: Order) => sum + order.total, 0);
    setStats({
      totalRevenue,
      totalUsers: mockUsers.length,
      pendingApprovals: pending.length,
      totalOrders: orderData.length
    });
  };

  const approveTool = (toolId: string | number) => {
    const submittedTools = JSON.parse(localStorage.getItem('submittedTools') || '[]');
    const updatedTools = submittedTools.map((tool: Product) => 
      tool.id === toolId ? { ...tool, status: 'approved' } : tool
    );
    localStorage.setItem('submittedTools', JSON.stringify(updatedTools));
    
    setPendingTools(prev => prev.filter(tool => tool.id !== toolId));
    setAllTools(updatedTools);
    
    alert('ツールを承認しました！');
  };

  const rejectTool = (toolId: string | number) => {
    const reason = prompt('却下理由を入力してください:');
    if (!reason) return;

    const submittedTools = JSON.parse(localStorage.getItem('submittedTools') || '[]');
    const updatedTools = submittedTools.map((tool: Product) => 
      tool.id === toolId ? { ...tool, status: 'rejected', rejectReason: reason } : tool
    );
    localStorage.setItem('submittedTools', JSON.stringify(updatedTools));
    
    setPendingTools(prev => prev.filter(tool => tool.id !== toolId));
    setAllTools(updatedTools);
    
    alert('ツールを却下しました');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
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

  const TabButton = ({ tab, label, icon }: { tab: string; label: string; icon: string }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === tab
          ? 'bg-purple-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/" className="hover:bg-purple-700 px-3 py-2 rounded transition-colors">
            ← ホームに戻る
          </Link>
          <h1 className="text-xl font-bold">👑 管理者ダッシュボード</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* 管理者情報 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-xl">👑</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">管理者ダッシュボード</h2>
              <p className="text-gray-600">AI Marketplace Pro の運営管理</p>
            </div>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton tab="overview" label="概要" icon="📊" />
          <TabButton tab="tools" label="ツール管理" icon="🛠️" />
          <TabButton tab="users" label="ユーザー管理" icon="👥" />
          <TabButton tab="orders" label="注文管理" icon="📦" />
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
                  ¥{stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl mb-2">👥</div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">総ユーザー数</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}人</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl mb-2">⏳</div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">承認待ち</h3>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingApprovals}件</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl mb-2">📦</div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">総注文数</h3>
                <p className="text-2xl font-bold text-purple-600">{stats.totalOrders}件</p>
              </div>
            </div>

            {/* 緊急対応が必要な項目 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🚨 要対応項目</h3>
              <div className="space-y-3">
                {stats.pendingApprovals > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⏳</span>
                      <div>
                        <div className="font-bold text-yellow-800">
                          {stats.pendingApprovals}件のツールが承認待ちです
                        </div>
                        <div className="text-yellow-700 text-sm">
                          早急に審査を行ってください
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('tools')}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors ml-auto"
                      >
                        確認する
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <div className="font-bold text-green-800">システム正常稼働中</div>
                      <div className="text-green-700 text-sm">すべてのサービスが正常に動作しています</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 最近のアクティビティ */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📝 最近のアクティビティ</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">🛠️</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">新しいツールが出品されました</div>
                    <div className="text-sm text-gray-600">2時間前</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">💰</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">新しい注文が入りました</div>
                    <div className="text-sm text-gray-600">5時間前</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">👤</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">新しいユーザーが登録しました</div>
                    <div className="text-sm text-gray-600">1日前</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ツール管理タブ */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            {/* 承認待ちツール */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⏳ 承認待ちツール</h3>
              
              {pendingTools.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">✅</div>
                  <h4 className="text-lg font-bold text-gray-600 mb-2">承認待ちのツールはありません</h4>
                  <p className="text-gray-500">すべてのツールが審査済みです。</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingTools.map((tool) => (
                    <div key={tool.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{tool.icon || '🤖'}</span>
                            <h4 className="text-lg font-bold text-gray-800">{tool.title}</h4>
                            {getStatusBadge(tool.status || 'pending')}
                          </div>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{tool.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-500">
                            <span>カテゴリ: {tool.category}</span>
                            <span>価格: ¥{tool.price?.toLocaleString()}</span>
                            <span>作成者: {tool.creator}</span>
                            <span>出品日: {formatDate(tool.createdAt)}</span>
                          </div>
                          {tool.endpointUrl && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium text-gray-600">API URL:</span>
                              <span className="ml-2 text-blue-600">{tool.endpointUrl}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => approveTool(tool.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            ✅ 承認
                          </button>
                          <button
                            onClick={() => rejectTool(tool.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            ❌ 却下
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 全ツール一覧 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🛠️ 全ツール一覧</h3>
              
              <div className="space-y-3">
                {allTools.map((tool) => (
                  <div key={tool.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{tool.icon || '🤖'}</span>
                      <div>
                        <div className="font-medium text-gray-800">{tool.title}</div>
                        <div className="text-sm text-gray-600">
                          {tool.creator} • ¥{tool.price?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(tool.status || 'pending')}
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        詳細
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ユーザー管理タブ */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">👥 ユーザー管理</h3>
            
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? '管理者' : 'ユーザー'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 注文管理タブ */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📦 注文管理</h3>
            
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📦</div>
                <h4 className="text-lg font-bold text-gray-600 mb-2">注文履歴がありません</h4>
                <p className="text-gray-500">まだ注文が入っていません。</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800">注文 #{order.id.slice(-8)}</h4>
                        <p className="text-gray-600 text-sm">
                          購入者: {order.customerInfo.name} ({order.customerInfo.email})
                        </p>
                        <p className="text-gray-500 text-sm">
                          注文日: {formatDate(order.createdAt)}
                        </p>
                        <div className="mt-2">
                          <div className="text-sm text-gray-600">購入商品:</div>
                          <ul className="text-sm text-gray-700 ml-4">
                            {order.products.map((product, index) => (
                              <li key={index}>• {product.title} - ¥{product.price.toLocaleString()}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ¥{order.total.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.status === 'completed' ? '完了' : '処理中'}
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
                  <h4 className="font-bold text-gray-800 mb-4">売上推移</h4>
                  <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
                    <span className="text-gray-500">グラフエリア（Chart.js等で実装予定）</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-800 mb-4">カテゴリ別人気度</h4>
                  <div className="bg-gray-50 rounded-lg p-8 h-48 flex items-center justify-center">
                    <span className="text-gray-500">円グラフエリア（実装予定）</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-bold text-gray-800 mb-4">月間統計</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">新規ユーザー:</span>
                    <span className="font-bold">+12人</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">新規ツール:</span>
                    <span className="font-bold">+{allTools.length}個</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">売上:</span>
                    <span className="font-bold text-green-600">¥{stats.totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-bold text-gray-800 mb-4">承認率</h4>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {allTools.length > 0 
                      ? Math.round(((allTools.length - stats.pendingApprovals) / allTools.length) * 100)
                      : 0}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {allTools.length - stats.pendingApprovals} / {allTools.length} ツール承認済み
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-bold text-gray-800 mb-4">平均注文金額</h4>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ¥{stats.totalOrders > 0 
                      ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString()
                      : 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stats.totalOrders}件の注文から算出
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