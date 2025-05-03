"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock, User } from "lucide-react"

interface RelatedArticle {
  id: string
  title: string
  image: string
  timeRange: string
  readTime: string
}

export default function NewsArticlePage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [location, setLocation] = useState("Quận 10, HCM")

  // Related articles data
  const relatedArticles: RelatedArticle[] = [
    {
      id: "1",
      title: "Bill 299k khi mua các sản phẩm Cerave, La Roche-Posay,Vichy tặng ngẫu nhiên 1 sản phẩm",
      image: "/images/sanpham1.webp",
      timeRange: "(05/05 - 31/05)",
      readTime: "16 giây trước",
    },
    {
      id: "2",
      title: "Giờ vàng giá shock - Ngập deal khuyến mãi",
      image: "/images/sanpham2.webp",
      timeRange: "(03/05 - 04/05)",
      readTime: "1 ngày trước",
    },
    {
      id: "3",
      title: "Thu cũ đổi mới! Bút tiêm tiểu đường và Bình xịt hen suyễn - Nhận ngay ưu đãi",
      image: "/images/sanpham3.webp",
      timeRange: "(01/05 - 31/05)",
      readTime: "1 ngày trước",
    },
    {
      id: "4",
      title: "Chăm tuổi 50 - Khỏe răng ngọc, khuyến mãi ngập tràn",
      image: "/images/sanpham4.webp",
      timeRange: "(05/05 - 31/05)",
      readTime: "1 ngày trước",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main content */}
      <div className="container mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm mb-4">
          <Link href="/" className="text-gray-500 hover:text-blue-600">
            Thông tin khuyến mãi
          </Link>
          <span className="mx-1">›</span>
          <span className="text-gray-700">MWG - Top 10 Doanh Nghiệp Thực Thi ESG Toàn Diện Nhất 2024</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Article content */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold mb-4">MWG - Top 10 Doanh Nghiệp Thực Thi ESG Toàn Diện Nhất 2024</h1>

              <div className="flex items-center text-sm text-gray-500 mb-6">
                <div className="flex items-center mr-4">
                  <Clock size={14} className="mr-1" />
                  <span>Cập nhật: 29/04/2025</span>
                </div>
                <div className="flex items-center">
                  <User size={14} className="mr-1" />
                  <span>Lượt xem: 29</span>
                </div>
              </div>

              <div className="mb-6">
                <p className="font-bold mb-4">
                  MWG lọt Top 10 Doanh Nghiệp Thực Thi ESG Toàn Diện Tại Vietnam ESG Awards 2025.
                </p>

                <p className="mb-4">
                  Tập đoàn Thế Giới Di Động (MWG) tự hào được vinh danh trong Top 10 đơn vị thực thi ESG toàn diện tại
                  Vietnam ESG Awards 2025 – giải thưởng do Báo Dân trí khởi xướng nhằm ghi nhận những nỗ lực nổi bật
                  trong hành trình phát triển bền vững của doanh nghiệp Việt.
                </p>

                <div className="flex justify-center my-6">
                  <div className="relative w-full max-w-lg">
                    <Image
                      src="/images/mypham1.webp"
                      alt="ESG Award Trophy"
                      width={500}
                      height={300}
                      className="rounded-md"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      MWG - Top 10 Doanh Nghiệp Thực Thi ESG Toàn Diện Nhất 2024
                    </div>
                  </div>
                </div>

                <p className="mb-4">
                  Trong những năm gần đây, với triết lý <strong>Đặt Tính Bền Vững Làm Trung Tâm</strong>, MWG đã triển
                  khai nhiều sáng kiến phát triển bền vững trên toàn quốc.
                </p>

                <p className="mb-4">Những điểm ấn nổi bật của MWG trên hành trình thực thi ESG:</p>

                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Chuyển dịch sử dụng năng lượng tái tạo.</li>
                  <li>Tối ưu vận hành qua hệ thống Internet Vạn Vật (IoT).</li>
                  <li>Lan tỏa hành vi sống xanh và tiêu dùng bền vững qua các dự án hợp tác.</li>
                  <li>Chung tay đóng góp và giúp đỡ cộng đồng địa phương.</li>
                  <li>Thực hành quản trị minh bạch và chuẩn mực.</li>
                </ul>

                <p className="mb-4">
                  Việc MWG được vinh danh tại Vietnam ESG Awards 2025 với danh hiệu Doanh nghiệp Thực Thi ESG Toàn Diện
                  Nhất 2024 là sự ghi nhận cho những nỗ lực không ngừng của hơn 60000 nhân viên và và đang chung tay
                  cho hành trình này. Bên cạnh đó, đây sẽ là động lực để doanh nghiệp tiếp tục phong trào hành trình
                  hiện thực hóa các cam kết ESG, chung tay xây dựng một Việt Nam phát triển xanh và bền vững hơn.
                </p>

                <div className="text-right mt-8 text-sm text-gray-600">
                  <p className="font-bold">Phạm Nguyễn Như Minh</p>
                  <p>30/04/2025 15:24:00</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">Từ khóa:</span>
                  <div className="flex flex-wrap gap-2">
                    <Link href="#" className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md text-xs text-gray-700">
                      #esgmwg
                    </Link>
                    <Link href="#" className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md text-xs text-gray-700">
                      #phattrienbenvung
                    </Link>
                    <Link href="#" className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md text-xs text-gray-700">
                      #vietnamesgawards2025
                    </Link>
                    <Link href="#" className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md text-xs text-gray-700">
                      #top10esg
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Related articles */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Các bài tin liên quan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((article) => (
                  <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="relative">
                      <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded-br-md">
                        {article.timeRange}
                      </div>
                      <Image
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        width={300}
                        height={150}
                        className="w-full h-40 object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <Link href="#" className="hover:text-blue-600">
                        <h3 className="font-medium text-sm line-clamp-2 mb-2">{article.title}</h3>
                      </Link>
                      <div className="text-xs text-gray-500">{article.readTime}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Promotion banner 1 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Link href="#">
                <Image
                  src="/images/slider-1.webp"
                  alt="Đặt khám hẹn giờ"
                  width={300}
                  height={200}
                  className="w-full"
                />
              </Link>
            </div>

            {/* Promotion banner 2 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Link href="#">
                <Image
                  src="/images/slider-2.webp"
                  alt="Chăm da đón hè"
                  width={300}
                  height={200}
                  className="w-full"
                />
              </Link>
            </div>

            {/* Promotion banner 3 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Link href="#">
                <Image
                  src="/images/slider-3.webp"
                  alt="COSTAR GIẢM 30%"
                  width={300}
                  height={200}
                  className="w-full"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Service features */}
      <div className="bg-white py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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


    </div>
  )
}
