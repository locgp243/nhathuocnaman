"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Truck,
  Clock,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PharmacyWebsite() {
  // State for location selector
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [location, setLocation] = useState("Quận 10, Hồ Chí Minh")

  // State for banner carousel
  const [currentBanner, setCurrentBanner] = useState(0)

  // State for product types
  const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>({})

  // Banner carousel data
  const banners = [
    {
      id: 1,
      image: "/images/banner-ca1.jpg",
      title: "Thương hiệu TPCN Hàng đầu Nhật Bản",
      discount: "Giảm đến 25%",
      description: "Không có chất bảo quản, không có thuốc nhuộm thực phẩm*",
    },
    {
      id: 2,
      image: "/images/banner-ca2.jpg",
      title: "COSTAR",
      discount: "Giảm đến 30%",
      description: "Thương hiệu dầu cá Omega-3 hàng đầu",
    },
  ]

  // Categories data
  const categories = [
    {
      id: 1,
      name: "Vitamin và khoáng chất",
      icon: "/images/icon-cate/thucphamchucnang/vitamin.png",
      count: 185,
      href: "/vitamin-khoang-chat",
    },
    {
      id: 2,
      name: "Bổ gan, thanh nhiệt",
      icon: "/images/icon-cate/thucphamchucnang/bogan.png",
      count: 26,
      href: "/bo-gan-thanh-nhiet",
    },
    {
      id: 3,
      name: "Bổ não",
      icon: "/images/icon-cate/thucphamchucnang/bonao.png",
      count: 37,
      href: "/bo-nao",
    },
    {
      id: 4,
      name: "Bổ phổi, hô hấp",
      icon: "/images/icon-cate/thucphamchucnang/bophe.png",
      count: 48,
      href: "/bo-phoi-ho-hap",
    },
    {
      id: 5,
      name: "Bổ tim xương khớp",
      icon: "/images/icon-cate/thucphamchucnang/boxuong.png",
      count: 37,
      href: "/bo-tim-xuong-khop",
    },
    {
      id: 6,
      name: "Hỗ trợ tiêu hóa",
      icon: "/images/icon-cate/thucphamchucnang/tieuhoa.png",
      count: 55,
      href: "/ho-tro-tieu-hoa",
    },
    {
      id: 7,
      name: "Kẹo ngậm, viên ngậm",
      icon: "/images/icon-cate/thucphamchucnang/keongam.png",
      count: 12,
      href: "/keo-ngam-vien-ngam",
    },
    {
      id: 8,
      name: "Làm đẹp, giảm cân",
      icon: "/images/icon-cate/thucphamchucnang/lamdep.png",
      count: 55,
      href: "/lam-dep-giam-can",
    },
    {
      id: 9,
      name: "Dầu cá, bổ mắt",
      icon: "/images/icon-cate/thucphamchucnang/bomat.png",
      count: 40,
      href: "/dau-ca-bo-mat",
    },
    {
      id: 10,
      name: "Thảo dược tự nhiên",
      icon: "/images/icon-cate/thucphamchucnang/thaoduoc.png",
      count: 19,
      href: "/thao-duoc-tu-nhien",
    },
    {
      id: 11,
      name: "Hỗ trợ tim mạch",
      icon: "/images/icon-cate/thucphamchucnang/botim.png",
      count: 20,
      href: "/ho-tro-tim-mach",
    },
    {
      id: 12,
      name: "Hỗ trợ tiểu đường",
      icon: "/images/icon-cate/thucphamchucnang/tieuduong.png",
      count: 9,
      href: "/ho-tro-tieu-duong",
    },
    {
      id: 13,
      name: "Tăng sinh lý, bổ thận",
      icon: "/images/icon-cate/thucphamchucnang/bothan.png",
      count: 51,
      href: "/tang-sinh-ly-bo-than",
    },
    {
      id: 14,
      name: "Hỗ trợ ung thư",
      icon: "/images/icon-cate/thucphamchucnang/ungthu.png",
      count: 8,
      href: "/ho-tro-ung-thu",
    },
    {
      id: 15,
      name: "Hỗ trợ trị giãn tĩnh mạch, táo bón",
      icon: "/images/icon-cate/thucphamchucnang/taobon.jpg",
      count: 26,
      href: "/tao-bon",
    },
  ]

  // Products data
  const products = [
    {
      id: "1",
      name: "Viên nhai Wellkid Multivitamin tăng cường sức khỏe",
      image: "/images/sanpham1.webp",
      originalPrice: 420000,
      discountedPrice: 388000,
      discount: 10,
      unit: "30 viên nhai",
      description: "Vitamin tổng hợp",
      category: "vitamin",
      availableTypes: ["Hộp", "Vỉ"],
    },
    {
      id: "2",
      name: "Dung dịch Levadion K2 + D3 giúp giảm nguy cơ bệnh xương",
      image: "/images/sanpham2.webp",
      originalPrice: 299000,
      discountedPrice: 298000,
      discount: 0,
      unit: "1 chai x 10ml",
      description: "Vitamin tổng hợp",
      category: "vitamin",
      availableTypes: ["Hộp", "Vỉ"],
    },
    {
      id: "3",
      name: "Evergreen Women's Ginseng Angelica Gold tăng cường sinh lý",
      image: "/images/sanpham3.webp",
      originalPrice: 720000,
      discountedPrice: 710000,
      discount: 20,
      unit: "1 lọ x 60 viên",
      description: "",
      category: "vitamin",
      availableTypes: ["Lọ"],
    },
    {
      id: "4",
      name: "Dầu cá Costar Omega-3 hỗ trợ sức khỏe tim mạch, bổ mắt",
      image: "/images/sanpham4.webp",
      originalPrice: 765000,
      discountedPrice: 742500,
      discount: 3,
      unit: "1 lọ x 200 viên",
      description: "Vitamin tổng hợp",
      category: "vitamin",
      availableTypes: ["Lọ", "Hộp"],
    },
    {
      id: "5",
      name: "Siro ăn ngon Baby Plus Gold x2 bổ bổ sung khoáng, tăng cường tiêu hóa",
      image: "/images/sanpham5.webp",
      originalPrice: 285000,
      discountedPrice: 256500,
      discount: 10,
      unit: "30 gói x 10ml",
      description: "Vitamin tổng hợp",
      category: "vitamin",
      availableTypes: ["Hộp", "Gói"],
    },
    {
      id: "6",
      name: "Men vi sinh Bioamicus Complete giúp bổ sung lợi khuẩn, tăng đề kháng",
      image: "/images/sanpham6.webp",
      originalPrice: 480000,
      discountedPrice: 470000,
      discount: 0,
      unit: "1 chai x 10ml",
      description: "Vitamin tổng hợp",
      category: "vitamin",
      availableTypes: ["Chai"],
    },
    {
      id: "7",
      name: "Viên uống Feroglobin B12 hỗ trợ tăng hấp thu sắt máu",
      image: "/images/mypham1.webp",
      originalPrice: 355000,
      discountedPrice: 353000,
      discount: 0,
      unit: "2 vỉ x 15 viên",
      description: "Vitamin tổng hợp",
      category: "vitamin",
      availableTypes: ["Vỉ"],
    },
    {
      id: "8",
      name: "Dầu cá Healthy Care Fish Oil Omega 3 1000mg hỗ trợ não bộ",
      image: "/images/mypham2.webp",
      originalPrice: 600000,
      discountedPrice: 621000,
      discount: 10,
      unit: "1 lọ x 400 viên",
      description: "",
      category: "vitamin",
      availableTypes: ["Lọ"],
    },
    {
      id: "9",
      name: "Pharmaton Essential bổ sung vitamin và khoáng chất",
      image: "/images/mypham3.webp",
      originalPrice: 208000,
      discountedPrice: 207000,
      discount: 0,
      unit: "1 lọ x 30 viên",
      description: "Vitamin tổng hợp",
      category: "vitamin",
      availableTypes: ["Lọ", "Hộp"],
    },
    {
      id: "10",
      name: "Nat B bổ sung vitamin B, giảm mệt mỏi",
      image: "/images/mypham4.webp",
      originalPrice: 178000,
      discountedPrice: 177000,
      discount: 0,
      unit: "3 vỉ x 10 viên",
      description: "Vitamin B",
      category: "vitamin",
      availableTypes: ["Vỉ"],
    },
  ]

  // Service features data
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "CAM KẾT 100%",
      description: "thuốc chính hãng",
    },
    {
      icon: <Truck className="w-6 h-6 text-green-600" />,
      title: "MIỄN PHÍ GIAO HÀNG",
      description: "đơn hàng từ 150.000đ",
    },
    {
      icon: <Clock className="w-6 h-6 text-green-600" />,
      title: "GIAO NHANH 2 GIỜ",
      description: "Xem chi tiết",
    },
    {
      icon: <CreditCard className="w-6 h-6 text-green-600" />,
      title: "ĐỔI TRẢ TRONG 3 NGÀY",
      description: "Xem chi tiết",
    },
  ]

  // Initialize selected types with the first available type for each product
  useEffect(() => {
    const initialSelectedTypes: Record<string, string> = {}
    products.forEach((product) => {
      initialSelectedTypes[product.id] = product.availableTypes[0]
    })
    setSelectedTypes(initialSelectedTypes)
  }, [])

  // Banner carousel controls
  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  // Update product type
  const updateProductType = (productId: string, type: string) => {
    setSelectedTypes((prev) => ({
      ...prev,
      [productId]: type,
    }))
  }

  // Format price with comma separators
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 space-y-6 py-4">
        {/* PROMO BANNER */}
        <div className="relative rounded-lg overflow-hidden">
          <div className="flex">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`w-full flex-shrink-0 transition-transform duration-500 ease-in-out ${
                  index === currentBanner ? "block" : "hidden"
                }`}
              >
                <Image
                  src={banner.image || "/placeholder.svg"}
                  alt={banner.title}
                  width={1200}
                  height={300}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>

          <button
            onClick={prevBanner}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextBanner}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-2 h-2 rounded-full ${index === currentBanner ? "bg-blue-600" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>

        {/* CATEGORY GRID */}
        <div className="bg-white rounded-lg p-4">
          <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/danh-muc/thuc-pham-chuc-nang/${category.href}`} className="flex flex-col items-center text-center group">
                <div className="mb-2">
                  <Image
                    src={category.icon || "/placeholder.svg"}
                    alt={category.name}
                    width={40}
                    height={40} 
                    className="group-hover:scale-110 transition-transform"
                  />
                </div>
                <h3 className="text-xs font-medium text-gray-800 mb-1 line-clamp-2 h-8">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.count} sản phẩm</p>
              </Link>
            ))}
          </div>
        </div>

        {/* FEATURED PRODUCTS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Sản phẩm nổi bật</h2>
            <Link href="/san-pham-noi-bat" className="text-blue-600 text-sm flex items-center">
              Xem thêm 14 sản phẩm <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
                {product.discount > 0 && (
                  <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 absolute">-{product.discount}%</div>
                )}

                <div className="p-3">
                  <div className="relative pt-2">
                    <Link href={`/product/${product.id}`}>
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={150}
                        height={150}
                        className="mx-auto h-32 object-contain group-hover:scale-105 transition-transform"
                      />
                    </Link>

                    {product.description && (
                      <div className="absolute top-0 right-0 bg-green-100 text-green-800 text-xs px-1 rounded">
                        {product.description}
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mt-2">{product.unit}</div>
                  </div>

                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-sm font-medium line-clamp-2 h-10 mt-1 group-hover:text-blue-600">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Product type selection */}
                  <div className="mt-2 mb-2 min-h-[32px]">
                    {product.availableTypes.length > 1 && (
                      <div className="flex flex-wrap gap-1">
                        {product.availableTypes.map((type) => (
                          <Button
                            key={type}
                            variant={selectedTypes[product.id] === type ? "default" : "outline"}
                            size="sm"
                            className={`px-2 py-0 h-6 text-xs ${
                              selectedTypes[product.id] === type
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "text-gray-700 border-gray-300"
                            }`}
                            onClick={() => updateProductType(product.id, type)}
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-2">
                    <div className="text-red-600 font-bold">{formatPrice(product.discountedPrice)}đ</div>
                    {product.originalPrice !== product.discountedPrice && (
                      <div className="text-gray-500 text-xs line-through">{formatPrice(product.originalPrice)}đ</div>
                    )}
                  </div>

                  <Button size="sm" className="w-full mt-2 text-xs bg-green-600 hover:bg-green-700">
                    Thêm vào giỏ hàng
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SERVICE FEATURES */}
        <div className="bg-white rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div className="mr-3 bg-green-100 p-2 rounded-full">{feature.icon}</div>
                <div>
                  <h3 className="text-sm font-bold">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
