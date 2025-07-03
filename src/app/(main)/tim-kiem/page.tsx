// app/(main)/tim-kiem/page.tsx

import { Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import { ApiProduct } from '@/types/product';

export interface Variant {
  id: number;
  unit_name: string;
  price: string;
  original_price: string | null;
}

export interface ProductImage {
  image_url: string;
  is_primary: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  variants: Variant[];
  images?: ProductImage[];
  subcategory_name?: string | null;
  category_slug?: string | null;
}

// --- HÀM FETCH & TRANSFORM ---
async function fetchAndTransformSearchResults(query: string): Promise<Product[]> {
  if (!query) return [];
  try {
    const response = await fetch(`https://nhathuoc.trafficnhanh.com/products.php?action=tim_kiem_san_pham&q=${encodeURIComponent(query)}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];

    const result = await response.json();
    if (!result.success || !Array.isArray(result.data)) return [];

    const apiProducts: ApiProduct[] = result.data;

    return apiProducts.map(apiProduct => {
      const mostDetailedPath = apiProduct.categories_full_path?.find(path => path.subcategory_name) || apiProduct.categories_full_path?.[0];

      return {
        id: String(apiProduct.id),
        name: apiProduct.name,
        slug: apiProduct.slug,
        variants: apiProduct.variants || [],
        images: apiProduct.images || [],
        subcategory_name: mostDetailedPath?.subcategory_name || null,
        category_slug: mostDetailedPath?.category_slug || null,
      };
    });

  } catch (error) {
    console.error("Search API fetch/transform error:", error);
    return [];
  }
}

// --- COMPONENT HIỂN THỊ KẾT QUẢ ---
function SearchResults({ products, query }: { products: Product[]; query: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Kết quả tìm kiếm cho từ khóa: <span className="text-primary">{query}</span>
      </h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-lg text-gray-600">Không tìm thấy sản phẩm nào phù hợp.</p>
        </div>
      )}
    </div>
  );
}

// ✅ SỬA Ở ĐÂY
export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q || "";
  const products = await fetchAndTransformSearchResults(query);

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<p className="text-lg text-center py-8 animate-pulse">Đang tìm kiếm...</p>}>
        <SearchResults products={products} query={query} />
      </Suspense>
    </div>
  );
}
