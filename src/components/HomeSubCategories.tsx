"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image" // SỬA ĐỔI: Import Image từ Next.js
import { Sparkles, List } from "lucide-react" // SỬA ĐỔI: Chỉ giữ lại các icon cần dùng
import { Skeleton } from "@/components/ui/skeleton"
import { API_BASE_URL } from "@/lib/api"

// SỬA ĐỔI: Định nghĩa lại interface cho khớp với dữ liệu API thực tế
interface Category {
  id: string;
  parent_id: string | null;
  title: string;
  slug: string;
  position: number;
  active: boolean;
  extend: boolean;
  image_url: string | null; // Ảnh có thể là null
  category_type: string;
}

// SỬA ĐỔI: Component Card được thiết kế lại để giữ giao diện cũ
const CategoryCard = ({
  imageUrl,
  title,
  href,
}: {
  imageUrl: string | null; // Có thể nhận null
  title: string;
  href: string;
}) => (
  <Link
    href={href}
    className="group flex flex-col items-center justify-center border border-[#E5E7EB] p-4 bg-[#FFFFFF] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full"
  >
    <div className="flex items-center justify-center h-10 w-10 mb-2">
      {/* SỬA ĐỔI: Logic hiển thị ảnh hoặc icon mặc định */}
      {imageUrl ? (
        <Image 
          // Nối Base URL với đường dẫn tương đối từ API
          src={`${API_BASE_URL}${imageUrl}`} 
          alt={title} 
          width={40} 
          height={40} 
          className="rounded-full object-cover" 
        />
      ) : (
        // Nếu không có ảnh, hiển thị icon mặc định
        <Sparkles size={24} className="text-secondary group-hover:text-primary transition-colors duration-300" />
      )}
    </div>
    <h3 className="text-center text-sm font-medium text-[#333333] group-hover:text-primary transition-colors duration-300">{title}</h3>
    {/* BỎ SUNG: Đã loại bỏ phần đếm sản phẩm vì API không còn trả về */}
  </Link>
)

// Giao diện Skeleton giữ nguyên vì đã khá phù hợp
const CategoryCardSkeleton = () => (
  <div className="flex flex-col items-center justify-center border border-[#E5E7EB] p-4 bg-[#FFFFFF] rounded-lg shadow-sm h-full">
    <Skeleton className="h-10 w-10 mb-2 rounded-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
)

export default function HomeSubCategories() {
  // SỬA ĐỔI: Sử dụng interface Category mới
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/categories.php?action=doc_danh_muc_cap_2`)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data: Category[] = await res.json()

        if (!Array.isArray(data)) {
          console.error("Fetched data is not an array:", data);
          setCategories([]);
          return;
        }

        // SỬA ĐỔI: Sắp xếp theo `position` thay vì `product_count`
        const filteredAndSorted = data.sort((a, b) => a.position - b.position)

        setCategories(filteredAndSorted)
      } catch (err) {
        console.error("Failed to load categories", err)
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-primary p-1 bg-neutral rounded-full">
          <List size={20} strokeWidth={2.5} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-primary">DANH MỤC SẢN PHẨM</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {loading ? (
          Array.from({ length: 12 }).map((_, index) => (
            <CategoryCardSkeleton key={index} />
          ))
        ) : categories.length > 0 ? (
          // SỬA ĐỔI: Truyền đúng props vào component Card
          categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              imageUrl={cat.image_url} // Truyền thẳng image_url (có thể là null)
              title={cat.title}
              href={`/danh-muc/${cat.slug}`}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-[#6B7280]">Không có danh mục nào.</p>
        )}
      </div>
    </div>
  )
}