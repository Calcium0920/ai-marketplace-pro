'use client'
import React, { useState, useEffect } from 'react';
import { Review } from '@/lib/types';

interface ReviewSectionProps {
  toolId: string;
  reviews: Review[];
  onReviewSubmit?: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  userCanReview?: boolean;
  currentUser?: { id: string; name: string } | null;
}

export default function ReviewSection({ 
  toolId, 
  reviews, 
  onReviewSubmit, 
  userCanReview = false,
  currentUser 
}: ReviewSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 平均評価計算
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  // 評価分布計算
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(review => review.rating === rating).length / reviews.length) * 100 
      : 0
  }));

  const handleSubmitReview = async () => {
    if (!currentUser || !onReviewSubmit) return;

    setIsSubmitting(true);
    try {
      const reviewData = {
        userId: currentUser.id,
        userName: currentUser.name,
        toolId,
        rating: newReview.rating,
        comment: newReview.comment,
        verified: false,
        helpful: 0
      };

      await onReviewSubmit(reviewData);
      
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      alert('レビューを投稿しました！');
    } catch (error) {
      console.error('レビュー投稿エラー:', error);
      alert('レビューの投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-xl'
    };

    return (
      <div className={`flex ${sizeClasses[size]}`}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        📝 レビュー ({reviews.length}件)
      </h3>

      {/* 評価サマリー */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* 平均評価 */}
        <div className="text-center">
          <div className="text-4xl font-bold text-yellow-500 mb-2">
            {averageRating.toFixed(1)}
          </div>
          {renderStars(Math.round(averageRating), 'lg')}
          <div className="text-gray-600 mt-2">
            {reviews.length}件のレビュー
          </div>
        </div>

        {/* 評価分布 */}
        <div className="space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm w-8">★{rating}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* レビュー投稿フォーム */}
      {userCanReview && currentUser && (
        <div className="border-t pt-6 mb-6">
          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              📝 レビューを書く
            </button>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-4">レビューを投稿</h4>
              
              {/* 評価選択 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  評価
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      className={`text-2xl ${
                        star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* コメント */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  コメント
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="このAIツールについての感想をお聞かせください..."
                />
              </div>

              {/* ボタン */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || !newReview.comment.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '投稿中...' : '投稿する'}
                </button>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* レビュー一覧 */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            まだレビューがありません。最初のレビューを投稿してみませんか？
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {review.userName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {review.userName}
                      {review.verified && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          認証済み
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>
                {renderStars(review.rating, 'sm')}
              </div>
              
              <p className="text-gray-700 mb-2">{review.comment}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <button className="hover:text-gray-700 transition-colors">
                  👍 役に立った ({review.helpful})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}