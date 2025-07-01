// app/san-pham/[slug]/page.tsx

import ProductClientPage from '@/components/ProductClientPage';
import { notFound } from 'next/navigation';
// import type { Metadata } from 'next';

// Định nghĩa kiểu props
interface PageProps {
  params: {
    slug: string;
  };
}

// Hàm lấy dữ liệu (không đổi)
async function getProductBySlug(slug: string) {
    try {
        const response = await fetch(`https://nhathuoc.trafficnhanh.com/products.php?action=doc_chi_tiet&slug=${slug}`, {
            next: { revalidate: 3600 } 
        });
        const result = await response.json();
        return (result.success && result.data) ? result.data : null;
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
}

// ⭐ MỚI: Tự động tạo metadata cho SEO
// export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
//     const product = await getProductBySlug(params.slug);

//     if (!product) {
//         return {
//             title: 'Không tìm thấy sản phẩm',
//         };
//     }
    
//     return {
//         title: product.meta_title || product.name,
//         description: product.meta_description || product.description,
//         openGraph: {
//             title: product.meta_title || product.name,
//             description: product.meta_description || product.description,
//             images: [
//                 {
//                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                     url: `https://nhathuoc.trafficnhanh.com/${product.images?.find((img: any) => img.is_primary)?.image_url || ''}`,
//                     width: 800,
//                     height: 600,
//                     alt: product.name,
//                 },
//             ],
//         },
//     };
// }


// Trang Server Component
export default async function ProductDetailPage({ params }: PageProps) {
    // ⭐ SỬA LỖI: Truyền thẳng `params.slug`, không destructure ra biến riêng
    const product = await getProductBySlug(params.slug);

    if (!product) {
        notFound();
    }

    return <ProductClientPage initialProduct={product} />;
}