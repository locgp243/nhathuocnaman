"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import SkeletonProductCards from "@/components/SkeletonProductCards"
import { saveCategoryToHistory, getClickHistory } from "@/lib/localStorageUtils"
import { useCart } from "@/contexts/CartContext"
import { toast } from "sonner"
// --- TYPES ---
interface ApiProduct {
    id: number;
    name: string;
    slug: string;
    brand_name: string;
    variants: { id: number; unit_name: string; price: string; original_price: string; is_default: 1 | 0; }[];
    images: { image_url: string; is_primary: 1 | 0; }[];
    categories_full_path: { subcategory_name: string | null; subcategory_slug: string | null; }[];
}
interface ApiHotSalesProduct {
    id: number;
    name: string;
    slug: string;
    image: string;
    discounted_price: string;
    original_price: string;
    discount_percent: number;
    subcategory_name: string | null;
    subcategory_slug: string | null;
    brand_name: string;
    unit_name: string;
}

// SỬA ĐỔI: Cấu trúc của Product để chứa thông tin đầy đủ của variant
interface Product {
    id: string;
    name: string;
    slug: string;
    image: string;
    discount: number;
    subcategory_name: string | null;
    subcategory_slug: string | null;
    availableTypes: string[];
    // Thay thế `prices` bằng `variantsInfo` để chứa cả variantId
    variantsInfo: Record<string, {
        id: number; // Đây chính là variantId
        original: number;
        discounted: number;
    }>;
    brand_name: string;
}
interface Subcategory {
    name: string;
    slug: string;
}
interface HomeRecommendProductsProps {
    title?: string;
    icon?: string;
}

// --- HÀM BIẾN ĐỔI ---
const API_BASE_URL = "https://nhathuoc.trafficnhanh.com";

// SỬA ĐỔI: Cập nhật hàm transform để tạo ra cấu trúc `variantsInfo`
const transformApiProduct = (apiProduct: ApiProduct): Product => {
    const primaryImage = apiProduct.images.find(img => img.is_primary === 1) || apiProduct.images[0];
    const imageUrl = primaryImage ? `${API_BASE_URL}${primaryImage.image_url}` : "/placeholder.svg";
    
    const variantsInfo: Product['variantsInfo'] = {};
    apiProduct.variants.forEach(variant => {
        const typeName = variant.unit_name;
        if (typeName) {
            variantsInfo[typeName] = {
                id: variant.id, // <-- Lưu lại ID của variant
                original: parseFloat(variant.original_price) || 0,
                discounted: parseFloat(variant.price) || 0
            };
        }
    });

    const defaultVariant = apiProduct.variants.find(v => v.is_default === 1) || apiProduct.variants[0];
    let discount = 0;
    if (defaultVariant) {
        const original = parseFloat(defaultVariant.original_price);
        const discounted = parseFloat(defaultVariant.price);
        if (original > 0 && discounted < original) {
            discount = Math.round(((original - discounted) / original) * 100);
        }
    }

    const firstSubcategory = apiProduct.categories_full_path.find(cat => cat.subcategory_name && cat.subcategory_slug);
    
    return {
        id: String(apiProduct.id),
        name: apiProduct.name,
        slug: apiProduct.slug,
        image: imageUrl,
        discount,
        subcategory_name: firstSubcategory?.subcategory_name || null,
        subcategory_slug: firstSubcategory?.subcategory_slug || null,
        availableTypes: apiProduct.variants.map(v => v.unit_name).filter(Boolean),
        variantsInfo, // <-- Sử dụng cấu trúc mới
        brand_name: apiProduct.brand_name
    };
};

// SỬA ĐỔI: Cập nhật hàm transform cho hot_sales
const transformHotSalesProduct = (apiProduct: ApiHotSalesProduct): Product => {
    const typeName = apiProduct.unit_name || 'Sản phẩm';
    return {
        id: String(apiProduct.id),
        name: apiProduct.name,
        slug: apiProduct.slug,
        image: `${API_BASE_URL}${apiProduct.image}`,
        discount: apiProduct.discount_percent || 0,
        subcategory_name: apiProduct.subcategory_name,
        subcategory_slug: apiProduct.subcategory_slug,
        availableTypes: [typeName],
        variantsInfo: { // <-- Sử dụng cấu trúc mới
            [typeName]: {
                id: apiProduct.id, // Với hot_sales, có thể variantId chính là productId nếu mỗi sp chỉ có 1 variant
                original: parseFloat(apiProduct.original_price) || 0,
                discounted: parseFloat(apiProduct.discounted_price) || 0,
            }
        },
        brand_name: apiProduct.brand_name,
    };
};

export default function HomeRecommendProducts({
    title = "ĐỀ XUẤT SẢN PHẨM",
}: HomeRecommendProductsProps) {
    const router = useRouter();
    const { addToCart } = useCart();

    const [isLoading, setIsLoading] = useState(true);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);
    const [selectedTab, setSelectedTab] = useState<string>("recommend");
    const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            let transformedProducts: Product[] = [];
            try {
                const historySlugs = getClickHistory();
                const apiUrl = `${API_BASE_URL}/products.php`;

                if (historySlugs.length > 0) {
                    const formData = new FormData();
                    formData.append('action', 'lay_san_pham_goi_y');
                    historySlugs.forEach(slug => formData.append('category_slugs[]', slug));
                    const response = await fetch(apiUrl, { method: 'POST', body: formData });
                    if (response.ok) {
                        const apiData: ApiProduct[] = await response.json();
                        if (apiData && apiData.length > 0) {
                             transformedProducts = apiData.map(transformApiProduct);
                        }
                    } else {
                        console.error("API gợi ý thất bại, sẽ tải sản phẩm hot sales.");
                    }
                }

                if (transformedProducts.length === 0) {
                    const fallbackUrl = `${API_BASE_URL}/products.php?action=hot_sales`;
                    const response = await fetch(fallbackUrl);
                    if (!response.ok) throw new Error('API hot_sales thất bại');
                    const hotSalesData: ApiHotSalesProduct[] = await response.json();
                    transformedProducts = hotSalesData.map(transformHotSalesProduct);
                }

                setAllProducts(transformedProducts);
                setProducts(transformedProducts);

                const subcategoriesMap = new Map<string, Subcategory>();
                transformedProducts.forEach(p => {
                    if (p.subcategory_slug && p.subcategory_name && !subcategoriesMap.has(p.subcategory_slug)) {
                        subcategoriesMap.set(p.subcategory_slug, { name: p.subcategory_name, slug: p.subcategory_slug });
                    }
                });
                setAvailableSubcategories(Array.from(subcategoriesMap.values()));
                
                const defaultTypes: Record<string, string> = {};
                transformedProducts.forEach(p => {
                    if (p.availableTypes?.length > 0) {
                        defaultTypes[p.id] = p.availableTypes[0];
                    }
                });
                setSelectedTypes(defaultTypes);
            } catch (err) {
                console.warn("⚠️ Lỗi API, không thể tải dữ liệu.", err);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    // SỬA LỖI: Cập nhật hàm `handleAddToCart` để gửi đúng `variantId`
    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();
        
        const selectedType = selectedTypes[product.id];
        const variantInfo = product.variantsInfo[selectedType];

        if (!variantInfo) {
            alert("Đã xảy ra lỗi. Vui lòng chọn phân loại sản phẩm.");
            return;
        }

        const itemToAdd = {
            productId: product.id,
            variantId: String(variantInfo.id), // <-- LẤY VARIANT ID TỪ ĐÂY
            name: product.name,
            image: product.image,
            price: variantInfo.discounted,
            quantity: 1,
            type: selectedType,
        };
        
        addToCart(itemToAdd);

        toast.success(`Đã thêm "${product.name} (${selectedType})" vào giỏ hàng!`, {
            duration: 2000,
            position: "top-right",
            style: {
                backgroundColor: "#fff",
                color: "text-primary",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "12px 16px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            },
             action: {
                label: "Xem giỏ hàng",
                onClick: () => router.push('/gio-hang'),
            },
        });
    };
    
    const handleProductClick = useCallback((product: Product) => {
        if (product.subcategory_slug) {
            saveCategoryToHistory(product.subcategory_slug);
        }
        router.push(`/san-pham/${product.slug}`);
    }, [router]);

    const handleTabChange = useCallback((tabSlug: string) => {
        setSelectedTab(tabSlug);
        if (tabSlug === "recommend") {
            setProducts(allProducts);
        } else {
            setProducts(allProducts.filter(p => p.subcategory_slug === tabSlug));
        }
    }, [allProducts]);
    
    const formatPrice = (price: number) => price.toLocaleString('vi-VN');
    const handleTypeChange = (e: React.MouseEvent, productId: string, type: string) => { 
        e.stopPropagation(); 
        setSelectedTypes(prev => ({ ...prev, [productId]: type })); 
    };

    const renderProductCard = (product: Product) => {
        const selectedTypeForProduct = selectedTypes[product.id];
        // SỬA ĐỔI: Lấy thông tin giá từ `variantsInfo` thay vì `prices`
        const variantInfo = product.variantsInfo[selectedTypeForProduct];
        const discountedPrice = variantInfo?.discounted;
        const originalPrice = variantInfo?.original;

        return (
            <Card onClick={() => handleProductClick(product)} className="bg-white shadow-md hover:shadow-lg text-black relative overflow-hidden h-full border border-gray-200 cursor-pointer flex flex-col">
                {product.discount > 0 && <Badge className="absolute top-2 left-2 bg-rose-500 text-white z-10">Giảm {product.discount}%</Badge>}
                {product.subcategory_name && <Badge variant="secondary" className="absolute top-2 right-2 z-10">{product.subcategory_name}</Badge>}
                <CardContent className="p-3 flex flex-col h-full">
                    <div className="flex justify-center mb-3 h-[150px] items-center">
                        <Image src={product.image} alt={product.name} width={150} height={150} className="object-contain max-h-full" />
                    </div>
                    <div className="flex-grow flex flex-col">
                        <h3 className="font-medium text-sm mb-2 h-10 line-clamp-2 text-gray-800">{product.name}</h3>
                        <div className="h-[40px] mb-2 flex items-center">
                            {product.availableTypes && product.availableTypes.length > 1 ? (
                                <div className="flex flex-wrap gap-1">
                                    {product.availableTypes.map((type, index) => ( // Thêm index để tạo key an toàn
                                        <Button key={`${product.id}-${type}-${index}`} variant={selectedTypes[product.id] === type ? "default" : "outline"} size="sm" className={`px-2 py-0 h-8 text-xs ${selectedTypes[product.id] === type ? "bg-rose-500 hover:bg-rose-600 text-white" : "text-gray-700 border-gray-300"}`} onClick={(e) => handleTypeChange(e, product.id, type)}>{type}</Button>
                                    ))}
                                </div>
                            ) : product.availableTypes && product.availableTypes.length === 1 ? <div className="text-xs text-gray-500">{product.availableTypes[0]}</div> : null}
                        </div>
                        <div className="space-y-1 mt-auto">
                            {typeof discountedPrice === 'number' && <p className="text-rose-600 font-bold text-lg">{formatPrice(discountedPrice)}₫</p>}
                            {(typeof originalPrice === 'number' && typeof discountedPrice === 'number' && originalPrice > discountedPrice) && (<p className="text-gray-500 text-sm line-through">{formatPrice(originalPrice)}₫</p>)}
                        </div>
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-rose-500 hover:bg-rose-600 text-white" onClick={(e) => handleAddToCart(e, product)}>Thêm Giỏ Hàng</Button>
                </CardContent>
            </Card>
        );
    };
    
    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="rounded-lg">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                    </div>
                    <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full md:w-auto">
                        <TabsList className="bg-transparent h-auto flex flex-wrap gap-2">
                            <TabsTrigger value="recommend" className="bg-gray-200 text-gray-800 data-[state=active]:bg-rose-500 data-[state=active]:text-white">Gợi ý cho bạn</TabsTrigger>
                            {availableSubcategories.map((sub) => (
                                <TabsTrigger key={sub.slug} value={sub.slug} className="bg-gray-200 text-gray-800 data-[state=active]:bg-rose-500 data-[state=active]:text-white">
                                    {sub.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
                {isLoading ? <SkeletonProductCards /> : (
                    <Carousel opts={{ align: "start", loop: products.length > 5 }} className="w-full">
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {products.length > 0 ? products.map(product => (
                                <CarouselItem key={product.id} className="basis-1/2 pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                    {renderProductCard(product)}
                                </CarouselItem>
                            )) : <div className="w-full text-center py-10">Không có sản phẩm nào phù hợp.</div>}
                        </CarouselContent>
                         {products.length > 5 && (
                              <>
                                <CarouselPrevious className="absolute left-[-1rem] hidden md:inline-flex" />
                                <CarouselNext className="absolute right-[-1rem] hidden md:inline-flex" />
                              </>
                          )}
                    </Carousel>
                )}
            </div>
        </div>
    )
}