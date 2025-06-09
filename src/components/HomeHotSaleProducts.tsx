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

const STORAGE_KEYS = {
  CLICK_HISTORY: "subcategory_click_history",
  CART: "cart_items"
}

// === TYPES ===
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
  // State
  const [products, setProducts] = useState<Product[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [selectedTypes, setSelectedTypes] = useState<Record<string, ProductType>>({})
  const [selectedCategory, setSelectedCategory] = useState<ProductSubcategory | "all">("all")
  const [isLoading, setIsLoading] = useState(true)

  // === DATA FETCHING ===
  const loadSubcategories = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.SUBCATEGORIES}`)
      if (!response.ok) throw new Error("Failed to fetch subcategories")
      const data = await response.json()
      setSubcategories(data)
    } catch (error) {
      console.error("Error loading subcategories:", error)
    }
  }

  const loadProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_ENDPOINTS.PRODUCTS}`)
      if (!response.ok) throw new Error("Failed to fetch products")
      const data: Product[] = await response.json()
      
      setProducts(data)
      initializeDefaultTypes(data)
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const initializeDefaultTypes = (products: Product[]) => {
    const defaultTypes: Record<string, ProductType> = {}
    products.forEach((product) => {
      if (product.availableTypes?.length > 0) {
        defaultTypes[product.id] = product.availableTypes[0]
      }
    })
    setSelectedTypes(defaultTypes)
  }

  // === EVENT HANDLERS ===
  const handleTypeChange = (productId: string, type: ProductType) => {
    setSelectedTypes(prev => ({ ...prev, [productId]: type }))
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value as ProductSubcategory | "all")
  }

  const handleProductClick = (product: Product) => {
    if (!product.subcategory_name) return
    
    try {
      const history = getStoredHistory()
      history.push(product.subcategory_name)
      localStorage.setItem(STORAGE_KEYS.CLICK_HISTORY, JSON.stringify(history))
      console.log(`Saved subcategory: ${product.subcategory_name}`)
    } catch (error) {
      console.error("Error saving subcategory:", error)
    }
  }

  const handleAddToCart = (product: Product) => {
    const selectedType = selectedTypes[product.id]
    if (!selectedType) {
      alert("Vui lòng chọn loại sản phẩm trước khi thêm vào giỏ.")
      return
    }

    const priceInfo = product.prices?.[selectedType]
    if (!priceInfo) {
      alert("Thông tin giá không tồn tại.")
      return
    }

    try {
      const cart = getStoredCart()
      const existingIndex = cart.findIndex(
        item => item.id === product.id && item.selectedType === selectedType
      )

      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        selectedType,
        price: priceInfo.discounted || 0,
        originalPrice: priceInfo.original || 0,
        image: product.image || "/placeholder.png",
        subcategory: product.subcategory_name,
        quantity: existingIndex >= 0 ? cart[existingIndex].quantity + 1 : 1,
        timestamp: Date.now()
      }

      if (existingIndex >= 0) {
        cart[existingIndex] = cartItem
      } else {
        cart.push(cartItem)
      }

      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart))
      alert(`Đã thêm '${product.name} (${selectedType})' vào giỏ hàng!`)
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  // === HELPER FUNCTIONS ===
  const getStoredHistory = (): string[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CLICK_HISTORY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  } 

  const getStoredCart = (): CartItem[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const getFilteredProducts = () => {
    return selectedCategory === "all" 
      ? products 
      : products.filter(product => product.subcategory_name === selectedCategory)
  }

  const getItemsPerView = () => {
    if (typeof window === "undefined") return 5
    const width = window.innerWidth
    if (width >= 1280) return 5 // xl
    if (width >= 1024) return 4 // lg
    if (width >= 768) return 3  // md
    return 2 // sm
  }

  // === RENDER FUNCTIONS ===
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
        {/* Badges */}
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
          {/* Product Image */}
          <div className="flex justify-center mb-3">
            <Image 
              src={product.image || "/placeholder.png"} 
              alt={product.name} 
              width={150} 
              height={150} 
              className="object-contain h-[120px] md:h-[150px]" 
            />
          </div>
          
          {/* Product Name */}
          <h3 className="font-medium text-sm text-[#333333] mb-2 h-10 line-clamp-2">
            {product.name}
          </h3>
          
          {/* Type Selector */}
          {renderTypeSelector(product)}
          
          {/* Price Info */}
          {renderPriceInfo(product)}
          
          {/* Add to Cart Button */}
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

  // === EFFECTS ===
  useEffect(() => {
    loadSubcategories()
    loadProducts()
  }, [])

  // === MAIN RENDER ===
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
      <div className="bg-primary text-[#FFFFFF] p-4 rounded-lg shadow-lg animate-bg-flow animate-bg-shimmer">
        {/* Header */}
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

          {/* Category Tabs */}
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

        {/* Countdown Timer */}
        <CountdownTimer />

        {/* Products */}
        {isLoading ? <SkeletonProductCards /> : renderProductCarousel()}
      </div>
    </div>
  )
}