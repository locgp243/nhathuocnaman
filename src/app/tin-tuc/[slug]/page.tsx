"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import type { Post, PostCategory } from "@/types/ArticleCard" // Đảm bảo đường dẫn đúng
import { API_BASE_URL } from "@/lib/api"
// Component con cho một bài viết trong lưới
const ArticleCard = ({ article }: { article: Post }) => (
  <Link href={`/goc-suc-khoe/${article.slug}`} legacyBehavior>
    <a className="block group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        {article.category_title && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-sm">
              {article.category_title}
            </span>
          </div>
        )}
        <div className="aspect-video relative">
          <Image
            src={`${API_BASE_URL}${article.image_url || "/images/placeholder.jpg"}`}
            alt={article.title}
            fill
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
      </div>
    </a>
  </Link>
);

// Component con cho bài viết trong sidebar
const SidebarArticle = ({ article }: { article: Post }) => (
  <Link href={`/goc-suc-khoe/${article.slug}`} className="flex group gap-3 items-center">
    <div className="w-20 h-20 flex-shrink-0 relative">
      <Image
        src={`${API_BASE_URL}${article.image_url || "/images/placeholder.jpg"}`}
        alt={article.title}
        fill
        className="w-full h-full object-cover rounded-md"
        sizes="10vw"
      />
    </div>
    <div>
      <h3 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-3">{article.title}</h3>
      {article.category_title && <p className="text-xs text-gray-500 mt-1">{article.category_title}</p>}
    </div>
  </Link>
);


export default function HealthCornerPage() {

  // State cho các loại dữ liệu khác nhau trên trang
  const [heroArticle, setHeroArticle] = useState<Post | null>(null);
  const [generalArticles, setGeneralArticles] = useState<Post[]>([]);
  const [categorySections, setCategorySections] = useState<Record<string, Post[]>>({});
  const [sidebarCategories, setSidebarCategories] = useState<PostCategory[]>([]);
  const [sidebarFeatured, setSidebarFeatured] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const categoriesToFetch = [
            { key: 'benhVien', slug: 'benh-vien' },
            { key: 'sucKhoeTreEm', slug: 'suc-khoe-tre-em' },
            { key: 'phucHoiSauSinh', slug: 'phuc-hoi-sau-sinh' }
        ];

        // Dùng Promise.all để gọi các API song song, tăng tốc độ tải trang
        const [
          heroRes,
          generalRes,
          sidebarCatRes,
          sidebarFeaturedRes,
          ...categorySectionsRes
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/posts.php?action=doc&featured=true&limit=1`),
          fetch(`${API_BASE_URL}/posts.php?action=doc&limit=7`), // 1 hero + 6 general
          fetch(`${API_BASE_URL}/categories.php?action=read_post_subcategories`),
          fetch(`${API_BASE_URL}/posts.php?action=doc&featured=true&limit=3`),
          ...categoriesToFetch.map(cat => fetch(`${API_BASE_URL}/posts.php?action=doc&category_slug=${cat.slug}&limit=4`))
        ]);

        // Xử lý kết quả
        const heroData = await heroRes.json();
        const generalData = await generalRes.json();
        const sidebarCatData = await sidebarCatRes.json();
        const sidebarFeaturedData = await sidebarFeaturedRes.json();

        setHeroArticle(heroData?.[0] || generalData?.[0] || null);
        setGeneralArticles(generalData?.slice(1, 7) || []); // Bỏ bài đầu tiên (đã làm hero) và lấy 6 bài tiếp theo
        setSidebarCategories(sidebarCatData || []);
        setSidebarFeatured(sidebarFeaturedData || []);
        
        const sectionsData: Record<string, Post[]> = {};
        for (let i = 0; i < categoriesToFetch.length; i++) {
            const key = categoriesToFetch[i].key;
            const data = await categorySectionsRes[i].json();
            sectionsData[key] = data;
        }
        setCategorySections(sectionsData);

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang Góc sức khỏe:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE_URL]);

  if (isLoading) {
      // Có thể tạo một Skeleton component chi tiết hơn cho toàn trang
      return <div className="container mx-auto px-4 py-4 text-center">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-primary">Bệnh & Góc sức khỏe</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-4">
        {/* Search Bar & Tabs */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center space-x-6">
            <Link href="/goc-suc-khoe?filter=featured" className="flex items-center text-primary font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              <span>Bài viết nổi bật</span>
            </Link>
            {/* Các tab khác có thể thêm ở đây */}
            <div className="flex-1 relative ml-auto">
              <Input type="text" placeholder="Tìm kiếm bài viết..." className="pl-10"/>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột nội dung chính (trái) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Article */}
            {heroArticle && (
                <Link href={`/tin-tuc/goc-suc-khoe/${heroArticle.slug}`} legacyBehavior>
                    <a className="block group bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="relative aspect-video">
                            <Image src={heroArticle.image_url || "/images/placeholder-large.jpg"} alt={heroArticle.title} fill className="object-cover"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6">
                                <h2 className="text-white text-2xl font-bold line-clamp-2 group-hover:underline">{heroArticle.title}</h2>
                            </div>
                        </div>
                    </a>
                </Link>
            )}

            {/* General Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generalArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            
            {/* Category-specific Sections */}
            {Object.entries(categorySections).map(([key, articles]) => {
              if (articles.length === 0) return null;
              const sectionInfo = {
                  benhVien: { title: 'Bệnh Viện', slug: 'benh-vien' },
                  sucKhoeTreEm: { title: 'Sức khỏe trẻ em', slug: 'suc-khoe-tre-em' },
                  phucHoiSauSinh: { title: 'Phục hồi sau sinh', slug: 'phuc-hoi-sau-sinh' },
              }[key];
              
              if (!sectionInfo) return null;

              return (
                <div key={key} className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">{sectionInfo.title}</h2>
                    <Link href={`/goc-suc-khoe/danh-muc/${sectionInfo.slug}`} className="text-primary hover:underline text-sm font-medium">Xem thêm</Link>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {articles.slice(0, 4).map(article => ( // Hiển thị tối đa 4 bài
                          <ArticleCard key={article.id} article={article} />
                      ))}
                   </div>
                </div>
              )
            })}
          </div>

          {/* Sidebar (phải) */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-bold mb-4">Chuyên mục nổi bật</h2>
              <div className="space-y-3">
                {sidebarCategories.map((category) => (
                  <Link key={category.id} href={`/goc-suc-khoe/danh-muc/${category.slug}`} className="flex items-center p-2 hover:bg-gray-100 rounded-md group">
                    <div className="mr-4 relative w-12 h-12 flex-shrink-0">
                      <Image src={category.image_url || "/images/placeholder-icon.jpg"} alt={category.title} fill className="rounded-md object-cover"/>
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-primary">{category.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-bold mb-4">Bài viết xem nhiều</h2>
              <div className="space-y-4">
                {sidebarFeatured.map((article) => (
                   <SidebarArticle key={article.id} article={article} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}