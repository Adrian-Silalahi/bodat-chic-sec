import prisma from '../libs/prismadb'
import { ProductFilterParams, ProductWithImages } from '../types'


export default async function getProducts (params: ProductFilterParams): Promise<ProductWithImages[]> {
  try {
    const { category } = params
    const query: any = {}

    if (category) {
      query.category = category
    }

    let products: ProductWithImages[]

    // products = await prisma.product.findMany({
    products = await prisma.product.findMany({
      where: {
        ...query,
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
