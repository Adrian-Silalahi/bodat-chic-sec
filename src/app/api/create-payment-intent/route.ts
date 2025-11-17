import { getCurrentUser } from '@/src/actions/getCurrentUser'
import prisma from '@/src/libs/prismadb'
import { type ProductType } from '@/src/types'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16'
})

const getTotalPrice = (products: ProductType[]): number => {
  if (!products || products.length === 0) {
    return 0
  }
  
  const totalPriceAllProducts = products.reduce((acc, product) => {
    const priceAsNumber = Number(product.price) || 0 
    return acc + priceAsNumber
  }, 0)

  return totalPriceAllProducts
}

export async function POST (request: Request): Promise<NextResponse> {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  
try{

  const body = await request.json()
  
  const { cartProducts } = body
  const paymentIntentId = currentUser?.paymentIntentId
  const total = getTotalPrice(cartProducts)
  const stripeTotal = Math.round(total * 100)// convert to cents
  const orderData = {
    userId: currentUser?.id,
    amount: total,
    currency: 'usd',
    status: 'pending',
    deliveryStatus: 'pending',
    paymentIntentId,
    products: cartProducts
  }


  if (paymentIntentId) {
    console.log('Masuk to update payment intent')

    const currentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId
    )

     const existingOrder = await prisma.order.findFirst({
          where: { paymentIntentId: paymentIntentId },
    })

    if (!existingOrder) {
        return NextResponse.json(
          { error: 'Invalid Payment Intent' },
          { status: 404 })
      }

    if (currentIntent) {
      const updatedIntent = await stripe.paymentIntents.update(
        paymentIntentId,
        { amount: stripeTotal }
      )

   

    const updatedOrder = await prisma.order.update({
          where: { id: existingOrder.id },
          data: {
            amount: total,
            products: cartProducts
          }
    })

    return NextResponse.json({ paymentIntent: updatedIntent })
    }
  }else{
    console.log('Masuk to Creating new payment intent')
  const paymentIntent = await stripe.paymentIntents.create({
    amount: stripeTotal,
    currency: 'usd',
    automatic_payment_methods: { enabled: true } 
  })


  // create the order
  orderData.paymentIntentId = paymentIntent.id
  await prisma.user.update({
    where: {
      id: currentUser.id
    },
    data: {
      paymentIntentId: paymentIntent.id
    }
  })
  
  await prisma.order.create({
    data: orderData
  })

  return NextResponse.json({ paymentIntent })
}
  return NextResponse.json({ error: 'Error' }, { status: 404 })
  } catch (error: any) {
    // INI ADALAH BAGIAN TERPENTING
    console.error('!!!!!!!!!!!!!! API CRASH !!!!!!!!!!!!!!')
    console.error(error)
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

    // Kirim pesan error yang jelas ke frontend
    return NextResponse.json(
      { error: 'Terjadi kesalahan di server', details: error.message },
      { status: 500 }
    )
  }
}
