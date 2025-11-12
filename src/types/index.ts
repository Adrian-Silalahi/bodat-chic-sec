import { type User } from '@prisma/client'

export type SafeUser = Omit<User, 'createdAt' | 'updatedAt' | 'emailVerified'> & {
  createdAt: string
  updatedAt: string
  emailVerified: string
}

export interface VariationRequestType {
  color: string
  colorCode: string
  images: File[] | null
}

export interface ProductFilterParams {
  category?: string | null
}

export interface ProductType {
  id?: string
  productId?: string
  userId?: string
  name: string
  description: string
  category: string
  brand: string
  images: string[]
  price: number
  size: string
}

export interface CartProductType {
  id?: string
  productId?: string
  userId?: string
  name: string
  description: string
  category: string
  brand: string
  image: string
  price: number
  size: string
}

export interface VariationResponseType {
  color: string
  colorCode: string
  images: string[]
}
