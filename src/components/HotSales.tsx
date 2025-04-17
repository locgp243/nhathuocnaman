"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

// Product type options
type ProductType = "Hộp" | "Vỉ" | "Ống" | "Chai" | "Gói" | "Hũ" | "Lọ" | "Tuýp" | "Vỉ 10 viên" | "Vỉ 20 viên"
type ProductCategory = "Thuốc kháng sinh" | "Vitamin" | "Thuốc giảm đau" | "Dụng cụ y tế"

// Product interface
interface Product {
  id: string
  name: string
  image: string
  discount: number
  category: ProductCategory
  // Only include price information for available types
  prices: Partial<{
    [key in ProductType]: {
      original: number
      discounted: number
    }
  }>
  availableTypes: ProductType[] // List of available types for this product
  rating: number
  installment: boolean
}

// Sample pharmaceutical products with different available types
const products: Product[] = [
  {
    id: "1",
    name: "Hỗn dịch uống men vi sinh Enterogermina Gut Defense Sanofi tăng cường tiêu hóa, hỗ trợ bảo vệ đường ruột",
    image: "/images/sanpham1.webp",
    category: "Vitamin",
    discount: 33,
    availableTypes: ["Hộp", "Vỉ", "Ống"],
    prices: {
      Hộp: { original: 120000, discounted: 80000 },
      Vỉ: { original: 25000, discounted: 16750 },
      Ống: { original: 15000, discounted: 10050 },
    },
    rating: 5,
    installment: true,
  },
  {
    id: "2",
    name: "Nước súc miệng Pearlie White Fluorinze Anti-bacterial Fluoride 750ml chống lại vi khuẩn gây mảng bám sâu răng",
    image: "/images/sanpham2.webp",
    category: "Thuốc kháng sinh",
    discount: 21,
    availableTypes: ["Chai", "Lọ"],
    prices: {
      Chai: { original: 350000, discounted: 276500 },
      Lọ: { original: 280000, discounted: 221200 },
    },
    rating: 5,
    installment: true,
  },
  {
    id: "3",
    name: "Dung dịch MorningKids Increase Height bổ sung vitamin, tăng chiều cao cho trẻ (150ml)",
    image: "/images/sanpham3.webp",
    category: "Vitamin",
    discount: 19,
    availableTypes: ["Chai", "Hộp"],
    prices: {
      Chai: { original: 180000, discounted: 145800 },
      Hộp: { original: 320000, discounted: 259200 },
    },
    rating: 5,
    installment: true,
  },
  {
    id: "4",
    name: "Máy xông khí dung nén khí Yuwell 403M chuyển thuốc dạng dung dịch thành sương mù cho niêm mạc hô hấp",
    image: "/images/sanpham4.webp",
    category: "Dụng cụ y tế",
    discount: 17,
    availableTypes: ["Hộp"],
    prices: {
      Hộp: { original: 450000, discounted: 373500 },
    },
    rating: 5,
    installment: true,
  },
  {
    id: "5",
    name: "Siro Brauer Baby & Kids Liquid Zinc bổ sung kẽm, tăng sức đề kháng cho trẻ (200ml)",
    image: "/images/sanpham5.webp",
    category: "Vitamin",
    discount: 18,
    availableTypes: ["Chai", "Lọ", "Hộp"],
    prices: {
      Chai: { original: 380000, discounted: 311600 },
      Lọ: { original: 320000, discounted: 262400 },
      Hộp: { original: 450000, discounted: 369000 },
    },
    rating: 5,
    installment: true,
  },
  {
    id: "6",
    name: "Thực phẩm bảo vệ sức khỏe NMN PQQ",
    image: "/images/sanpham6.webp",
    category: "Vitamin",
    discount: 18,
    availableTypes: ["Hộp", "Gói", "Vỉ 10 viên"],
    prices: {
      Hộp: { original: 380000, discounted: 311600 },
      Gói: { original: 50000, discounted: 41000 },
      "Vỉ 10 viên": { original: 120000, discounted: 98400 },
      "Vỉ 20 viên": { original: 220000, discounted: 180400 },
    },
    rating: 5,
    installment: true,
  },
]

// Category filters
const categories: ProductCategory[] = [
  "Thuốc kháng sinh",
  "Vitamin",
  "Thuốc giảm đau",
  "Dụng cụ y tế",
]

export default function PharmaHotSale() {
  // Initialize selected types with the first available type for each product
  const [selectedTypes, setSelectedTypes] = useState<Record<string, ProductType>>(
    products.reduce(
      (acc, product) => ({
        ...acc,
        [product.id]: product.availableTypes[0],
      }),
      {},
    ),
  )

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all")

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 10,
    seconds: 44,
  })

  // Update product type
  const updateProductType = (productId: string, type: ProductType) => {
    setSelectedTypes((prev) => ({
      ...prev,
      [productId]: type,
    }))
  }

  // Format price with comma separators
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  // Filter products by category
  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory)

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)


    return () => clearInterval(timer)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hot Sale Banner */}
      <div className="bg-[#309D94] text-white p-4 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-white rounded-full p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                  fill="#FF385C"
                />
                <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="#FF385C" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">HOT SALE CUỐI TUẦN</h2>
          </div>

          <Tabs
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value as ProductCategory | "all")}
            className="w-full md:w-auto"
          >
            <TabsList className="bg-transparent h-auto flex flex-wrap gap-2">
              <TabsTrigger
                value="all"
                className="bg-white text-gray-700 data-[state=active]:bg-rose-500 data-[state=active]:text-white"
              >
                Tất cả
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="bg-white text-gray-700 data-[state=active]:bg-rose-500 data-[state=active]:text-white"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

        </div>

        {/* Countdown Timer */}
        <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
          <span className="text-sm">Bắt đầu sau:</span>
          <div className="flex items-center gap-1">
            <span className="bg-amber-50 text-rose-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span>:</span>
            <span className="bg-amber-50 text-rose-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span>:</span>
            <span className="bg-amber-50 text-rose-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Products Carousel */}
        {filteredProducts.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {filteredProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="basis-1/2 pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <Card className="bg-white text-black relative overflow-hidden h-full">
                    <Badge className="absolute top-2 left-2 bg-rose-500">Giảm {product.discount}%</Badge>
                    <Badge className="absolute top-2 right-2 bg-blue-500">{product.category}</Badge>

                    <CardContent className="p-3">
                      <div className="flex justify-center mb-3">
                        <Image
                          src={product.image || ""}
                          alt={product.name}
                          width={150}
                          height={200}
                          className="object-contain h-[150px]"
                        />
                      </div>

                      <h3 className="font-medium text-sm mb-2 h-10 line-clamp-2">{product.name}</h3>

                      <div className="h-[40px] mb-2">
                        {product.availableTypes.length > 1 ? (
                          <div className="flex flex-wrap gap-1">
                            {product.availableTypes.map((type) => (
                              <Button
                                key={type}
                                variant={selectedTypes[product.id] === type ? "default" : "outline"}
                                size="sm"
                                className={`px-2 py-0 h-8 text-xs ${
                                  selectedTypes[product.id] === type
                                    ? "bg-rose-500 hover:bg-rose-600 text-white"
                                    : "text-gray-700 border-gray-300"
                                }`}
                                onClick={() => updateProductType(product.id, type)}
                              >
                                {type}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 flex items-center h-full">
                            Loại: {product.availableTypes[0]}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-rose-600 font-bold">
                          {formatPrice(product.prices[selectedTypes[product.id]]?.discounted || 0)}₫
                        </p>
                        <p className="text-gray-500 text-sm line-through">
                          {formatPrice(product.prices[selectedTypes[product.id]]?.original || 0)}₫
                        </p>
                      </div>

                      <Button size="sm" className="w-full mt-3 bg-rose-500 hover:bg-rose-600 text-white">
                        Thêm Giỏ Hàng
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1 w-12 h-12 rounded-full bg-rose-500 text-white shadow-md flex items-center justify-center hover:bg-rose-600" />
            <CarouselNext className="right-1 w-12 h-12 rounded-full bg-rose-500 text-white shadow-md flex items-center justify-center hover:bg-rose-600" />

          </Carousel>
        ) : (
          <div className="text-center text-white py-10 text-sm">
            Không có sản phẩm nào được tìm thấy.
          </div>
        )}

      </div>
    </div>
  )
}
