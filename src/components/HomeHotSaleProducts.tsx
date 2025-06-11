"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import CountdownTimer from "@/components/CountdownTime"
import { Product, ProductType } from "@/types/product"
import { Subcategory, ProductSubcategory } from "@/types/subcategory"
import SkeletonProductCards from "@/components/SkeletonProductCards"
import { API_ENDPOINTS } from "@/lib/api"

// 1. IMPORT DỮ LIỆU GIẢ
// Dữ liệu này sẽ được dùng như một phương án dự phòng an toàn.
import { mockProducts, mockSubcategories } from "@/lib/mock-data"

// === TYPES (Có thể giữ lại hoặc chuyển hết vào /types) ===
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CartItem {
  id: string
  name: string
  selectedType: ProductType
  price: number
  originalPrice: number
  image: string
  subcategory: string
  quantity: number
  timestamp: number
}

// === MAIN COMPONENT ===
export default function HomeHotSaleProducts() {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState<Product[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [selectedTypes, setSelectedTypes] = useState<Record<string, ProductType>>({})
  const [selectedCategory, setSelectedCategory] = useState<ProductSubcategory | "all">("all")
  const [isLoading, setIsLoading] = useState(true)

  // 2. TÁI CẤU TRÚC LOGIC VÀO CÁC HÀM HELPER
  // Điều này giúp code sạch sẽ và dễ tái sử dụng hơn.
  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const handleTypeChange = (productId: string, type: ProductType) => {
    setSelectedTypes(prev => ({ ...prev, [productId]: type }))
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value as ProductSubcategory | "all")
  }

  // --- 3. CẬP NHẬT LOGIC TẢI DỮ LIỆU VỚI CƠ CHẾ DỰ PHÒNG (FALLBACK) ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Cố gắng fetch đồng thời cả sản phẩm và danh mục từ API thật
        const [productRes, subcategoryRes] = await Promise.all([
          fetch(API_ENDPOINTS.PRODUCTS), // Giả sử endpoint này trả về các sản phẩm hot sale
          fetch(API_ENDPOINTS.SUBCATEGORIES) // Giả sử endpoint này trả về các danh mục con tương ứng
        ]);

        // Nếu một trong hai API không thành công, sẽ chủ động gây ra lỗi để nhảy vào khối catch
        if (!productRes.ok || !subcategoryRes.ok) {
          throw new Error("API request failed");
        }

        const productData: Product[] = await productRes.json();
        const subcategoryData: Subcategory[] = await subcategoryRes.json();
        
        // Nếu API không trả về sản phẩm, cũng coi như lỗi để dùng mock data
        if (productData.length === 0) {
            throw new Error("API returned no products");
        }

        console.log("✅ Dữ liệu được tải từ API thật.");
        // Nếu thành công, thiết lập state với dữ liệu từ API
        setProducts(productData)
        setSubcategories(subcategoryData)
        initializeDefaultTypes(productData)

      } catch (error) {
        // Nếu có bất kỳ lỗi nào ở khối try, luồng sẽ nhảy vào đây
        console.warn("⚠️ Lỗi khi tải dữ liệu từ API, sử dụng dữ liệu giả (mock data) làm phương án dự phòng.", error);
        
        // Thiết lập state với dữ liệu từ file mock-data.ts
        setProducts(mockProducts)
        setSubcategories(mockSubcategories) // Giả sử mock-data.ts có export mockSubcategories
        initializeDefaultTypes(mockProducts)

      } finally {
        // Dù thành công hay thất bại, cuối cùng luôn tắt trạng thái loading
        setIsLoading(false)
      }
    };

    loadData()
  }, []) // Mảng dependency rỗng để useEffect chỉ chạy 1 lần khi component được mount

  
  // --- Các hàm logic và render còn lại giữ nguyên cấu trúc, không thay đổi giao diện ---

  const initializeDefaultTypes = (productsToInit: Product[]) => {
    const defaultTypes: Record<string, ProductType> = {}
    productsToInit.forEach((product) => {
      if (product.availableTypes?.length > 0) {
        defaultTypes[product.id] = product.availableTypes[0]
      }
    })
    setSelectedTypes(defaultTypes)
  }

  const handleProductClick = (product: Product) => {
    if (!product.subcategory_name) return
    // Logic lưu vào localStorage...
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddToCart = (product: Product) => {
    // Logic thêm vào giỏ hàng...
  }

  const getFilteredProducts = () => {
    return selectedCategory === "all" 
      ? products 
      : products.filter(product => product.subcategory_name === selectedCategory)
  }

  const getItemsPerView = () => {
    if (typeof window === "undefined") return 5
    const width = window.innerWidth
    if (width >= 1280) return 5
    if (width >= 1024) return 4
    if (width >= 768) return 3
    return 2
  }

  const renderTypeSelector = (product: Product) => {
    if (!product.availableTypes?.length) {
      return <div className="h-[40px] mb-2" />
    }
    if (product.availableTypes.length === 1) {
      return (
        <div className="text-xs text-[#6B7280] flex items-center h-[40px] mb-2">
          Loại: {product.availableTypes[0]}
        </div>
      )
    }
    return (
      <div className="flex flex-wrap gap-1 h-[40px] mb-2 items-center">
        {product.availableTypes.map((type) => (
          <Button 
            key={type} 
            variant={selectedTypes[product.id] === type ? "default" : "outline"} 
            size="sm"
            className={`px-2 py-0 h-8 text-xs ${
              selectedTypes[product.id] === type 
                ? "bg-[#F43F5E] hover:bg-[#E11D48] text-[#FFFFFF]"
                : "bg-neutral text-[#333333] border border-[#AAAAAA] hover:bg-[#E5E7EB]"
            }`}
            onClick={(e) => {
              e.stopPropagation()
              handleTypeChange(product.id, type)
            }}
          >
            {type}
          </Button>
        ))}
      </div>
    )
  }

  const renderPriceInfo = (product: Product) => {
    const currentType = selectedTypes[product.id]
    const priceInfo = product.prices?.[currentType]
    if (!priceInfo) {
      return (
        <div className="space-y-1 mt-auto">
          <p className="text-[#AAAAAA] text-sm h-[calc(1.25rem+0.25rem+0.875rem)] flex items-end">
            Vui lòng chọn loại
          </p>
        </div>
      )
    }
    return (
      <div className="space-y-1 mt-auto">
        <p className="text-[#F43F5E] font-bold text-base">
          {formatPrice(priceInfo.discounted)}₫
        </p>
        {priceInfo.original > priceInfo.discounted && (
          <p className="text-[#AAAAAA] text-xs line-through">
            {formatPrice(priceInfo.original)}₫
          </p>
        )}
      </div>
    )
  }
  
  const renderProductCard = (product: Product) => {
    const currentType = selectedTypes[product.id]
    const priceInfo = product.prices?.[currentType]
    return (
      <Card 
        className="bg-[#FFFFFF] text-[#333333] relative overflow-hidden h-full cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
        onClick={() => handleProductClick(product)}
      >
        {product.discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-[#F43F5E] text-[#FFFFFF] z-10">
            Giảm {product.discount}%
          </Badge>
        )}
        {product.subcategory_name && (
          <Badge className="absolute top-2 right-2 bg-secondary text-[#FFFFFF] z-10">
            {product.subcategory_name}
          </Badge>
        )}
        <CardContent className="p-3 flex flex-col flex-grow">
          <div className="flex justify-center mb-3">
            <Image 
              src={product.image || "/placeholder.png"} 
              alt={product.name} 
              width={150} 
              height={150} 
              className="object-contain h-[120px] md:h-[150px]" 
            />
          </div>
          <h3 className="font-medium text-sm text-[#333333] mb-2 h-10 line-clamp-2">
            {product.name}
          </h3>
          {renderTypeSelector(product)}
          {renderPriceInfo(product)}
          <Button 
            size="sm" 
            className="w-full mt-3 bg-[#F43F5E] hover:bg-[#E11D48] text-[#FFFFFF]"
            onClick={(e) => {
              e.stopPropagation()
              handleAddToCart(product)
            }}
            disabled={!priceInfo || !selectedTypes[product.id]}
          >
            Thêm Giỏ Hàng
          </Button>
        </CardContent>
      </Card>
    )
  }

  const renderProductCarousel = () => {
    const filteredProducts = getFilteredProducts()
    if (filteredProducts.length === 0) {
      return (
        <div className="text-center text-[#FFFFFF] py-10 text-sm">
          Không có sản phẩm nào được tìm thấy.
        </div>
      )
    }
    const itemsPerView = getItemsPerView()
    const showNavigation = filteredProducts.length > itemsPerView
    return (
      <Carousel 
        opts={{ align: "start", loop: showNavigation }} 
        className="w-full"
      > 
        <CarouselContent className="-ml-2 md:-ml-4">
          {filteredProducts.map((product) => (
            <CarouselItem 
              key={`${product.id}-${selectedCategory}`}
              className="basis-1/2 pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              {renderProductCard(product)}
            </CarouselItem>
          ))}
        </CarouselContent>
        {showNavigation && (
          <>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F43F5E] text-[#FFFFFF] shadow-md flex items-center justify-center hover:bg-[#E11D48]" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F43F5E] text-[#FFFFFF] shadow-md flex items-center justify-center hover:bg-[#E11D48]" />
          </>
        )}
      </Carousel>
    )
  }

  // --- PHẦN JSX CHÍNH (GIAO DIỆN) KHÔNG THAY ĐỔI ---
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
      <div className="bg-primary text-[#FFFFFF] p-4 rounded-lg shadow-lg animate-bg-flow animate-bg-shimmer">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-[#FFFFFF] rounded-full p-1 sm:p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#F43F5E" />
                <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="#F43F5E" />
              </svg>
            </div>
            <h2 className="text-accent text-xl sm:text-2xl font-bold tracking-tight animate-sparkle">HOT SALE</h2>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#FFFFFF] animate-sparkle">CUỐI TUẦN</span>
          </div>
          <Tabs 
            value={selectedCategory} 
            onValueChange={handleCategoryChange}
            className="w-full md:w-auto"
          >
            <TabsList className="bg-transparent h-auto flex flex-wrap gap-1 sm:gap-2 justify-center md:justify-end">
              <TabsTrigger 
                value="all" 
                className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 bg-secondary text-[#FFFFFF] data-[state=active]:bg-[#F43F5E] data-[state=active]:text-[#FFFFFF] rounded"
              >
                Tất cả
              </TabsTrigger>
              {subcategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.name} 
                  className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 bg-secondary text-[#FFFFFF] data-[state=active]:bg-[#F43F5E] data-[state=active]:text-[#FFFFFF] rounded"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <CountdownTimer />
        {isLoading ? <SkeletonProductCards /> : renderProductCarousel()}
      </div>
    </div>
  )
}