"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbList } from "@/components/ui/breadcrumb"
import {
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { usePathname } from "next/navigation" 
import Service from "@/components/Services"


type ProductType = "Hộp" | "Vỉ" | "Ống" | "Chai" | "Gói" | "Hũ" | "Lọ" | "Tuýp" | "Vỉ 10 viên" | "Vỉ 20 viên"

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
  icon: string
}

export default function PharmacyWebsite() {
  const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>({})
  const [products, setProducts] = useState<Product[]>([])
  const [subCategories, setSubCategories] = useState<Subcategory[]>([
     {
      id: '1',
      name: "Vitamin và khoáng chất",
      icon: "/images/icon-cate/thucphamchucnang/vitamin.png",
      slug: "/vitamin-khoang-chat",
    },
    {
      id: '2',
      name: "Bổ gan, thanh nhiệt",
      icon: "/images/icon-cate/thucphamchucnang/bogan.png",
      slug: "/bo-gan-thanh-nhiet",
    },
    {
      id: '3',
      name: "Bổ não",
      icon: "/images/icon-cate/thucphamchucnang/bonao.png",
      slug: "/bo-nao",
    },
    {
      id: '4',
      name: "Bổ phổi, hô hấp",
      icon: "/images/icon-cate/thucphamchucnang/bophe.png",
      slug: "/bo-phoi-ho-hap",
    },
    {
      id: '5',
      name: "Bổ tim xương khớp",
      icon: "/images/icon-cate/thucphamchucnang/boxuong.png",
      slug: "/bo-tim-xuong-khop",
    },
    {
      id: '6',
      name: "Hỗ trợ tiêu hóa",
      icon: "/images/icon-cate/thucphamchucnang/tieuhoa.png",
      slug: "/ho-tro-tieu-hoa",
    },
    {
      id: '7',
      name: "Kẹo ngậm, viên ngậm",
      icon: "/images/icon-cate/thucphamchucnang/keongam.png",
      slug: "/keo-ngam-vien-ngam",
    },
    {
      id: '8',
      name: "Làm đẹp, giảm cân",
      icon: "/images/icon-cate/thucphamchucnang/lamdep.png",
      slug: "/lam-dep-giam-can",
    },
    {
      id: '9',
      name: "Dầu cá, bổ mắt",
      icon: "/images/icon-cate/thucphamchucnang/bomat.png",
      slug: "/dau-ca-bo-mat",
    },
    {
      id: '10',
      name: "Thảo dược tự nhiên",
      icon: "/images/icon-cate/thucphamchucnang/thaoduoc.png",
      slug: "/thao-duoc-tu-nhien",
    },
    {
      id: '11',
      name: "Hỗ trợ tim mạch",
      icon: "/images/icon-cate/thucphamchucnang/botim.png",
      slug: "/ho-tro-tim-mach",
    },
    {
      id: '12',
      name: "Hỗ trợ tiểu đường",
      icon: "/images/icon-cate/thucphamchucnang/tieuduong.png",
      slug: "/ho-tro-tieu-duong",
    },
    {
      id: '13',
      name: "Tăng sinh lý, bổ thận",
      icon: "/images/icon-cate/thucphamchucnang/bothan.png",
      slug: "/tang-sinh-ly-bo-than",
    },
    {
      id: '14',
      name: "Hỗ trợ ung thư",
      icon: "/images/icon-cate/thucphamchucnang/ungthu.png",
      slug: "/ho-tro-ung-thu",
    },
    {
      id: '15',
      name: "Hỗ trợ trị giãn tĩnh mạch, táo bón",
      icon: "/images/icon-cate/thucphamchucnang/taobon.jpg",
      slug: "/tao-bon",
    },
  ])
  const params = useParams()
  const pathname = usePathname()
  const slug = params.slug
  const title = localStorage.getItem("title_main_categories")

  console.log("Saved title from localStorage:", title)

  useEffect(() => {
    fetch(`http://localhost/server/get_product_by_main_category.php?main_category=${slug}`)
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
  }, [slug])

    useEffect(() => {
    if (!slug) return

    fetch(`http://localhost/server/get_sub_category_by_main.php?main_category=${slug}`)
      .then(res => res.json())
      .then((data) => {
        setSubCategories(data)
      })
      .catch(err => console.error("Lỗi khi tải subcategories:", err))
  }, [slug])

  useEffect(() => {
    const initialSelectedTypes: Record<string, string> = {}
    products.forEach((product) => {
      initialSelectedTypes[product.id] = product.availableTypes[0]
    })
    setSelectedTypes(initialSelectedTypes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateProductType = (productId: string, type: string) => {
    setSelectedTypes((prev) => ({
      ...prev,
      [productId]: type,
    }))
  }

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 space-y-6 py-4">

        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/${slug}"
                className={pathname === `/${slug}` ? "text-primary font-semibold" : "text-gray-700"}
              >{title}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList> 
        </Breadcrumb>

        <div className="bg-white rounded-lg p-4">
          <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-4">
            {subCategories.map((category) => (
              <Link key={category.id}
                href={`/${slug}/${category.slug}`}
                onClick={() => {
                  localStorage.setItem("title_sub_categories", category.name)
                }}
                className="flex flex-col items-center text-center group">
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
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Sản phẩm nổi bật</h2>
            <Link href="/san-pham-noi-bat" className="text-blue-600 text-sm flex items-center">
              Xem thêm 14 sản phẩm <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="bg-white text-black relative overflow-hidden h-full">
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
                          {formatPrice(product.prices[selectedTypes[product.id] as ProductType]?.discounted || 0)}₫
                        </p>
                        <p className="text-gray-500 text-sm line-through">
                          {formatPrice(product.prices[selectedTypes[product.id] as ProductType]?.original || 0)}₫
                        </p>
                      </div>

                      <Button size="sm" className="w-full mt-3 bg-rose-500 hover:bg-rose-600 text-white">
                        Thêm Giỏ Hàng
                      </Button>
                    </CardContent>
                  </Card>
            ))}
          </div>
        </div>

        {/* Services */}
        <Service />
      </div>

    </div>
  )
}
