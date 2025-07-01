"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Product } from "@/types/product"
import SkeletonProductCards from "@/components/SkeletonProductCards"
import { saveCategoryToHistory } from "@/lib/localStorageUtils"

// MỚI: Import hook và toast để sử dụng
import { useCart } from "@/contexts/CartContext"
import { toast } from "sonner"

// Interface cho Subcategory
interface Subcategory {
    name: string;
    slug: string;
}

export default function HomeHotSaleProducts() {
    const router = useRouter();
    const { addToCart } = useCart();

    // --- STATE MANAGEMENT ---
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    // THAY ĐỔI: Thêm lại state để quản lý variant được chọn cho mỗi sản phẩm
    const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>({});
    const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(true);

    // --- LOGIC TẢI DỮ LIỆU ---
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const apiUrl = `https://nhathuoc.trafficnhanh.com/products.php?action=hot_sales`;
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error("API request failed");

                const productData: Product[] = await response.json();
                
                setAllProducts(productData);

                // Logic tạo subcategories không đổi
                const subcategoriesMap = new Map<string, Subcategory>();
                productData.forEach(p => {
                    // Lấy subcategory từ trong mảng categories_full_path
                    const subcat = p.categories_full_path?.find(cat => cat.subcategory_slug);
                    if (subcat?.subcategory_slug && subcat?.subcategory_name && !subcategoriesMap.has(subcat.subcategory_slug)) {
                        subcategoriesMap.set(subcat.subcategory_slug, { name: subcat.subcategory_name, slug: subcat.subcategory_slug });
                    }
                });
                setSubcategories(Array.from(subcategoriesMap.values()));
                
                // THAY ĐỔI: Thiết lập variant mặc định cho mỗi sản phẩm
                const defaultTypes: Record<string, string> = {};
                productData.forEach((product) => {
                    if (product.variants?.length > 0) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const defaultVariant = product.variants.find((v: any) => v.is_default === 1) || product.variants[0];
                        if (defaultVariant) {
                           defaultTypes[product.id] = defaultVariant.unit_name;
                        }
                    }
                });
                setSelectedTypes(defaultTypes);
                
            } catch (error) {
                console.warn("⚠️ Lỗi API, không thể tải Hot Sale.", error);
                toast.error("Không thể tải sản phẩm Hot Sale", {
                    description: "Vui lòng kiểm tra lại kết nối và thử lại."
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
    const handleProductClick = useCallback((product: Product) => {
        const subcat = product.categories_full_path?.find(cat => cat.subcategory_slug);
        if (subcat?.subcategory_slug) {
            saveCategoryToHistory(subcat.subcategory_slug);
        }
        router.push(`/san-pham/${product.slug}`);
    }, [router]);
    
    // THAY ĐỔI: Thêm lại hàm xử lý chọn variant
    const handleTypeChange = (e: React.MouseEvent, productId: string, type: string) => {
        e.stopPropagation();
        setSelectedTypes(prev => ({ ...prev, [productId]: type }));
    };

    // THAY ĐỔI: Logic thêm vào giỏ hàng giờ đây giống hệt các trang khác
    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();

        const selectedUnitName = selectedTypes[product.id];
        const selectedVariant = product.variants?.find(v => v.unit_name === selectedUnitName);

        if (!selectedVariant) {
            toast.error("Đã xảy ra lỗi", { description: "Không tìm thấy loại sản phẩm được chọn." });
            return;
        }

        const primaryImageObject = product.images?.find(img => img.is_primary) || product.images?.[0];
        const imageUrl = primaryImageObject ? `https://nhathuoc.trafficnhanh.com${primaryImageObject.image_url}` : '/placeholder-image.png';

        const itemToAdd = {
            productId: String(product.id),
            variantId: String(selectedVariant.id), // Lấy ID của variant đã chọn
            name: product.name,
            image: imageUrl,
            price: Number(selectedVariant.price),
            quantity: 1,
            type: selectedVariant.unit_name,
        };

        addToCart(itemToAdd);

        toast.success("Đã thêm vào giỏ hàng!", {
            description: `${product.name} (${selectedVariant.unit_name})`,
            action: {
                label: "Xem giỏ",
                onClick: () => router.push('/gio-hang'),
            },
        });
    };

    // --- LOGIC LỌC VÀ RENDER ---
    const formatPrice = (price: number | string): string => Number(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    const filteredProducts = selectedCategorySlug === "all" 
        ? allProducts 
        : allProducts.filter(product => product.categories_full_path?.some(cat => cat.subcategory_slug === selectedCategorySlug));

    const renderProductCard = (product: Product) => {
        // THAY ĐỔI: Logic render giờ dựa vào variant được chọn
        const selectedVariant = product.variants?.find(v => v.unit_name === selectedTypes[product.id]);
        const primaryImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url;
        
        const discountedPrice = selectedVariant ? Number(selectedVariant.price) : 0;
        const originalPrice = selectedVariant ? Number(selectedVariant.original_price) : 0;
        const discountPercent = (originalPrice > 0 && originalPrice > discountedPrice) 
            ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
            : 0;

        const subcategoryName = product.categories_full_path?.find(cat => cat.subcategory_name)?.subcategory_name;

        return (
            <Card 
                className="bg-[#FFFFFF] text-[#333333] relative overflow-hidden h-full cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
                onClick={() => handleProductClick(product)}
            >
                {discountPercent > 0 && <Badge className="absolute top-2 left-2 bg-[#F43F5E] text-[#FFFFFF] z-10">Giảm {discountPercent}%</Badge>}
                {subcategoryName && <Badge className="absolute top-2 right-2 bg-secondary text-[#FFFFFF] z-10">{subcategoryName}</Badge>}
                <CardContent className="p-3 flex flex-col flex-grow">
                    <div className="flex justify-center mb-3">
                        <Image src={primaryImage ? `https://nhathuoc.trafficnhanh.com/${primaryImage}` : "/placeholder.png"} alt={product.name} width={150} height={150} className="object-contain h-[120px] md:h-[150px]" />
                    </div>
                    <h3 className="font-medium text-sm text-[#333333] mb-2 h-10 line-clamp-2">{product.name}</h3>
                    
                    <div className="h-[40px] mb-2 flex items-center">
                       {product.variants && product.variants.length > 1 ? (
                            <div className="flex flex-wrap gap-1">
                                {product.variants.map((variant) => (
                                    <Button key={variant.id} variant={selectedTypes[product.id] === variant.unit_name ? "default" : "outline"} size="sm"
                                        className={`px-2 py-0 h-8 text-xs ${selectedTypes[product.id] === variant.unit_name ? "bg-rose-500 hover:bg-rose-600 text-white" : "text-gray-700 border-gray-300"}`}
                                        onClick={(e) => handleTypeChange(e, product.id, variant.unit_name)}
                                    >{variant.unit_name}</Button>
                                ))}
                            </div>
                        ) : product.variants && product.variants.length === 1 ? (
                            <div className="text-xs text-[#6B7280]">Loại: {product.variants[0].unit_name}</div>
                        ) : null}
                    </div>

                    <div className="space-y-1 mt-auto">
                        <p className="text-[#F43F5E] font-bold text-base">{formatPrice(discountedPrice)}₫</p>
                        {originalPrice > discountedPrice && <p className="text-[#AAAAAA] text-xs line-through">{formatPrice(originalPrice)}₫</p>}
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-[#F43F5E] hover:bg-[#E11D48] text-[#FFFFFF]"
                        onClick={(e) => handleAddToCart(e, product)}
                    >Thêm Giỏ Hàng</Button>
                </CardContent>
            </Card>
        );
    };
    
    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
            <div className="bg-primary text-[#FFFFFF] p-4 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <div className="bg-[#FFFFFF] rounded-full p-1 sm:p-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#F43F5E" /><path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="#F43F5E" /></svg>
                        </div>
                        <h2 className="text-accent text-xl sm:text-2xl font-bold tracking-tight">HOT SALE</h2>
                        <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#FFFFFF]">CUỐI TUẦN</span>
                    </div>
                    <Tabs value={selectedCategorySlug} onValueChange={setSelectedCategorySlug} className="w-full md:w-auto">
                        <TabsList className="bg-transparent h-auto flex flex-wrap gap-1 sm:gap-2 justify-center md:justify-end">
                            <TabsTrigger value="all" className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 bg-secondary text-[#FFFFFF] data-[state=active]:bg-[#F43F5E] data-[state=active]:text-[#FFFFFF] rounded">Tất cả</TabsTrigger>
                            {subcategories.slice(0, 5).map((category) => (
                                <TabsTrigger key={category.slug} value={category.slug} className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 bg-secondary text-[#FFFFFF] data-[state=active]:bg-[#F43F5E] data-[state=active]:text-[#FFFFFF] rounded">{category.name}</TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
                {isLoading ? <SkeletonProductCards /> : (
                    <Carousel opts={{ align: "start", loop: filteredProducts.length > 5 }} className="w-full">
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                                <CarouselItem key={`${product.id}-${selectedCategorySlug}`} className="basis-1/2 pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                    {renderProductCard(product)}
                                </CarouselItem>
                            )) : (
                                <div className="w-full text-center text-white/80 py-10 text-sm">
                                    Hiện chưa có sản phẩm hot sale nào.
                                </div>
                            )}
                        </CarouselContent>
                        {filteredProducts.length > 5 && <>
                            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F43F5E] text-[#FFFFFF] shadow-md flex items-center justify-center hover:bg-[#E11D48]" />
                            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F43F5E] text-[#FFFFFF] shadow-md flex items-center justify-center hover:bg-[#E11D48]" />
                        </> }
                    </Carousel>
                )}
            </div>
        </div>
    )
}

