"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image";

// Phone brand type
type Brand = {
  id: string
  name: string
}

// Phone product type
type Phone = {
  id: string
  name: string
  image: string
  currentPrice: number
  originalPrice: number
  discount: number | null
  smemberDiscount: number
  studentDiscount?: number
  rating: number
  promotionText?: string
  isFavorite: boolean
}

export default function PromotionProduct() {
  // Available brands
  const brands: Brand[] = [
    { id: "all", name: "Xem tất cả" },
    { id: "apple", name: "Apple" },
    { id: "samsung", name: "Samsung" },
    { id: "xiaomi", name: "Xiaomi" },
    { id: "oppo", name: "OPPO" },
    { id: "vivo", name: "vivo" },
    { id: "realme", name: "realme" },
    { id: "asus", name: "ASUS" },
    { id: "tecno", name: "TECNO" },
    { id: "nokia", name: "Nokia" },
    { id: "infinix", name: "Infinix" },
    { id: "nothing", name: "Nothing" },
  ]

  // Sample phone data
  const phones: Phone[] = [
    {
      id: "1",
      name: "iPhone 16 Pro Max 256GB | Chính hãng VN/A",
      image: "/placeholder.svg?height=200&width=100",
      currentPrice: 30990000,
      originalPrice: 34990000,
      discount: 11,
      smemberDiscount: 310000,
      rating: 5,
      promotionText: "Không phí chuyển đổi khi trả góp 0% qua thẻ tín dụng kỳ hạn 3-6...",
      isFavorite: false,
    },
    {
      id: "2",
      name: "OPPO FIND N5",
      image: "/placeholder.svg?height=200&width=100",
      currentPrice: 44990000,
      originalPrice: 44990000,
      discount: null,
      smemberDiscount: 450000,
      studentDiscount: 200000,
      rating: 5,
      promotionText: "Tặng Oppo Care trị giá 6 triệu. 24 tháng bảo hành & 12 tháng...",
      isFavorite: false,
    },
    {
      id: "3",
      name: "Samsung Galaxy S25 Ultra 12GB 256GB",
      image: "/placeholder.svg?height=200&width=100",
      currentPrice: 28990000,
      originalPrice: 33990000,
      discount: 15,
      smemberDiscount: 290000,
      studentDiscount: 600000,
      rating: 5,
      promotionText: "Không phí chuyển đổi khi trả góp 0% qua thẻ tín dụng kỳ hạn 3-6...",
      isFavorite: false,
    },
    {
      id: "4",
      name: "OPPO Reno10 Pro+ 5G 12GB 256GB",
      image: "/placeholder.svg?height=200&width=100",
      currentPrice: 10990000,
      originalPrice: 19990000,
      discount: 45,
      smemberDiscount: 110000,
      studentDiscount: 200000,
      rating: 5,
      promotionText: "Nhận ngay 500.000đ mua kèm Gia dụng (áp dụng mua tại shop)",
      isFavorite: false,
    },
    {
      id: "5",
      name: "Samsung Galaxy S24 FE 5G 8GB 128GB",
      image: "/placeholder.svg?height=200&width=100",
      currentPrice: 12990000,
      originalPrice: 16990000,
      discount: 24,
      smemberDiscount: 130000,
      studentDiscount: 600000,
      rating: 5,
      promotionText: "Không phí chuyển đổi khi trả góp 0% qua thẻ tín dụng kỳ hạn 3-6...",
      isFavorite: false,
    },
  ]

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [favoritePhones, setFavoritePhones] = useState<string[]>([])

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    if (favoritePhones.includes(id)) {
      setFavoritePhones(favoritePhones.filter((phoneId) => phoneId !== id))
    } else {
      setFavoritePhones([...favoritePhones, id])
    }
  }

  // Format price to Vietnamese currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ"
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-around">
        <h2 className="text-1xl font-bold uppercase">Điện thoại nổi bật</h2>

        <Tabs defaultValue="all" className="">
          <TabsList className="flex flex-wrap gap-2 h-auto">
            {brands.map((brand) => (
              <TabsTrigger
                key={brand.id}
                value={brand.id}
                onClick={() => setSelectedBrand(brand.id)}
                className="border-gray-200 bg-white hover:bg-gray-100 px-4 py-2 data-[state=active]:bg-gray-100"
              >
                {brand.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="relative w-full">
        <div className="flex overflow-x-auto pb-6 gap-4 scrollbar-hide snap-x snap-mandatory">
          {phones.map((phone) => (
            <Card
              key={phone.id}
              className="overflow-hidden border border-gray-200 flex-shrink-0 w-[220px] h-full flex flex-col snap-start"
            >
              {/* Discount badge */}
              <div className="relative">
                {phone.discount && (
                  <Badge className="absolute top-2 left-2 bg-red-600 text-white font-medium z-10">
                    Giảm {phone.discount}%
                  </Badge>
                )}
                {!phone.discount && (
                  <Badge className="absolute top-2 left-2 bg-blue-600 text-white font-medium z-10">Trả góp 0%</Badge>
                )}

                {/* Phone image */}
                <div className="flex justify-center p-4 bg-white">
                  <Image
                    src={phone.image || "/placeholder.svg"}
                    alt={phone.name}
                    width={150}
                    height={200}
                    className="object-contain h-[200px]"
                  />
                </div>
              </div>

              <CardContent className="flex-grow p-4">
                {/* Phone name */}
                <h3 className="font-medium text-sm mb-2 line-clamp-2 h-10">{phone.name}</h3>

                {/* Prices */}
                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-bold">{formatPrice(phone.currentPrice)}</span>
                    {phone.originalPrice !== phone.currentPrice && (
                      <span className="text-gray-500 line-through text-sm">{formatPrice(phone.originalPrice)}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Smember giảm thêm đến{" "}
                    <span className="text-red-600 font-medium">{formatPrice(phone.smemberDiscount)}</span>
                  </div>
                  {phone.studentDiscount && (
                    <div className="text-xs text-gray-600 mt-1">
                      S-Student giảm thêm đến{" "}
                      <span className="text-red-600 font-medium">{formatPrice(phone.studentDiscount)}</span>
                    </div>
                  )}
                </div>

                {/* Promotion text */}
                {phone.promotionText && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{phone.promotionText}</p>
                )}
              </CardContent>

              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                {/* Rating stars */}
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < phone.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                {/* Favorite button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-500"
                  onClick={() => toggleFavorite(phone.id)}
                >
                  <span className="mr-1 text-xs">Yêu thích</span>
                  <Heart
                    className={`w-4 h-4 ${favoritePhones.includes(phone.id) ? "fill-red-500 text-red-500" : ""}`}
                  />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
