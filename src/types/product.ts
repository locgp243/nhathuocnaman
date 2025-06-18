// src/types/product.ts

export type ProductType = string;

export interface PriceInfo {
  original: number;
  discounted: number;
}

export interface Product {
  discount_percent: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unit_name: any;
  original_price: number;
  discounted_price: number;
  id: string;
  name: string;
  slug: string;
  image: string | null;
  discount: number;
  main_category_name: string | null;
  main_category_slug: string | null;
  subcategory_name: string | null; // Danh mục cấp 2
  subcategory_slug: string | null; // Slug của danh mục cấp 2
  category_name: string | null;      // Danh mục cấp 3 (có thể null)
  category_slug: string | null;      // Slug của danh mục cấp 3 (có thể null)
  availableTypes: ProductType[];
  prices: Record<ProductType, PriceInfo>;
  created_at?: string;
}