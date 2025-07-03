// app/(main)/tim-kiem/page.tsx

import { Suspense } from 'react';
import ProductCard from '@/components/ProductCard'; // Import component "xịn"
import { ApiProduct } from '@/types/product'; // Import các kiểu dùng chung

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
    category_slug?: string | null; // Dùng để lưu vào history
}

// --- HÀM LẤY VÀ BIẾN ĐỔI DỮ LIỆU ---
async function fetchAndTransformSearchResults(query: string): Promise<Product[]> {
    if (!query) return [];
    try {
        const response = await fetch(`https://nhathuoc.trafficnhanh.com/products.php?action=tim_kiem_san_pham&q=${encodeURIComponent(query)}`, {
            next: { revalidate: 300 } // Cache 5 phút
        });
        if (!response.ok) return [];

        const result = await response.json();
        if (!result.success || !Array.isArray(result.data)) return [];

        const apiProducts: ApiProduct[] = result.data;

        // ⭐ LOGIC TRANSFORM ĐÚNG VÀ ĐƠN GIẢN
        // Chỉ tạo ra object có cấu trúc khớp với interface Product trong ProductCard
        const transformedProducts: Product[] = apiProducts.map(apiProduct => {
            const mostDetailedPath = apiProduct.categories_full_path?.find(path => path.subcategory_name) || apiProduct.categories_full_path?.[0];

            return {
                id: String(apiProduct.id),
                name: apiProduct.name,
                slug: apiProduct.slug,
                // Truyền thẳng mảng variants và images, không cần xử lý ở đây
                variants: apiProduct.variants || [],
                images: apiProduct.images || [],
                subcategory_name: mostDetailedPath?.subcategory_name || null,
                category_slug: mostDetailedPath?.category_slug || null,
            };
        });

        return transformedProducts;

    } catch (error) {
        console.error("Search API fetch/transform error:", error);
        return [];
    }
}


// --- COMPONENTS HIỂN THỊ ---

async function SearchResults({ query }: { query: string }) {
    const products = await fetchAndTransformSearchResults(query);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">
                Kết quả tìm kiếm cho từ khóa: <span className="text-primary">{query}</span>
            </h1>
            {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {products.map((product) => (
                        // Giờ đây `product` có kiểu dữ liệu hoàn toàn tương thích
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

export default function SearchPage({ searchParams }: { searchParams: { q: string } }) {
    const query = searchParams.q || "";

    return (
        <div className="container mx-auto px-4 py-8">
            <Suspense 
                fallback={
                    <div className="text-center py-16">
                        <p className="text-lg animate-pulse">Đang tìm kiếm...</p>
                    </div>
                }
            >
                <SearchResults query={query} />
            </Suspense>
        </div>
    );
}