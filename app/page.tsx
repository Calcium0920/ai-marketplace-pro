export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🤖 AI Marketplace Pro
          </h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            プロフェッショナルなAIツール販売プラットフォーム
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            最先端のAIツールを見つけて、あなたのビジネスを加速させましょう
          </p>
        </div>
        
        {/* 商品カード */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* ツール1 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-5xl mb-6 text-center">🧠</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">文章校正AI</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              日本語の文章を自動で校正・改善。ビジネス文書からブログ記事まで幅広く対応します。
            </p>
            <div className="text-3xl font-bold text-blue-600 mb-4">¥2,980</div>
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              詳細を見る
            </button>
          </div>
          
          {/* ツール2 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-5xl mb-6 text-center">📊</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">データ分析AI</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              CSVファイルをアップロードするだけで、自動でグラフ作成や統計分析を実行します。
            </p>
            <div className="text-3xl font-bold text-blue-600 mb-4">¥4,500</div>
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              詳細を見る
            </button>
          </div>
          
          {/* ツール3 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-5xl mb-6 text-center">🎨</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">ロゴ生成AI</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              会社名やキーワードを入力するだけで、プロ品質のロゴデザインを自動生成します。
            </p>
            <div className="text-3xl font-bold text-blue-600 mb-4">¥1,980</div>
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              詳細を見る
            </button>
          </div>
        </div>
        
        {/* 成功メッセージ */}
        <div className="mt-16 text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-8 py-6 rounded-xl inline-block">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">デプロイ大成功！</h3>
            <p className="text-lg">AI Marketplace Pro が完全に稼働しています</p>
          </div>
        </div>
      </main>
    </div>
  )
}