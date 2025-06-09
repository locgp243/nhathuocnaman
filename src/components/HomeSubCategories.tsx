"use client"

import { useEffect, useState } from "react" // Thêm useCallback nếu cần, hiện tại không dùng
import Link from "next/link"
import {
  Brain, Pill, Heart, Shield, Stethoscope,
  FlaskConical, Apple, Syringe, Sparkles, Eye,
  Gem, HeartHandshake, List // Thêm List icon cho tiêu đề mục
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton" // Giả sử bạn có component Skeleton

interface CategoryData {
  subcategory_id: number
  subcategory_name: string
  subcategory_slug: string
  subcategory_icon: string | null // Giữ nguyên, iconMap sẽ xử lý
  product_count: number
}

// iconMap nên được đặt bên ngoài component nếu nó không phụ thuộc vào props hoặc state
const iconMap: Record<string, React.ReactNode> = {
  "vitamin-khoang-chat": <Pill size={24} className="text-secondary" />, // Áp dụng màu secondary ở đây
  "than-kinh-nao": <Brain size={24} className="text-secondary" />,
  "suc-khoe-tim-mach": <Heart size={24} className="text-secondary" />,
  "tang-suc-de-khang": <Shield size={24} className="text-secondary" />,
  "ho-tro-tieu-hoa": <Stethoscope size={24} className="text-secondary" />,
  "sinh-ly-noi-tiet-to": <FlaskConical size={24} className="text-secondary" />,
  "dinh-duong": <Apple size={24} className="text-secondary" />,
  "ho-tro-dieu-tri": <Syringe size={24} className="text-secondary" />,
  "giai-phap-lan-da": <Sparkles size={24} className="text-secondary" />, // Hoặc icon mặc định nếu slug không khớp
  "cham-soc-da-mat": <Eye size={24} className="text-secondary" />,
  "ho-tro-lam-dep": <Gem size={24} className="text-secondary" />,
  "ho-tro-tinh-duc": <HeartHandshake size={24} className="text-secondary" />,
  "default": <Sparkles size={24} className="text-secondary" /> // Icon mặc định
}

const CategoryCard = ({
  icon,
  title,
  count,
  href,
}: {
  icon: React.ReactNode
  title: string
  count: number
  href: string
}) => (
  <Link
    href={href}
    className="group flex flex-col items-center justify-center border border-[#E5E7EB] p-4 bg-[#FFFFFF] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
  >
    {/* Icon đã có màu từ iconMap, không cần div bao quanh với text-secondary nữa */}
    <div className="mb-2 group-hover:text-primary transition-colors duration-300">{icon}</div>
    <h3 className="text-center text-sm font-medium mb-1 text-[#333333] group-hover:text-primary transition-colors duration-300">{title}</h3>
    <p className="text-xs text-[#AAAAAA]">{count} sản phẩm</p>
  </Link>
)

const CategoryCardSkeleton = () => (
  <div className="flex flex-col items-center justify-center border border-[#E5E7EB] p-4 bg-[#FFFFFF] rounded-lg shadow-sm">
    <Skeleton className="h-6 w-6 mb-2 rounded-full" /> {/* Icon placeholder */}
    <Skeleton className="h-4 w-3/4 mb-1" /> {/* Title placeholder */}
    <Skeleton className="h-3 w-1/2" /> {/* Count placeholder */}
  </div>
)

export default function HomeSubCategories() {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true) // Thêm state loading

  useEffect(() => {
    async function fetchData() {
      setLoading(true); // Bắt đầu tải thì set loading
      try {
        const res = await fetch("http://localhost/server/get_subcategories.php")
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json()

        // Kiểm tra data có phải là mảng không
        if (!Array.isArray(data)) {
            console.error("Fetched data is not an array:", data);
            setCategories([]); // Set thành mảng rỗng hoặc xử lý lỗi phù hợp
            return; // Dừng sớm
        }

        const filtered = data
          // .filter((cat: CategoryData) => cat.product_count > 0) 
          .sort((a: CategoryData, b: CategoryData) => b.product_count - a.product_count)

        setCategories(filtered)
      } catch (err) {
        console.error("Failed to load categories", err)
        setCategories([]); // Có lỗi thì set thành mảng rỗng
      } finally {
        setLoading(false); // Kết thúc tải (dù thành công hay lỗi) thì bỏ loading
      }
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-7xl mx-auto py-8 px-4"> {/* Sử dụng mx-auto và py-8 cho nhất quán */}
      {/* Container không cần thiết nếu max-w-7xl đã có mx-auto */}
      {/* <div className="container mx-auto"> */}
        <div className="flex items-center gap-3 mb-6"> {/* Tăng gap và mb */}
          {/* Đổi icon tiêu đề mục cho phù hợp hơn */}
          <div className="text-primary p-1 bg-neutral rounded-full"> {/* Dùng màu primary và nền neutral */}
            <List size={20} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-primary">DANH MỤC SẢN PHẨM</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading ? (
            // Hiển thị Skeleton khi đang tải, ví dụ 12 cái
            Array.from({ length: 12 }).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))
          ) : categories.length > 0 ? (
            // Hiển thị danh mục khi đã tải xong và có dữ liệu
            categories.map((cat) => (
              <CategoryCard
                key={cat.subcategory_id}
                icon={iconMap[cat.subcategory_slug] || iconMap["default"]} // Lấy icon theo slug, fallback về default
                title={cat.subcategory_name}
                count={cat.product_count}
                href={`/danh-muc/${cat.subcategory_slug}`} // Ví dụ URL thân thiện
              />
            ))
          ) : (
            // Thông báo nếu không có danh mục nào (sau khi đã tải xong)
            <p className="col-span-full text-center text-[#6B7280]">Không có danh mục nào.</p>
          )}
        </div>
      {/* </div> */}
    </div>
  )
}