import { Prisma } from '@prisma/client'
import prisma from '../libs/prismadb'
import { ProductFilterParams, ProductWithImages } from '../types'

export default async function getProducts (params: ProductFilterParams): Promise<ProductWithImages[]> {
  try {
    const { category } = params
    const filters: Prisma.ProductWhereInput = {}

    if (category) {
      filters.category = category
    }

    let products: ProductWithImages[]

    products = await prisma.product.findMany({
      where: {
        ...filters,
      },
      include: {
        images: {
          orderBy: {
            sequence: 'asc',
          },
        },
      },
    })
    return products
  } catch (error: any) {
    throw new Error(error)
  }
}
