'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Star, ThumbsUp, Flag, User } from 'lucide-react'
import Link from 'next/link'

interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
  verified: boolean
  helpful: number
  toolId: string
}

interface Purchase {
  id: string
  items: PurchaseItem[]
  status?: string
  userEmail?: string
}

interface PurchaseItem {
  id: string | number
  title: string
  price: number
}

interface ReviewSectionProps {
  toolId: string | number
  toolTitle: string
}

export default function ReviewSection({ toolId, toolTitle }: ReviewSectionProps) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)

  useEffect(() => {
    loadReviews()
  }, [toolId])

  const loadReviews = (): void => {
    try {
      const allReviews: Review[] = JSON.parse(localStorage.getItem('reviews') || '[]')
      const toolReviews = allReviews.filter((review: Review) => review.toolId === toolId.toString())
      setReviews(toolReviews)
    } catch (error) {
      console.error('レビュー読み込みエラー:', error)
    } finally {
      setLoading(false)
    }
  }

  // 改善されたcanWriteReview関数
  const canWriteReview = (): boolean => {
    if (!session?.user?.email) {
      console.log('未ログイン')
      return false
    }
    
    // 購入履歴をチェック
    const purchases: Purchase[] = JSON.parse(localStorage.getItem('purchases') || '[]')
    console.log('全購入履歴:', purchases)
    
    const hasPurchased = purchases.some((purchase: Purchase) => {
      if (!purchase.items) return false
      
      return purchase.items.some((item: PurchaseItem) => {
        const match = item.id.toString() === toolId.toString()
        console.log(`アイテム ${item.id} vs ツール ${toolId}: ${match}`)
        return match
      })
    })
    
    console.log('購入済み:', hasPurchased)
    
    if (!hasPurchased) return false

    // 既にレビューを書いているかチェック
    const hasReviewed = reviews.some((review: Review) => {
      const match = review.userId === session.user?.email
      console.log(`レビューチェック: ${review.userId} vs ${session.user?.email}: ${match}`)
      return match
    })
    
    console.log('レビュー済み:', hasReviewed)
   
   return !hasReviewed
 }

 const submitReview = async (): Promise<void> => {
   if (!session || newReview.rating === 0 || !newReview.comment.trim()) {
     alert('評価とコメントを入力してください')
     return
   }

   setSubmitting(true)

   try {
     const review: Review = {
       id: Date.now().toString(),
       userId: session.user?.email || '',
       userName: session.user?.name || '匿名ユーザー',
       rating: newReview.rating,
       comment: newReview.comment.trim(),
       createdAt: new Date().toISOString(),
       verified: true,
       helpful: 0,
       toolId: toolId.toString()
     }

     const allReviews: Review[] = JSON.parse(localStorage.getItem('reviews') || '[]')
     allReviews.push(review)
     localStorage.setItem('reviews', JSON.stringify(allReviews))

     setReviews([review, ...reviews])
     setNewReview({ rating: 0, comment: '' })
     setShowReviewForm(false)
     alert('レビューを投稿しました！')
   } catch (error) {
     console.error('レビュー投稿エラー:', error)
     alert('レビューの投稿に失敗しました')
   } finally {
     setSubmitting(false)
   }
 }

 const markHelpful = (reviewId: string): void => {
   try {
     const allReviews: Review[] = JSON.parse(localStorage.getItem('reviews') || '[]')
     const updatedReviews = allReviews.map((review: Review) => 
       review.id === reviewId 
         ? { ...review, helpful: (review.helpful || 0) + 1 }
         : review
     )
     localStorage.setItem('reviews', JSON.stringify(updatedReviews))
     loadReviews()
   } catch (error) {
     console.error('参考になるマークエラー:', error)
   }
 }

 // より明確な状態表示
 const renderReviewStatus = () => {
   if (!session) {
     return (
       <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
         <div className="flex">
           <div className="flex-shrink-0">
             <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
             </svg>
           </div>
           <div className="ml-3">
             <p className="text-sm text-blue-700">
               レビューを投稿するには
               <Link href="/login" className="font-medium underline hover:text-blue-600 ml-1">
                 ログイン
               </Link>
               が必要です
             </p>
           </div>
         </div>
       </div>
     )
   }

   const purchases: Purchase[] = JSON.parse(localStorage.getItem('purchases') || '[]')
   const hasPurchased = purchases.some((purchase: Purchase) => 
     purchase.items?.some((item: PurchaseItem) => item.id.toString() === toolId.toString())
   )

   if (!hasPurchased) {
     return (
       <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
         <div className="flex">
           <div className="flex-shrink-0">
             <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
             </svg>
           </div>
           <div className="ml-3">
             <p className="text-sm text-yellow-700">
               レビューを投稿するには、まずこのツールを購入してください
             </p>
             <div className="mt-2">
               <Link
                 href={`/tools/${toolId}`}
                 className="bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700 transition-colors inline-block"
               >
                 商品を購入する
               </Link>
             </div>
           </div>
         </div>
       </div>
     )
   }

   const hasReviewed = reviews.some((review: Review) => review.userId === session.user?.email)
   
   if (hasReviewed) {
     return (
       <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
         <div className="flex">
           <div className="flex-shrink-0">
             <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
             </svg>
           </div>
           <div className="ml-3">
             <p className="text-sm text-green-700">
               このツールのレビューは投稿済みです
             </p>
           </div>
         </div>
       </div>
     )
   }

   return null
 }

 const averageRating = reviews.length > 0 
   ? reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length
   : 0

 const ratingDistribution = [5, 4, 3, 2, 1].map((rating: number) => ({
   rating,
   count: reviews.filter((review: Review) => review.rating === rating).length,
   percentage: reviews.length > 0 
     ? (reviews.filter((review: Review) => review.rating === rating).length / reviews.length) * 100
     : 0
 }))

 if (loading) {
   return (
     <div className="bg-white rounded-lg shadow-md p-6">
       <div className="animate-pulse">
         <div className="h-6 bg-gray-200 rounded mb-4"></div>
         <div className="space-y-3">
           <div className="h-4 bg-gray-200 rounded"></div>
           <div className="h-4 bg-gray-200 rounded"></div>
         </div>
       </div>
     </div>
   )
 }

 return (
   <div className="bg-white rounded-lg shadow-md p-6">
     <h3 className="text-2xl font-bold text-gray-800 mb-6">レビュー・評価</h3>

     {/* 開発環境でのデバッグ情報表示 */}
     {process.env.NODE_ENV === 'development' && (
       <div className="bg-gray-100 p-4 rounded mb-4 text-xs">
         <h4 className="font-bold mb-2">🔧 デバッグ情報</h4>
         <div>セッション: {session ? '✅ ログイン済み' : '❌ 未ログイン'}</div>
         <div>ユーザー: {session?.user?.email || 'N/A'}</div>
         <div>ツールID: {toolId}</div>
         <div>レビュー投稿可能: {canWriteReview() ? '✅ 投稿可能' : '❌ 投稿不可'}</div>
         <details className="mt-2">
           <summary className="cursor-pointer font-medium">購入履歴詳細</summary>
           <pre className="mt-2 bg-white p-2 rounded text-xs overflow-auto max-h-32">
             {JSON.stringify(JSON.parse(localStorage.getItem('purchases') || '[]'), null, 2)}
           </pre>
         </details>
         <details className="mt-2">
           <summary className="cursor-pointer font-medium">レビュー履歴詳細</summary>
           <pre className="mt-2 bg-white p-2 rounded text-xs overflow-auto max-h-32">
             {JSON.stringify(reviews, null, 2)}
           </pre>
         </details>
       </div>
     )}

     {/* 評価サマリー */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
       {/* 平均評価 */}
       <div className="text-center">
         <div className="text-4xl font-bold text-yellow-600 mb-2">
           {averageRating.toFixed(1)}
         </div>
         <div className="flex justify-center mb-2">
           {[1, 2, 3, 4, 5].map((star: number) => (
             <Star
               key={star}
               className={`w-6 h-6 ${
                 star <= Math.round(averageRating)
                   ? 'text-yellow-400 fill-current'
                   : 'text-gray-300'
               }`}
             />
           ))}
         </div>
         <div className="text-gray-600">{reviews.length}件のレビュー</div>
       </div>

       {/* 評価分布 */}
       <div className="space-y-2">
         {ratingDistribution.map(({ rating, count, percentage }) => (
           <div key={rating} className="flex items-center gap-3">
             <span className="text-sm w-8">{rating}★</span>
             <div className="flex-1 bg-gray-200 rounded-full h-2">
               <div 
                 className="bg-yellow-400 h-2 rounded-full"
                 style={{ width: `${percentage}%` }}
               />
             </div>
             <span className="text-sm w-8 text-gray-600">{count}</span>
           </div>
         ))}
       </div>
     </div>

     {/* レビュー状態表示 */}
     {renderReviewStatus()}

     {/* レビュー投稿フォーム */}
     {canWriteReview() && (
       <div className="mb-6">
         {!showReviewForm ? (
           <button
             onClick={() => setShowReviewForm(true)}
             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
           >
             レビューを書く
           </button>
         ) : (
           <div className="bg-gray-50 rounded-lg p-6">
             <h4 className="text-lg font-bold mb-4">「{toolTitle}」のレビューを投稿</h4>
             
             {/* 評価選択 */}
             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 評価 *
               </label>
               <div className="flex gap-1">
                 {[1, 2, 3, 4, 5].map((star: number) => (
                   <button
                     key={star}
                     onClick={() => setNewReview({ ...newReview, rating: star })}
                     className="p-1"
                   >
                     <Star
                       className={`w-8 h-8 ${
                         star <= newReview.rating
                           ? 'text-yellow-400 fill-current'
                           : 'text-gray-300 hover:text-yellow-200'
                       }`}
                     />
                   </button>
                 ))}
               </div>
             </div>

             {/* コメント入力 */}
             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 コメント *
               </label>
               <textarea
                 rows={4}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="このツールの良い点や改善点などを教えてください"
                 value={newReview.comment}
                 onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
               />
             </div>

             {/* 投稿ボタン */}
             <div className="flex gap-3">
               <button
                 onClick={submitReview}
                 disabled={submitting || newReview.rating === 0 || !newReview.comment.trim()}
                 className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {submitting ? '投稿中...' : 'レビューを投稿'}
               </button>
               <button
                 onClick={() => {
                   setShowReviewForm(false)
                   setNewReview({ rating: 0, comment: '' })
                 }}
                 className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
               >
                 キャンセル
               </button>
             </div>
           </div>
         )}
       </div>
     )}

     {/* レビュー一覧 */}
     <div className="space-y-6">
       {reviews.length === 0 ? (
         <div className="text-center py-8 text-gray-600">
           まだレビューがありません。最初のレビューを投稿してみませんか？
         </div>
       ) : (
         reviews.map((review: Review) => (
           <div key={review.id} className="border-b border-gray-200 pb-6">
             <div className="flex items-start gap-4">
               <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                 <User className="w-5 h-5 text-blue-600" />
               </div>
               
               <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                   <span className="font-medium text-gray-800">{review.userName}</span>
                   {review.verified && (
                     <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                       購入済み
                     </span>
                   )}
                   <div className="flex">
                     {[1, 2, 3, 4, 5].map((star: number) => (
                       <Star
                         key={star}
                         className={`w-4 h-4 ${
                           star <= review.rating
                             ? 'text-yellow-400 fill-current'
                             : 'text-gray-300'
                         }`}
                       />
                     ))}
                   </div>
                   <span className="text-sm text-gray-500">
                     {new Date(review.createdAt).toLocaleDateString()}
                   </span>
                 </div>
                 
                 <p className="text-gray-700 mb-3">{review.comment}</p>
                 
                 <div className="flex items-center gap-4">
                   <button
                     onClick={() => markHelpful(review.id)}
                     className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                   >
                     <ThumbsUp className="w-4 h-4" />
                     参考になった ({review.helpful || 0})
                   </button>
                   <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors">
                     <Flag className="w-4 h-4" />
                     報告
                   </button>
                 </div>
               </div>
             </div>
           </div>
         ))
       )}
     </div>
   </div>
 )
}