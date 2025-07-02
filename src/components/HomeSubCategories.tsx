'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, List, ChevronDown } from "lucide-react" 
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button" 
import { API_BASE_URL } from "@/lib/api"

interface Category {
  id: string;
  parent_id: string | null;
  title: string;
  slug: string;
  position: number;
  image_url: string | null;
  category_type: string;
}

const CategoryCard = ({ imageUrl, title, href }: { imageUrl: string | null; title: string; href: string; }) => (
  <Link href={href} className="group flex flex-col items-center justify-center border border-[#E5E7EB] p-4 bg-[#FFFFFF] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
    <div className="flex items-center justify-center h-10 w-10 mb-2">
      {imageUrl ? (
        <Image src={`${API_BASE_URL}${imageUrl}`} alt={title} width={40} height={40} className="rounded-full object-cover" />
      ) : (
        <Sparkles size={24} className="text-secondary group-hover:text-primary transition-colors duration-300" />
      )}
    </div>
    <h3 className="text-center text-sm font-medium text-[#333333] group-hover:text-primary transition-colors duration-300">{title}</h3>
  </Link>
)

const CategoryCardSkeleton = () => (
  <div className="flex flex-col items-center justify-center border border-[#E5E7EB] p-4 bg-[#FFFFFF] rounded-lg shadow-sm h-full">
    <Skeleton className="h-10 w-10 mb-2 rounded-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
)

export default function HomeSubCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobileExpanded, setIsMobileExpanded] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/categories.php?action=doc_danh_muc_cap_2`)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data: Category[] = await res.json();

        if (!Array.isArray(data)) {
          console.error("Fetched data is not an array:", data);
          setCategories([]);
          return;
        }

        const productCategories = data.filter(cat => cat.category_type === 'product');

        const sortedCategories = productCategories.sort((a, b) => a.position - b.position);
        const top12Categories = sortedCategories.slice(0, 12);
        
        setCategories(top12Categories);

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
          Array.from({ length: 12 }).map((_, index) => <CategoryCardSkeleton key={index} />)
        ) : categories.length > 0 ? (
          categories.map((cat, index) => (
            <div 
              key={cat.id} 
              className={index >= 6 && !isMobileExpanded ? 'hidden lg:block' : 'block'}
            >
              <CategoryCard
                imageUrl={cat.image_url}
                title={cat.title}
                href={`/danh-muc/${cat.slug}`}
              />
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-[#6B7280]">Không có danh mục nào.</p>
        )}
      </div>

      {!loading && !isMobileExpanded && categories.length > 6 && (
        <div className="mt-6 flex justify-center lg:hidden">
          <Button variant="outline" onClick={() => setIsMobileExpanded(true)}>
            Xem thêm <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}