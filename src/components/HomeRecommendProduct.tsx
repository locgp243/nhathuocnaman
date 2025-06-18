"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Product, ProductType } from "@/types/product"
import SkeletonProductCards from "@/components/SkeletonProductCards"
import { saveCategoryToHistory, getClickHistory } from "@/lib/localStorageUtils"

// Định nghĩa kiểu cho danh mục con
interface Subcategory {
  name: string;
  slug: string;
}

interface HomeRecommendProductsProps {
  title?: string;
  icon?: string;
}

export default function HomeRecommendProducts({ 
  title = "ĐỀ XUẤT SẢN PHẨM",
  icon = "/images/thucphamchucnang.png"
}: HomeRecommendProductsProps) {

  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);
  // CHANGED: selectedTab giờ sẽ lưu slug
  const [selectedTab, setSelectedTab] = useState<string>("recommend"); 
  const [selectedTypes, setSelectedTypes] = useState<Record<string, ProductType>>({});

  // --- HÀM XỬ LÝ SỰ KIỆN ---

  // CHANGED: Lưu subcategory_SLUG thay vì name
  const handleProductClick = useCallback((product: Product) => {
    if (product.subcategory_slug) {
      saveCategoryToHistory(product.subcategory_slug);
    }
    router.push(`/product/${product.slug}`);
  }, [router]);

  // CHANGED: Logic chuyển tab và lọc giờ hoạt động với SLUG
  const handleTabChange = useCallback((tabSlug: string) => {
    setSelectedTab(tabSlug);

    if (tabSlug === "recommend") {
      const historySlugs = getClickHistory();
      if (historySlugs.length > 0) {
        const recommendedProducts = allProducts.filter(p => 
          p.subcategory_slug && historySlugs.includes(p.subcategory_slug)
        );
        setProducts(recommendedProducts.length > 0 ? recommendedProducts : allProducts);
      } else {
        setProducts(allProducts);
      }
    } else {
      const filteredProducts = allProducts.filter(p => p.subcategory_slug === tabSlug);
      setProducts(filteredProducts);
    }
  }, [allProducts]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const historySlugs = getClickHistory();
        let productData: Product[] = [];

        if (historySlugs.length > 0) {
            // CHANGED: Sửa lại cách gọi API cho đúng
            // Action được đặt trên URL, không phải trong body
            const apiUrl = `https://nhathuoc.trafficnhanh.com/products.php?action=theo_danh_muc_cap_2`;
            
            const formData = new FormData();
            historySlugs.forEach(slug => {
                formData.append('action','theo_danh_muc_cap_2');
                formData.append('category_slugs[]', slug);
            });

            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error(`API gợi ý thất bại`);
            productData = await response.json();
        } else {
            // Nếu không có lịch sử, ta có thể hiển thị danh sách trống
            productData = [];
        }

        if (!productData) productData = [];
        
        setAllProducts(productData);
        setProducts(productData);

        const subcategoriesMap = new Map<string, Subcategory>();
        productData.forEach(p => {
            if (p.subcategory_slug && p.subcategory_name && !subcategoriesMap.has(p.subcategory_slug)) {
                subcategoriesMap.set(p.subcategory_slug, { name: p.subcategory_name, slug: p.subcategory_slug });
            }
        });
        setAvailableSubcategories(Array.from(subcategoriesMap.values()));
        
        const defaultTypes: Record<string, ProductType> = {};
        productData.forEach(p => { if (p.availableTypes?.length > 0) defaultTypes[p.id] = p.availableTypes[0] });
        setSelectedTypes(defaultTypes);

      } catch (err) {
        console.warn("⚠️ Lỗi API, sử dụng dữ liệu giả.", err);
        setProducts([]); // Đặt lại thành mảng rỗng khi có lỗi
        setAllProducts([]);
        setAvailableSubcategories([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);

  const formatPrice = (price: number) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const handleTypeChange = (e: React.MouseEvent, productId: string, type: ProductType) => { e.stopPropagation(); setSelectedTypes(prev => ({ ...prev, [productId]: type })); };
  const handleAddToCart = (e: React.MouseEvent) => { e.stopPropagation(); console.log("Thêm vào giỏ hàng"); };

  const renderProductCard = (product: Product) => {
    const priceInfo = product.prices?.[selectedTypes[product.id]];
    const originalPrice = priceInfo?.original;
    const discountedPrice = priceInfo?.discounted;

    return (
      <Card 
        onClick={() => handleProductClick(product)}
        className="bg-[#FFFFFF] shadow-md hover:shadow-lg text-black relative overflow-hidden h-full border border-[#E5E7EB] cursor-pointer"
      >
        {product.discount > 0 && <Badge className="absolute top-2 left-2 bg-[#F43F5E] text-[#FFFFFF] animate-sparkle">Giảm {product.discount}%</Badge>}
        {product.subcategory_name && <Badge className="absolute top-2 right-2 bg-secondary text-white animate-sparkle">{product.subcategory_name}</Badge>}
        <CardContent className="p-3 flex flex-col h-full">
          <div className="flex justify-center mb-3"><Image src={product.image || "/placeholder.svg"} alt={product.name} width={150} height={200} className="object-contain h-[150px]" /></div>
          <h3 className="font-medium text-sm mb-2 h-10 line-clamp-2 text-[#333333]">{product.name}</h3>
          <div className="h-[40px] mb-2 flex items-center">
            {product.availableTypes && product.availableTypes.length > 1 ? (
              <div className="flex flex-wrap gap-1">
                {product.availableTypes.map((type, index) => (
                  <Button key={`${type}-${index}`} variant={selectedTypes[product.id] === type ? "default" : "outline"} size="sm" className={`px-2 py-0 h-8 text-xs ${selectedTypes[product.id] === type ? "bg-[#F43F5E] hover:bg-[#E11D48] text-[#FFFFFF]" : "text-gray-700 border-gray-300"}`} onClick={(e) => handleTypeChange(e, product.id, type)}>{type}</Button>
                ))}
              </div>
            ) : product.availableTypes && product.availableTypes.length === 1 ? <div className="text-xs text-gray-500">Loại: {product.availableTypes[0]}</div> : null}
          </div>
          <div className="space-y-1 mt-auto">
            <p className="text-rose-600 font-bold">{formatPrice(discountedPrice || 0)}₫</p>
            {(typeof originalPrice === 'number' && typeof discountedPrice === 'number' && originalPrice > discountedPrice) && (<p className="text-gray-500 text-sm line-through">{formatPrice(originalPrice)}₫</p>)}
          </div>
          <Button size="sm" className="w-full mt-3 bg-rose-500 hover:bg-rose-600 text-white" onClick={handleAddToCart}>Thêm Giỏ Hàng</Button>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-secondary text-white rounded-full p-2"><Image src={icon} alt="icon" width={24} height={24} className="object-contain" /></div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          </div>
          <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full md:w-auto">
            <TabsList className="bg-transparent h-auto flex flex-wrap gap-2">
              <TabsTrigger value="recommend" className="bg-[#E5E7EB] text-[#333333] data-[state=active]:bg-[#F43F5E] data-[state=active]:text-white">Gợi ý cho bạn</TabsTrigger>
              {/* CHANGED: Dùng slug làm key và value, dùng name để hiển thị */}
              {availableSubcategories.map((sub) => (
                <TabsTrigger key={sub.slug} value={sub.slug} className="bg-[#E5E7EB] text-[#333333] data-[state=active]:bg-[#F43F5E] data-[state=active]:text-white">
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
                <CarouselPrevious className="left-1 w-12 h-12 rounded-full bg-rose-500 text-white shadow-md hover:bg-[#E11D48]" />
                <CarouselNext className="right-1 w-12 h-12 rounded-full bg-rose-500 text-white shadow-md hover:bg-[#E11D48]" />
            </Carousel>
        )}
      </div>
    </div>
  )
}