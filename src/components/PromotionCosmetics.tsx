"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

// Product type options
type ProductType = "Hộp" | "Chai" | "Tuýp" | "Lọ" | "Gói" | "Set"

// Subcategory types
type CosmeticSubcategory = "Dưỡng da" | "Sáng da" | "Rửa mặt" | "Chống nắng" | "Mặt nạ" | "Trang điểm"
type ProductSubcategory = CosmeticSubcategory

// Product interface
interface Product {
  id: string
  name: string
  image: string
  discount: number
  subcategory: ProductSubcategory
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

// Sample cosmetic products with different available types
const products: Product[] = [
  {
    id: "1",
    name: "Sữa rửa mặt Cetaphil Gentle Skin Cleanser làm sạch dịu nhẹ cho da nhạy cảm",
    image: "/images/mypham1.webp",
    subcategory: "Rửa mặt",
    discount: 25,
    availableTypes: ["Chai", "Tuýp"],
    prices: {
      Chai: { original: 220000, discounted: 165000 },
      Tuýp: { original: 120000, discounted: 90000 },
    },
    rating: 5,
    installment: true,
  },
  {
    id: "2",
    name: "Serum Vitamin C Melano CC Intensive Anti-Spot Essence giúp làm mờ thâm nám",
    image: "/images/mypham2.webp",
    subcategory: "Sáng da",
    discount: 20,
    availableTypes: ["Lọ", "Set"],
    prices: {
      Lọ: { original: 350000, discounted: 280000 },
      Set: { original: 650000, discounted: 520000 },
    },
    rating: 5,
    installment: true,
  },
  {
    id: "3",
    name: "Kem chống nắng La Roche-Posay Anthelios XL SPF 50+ bảo vệ da khỏi tia UV",
    image: "/images/mypham3.webp",
    subcategory: "Chống nắng",
    discount: 15,
    availableTypes: ["Tuýp", "Chai"],
    prices: {
      Tuýp: { original: 420000, discounted: 357000 },
      Chai: { original: 650000, discounted: 552500 },
    },
    rating: 5,
    installment: true,
  },
  {
    id: "4",
    name: "Mặt nạ dưỡng ẩm Laneige Water Sleeping Mask cấp nước chuyên sâu qua đêm",
    image: "/images/mypham4.webp",
    subcategory: "Mặt nạ",
    discount: 30,
    availableTypes: ["Hộp", "Gói"],
    prices: {
      Hộp: { original: 750000, discounted: 525000 },
      Gói: { original: 50000, discounted: 35000 },
    },
    rating: 5,
    installment: true,
  },
  {
    id: "5",
    name: "Kem dưỡng ẩm Neutrogena Hydro Boost Water Gel cấp nước cho da khô",
    image: "/images/mypham5.webp",
    subcategory: "Dưỡng da",
    discount: 18,
    availableTypes: ["Hộp", "Lọ", "Tuýp"],
    prices: {
      Hộp: { original: 380000, discounted: 311600 },
      Lọ: { original: 320000, discounted: 262400 },
      Tuýp: { original: 250000, discounted: 205000 },
    },
    rating: 5,
    installment: true,
  },
  {
    id: "6",
    name: "Phấn nền Maybelline Fit Me Matte + Poreless che phủ lỗ chân lông",
    image: "/placeholder.svg?height=200&width=150",
    subcategory: "Trang điểm",
    discount: 22,
    availableTypes: ["Hộp", "Set"],
    prices: {
      Hộp: { original: 220000, discounted: 171600 },
      Set: { original: 450000, discounted: 351000 },
    },
    rating: 5,
    installment: true,
  },
]

// Subcategory filters
const subcategories: ProductSubcategory[] = ["Dưỡng da", "Sáng da", "Rửa mặt", "Chống nắng", "Mặt nạ", "Trang điểm"]

export default function CosmeticsCategory() {
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

  const [selectedSubcategory, setSelectedSubcategory] = useState<ProductSubcategory | "all">("all")

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

  // Filter products by subcategory
  const filteredProducts =
    selectedSubcategory === "all" ? products : products.filter((product) => product.subcategory === selectedSubcategory)

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Category Banner */}
      <div className="bg-[#309d94] text-white p-4 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-white rounded-full p-2">
              <Image src="/images/mypham.png" alt="Logo" width={24} height={24} className="object-contain" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Mỹ phẩm</h2>
          </div>

          <Tabs
            value={selectedSubcategory}
            onValueChange={(value) => setSelectedSubcategory(value as ProductSubcategory | "all")}
            className="w-full md:w-auto"
          >
            <TabsList className="bg-transparent h-auto flex flex-wrap gap-2">
              <TabsTrigger
                value="all"
                className="bg-white text-gray-700 data-[state=active]:bg-rose-500 data-[state=active]:text-white"
              >
                Tất cả
              </TabsTrigger>
              {subcategories.map((subcategory) => (
                <TabsTrigger
                  key={subcategory}
                  value={subcategory}
                  className="bg-white text-gray-700 data-[state=active]:bg-rose-500 data-[state=active]:text-white"
                >
                  {subcategory}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
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
                    <Badge className="absolute top-2 right-2 bg-blue-500">{product.subcategory}</Badge>

                    <CardContent className="p-3">
                      <div className="flex justify-center mb-3">
                        <Image
                          src={product.image || "/placeholder.svg?height=200&width=150"}
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
            <CarouselPrevious className="left-1 w-12 h-12 rounded-full bg-rose-500 text-white shadow-md flex items-center justify-center hover:bg-purple-600" />
            <CarouselNext className="right-1 w-12 h-12 rounded-full bg-rose-500 text-white shadow-md flex items-center justify-center hover:bg-purple-600" />
          </Carousel>
        ) : (
          <div className="text-center text-white py-10 text-sm">Không có sản phẩm nào được tìm thấy.</div>
        )}
      </div>
    </div>
  )
}
