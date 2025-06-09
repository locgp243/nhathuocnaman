"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, ChevronRight, ChevronLeft, Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"


interface RelatedProduct {
  id: string
  name: string
  image: string
  packageInfo: string
  originalPrice: number
  discountedPrice: number
  originalPriceFormatted: string
  discountedPriceFormatted: string
}

export default function ProductDetailPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [location, setLocation] = useState("Quận 10, HCM")
  const [currentImage, setCurrentImage] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDistrict, setSelectedDistrict] = useState("Hồ Chí Minh")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedWard, setSelectedWard] = useState("Quận Quận Trưởng")
  const [showFullDescription, setShowFullDescription] = useState(false)

  // Product images
  const productImages = [
    "/images/thuockhangsinh2.webp",
    "/images/thuoctieuhoa.webp",
    "/images/thuocthankinh.webp",
  ]

  // Related products
  const relatedProducts: RelatedProduct[] = [
    {
      id: "1",
      name: "Panadol Extra With Optizorb giảm đau, hạ sốt",
      image: "/images/thuocthankinh.webp",
      packageInfo: "12 x 10 viên",
      originalPrice: 218000,
      discountedPrice: 218000,
      originalPriceFormatted: "218.000₫",
      discountedPriceFormatted: "218.000₫",
    },
    {
      id: "2",
      name: "Mexcold Plus giảm đau, hạ sốt",
      image: "/images/thuocthankinh.webp",
      packageInfo: "10 x 10 viên",
      originalPrice: 3200,
      discountedPrice: 3200,
      originalPriceFormatted: "3.200₫/viên",
      discountedPriceFormatted: "3.200₫/viên",
    },
    {
      id: "3",
      name: "Grasalvi Extra giảm các cơn đau nhẹ, hạ sốt",
      image: "/images/thuocthankinh.webp",
      packageInfo: "10 x 10 viên",
      originalPrice: 95000,
      discountedPrice: 95000,
      originalPriceFormatted: "95.000₫",
      discountedPriceFormatted: "95.000₫",
    },
    {
      id: "4",
      name: "Parahexal Extra giảm đau, hạ sốt",
      image: "/images/thuocthankinh.webp",
      packageInfo: "10 x 10 viên",
      originalPrice: 144000,
      discountedPrice: 144000,
      originalPriceFormatted: "144.000₫",
      discountedPriceFormatted: "144.000₫",
    },
    {
      id: "5",
      name: "Hapacol 650 Extra giảm đau, hạ sốt",
      image: "/images/thuocthankinh.webp",
      packageInfo: "10 x 10 viên",
      originalPrice: 55000,
      discountedPrice: 55000,
      originalPriceFormatted: "55.000₫",
      discountedPriceFormatted: "55.000₫",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top promotion banner */}
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

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center text-sm">
          <Link href="/" className="text-blue-600 hover:underline">
            Giảm đau
          </Link>
          <span className="mx-1">›</span>
          <Link href="/" className="text-blue-600 hover:underline">
            hạ sốt
          </Link>
          <span className="mx-1">›</span>
          <Link href="/" className="text-blue-600 hover:underline">
            kháng viêm
          </Link>
          <span className="mx-1">›</span>
          <Link href="/" className="text-blue-600 hover:underline">
            Thuốc đau đầu
          </Link>
          <span className="mx-1">›</span>
          <Link href="/" className="text-blue-600 hover:underline">
            hạ sốt
          </Link>
        </div>
      </div>

      {/* Product title */}
      <div className="container mx-auto px-4 py-2">
        <h1 className="text-xl font-bold">Panadol Extra giảm đau hạ sốt (15 vỉ x 12 viên)</h1>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product images */}
          <div>
            <div className="bg-white p-4 rounded-md mb-4 relative">
              <div className="relative h-[300px] w-full">
                <Image
                  src={productImages[currentImage] || "/placeholder.svg"}
                  alt="Panadol Extra"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={() => setCurrentImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
                  className="bg-white rounded-full p-1 shadow-md"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={() => setCurrentImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))}
                  className="bg-white rounded-full p-1 shadow-md"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="text-center mt-2 text-sm text-gray-500">
                {currentImage + 1}/{productImages.length}
              </div>
            </div>

            <div className="flex justify-center gap-2 mb-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`border-2 rounded-md overflow-hidden ${
                    currentImage === index ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    width={60}
                    height={60}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* <div className="flex justify-center gap-4 mb-4">
              <button className="flex flex-col items-center text-gray-600 text-xs">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span>Gọi điện tư vấn</span>
              </button>

              <button className="flex flex-col items-center text-gray-600 text-xs">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <span>Hỏi đáp sản phẩm</span>
              </button>

              <button className="flex flex-col items-center text-gray-600 text-xs">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <span>Thông tin sản phẩm</span>
              </button>
            </div> */}
          </div>

          {/* Product info */}
          <div>
            <div className="bg-white p-4 rounded-md mb-4">
              <div className="flex items-center mb-2">
                <div className="flex items-center text-green-500 mr-4">
                  <Check size={16} className="mr-1" />
                  <span className="text-sm font-medium">Còn hàng</span>
                </div>
                <div className="text-sm text-gray-600">Mã: 129157</div>
              </div>

              <div className="flex items-center mb-4">
                <div className="text-xl font-bold text-red-600 mr-4">1.300₫/viên</div>
                <div className="text-lg font-bold text-red-600">234.000₫/hộp</div>
              </div>

              <div className="flex gap-2 mb-4">
                <Button className="bg-green-500 hover:bg-green-600 text-white">Thêm vào giỏ thuốc</Button>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">Thêm vào giỏ thuốc</Button>
              </div>

              {/* <div className="mb-4">
                <div className="text-sm font-medium mb-2">Chọn địa chỉ nhận hàng để biết thời gian giao</div>
                <div className="text-sm text-gray-600 mb-2">
                  Gọi nhận tư vấn với dược sĩ 1900 1872 (8:00 - 21:30, 1000đ/phút)
                </div>
                <div className="flex items-center mb-2">
                  <div className="text-sm font-medium mr-2">Có 77 nhà thuốc có sẵn hàng</div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Checkbox id="nhathuoc" className="mr-2" />
                    <label htmlFor="nhathuoc" className="text-sm">
                      Nhà thuốc có hàng gần tôi
                    </label>
                  </div>

                  <div className="mb-2">
                    <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                      <option>Hồ Chí Minh</option>
                      <option>Hà Nội</option>
                      <option>Đà Nẵng</option>
                    </select>
                  </div>

                  <div className="mb-2">
                    <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                      <option>Chọn Quận huyện</option>
                      <option>Quận 1</option>
                      <option>Quận 2</option>
                      <option>Quận 3</option>
                    </select>
                  </div>

                  <div className="mb-2">
                    <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                      <option>Chọn Phường xã</option>
                      <option>Phường 1</option>
                      <option>Phường 2</option>
                      <option>Phường 3</option>
                    </select>
                  </div>

                  <div className="p-3 bg-green-50 rounded-md text-sm text-gray-700 mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <div>300 Phan Văn Trị, Phường 11, Quận Bình Thạnh, TP Hồ Chí Minh</div>
                      <Badge className="bg-green-500">Gần bạn</Badge>
                    </div>
                    <Link href="#" className="text-blue-600 hover:underline">
                      Xem thêm 76 nhà thuốc
                    </Link>
                  </div>
                </div>
              </div> */}

              <div className="border-t pt-4">
                <div className="flex mb-2">
                  <div className="w-1/3 text-sm text-gray-600">Công dụng</div>
                  <div className="w-2/3 text-sm">Hạ sốt, giảm đau</div>
                </div>

                <div className="flex mb-2">
                  <div className="w-1/3 text-sm text-gray-600">Thành phần chính</div>
                  <div className="w-2/3 text-sm">
                    <div className="flex items-center">
                      <span className="mr-1">Cafein</span>
                      <Info size={14} className="text-blue-500" />
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">Paracetamol</span>
                      <Info size={14} className="text-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="flex mb-2">
                  <div className="w-1/3 text-sm text-gray-600">Đối tượng sử dụng</div>
                  <div className="w-2/3 text-sm">Người lớn, trẻ em ≥ 12 tuổi</div>
                </div>

                <div className="flex mb-2">
                  <div className="w-1/3 text-sm text-gray-600">Thương hiệu</div>
                  <div className="w-2/3 text-sm flex items-center">
                    <span>GlaxoSmithKline (gsk) (Anh)</span>
                    <Info size={14} className="text-blue-500 ml-1" />
                  </div>
                </div>

                <div className="flex mb-2">
                  <div className="w-1/3 text-sm text-gray-600">Nhà sản xuất</div>
                  <div className="w-2/3 text-sm">Sanofi - Synthelabo</div>
                </div>

                <div className="flex mb-2">
                  <div className="w-1/3 text-sm text-gray-600">Nơi sản xuất</div>
                  <div className="w-2/3 text-sm">Việt Nam</div>
                </div>

                <div className="mt-2">
                  <Link href="#" className="text-blue-600 hover:underline text-sm">
                    Xem tất cả đặc điểm nổi bật
                  </Link>
                </div>
              </div>
            </div>

            {/* QR code and app download */}
            <div className="bg-white p-4 rounded-md mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src="/qr.jpg"
                    alt="QR Code"
                    width={80}
                    height={80}
                    className="mr-3"
                  />
                  <div>
                    <div className="text-yellow-500 font-bold mb-1">Quà Tặng VIP</div>
                    <div className="text-sm text-gray-600">Tích điểm đổi quà</div>
                    <div className="text-sm text-gray-600">cho khách hàng thân thiết</div>
                    <div className="text-xs text-gray-500">Quét mã để tải app</div>
                  </div>
                </div>
                {/* <div className="flex flex-col gap-2">
                  <Link href="#">
                    <Image
                      src="/placeholder.svg?text=Google+Play&width=120&height=40"
                      alt="Google Play"
                      width={120}
                      height={40}
                    />
                  </Link>
                  <Link href="#">
                    <Image
                      src="/placeholder.svg?text=App+Store&width=120&height=40"
                      alt="App Store"
                      width={120}
                      height={40}
                    />
                  </Link>
                </div> */}
              </div>
            </div>

            {/* Service guarantees */}
            <div className="bg-white p-4 rounded-md">
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <Check size={14} className="text-green-600" />
                  </div>
                  <div className="text-sm">Cam kết 100% thuốc chính hãng</div>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <Check size={14} className="text-green-600" />
                  </div>
                  <div className="text-sm">
                    Miễn phí giao đơn hàng từ 150.000đ{" "}
                    <Link href="#" className="text-blue-600 hover:underline">
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <Check size={14} className="text-green-600" />
                  </div>
                  <div className="text-sm">
                    Giao nhanh 2 giờ{" "}
                    <Link href="#" className="text-blue-600 hover:underline">
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product details */}
        <div className="mt-8">
          <div className="bg-white rounded-md p-4 mb-4">
            <h2 className="text-lg font-bold mb-4">THÔNG TIN SẢN PHẨM</h2>

            <div className="bg-green-50 p-4 rounded-md mb-4 text-sm text-gray-700">
              <p>
                Mọi thông tin dưới đây về dược được dược sĩ biên soạn lại. Tuy nhiên, nội dung hoàn toàn giữ nguyên dựa trên
                hướng dẫn sử dụng, chỉ thay đổi về mặt hình thức.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-2">1. Thành phần</h3>
              <p className="mb-2">Mỗi viên nén Panadol Extra chứa:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Hoạt chất: Paracetamol 500mg, Caffeine 65mg</li>
                <li>
                  Tá dược: Pregelatinised starch, Maize starch, Povidone, Potassium Sorbate,Talc, Stearic acid,
                  Croscarmellose sodium
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-2">2. Công dụng (Chỉ định)</h3>
              <p className="mb-2">
                Panadol Extra chứa paracetamol là một chất hạ sốt, giảm đau và caffeine là một chất kích thích hệ thần
                kinh trung ương. Panadol Extra có hiệu quả trong:
              </p>
              <p className="mb-2">Điều trị các cơn đau vừa và hạ sốt như:</p>
            </div>

            <div className="mb-4">
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-600 hover:underline flex items-center"
              >
                {showFullDescription ? "Thu gọn" : "Xem thêm"}
                <ChevronDown className={`ml-1 transform ${showFullDescription ? "rotate-180" : ""}`} size={16} />
              </button>
            </div>
          </div>

          {/* Pharmacist info */}
          <div className="bg-white rounded-md p-4 mb-8">
            <div className="flex items-center bg-green-100 p-2 rounded-md mb-4">
              <div className="text-green-600 font-medium text-sm">Dược sĩ Đại học Hồ Chí Minh</div>
            </div>

            <div className="flex">
              <div className="mr-4">
                <Image
                  src="/images/avatar.jpg"
                  alt="Dược sĩ"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="font-bold mb-1">Dược sĩ Phạm Gia Lộc</h3>
                <p className="text-sm text-gray-600 mb-2">Chuyên khoa: Dược</p>
                <p className="text-sm text-gray-600">
                  Dược sĩ Phạm Gia Lộc có hơn 4 năm kinh nghiệm công tác trong lĩnh vực tư vấn sử dụng Dược
                  phẩm. Hiện đang là quản lý nhà thuốc Nam An
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">THUỐC ĐAU ĐẦU, HẠ SỐT KHÁC</h2>
            <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
              Xem tất cả Thuốc đau đầu, hạ sốt khác <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded shadow-sm">
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
        </div>
      </div>

      {/* Service features */}
      <div className="bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center">
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

            <div className="flex items-center">
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

            <div className="flex items-center">
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

            <div className="flex items-center">
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
