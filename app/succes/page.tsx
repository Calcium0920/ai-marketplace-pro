'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [downloadLinks, setDownloadLinks] = useState<string[]>([]);
  const [user, setUser] = useState<{name: string; email: string} | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    loadUserData();
    processOrder();
  }, []);

  const loadUserData = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const processOrder = () => {
    // カートデータを取得
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const cart = JSON.parse(cartData);
      
      // 注文データを作成
      const order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        products: cart,
        total: cart.reduce((sum: number, item: any) => sum + item.price, 0),
        status: 'completed',
        createdAt: new Date().toISOString(),
        customerInfo: user || { name: 'ゲスト', email: 'guest@example.com' }
      };

      // 注文履歴に保存
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // ダウンロードリンクを生成
      const links = cart.map((item: any) => 
        `https://download.ai-marketplace-pro.com/tools/${item.id}/download`
      );
      setDownloadLinks(links);

      setOrderDetails(order);

      // カートをクリア
      localStorage.removeItem('cart');
    }
  };

  const generateInvoice = () => {
    if (!orderDetails) return;

    const invoiceData = {
      ...orderDetails,
      invoiceNumber: `INV-${orderDetails.id}`,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      tax: Math.round(orderDetails.total * 0.1),
      subtotal: orderDetails.total,
      grandTotal: Math.round(orderDetails.total * 1.1)
    };

    // 実際のプロジェクトではPDF生成ライブラリを使用
    const invoiceText = `
【領収書 / Invoice】
注文番号: ${invoiceData.invoiceNumber}
注文日: ${new Date(invoiceData.createdAt).toLocaleDateString('ja-JP')}
お客様: ${invoiceData.customerInfo.name}

【購入商品】
${invoiceData.products.map((p: any) => `- ${p.title}: ¥${p.price.toLocaleString()}`).join('\n')}

小計: ¥${invoiceData.subtotal.toLocaleString()}
税金: ¥${invoiceData.tax.toLocaleString()}
合計: ¥${invoiceData.grandTotal.toLocaleString()}

ありがとうございました。
    `;

    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceData.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <div className="text-xl">注文を処理中...</div>
        </div>
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
        {/* 成功メッセージ */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-6 fade-in">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            購入完了！
          </h2>
          <p className="text-gray-600 mb-6">
            ご購入ありがとうございます。AIツールのダウンロードが可能になりました。
          </p>
          
          {/* 注文概要 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-green-600 font-medium">注文番号</div>
                <div className="font-bold text-green-800">#{orderDetails.id.slice(-8)}</div>
              </div>
              <div>
                <div className="text-sm text-green-600 font-medium">購入日時</div>
                <div className="font-bold text-green-800">
                  {new Date(orderDetails.createdAt).toLocaleString('ja-JP')}
                </div>
              </div>
              <div>
                <div className="text-sm text-green-600 font-medium">合計金額</div>
                <div className="font-bold text-green-800 text-xl">
                  ¥{orderDetails.total.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 購入商品一覧 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📦 購入商品</h3>
          <div className="space-y-4">
            {orderDetails.products.map((product: any, index: number) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{product.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-800">{product.title}</h4>
                      <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      ¥{product.price.toLocaleString()}
                    </div>
                    <button
                      onClick={() => window.open(downloadLinks[index], '_blank')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm mt-2"
                    >
                      📥 ダウンロード
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🛠️ 次のアクション</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={generateInvoice}
              className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center btn-hover-lift"
            >
              <div className="text-2xl mb-2">📄</div>
              <div className="font-bold">領収書ダウンロード</div>
            </button>
            
            <Link
              href="/dashboard"
              className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center btn-hover-lift"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-bold">ダッシュボード</div>
            </Link>
            
            <Link
              href="/"
              className="bg-gray-600 text-white p-4 rounded-lg hover:bg-gray-700 transition-colors text-center btn-hover-lift"
            >
              <div className="text-2xl mb-2">🛍️</div>
              <div className="font-bold">もっと購入</div>
            </Link>
          </div>
        </div>

        {/* サポート情報 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🆘 サポート</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-700 mb-2">💡 ツールの使い方</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• 各ツールにはドキュメントが付属しています</li>
                <li>• APIキーが必要な場合は設定してください</li>
                <li>• チュートリアルを参考にしてください</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-700 mb-2">📞 お問い合わせ</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Email: support@ai-marketplace-pro.com</li>
                <li>• 電話: 03-1234-5678（平日 9-18時）</li>
                <li>• チャット: サイト右下のチャットボット</li>
              </ul>
            </div>
          </div>
        </div>

        {/* レビュー促進 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="text-center">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="text-lg font-bold text-yellow-800 mb-2">
              購入したツールはいかがでしたか？
            </h3>
            <p className="text-yellow-700 text-sm mb-4">
              あなたのレビューが他のユーザーの参考になります
            </p>
            <div className="flex gap-2 justify-center">
              {orderDetails.products.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/tools/${product.id}?review=true`}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                >
                  {product.title}をレビュー
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}