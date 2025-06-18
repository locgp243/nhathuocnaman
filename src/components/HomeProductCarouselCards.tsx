"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { saveCategoryToHistory } from "@/lib/localStorageUtils"
import { Product, ProductType } from "@/types/product"

interface Subcategory {
  name: string | null;
  slug: string | null;
}
interface Props {
  mainCategorySlug: string | null
  title?: string | null
  icon?: string | null
}

export default function HomeProductCarouselCards({ mainCategorySlug, title, icon }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [selectedTypes, setSelectedTypes] = useState<Record<string, ProductType>>({})
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const processApiResponse = useCallback((productData: Product[]) => {
    // Lọc sản phẩm theo mainCategorySlug
    const relevantProducts = productData.filter(p => p.main_category_slug === mainCategorySlug);
    setProducts(relevantProducts);
    
    // Tạo danh sách subcategory từ dữ liệu sản phẩm đã lọc
    const relevantSubcategoriesMap = new Map<string, Subcategory>();
    relevantProducts.forEach(p => {
      if (p.subcategory_name && !relevantSubcategoriesMap.has(p.subcategory_name)) {
        relevantSubcategoriesMap.set(p.subcategory_name, { name: p.subcategory_name, slug: p.subcategory_slug });
      }
    });
    setSubcategories(Array.from(relevantSubcategoriesMap.values()));
    
    // Set loại sản phẩm mặc định
    const defaultTypes: Record<string, ProductType> = {};
    relevantProducts.forEach((p) => {
      if (p.availableTypes && p.availableTypes.length > 0) { defaultTypes[p.id] = p.availableTypes[0]; }
    });
    setSelectedTypes(defaultTypes);
  }, [mainCategorySlug]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiUrl = `https://nhathuoc.trafficnhanh.com/products.php?action=theo_danh_muc_chinh&category_slug=${mainCategorySlug}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('API request failed');
        const productData: Product[] = await response.json();
        if (!productData || productData.length === 0) throw new Error('API returned no products');
        processApiResponse(productData);
      } catch (error) {
        console.warn(`⚠️ Lỗi API, sử dụng dữ liệu giả cho '${mainCategorySlug}'.`, error);
        // Fallback dùng mock data nếu API lỗi
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mainCategorySlug, processApiResponse]);

  const handleProductClick = useCallback((product: Product) => {
    if (product.subcategory_name) {
      saveCategoryToHistory(product.subcategory_name);
    }
    router.push(`/product/${product.slug}`);
  }, [router]);

  const updateProductType = (e: React.MouseEvent, productId: string, type: ProductType) => {
    e.stopPropagation();
    setSelectedTypes((prev) => ({ ...prev, [productId]: type }));
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Đã thêm vào giỏ hàng!");
  }

  const formatPrice = (price: number) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const filteredProducts = selectedSubcategory === "all"
    ? products
    : products.filter(p => p.subcategory_name === selectedSubcategory);

  // --- PHẦN RENDER ---
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          {icon && <div className="bg-secondary text-white rounded-full p-2"><Image src={icon} alt="icon" width={24} height={24} /></div>}
          <h2 className="text-2xl font-bold tracking-tight bg-destructive text-primary animate-bg-shimmer">{title}</h2>
        </div>
        <Tabs value={selectedSubcategory} onValueChange={(value) => setSelectedSubcategory(value)} className="w-full md:w-auto">
          <TabsList className="bg-transparent h-auto flex flex-wrap gap-2">
            <TabsTrigger value="all" className="bg-[#E5E7EB] text-[#333333] data-[state=active]:bg-[#F43F5E] data-[state=active]:text-white">Tất cả</TabsTrigger>
            
            {/* --- DÒNG CODE ĐÃ SỬA --- */}
            {subcategories
              .filter(sub => sub.name) // Chỉ giữ lại những subcategory có name (không phải null)
              .slice(0, 5)
              .map((subcategory) => (
                <TabsTrigger 
                  key={subcategory.slug || subcategory.name} 
                  value={subcategory.name!} // Thêm dấu ! để báo cho TS biết name chắc chắn là string ở đây
                  className="bg-[#E5E7EB] text-[#333333] data-[state=active]:bg-[#F43F5E] data-[state=active]:text-white"
                >
                  {subcategory.name}
                </TabsTrigger>
              ))}
            {/* ---------------------- */}

          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <Carousel className="w-full"> {/* Skeleton */}
          <CarouselContent className="-ml-2 md:-ml-4">
            {[...Array(5)].map((_, index) => (
              <CarouselItem key={index} className="basis-1/2 pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <Card className="bg-white h-full"><CardContent className="p-3 space-y-3">
                  <Skeleton className="w-full h-[150px] rounded" /><Skeleton className="h-4 w-3/4" /><div className="h-[40px]"><Skeleton className="h-4 w-1/2" /></div>
                  <Skeleton className="h-5 w-1/2" /><Skeleton className="h-5 w-1/3" /><Skeleton className="h-10 w-full" />
                </CardContent></Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : filteredProducts.length > 0 ? (
        <Carousel opts={{ align: "start", loop: filteredProducts.length > 5 }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {filteredProducts.map(product => (
              <CarouselItem key={product.id} className="basis-1/2 pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <Card
                  onClick={() => handleProductClick(product)}
                  className="bg-[#FFFFFF] shadow-md hover:shadow-lg text-black relative overflow-hidden h-full border border-[#E5E7EB] cursor-pointer"
                >
                  {product.discount > 0 && <Badge className="absolute top-2 left-2 bg-[#F43F5E] text-[#FFFFFF]">Giảm {product.discount}%</Badge>}
                  {product.subcategory_name && <Badge className="absolute top-2 right-2 bg-secondary text-white">{product.subcategory_name}</Badge>}
                  <CardContent className="p-3 flex flex-col h-full">
                    <div className="flex justify-center mb-3"><Image src={product.image || "/placeholder.svg"} alt={product.name} width={150} height={200} className="object-contain h-[150px]"/></div>
                    <h3 className="font-medium text-sm mb-2 h-10 line-clamp-2">{product.name}</h3>
                    <div className="h-[40px] mb-2 flex items-center">
                      {product.availableTypes && product.availableTypes.length > 1 ? (
                        <div className="flex flex-wrap gap-1">
                          {product.availableTypes.map((type, index) => (
                            <Button key={`${type}-${index}`}
                              variant={selectedTypes[product.id] === type ? "default" : "outline"}
                              size="sm"
                              className={`px-2 py-0 h-8 text-xs ${selectedTypes[product.id] === type ? "bg-rose-500 hover:bg-rose-600 text-white" : "text-gray-700 border-gray-300"}`}
                              onClick={(e) => updateProductType(e, product.id, type)}
                            >{type}</Button>
                          ))}
                        </div>
                      ) : ( product.availableTypes && product.availableTypes.length === 1 && <div className="text-xs text-gray-500">Loại: {product.availableTypes[0]}</div>)}
                    </div>
                    <div className="space-y-1 mt-auto">
                      <p className="text-rose-600 font-bold">{formatPrice(product.prices?.[selectedTypes[product.id]]?.discounted || 0)}₫</p>
                      {product.prices?.[selectedTypes[product.id]]?.original > product.prices?.[selectedTypes[product.id]]?.discounted &&
                        <p className="text-gray-500 text-sm line-through">{formatPrice(product.prices?.[selectedTypes[product.id]]?.original || 0)}₫</p>
                      }
                    </div>
                    <Button onClick={handleAddToCart} size="sm" className="w-full mt-3 bg-rose-500 hover:bg-rose-600 text-white">Thêm Giỏ Hàng</Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 w-12 h-12 rounded-full bg-rose-500 text-white hover:bg-rose-600" />
          <CarouselNext className="right-1 w-12 h-12 rounded-full bg-rose-500 text-white hover:bg-rose-600" />
        </Carousel>
      ) : (<div className="text-center text-[#333333] py-10 text-sm">Không có sản phẩm nào.</div>)}
    </div>
  )
}