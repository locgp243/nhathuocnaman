"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {ChevronDown, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbList } from "@/components/ui/breadcrumb"

// Product interface
interface Product {
  id: string
  name: string
  image: string
  discount: number | null
  packageInfo: string
  originalPrice: number
  discountedPrice: number
  originalPriceFormatted: string
  discountedPriceFormatted: string
  inStock: boolean
}

// Brand interface
interface Brand {
  id: string
  name: string
  logo: string
}

export default function PharmacyWebsitePage() {
  const title = localStorage.getItem("title_main_categories")
  const subTitle = localStorage.getItem("title_sub_categories")
  const params = useParams();
  const { slug, subslug } = params;
  console.log("Main Category Slug:", slug);
  console.log("Subcategory Slug:", subslug);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [location, setLocation] = useState("Quận 10, Hồ Chí Minh")
  const [activeTab, setActiveTab] = useState("tim-kiem-nhieu")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  // Sample brands data
  const brands: Brand[] = [
    { id: "1", name: "Solumedi", logo: "/images/sanpham1.webp" },
    { id: "2", name: "Philips", logo: "/images/sanpham2.webp" },
    { id: "3", name: "Meiji", logo: "/images/sanpham3.webp" },
    { id: "4", name: "Ensure", logo: "/images/sanpham4.webp" },
    { id: "5", name: "Blackmores", logo: "/images/sanpham5.webp" },
    { id: "6", name: "DHC", logo: "/images/sanpham6.webp" },
  ]

  // Sample products data
  const products: Product[] = [
    {
      id: "1",
      name: "Acnotin HA trị giảm mụn, giảm tiết bã nhờn",
      image: "/images/sanpham1.webp",
      discount: null,
      packageInfo: "3 x 2 x 10 viên",
      originalPrice: 125000,
      discountedPrice: 125000,
      originalPriceFormatted: "125.000₫",
      discountedPriceFormatted: "125.000₫",
      inStock: true,
    },
    {
      id: "2",
      name: "EDO500 hạn chế tác hại, làm đẹp da",
      image: "/images/sanpham1.webp",
      discount: null,
      packageInfo: "3 x 2 x 10 viên",
      originalPrice: 168000,
      discountedPrice: 168000,
      originalPriceFormatted: "168.000₫",
      discountedPriceFormatted: "168.000₫",
      inStock: true,
    },
    {
      id: "3",
      name: "Acnotin HA trị giảm mụn, giảm tiết bã nhờn",
      image: "/images/sanpham1.webp",
      discount: null,
      packageInfo: "3 x 2 x 10 viên",
      originalPrice: 125000,
      discountedPrice: 125000,
      originalPriceFormatted: "125.000₫",
      discountedPriceFormatted: "125.000₫",
      inStock: true,
    },
    {
      id: "4",
      name: "Acnotin HA trị giảm mụn, giảm tiết bã nhờn",
      image: "/images/sanpham1.webp",
      discount: null,
      packageInfo: "3 x 2 x 10 viên",
      originalPrice: 125000,
      discountedPrice: 125000,
      originalPriceFormatted: "125.000₫",
      discountedPriceFormatted: "125.000₫",
      inStock: true,
    },
    {
      id: "1",
      name: "Acnotin HA trị giảm mụn, giảm tiết bã nhờn",
      image: "/images/sanpham1.webp",
      discount: null,
      packageInfo: "3 x 2 x 10 viên",
      originalPrice: 125000,
      discountedPrice: 125000,
      originalPriceFormatted: "125.000₫",
      discountedPriceFormatted: "125.000₫",
      inStock: true,
    },
    {
      id: "2",
      name: "EDO500 hạn chế tác hại, làm đẹp da",
      image: "/images/sanpham1.webp",
      discount: null,
      packageInfo: "3 x 2 x 10 viên",
      originalPrice: 168000,
      discountedPrice: 168000,
      originalPriceFormatted: "168.000₫",
      discountedPriceFormatted: "168.000₫",
      inStock: true,
    },
    {
      id: "3",
      name: "Acnotin HA trị giảm mụn, giảm tiết bã nhờn",
      image: "/images/sanpham1.webp",
      discount: null,
      packageInfo: "3 x 2 x 10 viên",
      originalPrice: 125000,
      discountedPrice: 125000,
      originalPriceFormatted: "125.000₫",
      discountedPriceFormatted: "125.000₫",
      inStock: true,
    },
    {
      id: "4",
      name: "Acnotin HA trị giảm mụn, giảm tiết bã nhờn",
      image: "/images/sanpham1.webp",
      discount: null,
      packageInfo: "3 x 2 x 10 viên",
      originalPrice: 125000,
      discountedPrice: 125000,
      originalPriceFormatted: "125.000₫",
      discountedPriceFormatted: "125.000₫",
      inStock: true,
    },
    {
      id: "1",
      name: "Acnotin HA trị giảm mụn, giảm tiết bã nhờn",
      image: "/images/sanpham1.webp",
      discount: null,
      packageInfo: "3 x 2 x 10 viên",
      originalPrice: 125000,
      discountedPrice: 125000,
      originalPriceFormatted: "125.000₫",
      discountedPriceFormatted: "125.000₫",
      inStock: true,
    },
    {
      id: "2",
      name: "EDO500 hạn chế tác hại, làm đẹp da",
      image: "/images/sanpham1.webp",
      discount: null,
      packageInfo: "3 x 2 x 10 viên",
      originalPrice: 168000,
      discountedPrice: 168000,
      originalPriceFormatted: "168.000₫",
      discountedPriceFormatted: "168.000₫",
      inStock: true,
    },
    {
      id: "3",
      name: "Acnotin HA trị giảm mụn, giảm tiết bã nhờn",
      image: "/images/sanpham1.webp",
      discount: null,
      packageInfo: "3 x 2 x 10 viên",
      originalPrice: 125000,
      discountedPrice: 125000,
      originalPriceFormatted: "125.000₫",
      discountedPriceFormatted: "125.000₫",
      inStock: true,
    },
    {
      id: "4",
      name: "Acnotin HA trị giảm mụn, giảm tiết bã nhờn",
      image: "/images/sanpham1.webp",
      discount: null,
      packageInfo: "3 x 2 x 10 viên",
      originalPrice: 125000,
      discountedPrice: 125000,
      originalPriceFormatted: "125.000₫",
      discountedPriceFormatted: "125.000₫",
      inStock: true,
    },
  ]

  // Duplicate products to match the image layout
  const allProducts = [...products, ...products]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-yellow-200 py-2 relative overflow-hidden">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <button className="text-gray-600">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 flex items-center justify-center space-x-2">
            <div className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-bold">CHỈ BẢN ONLINE</div>
            <div className="text-red-600 font-bold text-sm">ĐẠI TIỆC DEAL HỜI</div>
            <div className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold">Giảm đến 40%</div>
            <div className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-bold">XEM NGAY</div>
          </div>
          <button className="text-gray-600">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/${slug}"
              >{title}</BreadcrumbLink>
            </BreadcrumbItem>
              <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/${slug}"
              >{subTitle}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList> 
        </Breadcrumb>

        {/* Page title */}
        <h1 className="text-xl font-bold mb-4">55 Sản phẩm làm đẹp, giảm cân</h1>

        {/* Filter options */}
        <div className="rounded-md p-3 mb-4">
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center border border-gray-300 rounded px-3 py-1 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              Lọc
            </button>
            <button className="flex items-center border border-gray-300 rounded px-3 py-1 text-sm">
              Loại sản phẩm <ChevronDown size={14} className="ml-1" />
            </button>
            <button className="flex items-center border border-gray-300 rounded px-3 py-1 text-sm">
              Dạng bào chế <ChevronDown size={14} className="ml-1" />
            </button>
            <button className="flex items-center border border-gray-300 rounded px-3 py-1 text-sm">
              Nơi sản xuất <ChevronDown size={14} className="ml-1" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white p-0 border-b border-gray-200 w-full justify-start">
              <TabsTrigger
                value="tim-kiem-nhieu"
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-500 rounded-none px-4 py-2"
              >
                Tìm kiếm nhiều
              </TabsTrigger>
              <TabsTrigger
                value="dap-da"
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-500 rounded-none px-4 py-2"
              >
                Đắp đá
              </TabsTrigger>
              <TabsTrigger
                value="dap-toc"
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-500 rounded-none px-4 py-2"
              >
                Đẹp tóc
              </TabsTrigger>
              <TabsTrigger
                value="dang-vien"
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-500 rounded-none px-4 py-2"
              >
                Dạng viên
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Brand filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className={`border rounded-md p-2 cursor-pointer ${
                selectedBrands.includes(brand.id) ? "border-green-500" : "border-gray-300"
              }`}
              onClick={() => {
                if (selectedBrands.includes(brand.id)) {
                  setSelectedBrands(selectedBrands.filter((id) => id !== brand.id))
                } else {
                  setSelectedBrands([...selectedBrands, brand.id])
                }
              }}
            >
              <Image
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                width={80}
                height={30}
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {/* Promotion checkbox */}
        <div className="flex items-center mb-4">
          <Checkbox id="khuyenmai" className="mr-2" />
          <label htmlFor="khuyenmai" className="text-sm">
            Khuyến mãi
          </label>
          <div className="ml-auto flex items-center">
            <span className="text-sm mr-2">Xếp theo:</span>
            <select className="text-sm border rounded px-2 py-1">
              <option>Bán chạy</option>
              <option>Giá thấp đến cao</option>
              <option>Giá cao đến thấp</option>
              <option>Mới nhất</option>
            </select>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {allProducts.map((product, index) => (
            <div key={`${product.id}-${index}`} className="bg-white rounded shadow-sm">
              <div className="relative">
                <Link href={`/product/${product.id}`}>
                  <div className="p-2 flex justify-center">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={150}
                      height={150}
                      className="h-[120px] object-contain"
                    />
                  </div>
                </Link>
                {product.discount && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
                    -{product.discount}%
                  </Badge>
                )}
              </div>

              <div className="p-2">
                <div className="text-xs text-gray-500 mb-1">{product.packageInfo}</div>
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-sm font-medium line-clamp-2 h-10 hover:text-blue-600">{product.name}</h3>
                </Link>

                <div className="mt-1 mb-2">
                  <div className="text-red-600 font-bold text-sm">{product.discountedPriceFormatted}</div>
                  {product.originalPrice !== product.discountedPrice && (
                    <div className="text-gray-500 text-xs line-through">{product.originalPriceFormatted}</div>
                  )}
                </div>

                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-xs py-1 h-8 rounded"
                  size="sm"
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Service features */}
      <div className="bg-white py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-center">
              <div className="bg-green-100 rounded-full p-3 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-green-600">CAM KẾT 100%</h3>
                <p className="text-sm">thuốc chính hãng</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="bg-green-100 rounded-full p-3 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-green-600">MIỄN PHÍ GIAO HÀNG</h3>
                <p className="text-sm">đơn hàng từ 150.000đ</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="bg-green-100 rounded-full p-3 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-green-600">GIAO NHANH 2 GIỜ</h3>
                <p className="text-sm">Xem chi tiết</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="bg-green-100 rounded-full p-3 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                  <line x1="18" y1="9" x2="12" y2="15"></line>
                  <line x1="12" y1="9" x2="18" y2="15"></line>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-green-600">ĐỔI TRẢ TRONG 3 NGÀY</h3>
                <p className="text-sm">Xem chi tiết</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
