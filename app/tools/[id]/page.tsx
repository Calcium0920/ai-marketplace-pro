'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Product, Review } from '@/lib/types';
import ReviewSection from '@/components/ReviewSection';

export default function ToolDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [tool, setTool] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{id: string; name: string; email: string} | null>(null);
  const [inCart, setInCart] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // デフォルトツールデータ
  const defaultTools: Product[] = [
    {
      id: 1,
      title: 'スマート文章校正AI',
      description: '日本語の文章を自動で校正・改善してくれるAIツール。ビジネス文書からブログ記事まで幅広く対応し、文法チェック、表現の改善、語彙の提案などを行います。',
      price: 2980,
      category: '文章作成',
      icon: '🧠',
      rating: 5,
      reviewCount: 127,
      tags: ['文章作成', '校正', 'ビジネス', 'AI', '日本語'],
      createdAt: '2024-01-15',
      creator: 'AI Text Lab',
      endpointUrl: 'https://api.textlab.com/v1/correct'
    },
    {
      id: 2,
      title: 'データ分析アシスタント',
      description: 'CSVファイルをアップロードするだけで、自動でグラフ作成や統計分析を行うAIツール。データの可視化、傾向分析、予測モデルの作成まで対応します。',
      price: 4500,
      category: 'データ分析',
      icon: '📊',
      rating: 4,
      reviewCount: 89,
      tags: ['データ分析', 'グラフ', '統計', 'CSV', '自動化'],
      createdAt: '2024-01-20',
      creator: 'Data Science Pro',
      endpointUrl: 'https://api.datasci.com/v1/analyze'
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
      createdAt: '2024-01-10',
      creator: 'Design AI Studio',
      endpointUrl: 'https://api.designai.com/v1/logo'
    }
  ];

  // デフォルトレビューデータ
  const defaultReviews: Review[] = [
    {
      id: 'review_1',
      userId: 'user_1',
      userName: '田中さん',
      rating: 5,
      comment: '文章校正の精度が非常に高く、ビジネス文書の作成時間が大幅に短縮されました。特に敬語の使い方や表現の改善提案が素晴らしいです。',
      createdAt: '2024-02-01',
      toolId: '1',
      verified: true,
      helpful: 15
    },
    {
      id: 'review_2',
      userId: 'user_2',
      userName: '佐藤さん',
      rating: 4,
      comment: 'データ分析が簡単にできて重宝しています。グラフの自動生成機能が特に便利で、プレゼン資料作成が楽になりました。',
      createdAt: '2024-01-28',
      toolId: '2',
      verified: true,
      helpful: 12
    },
    {
      id: 'review_3',
      userId: 'user_3',
      userName: '鈴木さん',
      rating: 5,
      comment: 'ロゴ生成の品質が期待以上でした。複数のパターンを提案してくれるので選択肢が豊富です。',
      createdAt: '2024-01-25',
      toolId: '3',
      verified: true,
      helpful: 8
    }
  ];

  useEffect(() => {
    loadToolData();
    loadUserData();
    checkCartStatus();
    
    // URLパラメータでレビューフォームを表示
    if (searchParams.get('review') === 'true') {
      setShowReviewForm(true);
    }
  }, [params.id]);

  const loadToolData = () => {
    const toolId = params.id as string;
    const foundTool = defaultTools.find(t => t.id.toString() === toolId);
    
    if (foundTool) {
      setTool(foundTool);
      // そのツールのレビューを取得
      const toolReviews = defaultReviews.filter(r => r.toolId === toolId);
      setReviews(toolReviews);
    }
    setLoading(false);
  };

  const loadUserData = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser({
        id: parsedUser.email, // 簡易ID
        name: parsedUser.name,
        email: parsedUser.email
      });
    }
  };

  const checkCartStatus = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const toolId = params.id as string;
    setInCart(cart.some((item: Product) => item.id.toString() === toolId));
  };

  const addToCart = () => {
    if (!tool) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = [...cart, tool];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setInCart(true);
    alert(`${tool.title}をカートに追加しました！`);
  };

  const handleReviewSubmit = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setReviews(prev => [newReview, ...prev]);
    
    // ツールの評価を更新
    if (tool) {
      const newReviewCount = tool.reviewCount + 1;
      const newRating = ((tool.rating * tool.reviewCount) + reviewData.rating) / newReviewCount;
      setTool(prev => prev ? {
        ...prev,
        rating: Math.round(newRating * 10) / 10,
        reviewCount: newReviewCount
      } : null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <div className="text-xl">ツール情報を読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <Link href="/" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">
              ← ホームに戻る
            </Link>
            <h1 className="text-xl font-bold">🤖 AI Marketplace Pro</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">❓</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">ツールが見つかりません</h2>
            <p className="text-gray-600 mb-6">指定されたツールは存在しないか、削除されている可能性があります。</p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ツール一覧に戻る
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
            ← ツール一覧に戻る
          </Link>
          <h1 className="text-xl font-bold">🤖 AI Marketplace Pro</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            {/* ツール基本情報 */}
            <div className="bg-white rounded-lg shadow-lg p-6 fade-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl">{tool.icon}</div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{tool.title}</h1>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">
                        {'★'.repeat(Math.floor(tool.rating))}{'☆'.repeat(5-Math.floor(tool.rating))}
                      </span>
                      <span className="text-sm text-gray-600">
                        {tool.rating.toFixed(1)} ({tool.reviewCount}件のレビュー)
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      {tool.category}
                    </span>
                    {tool.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <h3 className="text-lg font-bold text-gray-800 mb-3">📝 詳細説明</h3>
                <p className="text-gray-700 leading-relaxed mb-4">{tool.description}</p>
                
                <h3 className="text-lg font-bold text-gray-800 mb-3">✨ 主な機能</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• 高精度なAI処理エンジン</li>
                  <li>• 直感的なユーザーインターフェース</li>
                  <li>• リアルタイム処理</li>
                  <li>• API連携対応</li>
                  <li>• 24時間サポート</li>
                </ul>
                
                <h3 className="text-lg font-bold text-gray-800 mb-3 mt-6">🔧 技術仕様</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">対応形式:</span>
                      <span className="ml-2">JSON, CSV, TXT</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">処理速度:</span>
                      <span className="ml-2">1秒未満</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">言語:</span>
                      <span className="ml-2">日本語, 英語</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">API制限:</span>
                      <span className="ml-2">1000回/日</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 作成者情報 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">👤 作成者情報</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">
                    {tool.creator?.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-gray-800">{tool.creator}</div>
                  <div className="text-sm text-gray-600">認証済み開発者</div>
                </div>
              </div>
            </div>

            {/* レビューセクション */}
            <ReviewSection
              toolId={tool.id.toString()}
              reviews={reviews}
              onReviewSubmit={handleReviewSubmit}
              userCanReview={!!user && !showReviewForm}
              currentUser={user}
            />
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 購入カード */}
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ¥{tool.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">税込価格</div>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={addToCart}
                  disabled={inCart}
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-200 btn-hover-lift ${
                    inCart
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {inCart ? '✓ カートに追加済み' : '🛒 カートに追加'}
                </button>
                
                <Link
                  href="/success"
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-center block btn-hover-lift"
                >
                  💳 今すぐ購入
                </Link>
              </div>

              <div className="border-t pt-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>商品価格:</span>
                    <span>¥{tool.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>手数料:</span>
                    <span>¥0</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>合計:</span>
                    <span>¥{tool.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 特典情報 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-bold text-green-800 mb-2">🎁 購入特典</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• 永久ライセンス</li>
                <li>• 無料アップデート</li>
                <li>• 技術サポート</li>
                <li>• 使用方法動画</li>
                <li>• サンプルデータ</li>
              </ul>
            </div>

            {/* 関連ツール */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="font-bold text-gray-800 mb-4">🔗 関連ツール</h4>
              <div className="space-y-3">
                {defaultTools.filter(t => t.id !== tool.id && t.category === tool.category).map(relatedTool => (
                  <Link
                    key={relatedTool.id}
                    href={`/tools/${relatedTool.id}`}
                    className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{relatedTool.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm line-clamp-1">
                          {relatedTool.title}
                        </div>
                        <div className="text-blue-600 font-bold text-sm">
                          ¥{relatedTool.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}