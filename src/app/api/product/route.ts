import { getCurrentUser } from '@/src/actions/getCurrentUser'
import prisma from '@/src/libs/prismadb'
import { NextResponse } from 'next/server'

export async function POST (request: Request): Promise<NextResponse> {
  const currentUser = await getCurrentUser()
  const isInvalidUser = (!currentUser || currentUser.role !== 'ADMIN')

  if (isInvalidUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { name, description, price, brand, category, images, size } = body

  const product = await prisma.product.create({
    data: {
      name,
      description,
      brand,
      category,
      images: {
            create: images.map((imageUrl: string, index: number) => ({
              url: imageUrl,
              sequence: index, // index 0 akan jadi order 0 (cover), dst.
            })),
          },
      size: size,
      price: parseFloat(price),
    },
    // include: { images: true },
  })

  return NextResponse.json(product)
}
