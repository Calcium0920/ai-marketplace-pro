'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  TrendingUp, 
  Zap,
  Shield,
  Users,
  ArrowRight,
  Menu,
  X,
  Bell,
  User as UserIcon
} from 'lucide-react';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'seller' | 'admin';
}

export default function HomePage() {
  // States
  const [cart, setCart] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // サンプル商品データ
  const defaultProducts: Product[] = [
    {
      id: 1,
      title: 'スマート文章校正AI Pro',
      description: '日本語の文章を自動で校正・改善してくれる高性能AIツール。ビジネス文書からブログ記事まで幅広く対応し、自然で読みやすい文章に変換します。',
      price: 2980,
      category: '文章作成',
      icon: '🧠',
      rating: 4.8,
      reviewCount: 234,
      tags: ['文章作成', '校正', 'ビジネス', 'AI', '日本語', '自動化'],
      createdAt: '2024-01-15',
      status: 'approved'
    },
    {
      id: 2,
      title: 'データ分析アシスタント',
      description: 'CSVファイルをアップロードするだけで、美しいグラフと詳細な統計分析を自動生成。データサイエンスの専門知識不要で本格的な分析が可能です。',
      price: 4500,
      category: 'データ分析',
      icon: '📊',
      rating: 4.6,
      reviewCount: 189,
      tags: ['データ分析', 'グラフ', '統計', 'CSV', '自動化', 'ビジネス'],
      createdAt: '2024-01-20',
      status: 'approved'
    },
    {
      id: 3,
      title: 'プロロゴ生成AI Studio',
      description: '会社名やキーワードを入力するだけで、プロデザイナー級のロゴデザインを複数パターン自動生成。商用利用可能で高解像度出力対応。',
      price: 1980,
      category: 'デザイン',
      icon: '🎨',
      rating: 4.9,
      reviewCount: 456,
      tags: ['デザイン', 'ロゴ', 'ブランディング', 'AI', '自動生成', '商用利用'],
      createdAt: '2024-01-10',
      status: 'approved'
    },
    {
      id: 4,
      title: '24時間カスタマーサポートBot',
      description: 'よくある質問に自然な日本語で自動回答するチャットボット。Webサイトに簡単に組み込めて、顧客満足度向上に貢献します。',
      price: 3500,
      category: 'チャットボット',
      icon: '💬',
      rating: 4.5,
      reviewCount: 298,
      tags: ['チャットボット', 'サポート', '自動化', 'FAQ', 'ビジネス', '顧客対応'],
      createdAt: '2024-01-25',
      status: 'approved'
    },
    {
      id: 5,
      title: 'AI学習プランナー',
      description: '目標と現在のレベルを入力すると、最適な学習スケジュールを自動作成。進捗管理機能付きで継続的な学習をサポートします。',
      price: 2200,
      category: '教育',
      icon: '📚',
      rating: 4.7,
      reviewCount: 167,
      tags: ['教育', '学習', '計画', 'スケジュール', 'AI', '進捗管理'],
      createdAt: '2024-02-01',
      status: 'approved'
    },
    {
      id: 6,
      title: 'SEO最適化アナライザー',
      description: 'WebサイトのSEO状況を詳細分析し、具体的な改善提案を行うAIツール。検索順位向上のための戦略的アドバイスを提供します。',
      price: 5980,
      category: 'SEO',
      icon: '🔍',
      rating: 4.4,
      reviewCount: 123,
      tags: ['SEO', '分析', 'マーケティング', 'Web', '最適化', '検索順位'],
      createdAt: '2024-01-30',
      status: 'approved'
    }
  ];

  // Effects
  useEffect(() => {
    loadProducts();
    loadUserFromStorage();
    loadCartFromStorage();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [allProducts, searchQuery, selectedCategory, sortBy]);

  // Functions
  const loadProducts = async (): Promise<void> => {
    try {
      const submittedTools = JSON.parse(localStorage.getItem('submittedTools') || '[]');
      const approvedTools = submittedTools.filter((tool: any) => tool.status === 'approved');
      const allProductsData = [...defaultProducts, ...approvedTools];
      setAllProducts(allProductsData);
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

  const searchProducts = (products: Product[], query: string): Product[] => {
    if (!query.trim()) return products;
    const lowerQuery = query.toLowerCase();
    return products.filter(product =>
      product.title.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const applyFiltersAndSearch = () => {
    let products = searchProducts(allProducts, searchQuery);
    
    if (selectedCategory && selectedCategory !== 'all') {
      products = products.filter(product => product.category === selectedCategory);
    }
    
    switch (sortBy) {
      case 'price':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    
    setFilteredProducts(products);
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
  };

  const removeFromCart = (productId: number): void => {
    const updatedCart = cart.filter((item: Product) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getUniqueCategories = (products: Product[]): string[] => {
    const categories = products.map(product => product.category);
    const uniqueCategories: string[] = [];
    categories.forEach(category => {
      if (!uniqueCategories.includes(category)) {
        uniqueCategories.push(category);
      }
    });
    return uniqueCategories;
  };

  const cartTotal = cart.reduce((sum: number, item: Product) => sum + item.price, 0);
  const isAdmin = user?.email === 'admin@example.com';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <div className="text-xl font-medium text-gray-700">データを読み込み中...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl">🤖</div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                AI Marketplace Pro
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="AIツールを検索..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <div className="relative">
                <button
                  onClick={() => setShowCart(!showCart)}
                  className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ShoppingCart size={24} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>

              {/* User Menu */}
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {user?.name}
                  </span>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  ログイン
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="AIツールを検索..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
        </div>
      </header>

      {/* Cart Dropdown */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-16 right-4 w-96 bg-white rounded-xl shadow-xl border z-40 max-h-96 overflow-y-auto"
            >
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">🛒 カート ({cart.length})</h3>
                  <button
                    onClick={() => setShowCart(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                {cart.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">カートは空です</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      {cart.map((item: Product) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <div className="font-medium text-sm">{item.title}</div>
                              <div className="text-blue-600 font-bold">¥{item.price.toLocaleString()}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold">合計:</span>
                        <span className="text-xl font-bold text-blue-600">¥{cartTotal.toLocaleString()}</span>
                      </div>
                      <Link
                        href="/cart"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium block text-center"
                      >
                        💳 購入手続きへ
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
            <div 
              className="fixed inset-0 bg-black bg-opacity-25 z-30"
              onClick={() => setShowCart(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              🚀 AIツールの
              <span className="text-blue-600">マーケットプレイス</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              便利なAIツールを見つけて購入、または自分のツールを販売できるプラットフォーム
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-3xl mb-2">🛠️</div>
                <div className="text-2xl font-bold text-blue-600">{allProducts.length}+</div>
                <div className="text-gray-600">AIツール</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-green-600">4.7</div>
                <div className="text-gray-600">平均評価</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div className="text-3xl mb-2">👥</div>
                <div className="text-2xl font-bold text-purple-600">10K+</div>
                <div className="text-gray-600">利用者数</div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-600" />
                <span className="font-medium text-gray-700">フィルター:</span>
              </div>
              
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">すべてのカテゴリ</option>
                {getUniqueCategories(allProducts).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">新着順</option>
                <option value="rating">評価順</option>
                <option value="price">価格順</option>
              </select>

              <div className="ml-auto text-sm text-gray-600">
                {filteredProducts.length}件のツールが見つかりました
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="mb-12">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">検索結果が見つかりません</h3>
              <p className="text-gray-500">検索条件を変更してお試しください</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product: Product, index) => {
                const isInCart = cart.some((item: Product) => item.id === product.id);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 overflow-hidden"
                  >
                    {/* 商品画像・アイコン */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center group-hover:from-blue-100 group-hover:to-purple-100 transition-colors">
                      <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                        {product.icon}
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-600">
                        {product.category}
                      </div>
                    </div>

                    <div className="p-5">
                      {/* タイトル・説明 */}
                      <Link href={`/products/${product.id}`} className="block mb-3">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                          {product.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </Link>

                      {/* 評価 */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                              className="text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {product.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({product.reviewCount}件)
                        </span>
                      </div>

                      {/* タグ */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* 価格・購入ボタン */}
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-blue-600">
                          ¥{product.price.toLocaleString()}
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={isInCart}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            isInCart
                              ? 'bg-green-500 text-white cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transform hover:-translate-y-0.5'
                          }`}
                        >
                          <ShoppingCart size={16} />
                          {isInCart ? '追加済み' : 'カートに追加'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              なぜAI Marketplace Proを選ぶのか？
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">安全・安心</h3>
                <p className="text-blue-100">
                  すべてのツールは厳格な審査を通過。安全で高品質なAIツールのみを提供
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Zap size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">簡単導入</h3>
                <p className="text-blue-100">
                  購入後すぐに利用開始。複雑な設定不要で、誰でも簡単にAIツールを活用
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">コミュニティ</h3>
                <p className="text-blue-100">
                  活発なユーザーコミュニティ。レビューやフィードバックで最適なツール選び
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}