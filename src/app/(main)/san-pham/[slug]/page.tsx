// app/(main)/san-pham/[slug]/page.tsx

import ProductClientPage from '@/components/ProductClientPage';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Định nghĩa kiểu props cho Next.js 15
type PageProps = {
  params: Promise<{ slug: string; }>;
};

// Hàm lấy dữ liệu (không đổi)
async function getProductBySlug(slug: string) {
    try {
        const response = await fetch(`https://nhathuoc.trafficnhanh.com/products.php?action=doc_chi_tiet&slug=${slug}`, {
            next: { revalidate: 3600 } 
        });
        if (!response.ok) return null;
        const result = await response.json();
        return (result.success && result.data) ? result.data : null;
    } catch (error) {
        console.error("API Error fetching product:", error);
        return null;
    }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    // ⭐ AWAIT params trước khi sử dụng
    const params = await props.params;
    const slug = params.slug;
    const product = await getProductBySlug(slug);
    
    if (!product) {
        return {
            title: 'Không tìm thấy sản phẩm',
        };
    }

    return {
        title: product.meta_title || product.name,
        description: product.meta_description || product.description,
    };
}

export default async function ProductDetailPage(props: PageProps) {
    // ⭐ AWAIT params trước khi sử dụng
    const params = await props.params;
    const slug = params.slug;
    const product = await getProductBySlug(slug);
    
    if (!product) {
        notFound();
    }

    return <ProductClientPage initialProduct={product} />;
}