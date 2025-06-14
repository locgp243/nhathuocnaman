"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Product, ProductType } from "@/types/product"
import SkeletonProductCards from "@/components/SkeletonProductCards"
import { API_ENDPOINTS } from "@/lib/api"
import { getClickHistory, getPopularSubcategories } from "@/lib/localStorageUtils"

// 1. IMPORT DỮ LIỆU GIẢ
// Dữ liệu này sẽ được dùng làm phương án dự phòng khi API lỗi hoặc không trả về dữ liệu.
import { mockProducts } from "@/lib/mock-data"

const MAIN_CATEGORY = "thuc-pham-chuc-nang"

export default function HomeRecommendProducts() {
  // --- Các State của Component ---
  const [products, setProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [selectedTypes, setSelectedTypes] = useState<Record<string, ProductType>>({})
  const [selectedTab, setSelectedTab] = useState<"recommend" | "all" | string>("recommend")
  const [clickHistory, setClickHistory] = useState<string[]>([])
  const [popularSubcategories, setPopularSubcategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // --- Các hàm tiện ích và xử lý sự kiện ---
  const formatPrice = (price: number) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  const handleTypeChange = (productId: string, type: ProductType) => {
    setSelectedTypes(prev => ({ ...prev, [productId]: type }))
  }

  // 2. TÁCH LOGIC XỬ LÝ DỮ LIỆU RA HÀM RIÊNG
  // Hàm này nhận vào một danh sách sản phẩm và thực hiện các bước thiết lập state cần thiết.
  // Giúp tránh lặp code và làm logic rõ ràng hơn.
  const processData = useCallback((productList: Product[]) => {
    setAllProducts(productList)
    
    // Khởi tạo loại mặc định cho sản phẩm
    const defaultTypes: Record<string, ProductType> = {}
    productList.forEach(product => {
      if (product.availableTypes?.length > 0) {
        defaultTypes[product.id] = product.availableTypes[0]
      }
    })
    setSelectedTypes(defaultTypes)

    // Lấy lịch sử và danh mục phổ biến từ localStorage (chỉ chạy ở client)
    if (typeof window !== "undefined") {
      const history = getClickHistory()
      setClickHistory(history)
      setPopularSubcategories(getPopularSubcategories(history))
      
      // Lọc sản phẩm gợi ý dựa trên lịch sử
      if (history.length > 0) {
        const popular = getPopularSubcategories(history)
        const recommended = productList.filter(p => popular.includes(p.subcategory_name))
        setProducts(recommended.length > 0 ? recommended : productList)
      } else {
        setProducts(productList) // Nếu không có lịch sử, hiển thị tất cả
      }
    } else {
      setProducts(productList)
    }
  }, []) // Dependency rỗng vì các hàm bên trong nó ổn định


  const handleTabChange = (value: string) => {
    const newTab = value as "recommend" | "all" | string
    setSelectedTab(newTab)

    if (newTab === "recommend") {
      const popular = getPopularSubcategories(clickHistory)
      const recommended = allProducts.filter(p => popular.includes(p.subcategory_name))
      setProducts(recommended.length > 0 ? recommended : allProducts)
    } else {
      const filtered = allProducts.filter(p => p.subcategory_name === newTab)
      setProducts(filtered)
    }
  }

  // 3. LOGIC TẢI DỮ LIỆU CHÍNH VỚI CƠ CHẾ DỰ PHÒNG
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Cố gắng fetch dữ liệu từ API thật
        const res = await fetch(`${API_ENDPOINTS.PRODUCTS}?main_category=${MAIN_CATEGORY}`)
        
        if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`)
        }
        
        const data: Product[] = await res.json()

        // Nếu API không trả về dữ liệu (mảng rỗng), cũng coi như lỗi để dùng mock data
        if (!data || data.length === 0) {
            throw new Error("API returned no data")
        }
        
        console.log("✅ Dữ liệu được tải từ API thật.");
        processData(data)

      } catch (err) {
        // Nếu có bất kỳ lỗi nào ở khối try, sẽ chạy vào đây
        console.warn("⚠️ Lỗi khi tải dữ liệu từ API, sử dụng dữ liệu giả (mock data) làm phương án dự phòng.", err)
        
        // Lọc dữ liệu giả để chỉ lấy các sản phẩm thuộc danh mục chính cần thiết
        const fallbackProducts = mockProducts.filter(p => p.main_category_slug === MAIN_CATEGORY);
        processData(fallbackProducts);

      } finally {
        // Dù thành công hay thất bại, cuối cùng cũng tắt trạng thái loading
        setIsLoading(false)
      }
    }
    
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Chỉ chạy 1 lần khi component được mount


  // --- CÁC HÀM RENDER (KHÔNG THAY ĐỔI GIAO DIỆN) ---
  const renderSkeleton = () => <SkeletonProductCards />

  const renderTypeSelector = (product: Product) => {
    if (!product.availableTypes?.length) return <div className="h-[40px] mb-2" />;
    if (product.availableTypes.length === 1) {
      return <div className="text-xs text-gray-500 h-[40px] mb-2 flex items-center">Loại: {product.availableTypes[0]}</div>;
    }
    return (
      <div className="flex flex-wrap gap-1 h-[40px] mb-2 items-center">
        {product.availableTypes.map((type) => (
          <Button
            key={type}
            variant={selectedTypes[product.id] === type ? "default" : "outline"}
            size="sm"
            className={`px-2 py-0 h-8 text-xs ${selectedTypes[product.id] === type ? "bg-[#F43F5E] hover:bg-[#E11D48] text-[#FFFFFF]" : "bg-destructive text-[#333333] border border-[#AAAAAA] hover:bg-[#E5E7EB]"}`}
            onClick={(e) => { e.stopPropagation(); handleTypeChange(product.id, type); }}
          >{type}</Button>
        ))}
      </div>
    );
  };

  const renderPriceInfo = (product: Product) => {
    const currentType = selectedTypes[product.id];
    const priceInfo = product.prices?.[currentType];
    if (!priceInfo) return <div className="space-y-1"><p className="text-gray-500 text-sm">Vui lòng chọn loại</p></div>;
    return (
      <div className="space-y-1">
        <p className="text-rose-600 font-bold">{formatPrice(priceInfo.discounted || 0)}₫</p>
        {priceInfo.original > priceInfo.discounted && (
          <p className="text-gray-500 text-sm line-through">{formatPrice(priceInfo.original)}₫</p>
        )}
      </div>
    );
  };

  const renderProductCard = (product: Product) => (
    <Card className="bg-[#FFFFFF] shadow-md hover:shadow-lg text-black relative overflow-hidden h-full border border-[#E5E7EB]">
      {product.discount > 0 && <Badge className="absolute top-2 left-2 bg-[#F43F5E] text-[#FFFFFF] animate-sparkle">Giảm {product.discount}%</Badge>}
      {product.subcategory_name && <Badge className="absolute top-2 right-2 bg-secondary text-white animate-sparkle">{product.subcategory_name}</Badge>}
      <CardContent className="p-3">
        <div className="flex justify-center mb-3">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} width={150} height={200} className="object-contain h-[150px]" />
        </div>
        <h3 className="font-medium text-sm mb-2 h-10 line-clamp-2 text-[#333333]">{product.name}</h3>
        {renderTypeSelector(product)}
        {renderPriceInfo(product)}
        <Button size="sm" className="animate-bg-shimmer w-full mt-3 bg-rose-500 hover:bg-rose-600 text-white">Thêm Giỏ Hàng</Button>
      </CardContent>
    </Card>
  );

  const renderProductCarousel = () => {
    if (products.length === 0) {
      return (
        <div className="text-center text-gray-500 py-10 text-sm">
          {selectedTab === "recommend" && clickHistory.length === 0 
            ? "Chưa có lịch sử xem sản phẩm. Hãy khám phá các sản phẩm để nhận gợi ý!" 
            : "Không có sản phẩm nào được tìm thấy."}
        </div>
      );
    }
    return (
      <Carousel opts={{ align: "start", loop: products.length > 4 }} className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map(product => (
            <CarouselItem key={product.id} className="basis-1/2 pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              {renderProductCard(product)}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1 w-12 h-12 rounded-full bg-rose-500 text-white shadow-md flex items-center justify-center hover:bg-[#E11D48]" />
        <CarouselNext className="right-1 w-12 h-12 rounded-full bg-rose-500 text-white shadow-md flex items-center justify-center hover:bg-[#E11D48]" />
      </Carousel>
    );
  };
  
  const getRecommendTabText = () => clickHistory.length === 0 ? "Dành cho bạn" : `Gợi ý cho bạn`

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-secondary text-white rounded-full p-2">
              <Image src="/images/thucphamchucnang.png" alt="Logo" width={24} height={24} className="object-contain" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight bg-destructive text-primary animate-bg-shimmer">
              ĐỀ XUẤT SẢN PHẨM
            </h2>
          </div>
          <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full md:w-auto">
            <TabsList className="bg-transparent h-auto flex flex-wrap gap-2 animate-bg-shimmer">
              <TabsTrigger value="recommend" className="bg-[#E5E7EB] text-[#333333] data-[state=active]:bg-[#F43F5E] data-[state=active]:text-white">
                {getRecommendTabText()}
              </TabsTrigger>
              {popularSubcategories.map((subcategoryName) => (
                <TabsTrigger key={subcategoryName} value={subcategoryName} className="bg-[#E5E7EB] text-[#333333] data-[state=active]:bg-[#F43F5E] data-[state=active]:text-white">
                  {subcategoryName}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        {isLoading ? renderSkeleton() : renderProductCarousel()}
      </div>
    </div>
  )
}