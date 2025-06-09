export type ProductType =
  | "Hộp"
  | "Vỉ"
  | "Ống"
  | "Chai"
  | "Gói"
  | "Hũ"
  | "Lọ"
  | "Tuýp"
  | "Vỉ 10 viên"
  | "Vỉ 20 viên"

export interface Product {
  id: string
  name: string
  image: string
  slug: string
  price: string
  discount: number
  category: string
  prices: Partial<{
    [key in ProductType]: {
      original: number
      discounted: number
    }
  }>
  availableTypes: ProductType[]
  rating: number
  installment: boolean
  category_name: string
  subcategory_name: string
  main_category_name: string
}
