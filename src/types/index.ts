export type Product = {
  id: string
  categoryId: string
  image: string
  name: string
  description: string
}

export type ProductWithStock = Product & {
  quantity: number
  price: number
}

export type Stock = {
  id: string
  productId: string
  stockQuantity: number
  price: number
  color?: string
  size?: string
}

export type CreateStock = {
  productId: string
  stockQuantity: number
  price: number
  color?: string
  size?: string
}


export type Category = {
  id: string
  name: string
}

export type User = {
  id: string
  fullName: string
  email: string
  password: string
  countryCode: string
  phone: string
  role: string
}

export const ROLE = {
  Admin: "Admin",
  Customer: "Customer"
} as const

export type DecodedUser = {
  aud: string
  emailaddress: string
  exp: number
  iss: string
  name: string
  nameidentifier: string
  role: keyof typeof ROLE
}

export type ProductWithoutId = Omit<Product, "id">

