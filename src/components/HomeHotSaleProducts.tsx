"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
// import CountdownTimer from "@/components/CountdownTime"
import { Product, ProductType } from "@/types/product"
import SkeletonProductCards from "@/components/SkeletonProductCards"
import { saveCategoryToHistory } from "@/lib/localStorageUtils"
// import { mockProducts } from "@/lib/mock-data" // Giữ lại để dự phòng

// Interface cho Subcategory (danh mục cấp 2)
interface Subcategory {
  name: string;
  slug: string;
}

export default function HomeHotSaleProducts() {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Lưu tất cả sản phẩm hot sale
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]); // Các tab lọc, được suy ra từ sản phẩm
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTypes, setSelectedTypes] = useState<Record<string, ProductType>>({});
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // --- LOGIC TẢI DỮ LIỆU ĐÃ ĐƯỢC CẬP NHẬT ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // CHANGED: Chỉ cần gọi 1 API duy nhất cho hot sales
        const apiUrl = `https://nhathuoc.trafficnhanh.com/products.php?action=hot_sales`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const productData: Product[] = await response.json();
        
        // Thiết lập state sản phẩm
        setAllProducts(productData);

        // NEW: Tự động tạo danh sách tab lọc từ các subcategory có trong sản phẩm
        const subcategoriesMap = new Map<string, Subcategory>();
        productData.forEach(p => {
          if (p.subcategory_slug && p.subcategory_name && !subcategoriesMap.has(p.subcategory_slug)) {
            subcategoriesMap.set(p.subcategory_slug, { name: p.subcategory_name, slug: p.subcategory_slug });
          }
        });
        setSubcategories(Array.from(subcategoriesMap.values()));
        
        // Thiết lập loại sản phẩm mặc định
        const defaultTypes: Record<string, ProductType> = {};
        productData.forEach((product) => {
          if (product.availableTypes?.length > 0) {
            defaultTypes[product.id] = product.availableTypes[0];
          }
        });
        setSelectedTypes(defaultTypes);

      } catch (error) {
        console.warn("⚠️ Lỗi API, sử dụng dữ liệu giả Hot Sale.", error);
        // Fallback dùng mock data nếu API lỗi
        // setAllProducts(mockProducts);
        // const subcategoriesMap = new Map<string, Subcategory>();
        // mockProducts.forEach(p => { 
        //     if (p.subcategory_slug && p.subcategory_name && !subcategoriesMap.has(p.subcategory_slug)) {
        //         subcategoriesMap.set(p.subcategory_slug, {name: p.subcategory_name, slug: p.subcategory_slug})
        //     }
        // });
        // setSubcategories(Array.from(subcategoriesMap.values()));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Chạy 1 lần duy nhất khi component mount

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---

  // NEW: Bổ sung logic click để lưu slug vào localStorage
  const handleProductClick = useCallback((product: Product) => {
    if (product.subcategory_slug) {
      saveCategoryToHistory(product.subcategory_slug);
    }
    router.push(`/product/${product.slug}`);
  }, [router]);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTypeChange = (e: React.MouseEvent, productId: string, type: ProductType) => {
    e.stopPropagation();
    setSelectedTypes(prev => ({ ...prev, [productId]: type }));
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    console.log("Thêm vào giỏ hàng:", product.name);
  };

  // --- LOGIC LỌC VÀ RENDER ---

  const formatPrice = (price: number): string => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // CHANGED: Lọc sản phẩm dựa trên slug đã chọn
  const filteredProducts = selectedCategorySlug === "all" 
    ? allProducts 
    : allProducts.filter(product => product.subcategory_slug === selectedCategorySlug);

  const renderProductCard = (product: Product) => {
    // API hot_sales có thể không trả về cấu trúc 'prices' phức tạp, nên ta lấy trực tiếp
    const discountedPrice = Number(product.discounted_price || 0);
    const originalPrice = Number(product.original_price || 0);

    return (
      <Card 
        className="bg-[#FFFFFF] text-[#333333] relative overflow-hidden h-full cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
        onClick={() => handleProductClick(product)}
      >
        {product.discounted_price > 0 && <Badge className="absolute top-2 left-2 bg-[#F43F5E] text-[#FFFFFF] z-10">Giảm {product.discount_percent}%</Badge>}
        {product.subcategory_name && <Badge className="absolute top-2 right-2 bg-secondary text-[#FFFFFF] z-10">{product.subcategory_name}</Badge>}
        <CardContent className="p-3 flex flex-col flex-grow">
          <div className="flex justify-center mb-3">
            <Image src={'https://nhathuoc.trafficnhanh.com/' + product.image || "/placeholder.png"} alt={product.name} width={150} height={150} className="object-contain h-[120px] md:h-[150px]" />
          </div>
          <h3 className="font-medium text-sm text-[#333333] mb-2 h-10 line-clamp-2">{product.name}</h3>
          
          <div className="h-[40px] mb-2 flex items-center">
            {product.unit_name && <div className="text-xs text-[#6B7280]">Loại: {product.unit_name}</div>}
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
              {subcategories.map((category) => (
                <TabsTrigger key={category.slug} value={category.slug} className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 bg-secondary text-[#FFFFFF] data-[state=active]:bg-[#F43F5E] data-[state=active]:text-[#FFFFFF] rounded">{category.name}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        {/* <CountdownTimer /> */}
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
                </>}
            </Carousel>
        )}
      </div>
    </div>
  )
}