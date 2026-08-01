export type Category = 'Vestidos' | 'Blusas' | 'Calças' | 'Saias' | 'Conjuntos'

export type Size = 'PP' | 'P' | 'M' | 'G' | 'GG'

export interface Product {
  id: string
  name: string
  category: Category
  price: number
  sizes: Size[]
  description: string
  color: string
  icon: string
  image: string
  fixed: boolean
  featured: boolean
  highlight: boolean
  active: boolean
}

export interface CartItem {
  productId: string
  name: string
  price: number
  size: Size
  quantity: number
  color: string
  icon: string
  image: string
}
