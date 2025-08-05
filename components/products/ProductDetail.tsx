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

// components/products/ProductForm.tsx (出品フォーム)
'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Tag, 
  DollarSign, 
  FileText, 
  Image, 
  Link as LinkIcon,
  Save,
  Eye
} from 'lucide-react';
import { ProductFormData } from '@/lib/types';

export default function ProductForm() {
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    category: '',
    icon: '🤖',
    tags: [],
    demo_url: '',
    api_endpoint: ''
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const categories = [
    '文章作成',
    'データ分析', 
    'デザイン',
    'チャットボット',
    '教育',
    'SEO',
    'マーケティング',
    'ビジネス'
  ];

  const icons = ['🤖', '🧠', '📊', '🎨', '💬', '📚', '🔍', '📱', '💼', '⚡', '🚀', '💡'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 出品データをローカルストレージに保存（実際はAPIに送信）
      const submittedTools = JSON.parse(localStorage.getItem('submittedTools') || '[]');
      const newTool = {
        ...formData,
        id: Date.now(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        rating: 0,
        reviewCount: 0
      };
      
      submittedTools.push(newTool);
      localStorage.setItem('submittedTools', JSON.stringify(submittedTools));
      
      alert('出品申請を送信しました！審査完了後に公開されます。');
      
      // フォームリセット
      setFormData({
        title: '',
        description: '',
        price: 0,
        category: '',
        icon: '🤖',
        tags: [],
        demo_url: '',
        api_endpoint: ''
      });
      
    } catch (error) {
      console.error('出品エラー:', error);
      alert('出品に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag]
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 AIツールを出品する
          </h1>
          <p className="text-gray-600">
            あなたの開発したAIツールを世界中のユーザーに届けましょう
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline mr-2" size={16} />
                ツール名 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: スマート文章校正AI Pro"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                説明文 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={6}
                placeholder="ツールの機能、特徴、使用方法などを詳しく説明してください..."
                required
              />
            </div>

            {/* Category and Icon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カテゴリ *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">カテゴリを選択</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image className="inline mr-2" size={16} />
                  アイコン
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {icons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({...formData, icon})}
                      className={`text-2xl p-2 rounded-lg border transition-colors ${
                        formData.icon === icon 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline mr-2" size={16} />
                価格 (円) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="100"
                placeholder="2980"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline mr-2" size={16} />
                タグ
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="タグを入力"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  追加
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Demo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <LinkIcon className="inline mr-2" size={16} />
                デモURL (任意)
              </label>
              <input
                type="url"
                value={formData.demo_url}
                onChange={(e) => setFormData({...formData, demo_url: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://your-demo-site.com"
              />
            </div>

            {/* API Endpoint */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                APIエンドポイント (任意)
              </label>
              <input
                type="url"
                value={formData.api_endpoint}
                onChange={(e) => setFormData({...formData, api_endpoint: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://api.your-tool.com/v1"
              />
            </div>

            {/* Preview Toggle */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Eye size={20} />
                {preview ? 'フォームに戻る' : 'プレビュー表示'}
              </button>
            </div>

            {/* Preview */}
            {preview && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">プレビュー</h3>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                      {formData.icon}
                    </div>
                    <div className="flex-1">
                      <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                        {formData.category || 'カテゴリ未設定'}
                      </span>
                      <h4 className="text-xl font-bold text-gray-900 mt-2 mb-1">
                        {formData.title || 'ツール名を入力してください'}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {formData.description || '説明文を入力してください'}
                      </p>
                    </div>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.tags.map((tag) => (
                        <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-blue-600">
                      ¥{formData.price.toLocaleString()}
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                      カートに追加
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Save size={20} />
                    出品申請を送信
                  </>
                )}
              </button>
              
              <button
                type="button"
                className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                下書き保存
              </button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">📋 出品の流れ</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. フォームに必要情報を入力</li>
              <li>2. 出品申請を送信</li>
              <li>3. 管理者による審査（通常1-3営業日）</li>
              <li>4. 承認後、マーケットプレイスに公開</li>
              <li>5. 売上発生時に手数料15%を控除して振込</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}