'use client';

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { saveCategoryToHistory } from "@/lib/localStorageUtils";

// MỚI: Import hook và toast để sử dụng
import { useCart } from "@/contexts/CartContext"; // Đảm bảo đường dẫn này chính xác
import { toast } from "sonner";

// Định nghĩa kiểu dữ liệu cho API (Không đổi)
interface Variant {
    id: number;
    unit_name: string;
    price: string;
    original_price: string;
}
interface ProductImage {
    image_url: string;
    is_primary: number;
}
interface Product {
    id: string;
    name: string;
    slug: string;
    variants: Variant[];
    images?: ProductImage[];
    is_hotsale?: number;
    brand_name?: string;
    main_category_slug?: string;
    subcategory_name?: string;
    subcategory_slug?: string;
}

// Kiểu dữ liệu nội bộ cho component (Không đổi)
interface Subcategory {
    name: string;
    slug: string;
}

interface Props {
    mainCategorySlug: string | null;
    title?: string | null;
    icon?: string | null;
}

export default function HomeProductCarouselCards({ mainCategorySlug, title }: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>({});
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // MỚI: Lấy hàm addToCart từ CartContext bạn đã cung cấp
    const { addToCart } = useCart();

    const DOMAIN = "https://nhathuoc.trafficnhanh.com";
    
    // ... các hàm processApiResponse, useEffect, handleProductClick, ... không thay đổi ...
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processApiResponse = useCallback((apiProductData: any[]) => {
        const transformedProducts = apiProductData.map(p => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const categoryInfo = p.categories_full_path?.find((cat: any) => cat.subcategory_slug);
            return { ...p, subcategory_slug: categoryInfo?.subcategory_slug, subcategory_name: categoryInfo?.subcategory_name };
        });
        setProducts(transformedProducts);
        const relevantSubcategoriesMap = new Map<string, Subcategory>();
        transformedProducts.forEach(p => {
            if (p.subcategory_name && p.subcategory_slug && !relevantSubcategoriesMap.has(p.subcategory_slug)) {
                relevantSubcategoriesMap.set(p.subcategory_slug, { name: p.subcategory_name, slug: p.subcategory_slug });
            }
        });
        setSubcategories(Array.from(relevantSubcategoriesMap.values()));
        const defaultTypes: Record<string, string> = {};
        transformedProducts.forEach((p) => {
            if (p.variants && p.variants.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const defaultVariant = p.variants.find((v: any) => v.is_default === 1) || p.variants[0];
                if(defaultVariant) defaultTypes[p.id] = defaultVariant.unit_name;
            }
        });
        setSelectedTypes(defaultTypes);
    }, []);

    useEffect(() => {
        if (!mainCategorySlug) { setLoading(false); return; }
        const fetchData = async () => {
            setLoading(true);
            try {
                const apiUrl = `${DOMAIN}/products.php?action=theo_danh_muc_chinh&category_slug=${mainCategorySlug}`;
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error('API request failed');
                const productData: Product[] = await response.json();
                if (!Array.isArray(productData)) throw new Error('API did not return an array');
                processApiResponse(productData);
            } catch (error) {
                console.warn(`⚠️ Lỗi API cho '${mainCategorySlug}'.`, error);
                toast.error("Lỗi tải sản phẩm", { description: "Không thể tải dữ liệu từ máy chủ."});
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [mainCategorySlug, processApiResponse]);

    const handleProductClick = useCallback((product: Product) => {
        if (product && product.slug) {
            if (product.subcategory_slug) saveCategoryToHistory(product.subcategory_slug);
            router.push(`/san-pham/${product.slug}`);
        } else {
            console.error("Lỗi: Không thể chuyển trang vì product.slug không tồn tại.", product);
        }
    }, [router]);

    const updateProductType = (e: React.MouseEvent, productId: string, unit_name: string) => {
        e.stopPropagation();
        setSelectedTypes((prev) => ({ ...prev, [productId]: unit_name }));
    };
    
    // THAY ĐỔI: Hàm này được điều chỉnh để khớp chính xác với CartContext của bạn
    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();

        const selectedUnitName = selectedTypes[product.id];
        const selectedVariant = product.variants.find(v => v.unit_name === selectedUnitName);

        if (!selectedVariant) {
            toast.error("Vui lòng chọn loại sản phẩm.");
            return;
        }

        const primaryImage = product.images?.find(img => img.is_primary === 1) || product.images?.[0];
        // Đảm bảo image không bao giờ là null/undefined để khớp với interface CartItem
        const imageUrl = primaryImage ? `${DOMAIN}${primaryImage.image_url}` : '/placeholder-image.png';

        // Tạo đối tượng itemToAdd khớp với Omit<CartItem, 'id'>
        const itemToAdd = {
            productId: String(product.id),
            variantId: String(selectedVariant.id), // Chuyển sang string theo yêu cầu của context
            name: product.name,
            image: imageUrl,
            price: Number(selectedVariant.price),
            quantity: 1, // Luôn thêm 1 sản phẩm mỗi lần nhấn
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
    }

    const formatPrice = (price: string | number) => Number(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    const filteredProducts = selectedSubcategory === "all"
        ? products
        : products.filter(p => p.subcategory_name === selectedSubcategory);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                </div>
                <Tabs value={selectedSubcategory} onValueChange={(value) => setSelectedSubcategory(value)} className="w-full md:w-auto">
                    <TabsList className="bg-transparent h-auto flex flex-wrap gap-2">
                        <TabsTrigger value="all" className="bg-[#E5E7EB] text-[#333333] data-[state=active]:bg-[#F43F5E] data-[state=active]:text-white">Tất cả</TabsTrigger>
                        {subcategories.slice(0, 5).map((subcategory) => (
                            <TabsTrigger 
                                key={subcategory.slug}
                                value={subcategory.name}
                                className="bg-[#E5E7EB] text-[#333333] data-[state=active]:bg-[#F43F5E] data-[state=active]:text-white"
                            >
                                {subcategory.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {loading ? (
                // ... Skeleton loading không thay đổi ...
                <Carousel className="w-full">
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {[...Array(5)].map((_, index) => (
                            <CarouselItem key={index} className="basis-1/2 pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                <Card className="bg-white h-full"><CardContent className="p-3 space-y-3">
                                    <Skeleton className="w-full h-[150px] rounded" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <div className="h-[40px]"><Skeleton className="h-4 w-1/2" /></div>
                                    <Skeleton className="h-5 w-1/2" />
                                    <Skeleton className="h-5 w-1/3" />
                                    <Skeleton className="h-10 w-full" />
                                </CardContent></Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            ) : filteredProducts.length > 0 ? (
                <Carousel opts={{ align: "start", loop: filteredProducts.length > 5 }} className="w-full">
                    <CarouselContent className="-ml-2 md:-ml-4">
                            {filteredProducts.map(product => {
                            const selectedVariant = product.variants.find(v => v.unit_name === selectedTypes[product.id]) || product.variants[0];
                            const primaryImage = product.images?.find(img => img.is_primary === 1) || product.images?.[0];
                            const imageUrl = primaryImage ? `${DOMAIN}${primaryImage.image_url}` : null;
                            const discount = (selectedVariant && selectedVariant.original_price && Number(selectedVariant.original_price) > Number(selectedVariant.price)) 
                                ? Math.round(((Number(selectedVariant.original_price) - Number(selectedVariant.price)) / Number(selectedVariant.original_price)) * 100) 
                                : 0;
                            
                            return (
                                <CarouselItem key={product.id} className="basis-1/2 pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                    <Card
                                        onClick={() => handleProductClick(product)}
                                        className="bg-[#FFFFFF] shadow-md hover:shadow-lg text-black relative overflow-hidden h-full border border-[#E5E7EB] cursor-pointer group"
                                    >
                                        {/* ... JSX cho Badge và Image không đổi ... */}
                                        {discount > 0 && <Badge className="absolute top-2 left-2 bg-[#F43F5E] text-[#FFFFFF] z-10">Giảm {discount}%</Badge>}
                                        {product.brand_name && <Badge className="absolute top-2 right-2 bg-secondary text-white z-10">{product.brand_name}</Badge>}
                                        <CardContent className="p-3 flex flex-col h-full">
                                            <div className="relative flex justify-center items-center w-full h-[150px] mb-3 bg-gray-50 rounded-md">
                                                {imageUrl && (<Image src={imageUrl} alt={product.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw" className="object-contain group-hover:scale-105 transition-transform" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />)}
                                            </div>
                                            <h3 className="font-medium text-sm mb-2 h-10 line-clamp-2">{product.name}</h3>
                                            <div className="h-[40px] mb-2 flex items-center">
                                                {product.variants.length > 1 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {product.variants.map((variant) => (
                                                            <Button key={variant.id} variant={selectedTypes[product.id] === variant.unit_name ? "default" : "outline"} size="sm" className={`px-2 py-0 h-8 text-xs ${selectedTypes[product.id] === variant.unit_name ? "bg-rose-500 hover:bg-rose-600 text-white" : "text-gray-700 border-gray-300"}`} onClick={(e) => updateProductType(e, product.id, variant.unit_name)}>{variant.unit_name}</Button>
                                                        ))}
                                                    </div>
                                                ) : (product.variants.length === 1 && <div className="text-xs text-gray-500">Loại: {product.variants[0].unit_name}</div>)}
                                            </div>
                                            <div className="space-y-1 mt-auto">
                                                <p className="text-rose-600 font-bold">{formatPrice(selectedVariant?.price || 0)}₫</p>
                                                {discount > 0 && <p className="text-gray-500 text-sm line-through">{formatPrice(selectedVariant?.original_price || 0)}₫</p> }
                                            </div>
                                            {/* THAY ĐỔI: onClick đã được cập nhật để truyền cả event và product */}
                                            <Button onClick={(e) => handleAddToCart(e, product)} size="sm" className="w-full mt-3 bg-rose-500 hover:bg-rose-600 text-white">Thêm Giỏ Hàng</Button>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            )
                        })}
                    </CarouselContent>
                    <CarouselPrevious className="left-[-5px] sm:left-1 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-rose-500 text-white hover:bg-rose-600" />
                    <CarouselNext className="right-[-5px] sm:right-1 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-rose-500 text-white hover:bg-rose-600" />
                </Carousel>
            ) : (<div className="text-center text-[#333333] py-10 text-sm">Không có sản phẩm nào thuộc danh mục này.</div>)}
        </div>
    )
}