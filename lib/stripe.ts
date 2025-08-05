import Stripe from 'stripe';
import { Product } from './types';

// Stripe インスタンスを作成
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',  // 最新のAPIバージョンに修正
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

// 価格フォーマット
export const formatCurrency = (amount: number, currency: string = 'JPY'): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatStripeAmount = (amount: number): number => {
  return Math.round(amount * 100);
};

export const formatDisplayAmount = (stripeAmount: number): number => {
  return stripeAmount / 100;
};

export default stripe;