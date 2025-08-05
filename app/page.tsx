'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, SearchFilters } from '@/lib/types';
import { filterProducts, searchProducts, getUniqueCategories, getPriceRange } from '@/lib/searchUtils';
import SearchFilter from '@/components/SearchFilter';

export default function HomePage() {
  const [cart, setCart] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<{name: string; email: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 静的なサンプル商品データ
  const defaultProducts: Product[] = [
    {
      id: 1,
      title: 'スマート文章校正AI',
      description: '日本語の文章を自動で校正・改善してくれるAIツール。ビジネス文書からブログ記事まで対応。',
      price: 2980,
      category: '文章作成',
      icon: '🧠',
      rating: 5,
      reviewCount: 127,
      tags: ['文章作成', '校正', 'ビジネス', 'AI', '日本語'],
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'データ分析アシスタント',
      description: 'CSVファイルをアップロードするだけで、自動でグラフ作成や統計分析を行うAIツール。',
      price: 4500,
      category: 'データ分析',
      icon: '📊',
      rating: 4,
      reviewCount: 89,
      tags: ['データ分析', 'グラフ', '統計', 'CSV', '自動化'],
      createdAt: '2024-01-20'
    },
    {
      id: 3,
      title: 'ロゴ生成AI',
      description: '会社名やキーワードを入力するだけで、プロ品質のロゴデザインを自動生成。',
      price: 1980,
      category: 'デザイン',
      icon: '🎨',
      rating: 5,
      reviewCount: 203,
      tags: ['デザイン', 'ロゴ', 'ブランディング', 'AI', '自動生成'],
      createdAt: '2024-01-10'
    },
    {
      id: 4,
      title: 'カスタマーサポートBot',
      description: 'よくある質問に自動回答するチャットボット。Webサイトに簡単に組み込めます。',
      price: 3500,
      category: 'チャットボット',
      icon: '💬',
      rating: 4,
      reviewCount: 156,
      tags: ['チャットボット', 'サポート', '自動化', 'FAQ', 'ビジネス'],
      createdAt: '2024-01-25'
    },
    {
      id: 5,
      title: '学習計画AI',
      description: '目標と現在のレベルを入力すると、最適な学習スケジュールを自動作成。',
      price: 2200,
      category: '教育',
      icon: '📚',
      rating: 5,
      reviewCount: 95,
      tags: ['教育', '学習', '計画', 'スケジュール', 'AI'],
      createdAt: '2024-02-01'
    },
    {
      id: 6,
      title: 'SEO分析ツール',
      description: 'WebサイトのSEO状況を自動分析し、改善提案を行うAIツール。',
      price: 5980,
      category: 'SEO',
      icon: '🔍',
      rating: 4,
      reviewCount: 74,
      tags: ['SEO', '分析', 'マーケティング', 'Web', '最適化'],
      createdAt: '2024-01-30'
    }
  ];

  useEffect(() => {
    loadProducts();
    loadUserFromStorage();
    loadCartFromStorage();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [allProducts, searchQuery]);

  const loadProducts = async (): Promise<void> => {
    try {
      setAllProducts(defaultProducts);
    } catch (error) {
      console.error('商品読み込みエラー:', error);
      setAllProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  };

  const loadUserFromStorage = () => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('ユーザー情報読み込みエラー:', error);
    }
  };

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('カート情報読み込みエラー:', error);
    }
  };

  const applyFiltersAndSearch = () => {
    let products = searchProducts(allProducts, searchQuery);
    setFilteredProducts(products);
  };

  const handleFilterChange = (filters: SearchFilters) => {
    let products = searchProducts(allProducts, searchQuery);
    products = filterProducts(products, filters);
    setFilteredProducts(products);
  };

  const login = (userData: {name: string; email: string}) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    alert('ログアウトしました');
  };

  const addToCart = (product: Product): void => {
    const isInCart = cart.some((item: Product) => item.id === product.id);
    if (isInCart) {
      alert('既にカートに追加されています');
      return;
    }
    
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`${product.title}をカートに追加しました！`);
  };

  const removeFromCart = (productId: number | string): void => {
    const updatedCart = cart.filter((item: Product) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = (): void => {
    const confirmed = window.confirm('カートをすべて空にしますか？');
    if (confirmed) {
      setCart([]);
      localStorage.removeItem('cart');
      alert('カートを空にしました');
    }
  };

  const cartTotal = cart.reduce((sum: number, item: Product) => sum + item.price, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <div className="text-xl">データを読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-blue-600 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
            🤖 AI Marketplace Pro
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">
              ホーム
            </Link>
            <Link href="/sell" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">
              出品する
            </Link>
            <Link href="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">
              ダッシュボード
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* 検索バー */}
            <div className="hidden md:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ツールを検索..."
                className="px-3 py-2 rounded-lg text-gray-800 w-64"
              />
            </div>

            {/* カート */}
            <div className="relative">
              <button
                onClick={() => setShowCart(!showCart)}
                className="flex items-center gap-2 hover:text-blue-200 transition-colors"
              >
                🛒
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
            
            {/* ログイン/ログアウト */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-sm hidden md:block">こんにちは、{user?.name}さん</span>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors text-sm"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors font-medium"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* カートドロップダウン */}
      {showCart && (
        <div className="fixed top-16 right-4 w-96 bg-white rounded-lg shadow-2xl border z-40 max-h-96 overflow-y-auto">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">🛒 カート ({cart.length})</h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="p-4">
            {cart.length === 0 ? (
              <p className="text-gray-600 text-center py-4">カートは空です</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map((item: Product) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-blue-600 font-bold text-sm">¥{item.price.toLocaleString()}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3">
                  {cart.length > 1 && (
                    <button
                      onClick={clearCart}
                      className="w-full bg-gray-500 text-white py-1 rounded text-xs hover:bg-gray-600 transition-colors mb-2"
                    >
                      カートを空にする
                    </button>
                  )}
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold">合計:</span>
                    <span className="text-lg font-bold text-blue-600">¥{cartTotal.toLocaleString()}</span>
                  </div>
                  <Link
                    href="/success"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    💳 購入手続きへ
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* メイン画面 */}
      <main className="max-w-7xl mx-auto p-6">
        {/* ヒーローセクション */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🚀 AIツールマーケットプレイス
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            便利なAIツールを見つけて購入、または自分のツールを販売
          </p>
          
          {isLoggedIn && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg inline-block mb-4">
              👋 ようこそ、{user?.name}さん！
            </div>
          )}

          {/* モバイル検索 */}
          <div className="md:hidden mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ツールを検索..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800"
            />
          </div>
        </div>

        {/* 検索フィルター */}
        <SearchFilter
          onFilterChange={handleFilterChange}
          categories={getUniqueCategories(allProducts)}
          priceRange={getPriceRange(allProducts)}
        />

        {/* 商品一覧 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              AIツール ({filteredProducts.length}件)
            </h2>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              📡 Vercel運営中
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">検索結果が見つかりません</h3>
              <p className="text-gray-500">検索条件を変更してお試しください</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product: Product) => {
                const isInCart = cart.some((item: Product) => item.id === product.id);
                return (
                  <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 card-hover">
                    <div className="text-4xl mb-4 text-center bg-gray-50 rounded-lg py-8">
                      {product.icon}
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                        {product.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                        {product.tags.slice(0, 2).map((tag: string, index: number) => (
                          <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">
                          {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5-Math.floor(product.rating))}
                        </span>
                        <span className="text-sm text-gray-600">
                          {product.rating.toFixed(1)} ({product.reviewCount})
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          ¥{product.price.toLocaleString()}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addToCart(product)}
                            disabled={isInCart}
                            className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 btn-hover-lift ${
                              isInCart 
                                ? 'bg-green-500 text-white cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {isInCart ? '✓ 追加済み' : 'カートに追加'}
                          </button>
                          <Link
                            href={`/tools/${product.id}`}
                            className="px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            詳細
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* フッター */}
        <footer className="text-center py-8 border-t">
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-6 py-4 rounded-lg inline-block">
            <strong>🎉 AI Marketplace Pro 完全稼働中！</strong>
            <br />
            検索・フィルター・カート・ユーザー管理完備
          </div>
        </footer>
      </main>
    </div>
  );
}