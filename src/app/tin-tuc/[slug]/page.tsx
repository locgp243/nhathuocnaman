"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingCart, Bell, Menu, ChevronDown, } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface HealthArticle {
  id: string
  title: string
  image: string
  category: string
  excerpt: string
  isHot?: boolean
}

interface CategoryLink {
  title: string
  href: string
  icon?: string
}

export default function PharmacityWebsite() {
  const [searchQuery, setSearchQuery] = useState("")

  // Popular search terms
  const popularSearches = [
    "giảm cân",
    "làm chống lão hóa",
    "khỏi tràng",
    "hạ sốt",
    "Mua 1 Tặng 1",
    "collagen",
    "giảm ho đau họng",
  ]

  // Health articles
  const healthArticles: HealthArticle[] = [
    {
      id: "1",
      title: "Pharmacity hướng dẫn cách tra cứu thông tin thuốc, 'kỹ năng' tránh mua thuốc giả",
      image: "/images/tintuc4.jpg",
      category: "Tin tuyển dụng",
      excerpt:
        "Thuốc giả là một nguy hại tiềm ẩn nhưng chúng ta có thể chủ động phòng tránh bằng cách trang bị kiến thức và cẩn trọng khi mua thuốc.",
    },
    {
      id: "2",
      title: "Pharmacity chính thức triển khai dịch vụ xác thực điện tử qua VNeID",
      image: "/images/tintuc4.jpg",
      category: "Tin tuyển dụng",
      excerpt: "Chiều 19/3, tại Hà Nội, Trung tâm Nghiên cứu Ứng dụng dữ liệu dân cư và căn cước công dân...",
    },
    {
      id: "3",
      title: "Cảnh báo cúm mùa gia tăng ở trẻ và cách phòng bệnh hiệu quả",
      image: "/images/tintuc4.jpg",
      category: "Sống khỏe",
      excerpt:
        "Khi thời tiết giao mùa, đặc biệt là vào mùa đông xuân, nổi lo lắng về dịch bệnh cúm mùa gia tăng ở trẻ em.",
    },
    {
      id: "4",
      title: "Có nên mua thuốc Tamiflu để điều trị cúm A tại nhà không?",
      image: "/images/tintuc4.jpg",
      category: "Sống khỏe",
      excerpt:
        "Cúm A là bệnh truyền nhiễm phổ biến, đặc biệt trong mùa lạnh và giao mùa. Nhiều người tìm đến thuốc Tamiflu...",
    },
    {
      id: "5",
      title: "Vì sao cúm mùa gây nguy hiểm cho người cao tuổi?",
      image: "/images/tintuc4.jpg",
      category: "Sống khỏe",
      excerpt:
        "Sức khỏe của người cao tuổi luôn là mối quan tâm hàng đầu của gia đình và xã hội. Đặc biệt trong mùa cúm...",
    },
    {
      id: "6",
      title: "Cúm mùa: Triệu chứng, cách phòng ngừa và điều trị hiệu quả",
      image: "/images/tintuc4.jpg",
      category: "Bệnh thường gặp",
      excerpt:
        "Bệnh cúm mùa là bệnh truyền nhiễm cấp tính, chủ yếu do các virus cúm A và B gây ra. Bệnh lây truyền qua đường hô hấp...",
    },
    {
      id: "7",
      title: "Dịch cúm mùa tại Nhật Bản 2025 nguy hiểm ra sao?",
      image: "/images/tintuc4.jpg",
      category: "Sống khỏe",
      excerpt:
        "Dịch cúm tại Nhật Bản hiện gọi là cúm mùa Nhật Bản, là một bệnh truyền nhiễm cấp tính do virus cúm gây ra...",
    },
  ]

  // Hospital articles
  const hospitalArticles = [
    {
      id: "h1",
      title: "Hướng Dẫn Chọn Bệnh Viện Uy Tín Tại Thành Phố Năm 2025",
      image: "/images/tintuc4.jpg",
      excerpt:
        "Bạn đang tìm kiếm một bệnh viện đáng tin cậy tại thành phố? Cùng chúng tôi đề xuất những nơi đó chăm sóc sức khỏe không chỉ đảm bảo an toàn mà còn giúp bạn yên tâm. Với sự phát triển nhanh chóng của y tế đô thị năm 2025, nhu cầu về bệnh viện uy tín ngày [...]",
    },
  ]

  // Children's health articles
  const childrenHealthArticles = [
    {
      id: "c1",
      title: "Tắm cho trẻ nhỏ: lợi ích và lưu ý khi sử dụng nước cây lạc tiên",
      image: "/images/tintuc4.jpg",
      excerpt:
        "Việc tắm cho trẻ nhỏ là một nhu cầu thiết yếu để giữ cho cơ thể bé sạch sẽ và khỏe mạnh. Tuy nhiên, việc sử dụng các loại lá cây hoặc thảo dược để tắm có thể gây nguy hiểm cho sức khỏe của trẻ. Trong bài viết này, chúng ta [...]",
    },
  ]

  // Postpartum recovery articles
  const postpartumArticles = [
    {
      id: "p1",
      title: "Dấu hiệu sắp sinh trước 2 ngày mà mẹ bầu cần lưu ý",
      image: "/images/tintuc4.jpg",
      excerpt:
        "Dấu Hiệu Sắp Sinh Trước 2 Ngày Mà Mẹ Bầu Cần Lưu Ý Chào các mẹ bầu! Những ngày cuối thai kỳ luôn là khoảng thời gian hồi hộp và mong chờ nhất. Chắc hẳn các mẹ đều mong ngóng từng ngày được gặp con yêu. Tuy nhiên, việc nhận biết chính xác các dấu [...]",
    },
  ]

  // Category links
  const categoryLinks: CategoryLink[] = [
    { title: "Bệnh Viện", href: "/benh-vien", icon: "/images/icon-article/benhvien.avif" },
    { title: "Sức khỏe trẻ em", href: "/suc-khoe-tre-em", icon: "/images/icon-article/embe.avif" },
    { title: "Phục hồi sau sinh", href: "/phuc-hoi-sau-sinh", icon: "/images/icon-article/phuchoisausinh.avif" },
    { title: "Chăm sóc thai kì", href: "/cham-soc-thai-ki", icon: "/images/icon-article/embe.avif" },
    {
      title: "Chuẩn bị mang thai",
      href: "/chuan-bi-mang-thai",
      icon: "/images/icon-article/chuanbimangthai.avif",
    },
    { title: "Sống khỏe", href: "/song-khoe", icon: "/images/icon-article/songkhoe.avif" },
  ]

  // Hospital links
  const hospitalLinks = [
    {
      title: "Những Điều Cần Biết Về Khám Chữa Bệnh Hiện Đại Năm 2025",
      href: "/benh-vien/kham-chua-benh-hien-dai",
    },
    {
      title: "Phòng Khám Chuyên Khoa: Địa Chỉ Tin Cậy Cho Sức Khỏe",
      href: "/benh-vien/phong-kham-chuyen-khoa",
    },
    {
      title: "Tổng quan những điều cần biết về Bệnh viện Phạm Ngọc Thạch",
      href: "/benh-vien/pham-ngoc-thach",
    },
  ]

  // Children's health links
  const childrenHealthLinks = [
    {
      title: "5 cách bắt giun kim ở hậu môn cho bé hiệu quả tại nhà",
      href: "/suc-khoe-tre-em/bat-giun-kim",
    },
    {
      title: "Tập cho bé bú mẹ trở lại: cách hiệu quả và dễ dàng",
      href: "/suc-khoe-tre-em/tap-cho-be-bu-me",
    },
    {
      title: "Cách nấu cháo ăn dặm cho bé 7 tháng tuổi",
      href: "/suc-khoe-tre-em/chao-an-dam",
    },
  ]

  // Postpartum recovery links
  const postpartumLinks = [
    {
      title: "Dấu hiệu sắp sinh con thứ 2: những điều mẹ bầu cần biết",
      href: "/phuc-hoi-sau-sinh/dau-hieu-sap-sinh-con-thu-2",
    },
    {
      title: "Giục sinh ở tuần 39 của thai kỳ: có nên áp dụng?",
      href: "/phuc-hoi-sau-sinh/giuc-sinh-tuan-39",
    },
    {
      title: "Chuẩn bị đồ đi sinh mổ lần 2: đảm bảo quá trình sinh con suôn sẻ",
      href: "/phuc-hoi-sau-sinh/chuan-bi-do-sinh-mo-lan-2",
    },
  ]

  // Footer links
  const aboutLinks = [
    { title: "Giới thiệu", href: "/gioi-thieu" },
    { title: "Hệ thống cửa hàng", href: "/he-thong-cua-hang" },
    { title: "Giấy phép kinh doanh", href: "/giay-phep-kinh-doanh" },
    { title: "Quy chế hoạt động", href: "/quy-che-hoat-dong" },
    { title: "Chính sách đổi trả và bảo hành", href: "/chinh-sach-doi-tra" },
    { title: "Chính sách giao hàng", href: "/chinh-sach-giao-hang" },
    { title: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
    { title: "Chính sách bảo vệ dữ liệu cá nhân", href: "/chinh-sach-bao-ve-du-lieu" },
    { title: "Chính sách thanh toán", href: "/chinh-sach-thanh-toan" },
    { title: "Thế lệ chương trình thẻ thành viên", href: "/the-thanh-vien" },
    { title: "Câu hỏi thường gặp", href: "/cau-hoi-thuong-gap" },
    { title: "Sitemap", href: "/sitemap" },
    { title: "Bệnh viện", href: "/benh-vien" },
  ]

  const categoryMenuLinks = [
    { title: "Thuốc", href: "/thuoc" },
    { title: "Trà cúc bệnh", href: "/tra-cuc-benh" },
    { title: "Thực phẩm bảo vệ sức khỏe", href: "/thuc-pham-bao-ve-suc-khoe" },
    { title: "Chăm sóc cá nhân", href: "/cham-soc-ca-nhan" },
    { title: "Mẹ và Bé", href: "/me-va-be" },
    { title: "Chăm sóc sắc đẹp", href: "/cham-soc-sac-dep" },
    { title: "Thiết bị y tế", href: "/thiet-bi-y-te" },
    { title: "Sản phẩm tiện lợi", href: "/san-pham-tien-loi" },
    { title: "Doanh nghiệp", href: "/doanh-nghiep" },
    { title: "Nhãn hàng Pharmacitty", href: "/nhan-hang-pharmacitty" },
    { title: "Khuyến mãi HOT", href: "/khuyen-mai-hot" },
    { title: "Góc sức khỏe", href: "/goc-suc-khoe" },
    { title: "Chăm sóc sức khỏe", href: "/cham-soc-suc-khoe" },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link href="/" className="text-gray-500 hover:text-blue-600">
              Trang chủ
            </Link>
            <span className="mx-1">›</span>
            <Link href="/goc-suc-khoe" className="text-gray-500 hover:text-blue-600">
              Bệnh & Góc sức khỏe
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-4">
        {/* Health information tabs */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center space-x-6">
            <Link href="/bai-viet-noi-bat" className="flex items-center text-blue-600">
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
                className="mr-2"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <span className="font-medium">Bài viết nổi bật</span>
            </Link>
            <Link href="/chuyen-muc" className="flex items-center text-gray-600 hover:text-blue-600">
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
                className="mr-2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span className="font-medium">Chuyên mục</span>
            </Link>

            <div className="flex-1 relative ml-auto">
              <Input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="pl-10 border-gray-300 rounded-md w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main articles section */}
          <div className="md:col-span-2">
            {/* Featured article */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="relative">
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-md">
                  Nam An
                </div>
                <Image
                  src="/images/slider-1.webp"
                  alt="Hướng dẫn tra cứu thông tin thuốc đúng cách"
                  width={800}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <h2 className="text-white text-2xl font-bold mb-2">
                    HƯỚNG DẪN TRA CỨU THÔNG TIN THUỐC ĐÚNG CÁCH
                  </h2>
                </div>
              </div>
            </div>

            {/* Articles grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {healthArticles.slice(0, 6).map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative">
                    <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-md">
                      {article.category}
                    </div>
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <Link href={`/article/${article.id}`}>
                      <h3 className="font-medium text-base mb-2 hover:text-blue-600">{article.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-600 line-clamp-3">{article.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Hospital section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Bệnh Viện</h2>
                <Link href="/benh-vien" className="text-blue-600 hover:underline text-sm">
                  Xem thêm
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <Image
                      src="/images/tintuc1.jpg"
                      alt="Bệnh viện"
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-4">
                    <h3 className="font-bold text-lg mb-2">{hospitalArticles[0].title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{hospitalArticles[0].excerpt}</p>
                    <Link href="/benh-vien/huong-dan-chon-benh-vien" className="text-blue-600 hover:underline text-sm">
                      Đọc tiếp
                    </Link>
                  </div>
                </div>
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hospitalLinks.map((link, index) => (
                  <div key={index} className="flex items-center">
                    <div className="mr-2 text-gray-400">•</div>
                    <Link href={link.href} className="text-sm hover:text-blue-600">
                      {link.title}
                    </Link>
                  </div>
                ))}
              </div> */}
            </div>

            {/* Children's health section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Sức khỏe trẻ em</h2>
                <Link href="/suc-khoe-tre-em" className="text-blue-600 hover:underline text-sm">
                  Xem thêm
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <Image
                      src="/images/tintuc2.jpg"
                      alt="Sức khỏe trẻ em"
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-4">
                    <h3 className="font-bold text-lg mb-2">{childrenHealthArticles[0].title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{childrenHealthArticles[0].excerpt}</p>
                    <Link href="/suc-khoe-tre-em/tam-cho-tre-nho" className="text-blue-600 hover:underline text-sm">
                      Đọc tiếp
                    </Link>
                  </div>
                </div>
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {childrenHealthLinks.map((link, index) => (
                  <div key={index} className="flex items-center">
                    <div className="mr-2 text-gray-400">•</div>
                    <Link href={link.href} className="text-sm hover:text-blue-600">
                      {link.title}
                    </Link>
                  </div>
                ))}
              </div> */}
            </div>

            {/* Postpartum recovery section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Phục hồi sau sinh</h2>
                <Link href="/phuc-hoi-sau-sinh" className="text-blue-600 hover:underline text-sm">
                  Xem thêm
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <Image
                      src="/images/tintuc3.jpg"
                      alt="Phục hồi sau sinh"
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-4">
                    <h3 className="font-bold text-lg mb-2">{postpartumArticles[0].title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{postpartumArticles[0].excerpt}</p>
                    <Link href="/phuc-hoi-sau-sinh/dau-hieu-sap-sinh" className="text-blue-600 hover:underline text-sm">
                      Đọc tiếp
                    </Link>
                  </div>
                </div>
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {postpartumLinks.map((link, index) => (
                  <div key={index} className="flex items-center">
                    <div className="mr-2 text-gray-400">•</div>
                    <Link href={link.href} className="text-sm hover:text-blue-600">
                      {link.title}
                    </Link>
                  </div>
                ))}
              </div> */}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-bold mb-4">Chuyên mục nổi bật</h2>
              <div className="space-y-4">
                {categoryLinks.map((category, index) => (
                  <Link
                    key={index}
                    href={category.href}
                    className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                  >
                    <div className="mr-3">
                      <Image
                        src={category.icon || "/placeholder.svg"}
                        alt={category.title}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                    </div>
                    <span className="text-gray-700 hover:text-blue-600">{category.title}</span>
                  </Link>
                ))}
                <Link href="/xem-tat-ca" className="text-blue-600 hover:underline text-sm block text-center">
                  Xem tất cả
                </Link>
              </div>
            </div>

            {/* Featured articles */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-bold mb-4">Bài viết nổi bật</h2>
              <div className="space-y-4">
                {healthArticles.slice(0, 3).map((article) => (
                  <Link key={article.id} href={`/article/${article.id}`} className="flex group">
                    <div className="w-20 h-20 flex-shrink-0 mr-3">
                      <Image
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium group-hover:text-blue-600 line-clamp-2">{article.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{article.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Promotion banners */}
            {/* <div className="space-y-4">
              <Link href="/promotions/1">
                <Image
                  src="/placeholder.svg?text=Promotion+1&width=300&height=200&fontColor=white&bgColor=FF4136"
                  alt="Promotion 1"
                  width={300}
                  height={200}
                  className="w-full rounded-lg"
                />
              </Link>
              <Link href="/promotions/2">
                <Image
                  src="/placeholder.svg?text=Promotion+2&width=300&height=200&fontColor=white&bgColor=0074D9"
                  alt="Promotion 2"
                  width={300}
                  height={200}
                  className="w-full rounded-lg"
                />
              </Link>
            </div> */}
          </div>
        </div>
      </div>

      {/* Service features */}
      <div className="bg-white py-6 mt-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-3">
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
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-3">
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
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-3">
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
                <p className="text-sm">
                  <Link href="#" className="text-blue-600 hover:underline">
                    Xem chi tiết
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-3">
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
                <p className="text-sm">
                  <Link href="#" className="text-blue-600 hover:underline">
                    Xem chi tiết
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Floating chat button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Link href="/chat">
          <div className="bg-green-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors">
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
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </Link>
      </div>
    </div>
  )
}
