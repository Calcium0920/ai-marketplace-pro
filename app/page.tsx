export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🤖 AI Marketplace Pro
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            プロフェッショナルなAIツール販売プラットフォーム
          </p>
          
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            {/* ツール1 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-2">文章校正AI</h3>
              <p className="text-gray-600 mb-4">自動で文章を校正・改善</p>
              <div className="text-2xl font-bold text-blue-600">¥2,980</div>
            </div>
            
            {/* ツール2 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">データ分析AI</h3>
              <p className="text-gray-600 mb-4">CSV自動分析＆グラフ作成</p>
              <div className="text-2xl font-bold text-blue-600">¥4,500</div>
            </div>
            
            {/* ツール3 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">ロゴ生成AI</h3>
              <p className="text-gray-600 mb-4">プロ品質ロゴを自動生成</p>
              <div className="text-2xl font-bold text-blue-600">¥1,980</div>
            </div>
          </div>
          
          <div className="mt-12 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg inline-block">
            <strong>🎉 デプロイ成功！</strong>
            <br />
            AI Marketplace Pro が完全に動作しています
          </div>
        </div>
      </div>
    </div>
  )
}