// components/products/ProductDetail.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  Share, 
  Heart, 
  Flag, 
  User, 
  Calendar,
  Tag,
  ExternalLink,
  MessageCircle,
  ThumbsUp
} from 'lucide-react';
import Link from 'next/link';
import { Product, Review } from '@/lib/types';

interface ProductDetailProps {
  productId: string;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadProduct();
    loadReviews();
    loadUser();
  }, [productId]);

  const loadProduct = async () => {
    // 実際のAPIコール
    try {
      // サンプルデータ
      const sampleProduct: Product = {
        id: parseInt(productId),
        title: 'スマート文章校正AI Pro',
        description: '日本語の文章を自動で校正・改善してくれる高性能AIツール。ビジネス文書からブログ記事まで幅広く対応し、自然で読みやすい文章に変換します。\n\n【主な機能】\n・文法・表現の自動校正\n・より自然な表現への提案\n・文章の読みやすさ分析\n・ビジネス文書対応\n・リアルタイムプレビュー',
        price: 2980,
        category: '文章作成',
        icon: '🧠',
        rating: 4.8,
        reviewCount: 234,
        tags: ['文章作成', '校正', 'ビジネス', 'AI', '日本語', '自動化'],
        createdAt: '2024-01-15',
        status: 'approved',
        seller: {
          name: '田中 AI研究所',
          avatar_url: '👨‍💻'
        }
      };
      setProduct(sampleProduct);
    } catch (error) {
      console.error('商品読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    // サンプルレビューデータ
    const sampleReviews: Review[] = [
      {
        id: 1,
        product_id: parseInt(productId),
        user_id: '1',
        rating: 5,
        comment: '文章の質が劇的に向上しました。特にビジネスメールの作成時間が大幅に短縮できて、とても満足しています。UIも直感的で使いやすいです。',
        created_at: '2024-02-01',
        user: { name: '山田太郎', avatar_url: '👨‍💼' }
      },
      {
        id: 2,
        product_id: parseInt(productId),
        user_id: '2',
        rating: 4,
        comment: '校正機能は優秀ですが、たまに意図しない修正提案があります。ただし、全体的には非常に有用なツールだと思います。',
        created_at: '2024-01-28',
        user: { name: '佐藤花子', avatar_url: '👩‍💻' }
      },
      {
        id: 3,
        product_id: parseInt(productId),
        user_id: '3',
        rating: 5,
        comment: 'ブログ記事の執筆に使用しています。文章の流れが自然になり、読者からの反応も良くなりました。価格以上の価値があります。',
        created_at: '2024-01-25',
        user: { name: '鈴木次郎', avatar_url: '👨‍🎨' }
      }
    ];
    setReviews(sampleReviews);
  };

  const loadUser = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const isInCart = cart.some((item: Product) => item.id === product.id);
    
    if (isInCart) {
      alert('既にカートに追加されています');
      return;
    }
    
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('カートに追加しました！');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('レビューを投稿するにはログインが必要です');
      return;
    }

    const review: Review = {
      id: Date.now(),
      product_id: product!.id,
      user_id: user.id,
      rating: newReview.rating,
      comment: newReview.comment,
      created_at: new Date().toISOString(),
      user: { name: user.name, avatar_url: '👤' }
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    setShowReviewForm(false);
    alert('レビューを投稿しました！');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">商品が見つかりません</h1>
          <Link href="/" className="text-blue-600 hover:underline">ホームに戻る</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  ホーム
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <span className="text-gray-500">{product.category}</span>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium truncate">{product.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Product Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm p-8 mb-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-6xl p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                      {product.icon}
                    </div>
                    <div>
                      <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {product.category}
                      </span>
                      <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-2">
                        {product.title}
                      </h1>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-gray-500">({product.reviewCount}件のレビュー)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                    <Heart size={20} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                    <Share size={20} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-yellow-500 transition-colors">
                    <Flag size={20} />
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    <Tag size={14} className="inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-bold text-gray-900 mb-3">商品説明</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>

              {/* Seller Info */}
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{product.seller?.avatar_url}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">出品者</h4>
                    <p className="text-blue-600">{product.seller?.name}</p>
                  </div>
                  <div className="ml-auto">
                    <button className="text-blue-600 hover:text-blue-700 text-sm">
                      <ExternalLink size={16} className="inline mr-1" />
                      プロフィール
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  <MessageCircle className="inline mr-2" size={24} />
                  レビュー ({reviews.length})
                </h2>
                {user && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    レビューを書く
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-gray-50 rounded-lg p-6 mb-6"
                >
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        評価
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setNewReview({...newReview, rating})}
                            className="text-2xl text-yellow-400 hover:scale-110 transition-transform"
                          >
                            <Star
                              fill={rating <= newReview.rating ? 'currentColor' : 'none'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        コメント
                      </label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="このツールの使用感をお聞かせください..."
                        required
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        投稿する
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        キャンセル
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-200 pb-6 last:border-b-0"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">{review.user.avatar_url}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                            <div className="flex items-center gap-2">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    fill={i < review.rating ? 'currentColor' : 'none'}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString('ja-JP')}
                              </span>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-blue-500 transition-colors">
                            <ThumbsUp size={16} />
                          </button>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm p-6 sticky top-8"
            >
              {/* Price */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  ¥{product.price.toLocaleString()}
                </div>
                <div className="text-gray-500">買い切り価格</div>
              </div>

              {/* Purchase Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 mb-4"
              >
                <ShoppingCart size={20} />
                カートに追加
              </button>

              {/* Quick Info */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">カテゴリ</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">公開日</span>
                  <span className="font-medium">
                    {new Date(product.createdAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">レビュー</span>
                  <span className="font-medium">{product.reviewCount}件</span>
                </div>
              </div>

              {/* Features */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-gray-900 mb-3">特徴</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    即時利用開始
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    無期限ライセンス
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    サポート付き
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    アップデート無料
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

