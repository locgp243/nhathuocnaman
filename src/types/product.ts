// Định nghĩa cho một biến thể (variant) của sản phẩm
export interface Variant {
  id: number;
  product_id: number;
  unit_name: string;
  price: string;
  original_price: string;
  is_default?: 1 | 0;
  // Thêm các trường khác nếu có, ví dụ: sku, barcode...
}

// Định nghĩa cho một ảnh của sản phẩm
export interface ProductImage {
  id: number;
  image_url: string;
  is_primary: 1 | 0;
  position?: number;
}

// Định nghĩa cho đường dẫn danh mục của sản phẩm
export interface CategoryPath {
  category_id: number | null;
  category_name: string | null;
  category_slug: string | null;
  subcategory_id: number | null;
  subcategory_name: string | null;
  subcategory_slug: string | null;
  maincategory_id: number | null;
  maincategory_name: string | null;
  maincategory_slug: string | null;
}

// === ĐỊNH NGHĨA PRODUCT ĐẦY ĐỦ ===
export interface Product {
  created_at: Date;
  // Thông tin cơ bản từ API Hot Sales cũ
  id: string;
  name: string;
  slug: string;
  image: string; // Vẫn giữ lại để tương thích, nhưng ưu tiên dùng mảng `images`
  is_hotsale?: number;
  brand_name?: string;
  discounted_price?: string; // Có thể có từ API hot sales cũ
  original_price?: string;  // Có thể có từ API hot sales cũ
  discount_percent?: number;    // Có thể có từ API hot sales cũ
  unit_name?: string;           // Có thể có từ API hot sales cũ
  
  // Thuộc tính đầy đủ từ các API mới
  status?: 'active' | 'inactive';
  description?: string;
  
  // Mảng các biến thể (quan trọng)
  variants: Variant[];

  // Mảng các hình ảnh (quan trọng)
  images: ProductImage[];

  // Mảng đường dẫn danh mục (quan trọng)
  categories_full_path: CategoryPath[];

  // Có thể giữ lại để truy cập nhanh, nhưng categories_full_path đầy đủ hơn
  subcategory_name?: string;
  subcategory_slug?: string;
}

// Type này có thể không còn cần thiết nếu Product đã đầy đủ
// Nhưng giữ lại để không gây lỗi ở nơi khác
export interface ProductType {
  name: string;
  originalPrice: number;
  discountedPrice: number;
}

export interface ApiProduct {
    id: number;
    name: string;
    slug: string;
    variants: Variant[];
    images?: ProductImage[];
    categories_full_path?: {
        category_slug: string;
        subcategory_name?: string;
    }[];
}