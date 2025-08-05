import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { products, successUrl, cancelUrl, customerEmail } = await request.json();

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: '商品情報が不正です' },
        { status: 400 }
      );
    }

    // Stripe Checkout セッションを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map((product: any) => ({
        price_data: {
          currency: 'jpy',
          product_data: {
            name: product.title,
            description: product.description,
            images: product.images || [],
          },
          unit_amount: product.price,
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      customer_email: customerEmail,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['JP'],
      },
      metadata: {
        products: JSON.stringify(products.map((p: any) => ({ id: p.id, title: p.title }))),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe API Error:', error);
    return NextResponse.json(
      { error: '決済処理でエラーが発生しました', details: error.message },
      { status: 500 }
    );
  }
}

// Webhook処理（Stripeからの通知を受信）
export async function PUT(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Stripe署名がありません' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return NextResponse.json(
        { error: 'Webhook設定エラー' },
        { status: 500 }
      );
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // イベント処理
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('決済完了:', session.id);
        
        // ここで注文処理やデータベース更新を行う
        // await processOrder(session);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('支払い成功:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('支払い失敗:', failedPayment.id);
        break;

      default:
        console.log(`未処理のイベント: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json(
      { error: 'Webhook処理エラー', details: error.message },
      { status: 400 }
    );
  }
}

// 決済状況確認
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'セッションIDが必要です' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent']
    });

    return NextResponse.json({
      id: session.id,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      currency: session.currency,
      line_items: session.line_items?.data || []
    });
  } catch (error: any) {
    console.error('Session retrieve error:', error);
    return NextResponse.json(
      { error: 'セッション取得エラー', details: error.message },
      { status: 500 }
    );
  }
}