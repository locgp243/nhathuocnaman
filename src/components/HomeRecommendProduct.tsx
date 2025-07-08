"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import SkeletonProductCards from "@/components/SkeletonProductCards"
import { saveCategoryToHistory, getClickHistory } from "@/lib/localStorageUtils"
import { useCart } from "@/contexts/CartContext"
import { toast } from "sonner"

// --- TYPES ---
// Chỉ giữ lại interface cần thiết cho việc gợi ý sản phẩm
interface ApiProduct {
    id: number;
    name: string;
    slug: string;
    brand_name: string;
    variants: { id: number; unit_name: string; price: string; original_price: string | null; is_default: 1 | 0; }[];
    images: { image_url: string; is_primary: 1 | 0; }[];
    categories_full_path: {
        subcategory_name: string | null;
        subcategory_slug: string | null;
        category_slug: string | null;
    }[];
}

// Cấu trúc Product được chuẩn hóa để hiển thị
interface Product {
    id: string;
    name: string;
    slug: string;
    image: string;
    discount: number;
    subcategory_name: string | null;
    subcategory_slug: string | null;
    category_slug: string | null;
    availableTypes: string[];
    variantsInfo: Record<string, {
        id: number; // variantId
        original: number;
        discounted: number;
    }>;
    brand_name: string;
}

interface HomeRecommendProductsProps {
    title?: string;
}

// --- HÀM BIẾN ĐỔI ---
const API_BASE_URL = "https://nhathuoc.trafficnhanh.com";

const transformApiProduct = (apiProduct: ApiProduct): Product => {
    const primaryImage = apiProduct.images.find(img => img.is_primary === 1) || apiProduct.images[0];
    const imageUrl = primaryImage && primaryImage.image_url ? `${API_BASE_URL}${primaryImage.image_url}` : "/placeholder.svg";
    
    const variantsInfo: Product['variantsInfo'] = {};
    apiProduct.variants.forEach(variant => {
        const typeName = variant.unit_name;
        if (typeName) {
            variantsInfo[typeName] = {
                id: variant.id,
                original: parseFloat(variant.original_price || '0'),
                discounted: parseFloat(variant.price || '0')
            };
        }
    });

    const defaultVariant = apiProduct.variants.find(v => v.is_default === 1) || apiProduct.variants[0];
    let discount = 0;
    if (defaultVariant) {
        const original = parseFloat(defaultVariant.original_price || '0');
        const discounted = parseFloat(defaultVariant.price || '0');
        if (original > 0 && discounted < original) {
            discount = Math.round(((original - discounted) / original) * 100);
        }
    }

    const mostDetailedPath = 
        apiProduct.categories_full_path.find(path => path.category_slug) || 
        apiProduct.categories_full_path[0];

    return {
        id: String(apiProduct.id),
        name: apiProduct.name,
        slug: apiProduct.slug,
        image: imageUrl,
        discount,
        subcategory_name: mostDetailedPath?.subcategory_name || null,
        subcategory_slug: mostDetailedPath?.subcategory_slug || null,
        category_slug: mostDetailedPath?.category_slug || null,
        availableTypes: apiProduct.variants.map(v => v.unit_name).filter(Boolean),
        variantsInfo,
        brand_name: apiProduct.brand_name
    };
};


export default function HomeRecommendProducts({
    title = "GỢI Ý DÀNH RIÊNG CHO BẠN",
}: HomeRecommendProductsProps) {
    const router = useRouter();
    const { addToCart } = useCart();

    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadRecommendations = async () => {
            setIsLoading(true);
            setProducts([]); // Xóa sản phẩm cũ trước khi tải mới

            const historySlugs = getClickHistory();

            // Chỉ gọi API khi có lịch sử xem hàng trong localStorage
            if (historySlugs.length > 0) {
                try {
                    const apiUrl = `${API_BASE_URL}/products.php`;
                    const formData = new FormData();
                    formData.append('action', 'lay_san_pham_goi_y');
                    historySlugs.forEach(slug => formData.append('category_slugs[]', slug));
                    
                    const response = await fetch(apiUrl, { method: 'POST', body: formData });

                    if (response.ok) {
                        console.log("API gợi ý sản phẩm thành công:", response);
                        const apiResult = await response.json();
                        console.log("Kết quả API:", apiResult);
                        // API có thể trả về một object { success: true, data: [...] }
                        const productData = (apiResult.success && Array.isArray(apiResult.data)) ? apiResult.data : [];
                        console.log("API gợi ý sản phẩm:", productData);
                        if (productData.length > 0) {
                            const transformed = productData.map(transformApiProduct);
                            setProducts(transformed);

                            const defaultTypes: Record<string, string> = {};
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            transformed.forEach((p: { availableTypes: string | any[]; id: string | number }) => {
                                if (p.availableTypes?.length > 0) {
                                    defaultTypes[p.id] = p.availableTypes[0];
                                }
                            });
                            setSelectedTypes(defaultTypes);
                        }
                    } else {
                        console.error("API gợi ý thất bại.");
                    }
                } catch (err) {
                    console.warn("⚠️ Lỗi API, không thể tải dữ liệu gợi ý.", err);
                }
            }
            
            // Dù có lỗi hay không có history, cuối cùng cũng sẽ dừng loading
            setIsLoading(false);
        };

        loadRecommendations();
    }, []);

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();
        
        const selectedType = selectedTypes[product.id];
        const variantInfo = product.variantsInfo[selectedType];

        if (!variantInfo) {
            toast.error("Vui lòng chọn phân loại sản phẩm.");
            return;
        }

        const itemToAdd = {
            productId: product.id,
            variantId: String(variantInfo.id),
            name: product.name,
            image: product.image,
            price: variantInfo.discounted,
            quantity: 1,
            type: selectedType,
        };
        
        addToCart(itemToAdd);

        toast.success(`Đã thêm "${product.name} (${selectedType})" vào giỏ hàng!`, {
            action: {
                label: "Xem giỏ hàng",
                onClick: () => router.push('/gio-hang'),
            },
        });
    };
    
    const handleProductClick = useCallback((product: Product) => {
        if (product.category_slug) {
            console.log("Lưu danh mục vào lịch sử:", product.category_slug);
            saveCategoryToHistory(product.category_slug);
        }
        router.push(`/san-pham/${product.slug}`);
    }, [router]);
    
    const formatPrice = (price: number) => price.toLocaleString('vi-VN');
    
    const handleTypeChange = (e: React.MouseEvent, productId: string, type: string) => { 
        e.stopPropagation(); 
        setSelectedTypes(prev => ({ ...prev, [productId]: type })); 
    };

    const renderProductCard = (product: Product) => {
        const selectedTypeForProduct = selectedTypes[product.id];
        const variantInfo = product.variantsInfo[selectedTypeForProduct];
        const discountedPrice = variantInfo?.discounted;
        const originalPrice = variantInfo?.original;

        return (
            
            <Card onClick={() => handleProductClick(product)} className="bg-white shadow-md hover:shadow-lg text-black relative overflow-hidden h-full border border-gray-200 cursor-pointer flex flex-col">
                {product.discount > 0 && <Badge className="absolute top-2 left-2 bg-rose-500 text-white z-10">Giảm {product.discount}%</Badge>}
                {product.subcategory_name && <Badge className="absolute top-2 right-2 bg-secondary text-white z-10">{product.subcategory_name}</Badge>}

                <CardContent className="p-3 flex flex-col h-full">
                    <div className="flex justify-center mb-3 h-[150px] items-center p-2">
                        <Image src={product.image} alt={product.name} width={150} height={150} className="object-contain max-h-full" />
                    </div>
                    <div className="flex-grow flex flex-col">
                        <h3 className="font-medium text-sm mb-2 h-10 line-clamp-2 text-gray-800">{product.name}</h3>
                        <div className="h-[40px] mb-2 flex items-center">
                            {product.availableTypes && product.availableTypes.length > 1 ? (
                                <div className="flex flex-wrap gap-1">
                                    {product.availableTypes.map((type) => (
                                        <Button key={`${product.id}-${type}`} variant={selectedTypes[product.id] === type ? "default" : "outline"} size="sm" className={`cursor-pointer px-2 py-0 h-8 text-xs ${selectedTypes[product.id] === type ? "bg-rose-500 hover:bg-rose-600 text-white" : "text-gray-700 border-gray-300"}`} onClick={(e) => handleTypeChange(e, product.id, type)}>{type}</Button>
                                    ))}
                                </div>
                            ) : product.availableTypes && product.availableTypes.length === 1 ? <div className="text-xs text-gray-500">{product.availableTypes[0]}</div> : null}
                        </div>
                        <div className="space-y-1 mt-auto">
                            {typeof discountedPrice === 'number' && <p className="text-rose-600 font-bold text-lg">{formatPrice(discountedPrice)}₫</p>}
                            {(typeof originalPrice === 'number' && typeof discountedPrice === 'number' && originalPrice > discountedPrice) && (<p className="text-gray-500 text-sm line-through">{formatPrice(originalPrice)}₫</p>)}
                        </div>
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-rose-500 hover:bg-rose-600 text-white cursor-pointer" onClick={(e) => handleAddToCart(e, product)}>Thêm Giỏ Hàng</Button>
                </CardContent>
            </Card>
        );
    };
    
    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="bg-primary rounded-lg text-[#FFFFFF] p-4 shadow-lg animate-bg-flow animate-bg-shimmer">
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-2xl font-bold tracking-tight animate-sparkle">{title}</h2>
                </div>
                
                {isLoading ? (
                    <SkeletonProductCards /> 
                ) : products.length > 0 ? (
                    <Carousel opts={{ align: "start", loop: products.length > 5 }} className="w-full">
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {products.map(product => (
                                <CarouselItem key={product.id} className="basis-1/2 pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                    {renderProductCard(product)}
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                         {products.length > 5 && (
                             <>
                                <CarouselPrevious className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F43F5E] text-[#FFFFFF] shadow-md flex items-center justify-center hover:bg-[#E11D48]" />
                                <CarouselNext className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F43F5E] text-[#FFFFFF] shadow-md flex items-center justify-center hover:bg-[#E11D48]" />
                             </>
                         )}
                    </Carousel>
                ) : (
                    <div className="w-full text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
                        Chưa có sản phẩm gợi ý nào. <br/> Hãy khám phá thêm các danh mục để nhận được gợi ý tốt nhất!
                    </div>
                )}
            </div>
        </div>
    )
}   