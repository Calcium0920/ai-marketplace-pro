import Stripe from 'stripe';

// Stripe インスタンスを作成
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',  // ← 最新バージョンに変更
  typescript: true,
});

// 商品データの型定義
export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images?: string[];
}

// 決済セッション作成
export async function createCheckoutSession(
  products: StripeProduct[],
  successUrl: string,
  cancelUrl: string,
  customerEmail?: string
): Promise<Stripe.Checkout.Session> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map(product => ({
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description,
            images: product.images || [],
          },
          unit_amount: product.price * 100, // Stripeは最小通貨単位を使用
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['JP'],
      },
      payment_intent_data: {
        metadata: {
          products: JSON.stringify(products.map(p => ({ id: p.id, name: p.name }))),
        },
      },
      metadata: {
        products: JSON.stringify(products.map(p => ({ id: p.id, name: p.name }))),
      },
    });

    return session;
  } catch (error) {
    console.error('Stripe session creation error:', error);
    throw new Error('決済セッションの作成に失敗しました');
  }
}

// サブスクリプション作成
export async function createSubscription(
  customerId: string,
  priceId: string
): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  } catch (error) {
    console.error('Stripe subscription creation error:', error);
    throw new Error('サブスクリプションの作成に失敗しました');
  }
}

// 顧客作成
export async function createCustomer(
  email: string,
  name?: string
): Promise<Stripe.Customer> {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });

    return customer;
  } catch (error) {
    console.error('Stripe customer creation error:', error);
    throw new Error('顧客の作成に失敗しました');
  }
}

// 支払い確認
export async function retrievePaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Stripe payment intent retrieval error:', error);
    throw new Error('支払い情報の取得に失敗しました');
  }
}

// Webhook検証
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error('Stripe webhook verification error:', error);
    throw new Error('Webhook署名の検証に失敗しました');
  }
}

// 価格情報取得
export async function getPrice(priceId: string): Promise<Stripe.Price> {
  try {
    const price = await stripe.prices.retrieve(priceId);
    return price;
  } catch (error) {
    console.error('Stripe price retrieval error:', error);
    throw new Error('価格情報の取得に失敗しました');
  }
}

// 商品一覧取得
export async function listProducts(): Promise<Stripe.Product[]> {
  try {
    const products = await stripe.products.list({ active: true });
    return products.data;
  } catch (error) {
    console.error('Stripe products list error:', error);
    throw new Error('商品一覧の取得に失敗しました');
  }
}

// 返金処理
export async function createRefund(
  paymentIntentId: string,
  amount?: number
): Promise<Stripe.Refund> {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
    });

    return refund;
  } catch (error) {
    console.error('Stripe refund creation error:', error);
    throw new Error('返金処理に失敗しました');
  }
}

// ユーティリティ関数
export const formatCurrency = (amount: number, currency: string = 'JPY'): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatStripeAmount = (amount: number): number => {
  return Math.round(amount * 100); // 円をセント（最小単位）に変換
};

export const formatDisplayAmount = (stripeAmount: number): number => {
  return stripeAmount / 100; // セントを円に変換
};

// エラーハンドリング
export class StripeError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'StripeError';
  }
}

// 環境変数チェック
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY環境変数が設定されていません');
}

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  console.warn('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY環境変数が設定されていません');
}

export default stripe;