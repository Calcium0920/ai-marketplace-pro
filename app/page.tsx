'use client'
import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, LogOut, CreditCard, Loader2 } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import SearchFilter from '@/components/SearchFilter';
import { filterProducts } from '@/lib/searchUtils';
import { Product, FilterState, CategoryIconMap } from '@/lib/types';

// レビュー型定義
interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  toolId: string;
  verified: boolean;
  helpful: number;
}

// Supabaseツール型定義
interface SupabaseTool {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[] | null;
  created_at: string;
  creator: string;
  status: string;
  endpoint_url: string;
  submitted_by: string;
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [showCart, setShowCart] = useState<boolean>(false);

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
  }, []);

  // ヘルパー関数
  const calculateAverageRating = (toolId: number | string, reviews: Review[]): number => {
    const toolReviews = reviews.filter((review: Review) => review.toolId === toolId.toString());
    if (toolReviews.length === 0) return 0;
    const sum = toolReviews.reduce((acc: number, review: Review) => acc + review.rating, 0);
    return Math.round((sum / toolReviews.length) * 10) / 10; // 小数点1桁
  };

  const getReviewCount = (toolId: number | string, reviews: Review[]): number => {
    return reviews.filter((review: Review) => review.toolId === toolId.toString()).length;
  };

  // 🔥 Supabase対応: loadProducts関数を更新
  const loadProducts = async (): Promise<void> => {
    try {
      console.log('=== ツール一覧データ読み込み開始 ===');
      
      // 🔥 重要: Supabaseから承認済みツールを取得
      const { data: supabaseTools, error } = await supabase
        .from('tools')
        .select('*')
        .eq('status', 'approved') // 承認済みのみ表示
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabaseツール取得エラー:', error);
      }

      // レビューデータを取得（localStorage）
      const allReviews: Review[] = JSON.parse(localStorage.getItem('reviews') || '[]');
      
      // SupabaseツールをProduct形式に変換
      const formattedSupabaseTools: Product[] = (supabaseTools || []).map((tool: SupabaseTool) => ({
        id: tool.id, // 文字列IDをそのまま使用
        title: tool.title,
        description: tool.description,
        price: tool.price,
        category: tool.category,
        icon: getCategoryIcon(tool.category),
        rating: calculateAverageRating(tool.id, allReviews) || 5,
        reviewCount: getReviewCount(tool.id, allReviews) || 0,
        tags: tool.tags || [tool.category],
        createdAt: tool.created_at,
        creator: tool.creator
      }));

      // フォールバック: localStorageから承認済みツールを取得
      const localApproved = JSON.parse(localStorage.getItem('approvedTools') || '[]');
      const formattedLocalTools: Product[] = localApproved.map((tool: any, index: number) => ({
        id: `local_${index}`, // ローカルツール用のID
        title: tool.title,
        description: tool.description,
        price: tool.price,
        category: tool.category,
        icon: getCategoryIcon(tool.category),
        rating: calculateAverageRating(tool.id, allReviews) || 5,
        reviewCount: getReviewCount(tool.id, allReviews) || 0,
        tags: tool.tags || [tool.category],
        createdAt: tool.createdAt || new Date().toISOString(),
        creator: tool.creator
      }));

      // デフォルト商品の評価更新
      const updatedDefaultProducts: Product[] = defaultProducts.map((product: Product) => ({
        ...product,
        rating: calculateAverageRating(product.id, allReviews) || product.rating,
        reviewCount: getReviewCount(product.id, allReviews) || product.reviewCount
      }));

      // 🔥 重要: データソースの優先順位
      // 1. デフォルト商品（常に表示）
      // 2. Supabaseから取得した承認済みツール
      // 3. localStorageから取得した承認済みツール（フォールバック）
      const allProductsData: Product[] = [
        ...updatedDefaultProducts,
        ...formattedSupabaseTools,
        ...formattedLocalTools
      ];

      console.log('✅ データ読み込み完了:');
      console.log('- デフォルト商品:', updatedDefaultProducts.length, '件');
      console.log('- Supabaseツール:', formattedSupabaseTools.length, '件');
      console.log('- ローカルツール:', formattedLocalTools.length, '件');
      console.log('- 合計:', allProductsData.length, '件');

      setAllProducts(allProductsData);
      setFilteredProducts(allProductsData);

    } catch (error) {
      console.error('商品読み込みエラー:', error);
      
      // エラー時のフォールバック: デフォルト商品のみ表示
      const allReviews: Review[] = JSON.parse(localStorage.getItem('reviews') || '[]');
      const updatedDefaultProducts: Product[] = defaultProducts.map((product: Product) => ({
        ...product,
        rating: calculateAverageRating(product.id, allReviews) || product.rating,
        reviewCount: getReviewCount(product.id, allReviews) || product.reviewCount
      }));
      
      setAllProducts(updatedDefaultProducts);
      setFilteredProducts(updatedDefaultProducts);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string): string => {
    const iconMap: CategoryIconMap = {
      '文章作成': '🧠',
      'データ分析': '📊',
      'デザイン': '🎨',
      'チャットボット': '💬',
      '教育': '📚',
      'SEO': '🔍',
      'テキスト処理': '📝',
      '画像処理': '🖼️',
      '機械学習': '🤖',
      'API連携': '🔗',
      'その他': '⚡'
    };
    return iconMap[category as keyof CategoryIconMap] || '🤖';
  };

  // 検索・フィルター処理
  const handleSearch = (filters: FilterState): void => {
    const filtered = filterProducts(allProducts, filters);
    setFilteredProducts(filtered);
  };

  const addToCart = (product: Product): void => {
    const isInCart = cart.some((item: Product) => item.id === product.id);
    if (isInCart) {
      alert('既にカートに追加されています');
      return;
    }
    setCart(prevCart => [...prevCart, product]);
    alert(`${product.title}をカートに追加しました！`);
  };

  const removeFromCart = (productId: number | string): void => {
    setCart(prevCart => prevCart.filter((item: Product) => item.id !== productId));
  };

  const handleCheckout = async (): Promise<void> => {
    if (!session) {
      alert('購入するにはログインが必要です');
      return;
    }

    if (cart.length === 0) {
      alert('カートが空です');
      return;
    }

    setCheckoutLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      });

      if (!response.ok) throw new Error('決済処理でエラーが発生しました');

      const { url }: { url: string } = await response.json();
      if (url) {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('決済処理でエラーが発生しました。もう一度お試しください。');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const isAdmin = session?.user?.name === 'admin' || session?.user?.name === '管理者';
  const cartTotal = cart.reduce((sum: number, item: Product) => sum + item.price, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl">Supabaseからデータを読み込み中...</div>
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
            🤖 AI Marketplace
          </Link>
          
          {/* ナビゲーション */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">
              ホーム
            </Link>
            <Link href="/sell" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">
              出品する
            </Link>
            {session && (
              <Link href="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">
                ダッシュボード
              </Link>
            )}
            {/* 管理者リンク */}
            {session && isAdmin && (
              <Link href="/admin" className="hover:bg-red-700 px-3 py-2 rounded transition-colors bg-red-500">
                管理画面
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {/* カート */}
            <div className="relative">
              <button
                onClick={() => setShowCart(!showCart)}
                className="flex items-center gap-2 hover:text-blue-200 transition-colors"
              >
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
            
            {/* 認証状態 */}
            {status === 'loading' ? (
              <div className="text-sm">読み込み中...</div>
            ) : session ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                  <User size={20} />
                </div>
                <span className="hidden md:block">{session.user?.name}</span>
                {isAdmin && (
                  <span className="bg-red-500 px-2 py-1 rounded text-xs">管理者</span>
                )}
                <button 
                  onClick={() => signOut()}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                >
                  <LogOut size={16} />
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
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold">合計:</span>
                    <span className="text-lg font-bold text-blue-600">¥{cartTotal.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {checkoutLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        処理中...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        購入手続きへ
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* オーバーレイ */}
      {showCart && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setShowCart(false)}
        />
      )}

      {/* メイン画面 */}
      <main className="max-w-7xl mx-auto p-6">
        {/* ヒーローセクション */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🚀 AIツールを売買しよう
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            便利なAIツールを見つけて購入、または自分のツールを販売
          </p>
        </div>

        {/* 検索・フィルターセクション */}
        <SearchFilter
          onSearch={handleSearch}
          totalProducts={allProducts.length}
          filteredCount={filteredProducts.length}
        />

        {/* 商品一覧 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              AIツール ({filteredProducts.length}件)
            </h2>
            {/* Supabase接続状態表示 */}
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              📡 Supabase連携中
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">検索結果が見つかりません</h3>
              <p className="text-gray-600">
                検索条件を変更して再度お試しください
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product: Product) => {
                const isInCart = cart.some((item: Product) => item.id === product.id);
                return (
                  <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                    <div className="text-4xl mb-4 text-center bg-gray-50 rounded-lg py-8">
                      {product.icon}
                    </div>
                    
                    <div className="space-y-3">
                      {/* 商品タイトル（リンク付き） */}
                      <Link href={`/tools/${product.id}`}>
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                        {product.tags && product.tags.slice(0, 2).map((tag: string, index: number) => (
                          <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {product.rating && product.rating > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400">
                            {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5-Math.floor(product.rating))}
                          </span>
                          <span className="text-sm text-gray-600">
                            {product.rating.toFixed(1)} ({product.reviewCount})
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-3 border-t gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          ¥{product.price.toLocaleString()}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addToCart(product)}
                            disabled={isInCart}
                            className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                              isInCart 
                                ? 'bg-green-500 text-white cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
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
      </main>
    </div>
  );
}