'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';

export default function SellPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '文章作成',
    tags: [] as string[],
    endpointUrl: '',
    creator: ''
  });
  
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = [
    '文章作成',
    'データ分析', 
    'デザイン',
    'チャットボット',
    '教育',
    'SEO',
    'テキスト処理',
    '画像処理',
    '機械学習',
    'API連携'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ローカルストレージに保存
      const existingTools = JSON.parse(localStorage.getItem('submittedTools') || '[]');
      const newTool = {
        ...formData,
        id: Date.now(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        rating: 0,
        reviewCount: 0,
        icon: getRandomIcon()
      };
      
      existingTools.push(newTool);
      localStorage.setItem('submittedTools', JSON.stringify(existingTools));
      
      setSubmitSuccess(true);
      setFormData({
        title: '',
        description: '',
        price: 0,
        category: '文章作成',
        tags: [],
        endpointUrl: '',
        creator: ''
      });
      
    } catch (error) {
      console.error('Error submitting tool:', error);
      alert('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRandomIcon = () => {
    const icons = ['🤖', '🧠', '📊', '🎨', '💬', '📚', '🔍', '⚡', '🛠️', '💡'];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  if (submitSuccess) {
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
          <div className="bg-white rounded-lg shadow-lg p-8 text-center fade-in">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              出品申請完了！
            </h2>
            <p className="text-gray-600 mb-6">
              AIツールの出品申請が正常に送信されました。<br />
              審査完了後、マーケットプレイスに掲載されます。
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-blue-800 mb-2">📋 次のステップ</h3>
              <ul className="text-blue-700 text-sm text-left space-y-1">
                <li>• 審査には通常1-3営業日かかります</li>
                <li>• 承認されると自動的にメールで通知されます</li>
                <li>• ダッシュボードで申請状況を確認できます</li>
              </ul>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setSubmitSuccess(false)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors btn-hover-lift"
              >
                別のツールを出品
              </button>
              <Link
                href="/"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors btn-hover-lift"
              >
                ホームに戻る
              </Link>
              <Link
                href="/dashboard"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors btn-hover-lift"
              >
                ダッシュボード
              </Link>
            </div>
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
          <h1 className="text-xl font-bold">🤖 AI Marketplace Pro</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 fade-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              🚀 AIツールを出品する
            </h2>
            <p className="text-gray-600">
              あなたのAIツールをマーケットプレイスで販売しましょう
            </p>
          </div>

          {/* 出品のメリット */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 p-4 bg-blue-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-bold text-blue-800">収益化</h3>
              <p className="text-sm text-blue-600">あなたのスキルを収益に</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-bold text-blue-800">ユーザーベース</h3>
              <p className="text-sm text-blue-600">多くのユーザーにリーチ</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-bold text-blue-800">成長支援</h3>
              <p className="text-sm text-blue-600">マーケティング支援</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ツール名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ツール名 *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent custom-focus"
                placeholder="例: スマート文章校正AI"
              />
            </div>

            {/* 説明 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ツールの説明 *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent custom-focus"
                placeholder="ツールの機能や特徴を詳しく説明してください（最低100文字以上推奨）"
              />
              <div className="text-sm text-gray-500 mt-1">
                現在の文字数: {formData.description.length}
              </div>
            </div>

            {/* 価格 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                価格 (円) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="100"
                max="100000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent custom-focus"
                placeholder="例: 2980"
              />
              <div className="text-sm text-gray-500 mt-1">
                推奨価格帯: ¥500 - ¥10,000
              </div>
            </div>

            {/* カテゴリ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリ *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent custom-focus"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* APIエンドポイント */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                APIエンドポイントURL
              </label>
              <input
                type="url"
                name="endpointUrl"
                value={formData.endpointUrl}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent custom-focus"
                placeholder="https://api.example.com/your-tool"
              />
              <div className="text-sm text-gray-500 mt-1">
                オプション: APIとして提供する場合は入力してください
              </div>
            </div>

            {/* 作成者名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                作成者名 *
              </label>
              <input
                type="text"
                name="creator"
                value={formData.creator}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent custom-focus"
                placeholder="例: 田中太郎"
              />
            </div>

            {/* タグ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タグ
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent custom-focus"
                  placeholder="タグを入力（例: AI, 自動化, 効率化）"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  追加
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                検索されやすくするため、関連するキーワードを追加してください
              </div>
            </div>

            {/* 利用規約 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">📋 出品規約</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 著作権を侵害するコンテンツは禁止です</li>
                <li>• 虚偽の情報や誇大広告は禁止です</li>
                <li>• 売上の10%が手数料として差し引かれます</li>
                <li>• 購入者サポートの義務があります</li>
              </ul>
            </div>

            {/* 送信ボタン */}
            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.description || !formData.creator}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed btn-hover-lift"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="spinner"></div>
                    送信中...
                  </span>
                ) : (
                  '🚀 出品申請を送信'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}