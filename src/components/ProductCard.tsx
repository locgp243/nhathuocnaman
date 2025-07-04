'use client';

import { useState, useEffect, useMemo, useCallback, memo, FC } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import { useCart } from '@/contexts/CartContext';
import { saveCategoryToHistory } from '@/lib/localStorageUtils';
import { API_BASE_URL } from '@/lib/api';

// --- TYPES ---
// Đây là kiểu dữ liệu chuẩn và duy nhất mà ProductCard sẽ nhận vào
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

interface ProductCardProps {
    product: Product;
}

// --- COMPONENT CHÍNH ---
const ProductCard: FC<ProductCardProps> = ({ product }) => {
    const router = useRouter();
    const { addToCart } = useCart();

    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

    // Tự động chọn variant mặc định khi component tải
    useEffect(() => {
        if (product.variants && product.variants.length > 0) {
            // Ưu tiên is_default, nếu không có thì lấy cái đầu tiên
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const defaultVariant = product.variants.find((v: any) => v.is_default === 1) || product.variants[0];
            setSelectedVariant(defaultVariant);
        }
    }, [product.variants]);

    // Tối ưu việc tính toán giá, chỉ tính lại khi variant thay đổi
    const priceData = useMemo(() => {
        if (!selectedVariant) return { discounted: 0, original: 0, discountPercent: 0 };
        
        const discounted = Number(selectedVariant.price);
        const original = Number(selectedVariant.original_price);
        let discountPercent = 0;
        if (original > 0 && discounted < original) {
            discountPercent = Math.round(((original - discounted) / original) * 100);
        }
        return { discounted, original, discountPercent };
    }, [selectedVariant]);

    // Các hàm xử lý sự kiện
    const handleVariantChange = (e: React.MouseEvent, variant: Variant) => {
        e.stopPropagation();
        setSelectedVariant(variant);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedVariant) return;
        
        const primaryImage = product.images?.find(img => img.is_primary === 1) || product.images?.[0];
        const imageUrl = primaryImage ? `${API_BASE_URL}${primaryImage.image_url}` : '/placeholder.png';

        addToCart({
            productId: product.id,
            variantId: String(selectedVariant.id),
            name: product.name,
            image: imageUrl,
            price: priceData.discounted,
            quantity: 1,
            type: selectedVariant.unit_name,
        });
        toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
    };

    const handleCardClick = useCallback(() => {
        if (product.category_slug) saveCategoryToHistory(product.category_slug);
        router.push(`/san-pham/${product.slug}`);
    }, [product.slug, product.category_slug, router]);

    const formatPrice = (price: number) => price.toLocaleString('vi-VN');
    
    // Lấy ảnh đại diện
    const primaryImage = product.images?.find(img => img.is_primary === 1) || product.images?.[0];
    const imageUrl = primaryImage ? `${API_BASE_URL}${primaryImage.image_url}` : null;

    if (!selectedVariant) return null; // Không render gì nếu sản phẩm không có biến thể

    return (
        <Card onClick={handleCardClick} className="group flex flex-col h-full bg-white border rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="block overflow-hidden p-4 relative">
                {priceData.discountPercent > 0 && (
                    <Badge className="absolute top-2 left-2 bg-rose-500 text-white z-10">
                        Giảm {priceData.discountPercent}%
                    </Badge>
                )}
                {product.subcategory_name && <Badge variant="secondary" className="absolute top-2 right-2 z-10">{product.subcategory_name}</Badge>}
                
                <div className="relative aspect-square">
                    {imageUrl && (
                        <Image src={imageUrl} alt={product.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw" className="object-contain transition-transform duration-300 group-hover:scale-105" />
                    )}
                </div>
            </div>
            <CardContent className="p-3 pt-0 flex flex-col flex-grow">
                <h3 className="font-medium text-sm mb-2 h-10 line-clamp-2 text-gray-800 group-hover:text-primary transition-colors">{product.name}</h3>
                
                <div className="h-[40px] flex items-center">
                    {product.variants.length > 1 ? (
                        <div className="flex flex-wrap gap-1 cursor-pointer">
                            {product.variants.map(variant => (
                                <Button 
                                    key={variant.id} 
                                    variant={selectedVariant.id === variant.id ? "default" : "outline"} 
                                    size="sm" 
                                    className={`px-2 py-0 h-7 text-xs transition-all cursor-pointer ${selectedVariant.id === variant.id ? 'bg-rose-500 text-white' : 'border-gray-300'}`} 
                                    onClick={(e) => handleVariantChange(e, variant)}
                                >
                                    {variant.unit_name}
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-xs text-gray-500">{product.variants[0]?.unit_name}</div>
                    )}
                </div>
                
                <div className="space-y-1 mt-auto">
                    <p className="text-rose-500 font-bold text-lg">{formatPrice(priceData.discounted)}₫</p>
                    {priceData.original && (
                        <p className="text-gray-500 text-sm line-through">{formatPrice(priceData.original)}₫</p>
                    )}
                </div>

                <Button size="sm" className="cursor-pointer w-full mt-3 bg-rose-500 hover:bg-primary text-white" onClick={handleAddToCart}>
                    Thêm vào giỏ
                </Button>
            </CardContent>
        </Card>
    );
};

export default memo(ProductCard);