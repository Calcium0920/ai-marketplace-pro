import { NextRequest, NextResponse } from 'next/server'

interface CartItem {
  id: string | number
  title: string
  price: number
}

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()
    
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 })
    }

    // 簡易版：実際の決済は行わず、成功ページにリダイレクト
    const totalAmount = items.reduce((sum: number, item: CartItem) => sum + item.price, 0)
    
    console.log('Demo payment processed:', {
      items: items.length,
      total: totalAmount
    })

    // 成功ページのURLを返す
    const successUrl = `${request.headers.get('origin')}/success?amount=${totalAmount}`
    
    return NextResponse.json({ 
      url: successUrl,
      message: 'Demo payment processed successfully'
    })

  } catch (error) {
    console.error('Payment processing error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' }, 
      { status: 500 }
    )
  }
}