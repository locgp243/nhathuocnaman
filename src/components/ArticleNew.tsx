import Image from "next/image"
import Link from "next/link"

interface NewsItem {
  id: string
  title: string
  image: string
  slug: string
}

export default function ArticleNew() {
  const newsItems: NewsItem[] = [
    {
      id: "1",
      title: "Cảnh báo: Bệnh đậu mùa khỉ xuất hiện tại Việt Nam, những triệu chứng cần nhận biết",
      image: "/images/tintuc1.jpg",
      slug: "benh-dau-mua-khi-tai-viet-nam",
    },
    {
      id: "2",
      title: "So sánh các phương pháp điều trị viêm gan B mạn tính: Thuốc kháng virus và liệu pháp miễn dịch",
      image: "/images/tintuc2.jpg",
      slug: "so-sanh-dieu-tri-viem-gan-b",
    },
    {
      id: "3",
      title: "Bệnh Alzheimer: Nghiên cứu mới phát hiện dấu hiệu sớm qua xét nghiệm máu đơn giản",
      image: "/images/tintuc3.jpg",
      slug: "benh-alzheimer-dau-hieu-som",
    },
    {
      id: "4",
      title: "So sánh hiệu quả của các phương pháp điều trị đau thắt lưng cấp tính và mạn tính",
      image: "/images/tintuc4.jpg",
      slug: "so-sanh-dieu-tri-dau-that-lung", 
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
        <div className="bg-white rounded-full p-2">
          <Image src="/images/tintuc.png" alt="Logo" width={24} height={24} className="object-contain" />
        </div>
          <h2 className="text-2xl font-bold text-gray-800">BẢN TIN SỨC KHỎE</h2>
        </div>
        <Link href="/thong-tin-benh" className="text-blue-600 hover:underline text-sm">
          Xem tất cả
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {newsItems.map((item) => (
          <Link key={item.id} href={`/thong-tin-benh/${item.slug}`} className="group">
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800 line-clamp-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
