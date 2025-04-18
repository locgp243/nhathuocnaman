"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

// Product type options
type ProductType = "Hộp" | "Vỉ" | "Ống" | "Chai" | "Gói" | "Hũ" | "Lọ" | "Tuýp" | "Vỉ 10 viên" | "Vỉ 20 viên"

// Subcategory types for medications
type MedicationSubcategory =
  | "Thuốc kháng sinh"
  | "Thuốc giảm đau"
  | "Thuốc hạ sốt"
  | "Thuốc tiêu hóa"
  | "Thuốc tim mạch"
  | "Thuốc hô hấp"
type ProductSubcategory = MedicationSubcategory

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

// Sample pharmaceutical products with different available types
const products: Product[] = [
  {
    id: "1",
    name: "Amoxicillin 500mg điều trị nhiễm khuẩn đường hô hấp, tiết niệu, da và mô mềm",
    image: "/images/thuockhangsinh.webp",
    subcategory: "Thuốc kháng sinh",
    discount: 15,
    availableTypes: ["Hộp", "Vỉ"],
    prices: {
      Hộp: { original: 120000, discounted: 102000 },
      Vỉ: { original: 25000, discounted: 21250 },
    },
    rating: 5,
    installment: true,
  },
  {
    id: "2",
    name: "Paracetamol 500mg giảm đau, hạ sốt hiệu quả cho người lớn và trẻ em trên 12 tuổi",
    image: "/images/thuockhangsinh2.webp",
    subcategory: "Thuốc hạ sốt",
    discount: 10,
    availableTypes: ["Hộp", "Vỉ", "Chai"],
    prices: {
      Hộp: { original: 45000, discounted: 40500 },
      Vỉ: { original: 12000, discounted: 10800 },
      Chai: { original: 65000, discounted: 58500 },
    },
    rating: 5,
    installment: true,
  },
  {
    id: "3",
    name: "Omeprazole 20mg điều trị loét dạ dày, tá tràng và trào ngược dạ dày thực quản",
    image: "/images/thuoctieuhoa.webp",
    subcategory: "Thuốc tiêu hóa",
    discount: 20,
    availableTypes: ["Hộp", "Vỉ"],
    prices: {
      Hộp: { original: 180000, discounted: 144000 },
      Vỉ: { original: 35000, discounted: 28000 },
    },
    rating: 5,
    installment: true,
  },
  {
    id: "4",
    name: "Atorvastatin 10mg điều trị tăng cholesterol máu và phòng ngừa bệnh tim mạch",
    image: "/images/thuoctimmach.webp",
    subcategory: "Thuốc tim mạch",
    discount: 12,
    availableTypes: ["Hộp"],
    prices: {
      Hộp: { original: 250000, discounted: 220000 },
    },
    rating: 5,
    installment: true,
  },
  {
    id: "5",
    name: "Ibuprofen 400mg giảm đau, kháng viêm cho đau đầu, đau cơ và đau khớp",
    image: "/images/thuocthankinh.webp",
    subcategory: "Thuốc giảm đau",
    discount: 18,
    availableTypes: ["Chai", "Vỉ", "Hộp"],
    prices: {
      Chai: { original: 85000, discounted: 69700 },
      Vỉ: { original: 20000, discounted: 16400 },
      Hộp: { original: 120000, discounted: 98400 },
    },
    rating: 5,
    installment: true,
  },
  {
    id: "6",
    name: "Salbutamol 2mg điều trị hen phế quản, bệnh phổi tắc nghẽn mạn tính (COPD)",
    image: "/images/thuochohap.webp",
    subcategory: "Thuốc hô hấp",
    discount: 15,
    availableTypes: ["Hộp", "Vỉ"],
    prices: {
      Hộp: { original: 150000, discounted: 127500 },
      Vỉ: { original: 30000, discounted: 25500 },
    },
    rating: 5,
    installment: true,
  },
]

// Subcategory filters
const subcategories: ProductSubcategory[] = [
  "Thuốc kháng sinh",
  "Thuốc giảm đau",
  "Thuốc hạ sốt",
  "Thuốc tiêu hóa",
  "Thuốc tim mạch",
  "Thuốc hô hấp",
]

export default function PromotionMedicine() {
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
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Category Banner */}
      <div className="rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-white rounded-full p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 3L5 3C3.89543 3 3 3.89543 3 5L3 19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M12 8V16" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 12H16" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Sản phẩm thuốc</h2>
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
                        <p className="text-blue-600 font-bold">
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
          <div className="text-center text-gray-500 py-10 text-sm">Không có sản phẩm nào được tìm thấy.</div>
        )}
      </div>
    </div>
  )
}
