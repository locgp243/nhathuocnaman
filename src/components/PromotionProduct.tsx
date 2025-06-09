"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"


// Product type options
type ProductType = "Hộp" | "Vỉ" | "Ống" | "Chai" | "Gói" | "Hũ" | "Lọ" | "Tuýp" | "Vỉ 10 viên" | "Vỉ 20 viên"

// Subcategory types
type TPCNSubcategory = "Bổ não" | "Tiêu hóa" | "Bổ mắt" | "Tăng cường miễn dịch" | "Bổ tim mạch" | "Vitamin tổng hợp"
type ProductSubcategory = TPCNSubcategory

// Product interface
interface Product {
  id: string
  name: string
  image: string
  slug: string
  price: string
  discount: number
  category: string
  prices: Partial<{
    [key in ProductType]: {
      original: number
      discounted: number
    }
  }>
  availableTypes: ProductType[]
  rating: number
  installment: boolean
  category_name: string
  subcategory_name: string
  main_category_name: string
}

interface Subcategory {
  id: string
  name: string
  slug: string
}

export default function ProductCategory() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedTypes, setSelectedTypes] = useState<Record<string, ProductType>>({})
  const [selectedSubcategory, setSelectedSubcategory] = useState<ProductSubcategory | "all">("all")
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(true)

  
    useEffect(() => {
      fetch("http://localhost/server/get_sub_category_by_main.php?main_category=thuc-pham-chuc-nang")
        .then(res => res.json())
        .then(data => setSubcategories(data))
        .catch(err => console.error("Lỗi khi tải danh mục phụ:", err))
    }, [])

  useEffect(() => {
    setLoading(true)

    fetch("http://localhost/server/get_product_by_main_category.php?main_category=thuc-pham-chuc-nang")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        const defaultTypes: Record<string, ProductType> = {}
        data.forEach((p: Product) => {
          if (p.availableTypes?.length > 0) {
            defaultTypes[p.id] = p.availableTypes[0]
          }
        })
        setSelectedTypes(defaultTypes)
      })
      .catch((err) => console.error("Lỗi khi tải sản phẩm:", err))
      .finally(() => setLoading(false))

  }, [])

  const updateProductType = (productId: string, type: ProductType) => {
    setSelectedTypes((prev) => ({
      ...prev,
      [productId]: type,
    }))
  }

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const filteredProducts =
    selectedSubcategory === "all"
      ? products
      : products.filter((product) => product.subcategory_name === selectedSubcategory)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-white rounded-full p-2">
              <Image src="/images/thucphamchucnang.png" alt="Logo" width={24} height={24} className="object-contain" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Thực phẩm chức năng</h2>
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
              {subcategories.slice(0, 5).map((subcategory) => (
                <TabsTrigger
                  key={subcategory.id}
                  value={subcategory.name}
                  className="bg-white text-gray-700 data-[state=active]:bg-rose-500 data-[state=active]:text-white"
                >
                  {subcategory.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {[...Array(5)].map((_, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/2 pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <Card className="bg-white h-full">
                    <CardContent className="p-3 space-y-3">
                      <Skeleton className="w-full h-[150px] rounded" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          ) : filteredProducts.length > 0 ? (
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {filteredProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="basis-1/2 pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <Card className="bg-white text-black relative overflow-hidden h-full">
                    <Badge className="absolute top-2 left-2 bg-rose-500">Giảm {product.discount}%</Badge>
                    <Badge className="absolute top-2 right-2 bg-blue-500">{product.subcategory_name}</Badge>

                    <CardContent className="p-3">
                      <div className="flex justify-center mb-3">
                        <Image
                          src={product.image || "/placeholder.svg"}
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
          <div className="text-center text-white py-10 text-sm">Không có sản phẩm nào được tìm thấy.</div>
        )}
      </div>
    </div>
  )
}
