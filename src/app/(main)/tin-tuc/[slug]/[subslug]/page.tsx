// CategoryPage.jsx - Trang hiển thị bài viết theo danh mục

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, ArrowLeft, Calendar, User } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Post, PostCategory } from "@/types/ArticleCard"
import { API_BASE_URL } from "@/lib/api"

// ===================================================================
// COMPONENT CON - ArticleCard
// ===================================================================
const ArticleCard = ({ article }: { article: Post }) => (
  <Link href={`/bai-viet/${article.slug}`} legacyBehavior>
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
            src={`https://nhathuoc.trafficnhanh.com${article.image_url}`}
            alt={article.title}
            fill
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {article.excerpt}
        </p>
        <div className="flex items-center text-xs text-gray-500 space-x-4">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{new Date(article.published_at || article.created_at).toLocaleDateString('vi-VN')}</span>
          </div>
          {article.author_name && (
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              <span>{article.author_name}</span>
            </div>
          )}
        </div>
      </div>
    </a>
  </Link>
);

// ===================================================================
// COMPONENT CON - SidebarArticle
// ===================================================================
const SidebarArticle = ({ article }: { article: Post }) => (
  <Link href={`/bai-viet/${article.slug}`} className="flex group gap-3 items-center">
    <div className="w-20 h-20 flex-shrink-0 relative">
      <Image
        src={`https://nhathuoc.trafficnhanh.com${article.image_url}`}
        alt={article.title}
        fill
        className="w-full h-full object-cover rounded-md"
        sizes="10vw"
      />
    </div>
    <div>
      <h3 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-3">
        {article.title}
      </h3>
      {article.category_title && (
        <p className="text-xs text-gray-500 mt-1">{article.category_title}</p>
      )}
    </div>
  </Link>
);

// ===================================================================
// COMPONENT CON - Pagination
// ===================================================================
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void; 
}) => {
  const pages = [];
  const showPages = 5; // Số trang hiển thị
  
  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  const endPage = Math.min(totalPages, startPage + showPages - 1);
  
  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {currentPage > 1 && (
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1"
        >
          Trước
        </Button>
      )}
      
      {startPage > 1 && (
        <>
          <Button
            variant="outline"
            onClick={() => onPageChange(1)}
            className="px-3 py-1"
          >
            1
          </Button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}
      
      {pages.map(page => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          onClick={() => onPageChange(page)}
          className="px-3 py-1"
        >
          {page}
        </Button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Button
            variant="outline"
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1"
          >
            {totalPages}
          </Button>
        </>
      )}
      
      {currentPage < totalPages && (
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1"
        >
          Tiếp
        </Button>
      )}
    </div>
  );
};

// ===================================================================
// COMPONENT CHÍNH - CategoryPage
// ===================================================================
export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params?.subslug as string;
  
  const [category, setCategory] = useState<PostCategory | null>(null);
  const [articles, setArticles] = useState<Post[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Post[]>([]);
  const [relatedCategories, setRelatedCategories] = useState<PostCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  
  const articlesPerPage = 12;

  // Fetch dữ liệu danh mục và bài viết
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categorySlug) return;
      
      try {
        setIsLoading(true);
        
        const [categoryRes, articlesRes, featuredRes, relatedRes] = await Promise.all([
          // Lấy thông tin danh mục
          fetch(`${API_BASE_URL}/categories.php?action=doc_danh_muc_by_slug&slug=${categorySlug}`),
          // Lấy bài viết theo danh mục với phân trang
          fetch(`${API_BASE_URL}/posts.php?action=doc_tat_ca&category_slug=${categorySlug}&page=${currentPage}&limit=${articlesPerPage}&search=${searchTerm}`),
          // Lấy bài viết nổi bật
          fetch(`${API_BASE_URL}/posts.php?action=doc_tat_ca&featured=true&limit=5`),
          // Lấy các danh mục liên quan
          fetch(`${API_BASE_URL}/categories.php?action=doc_danh_muc_bai_viet&limit=8`)
        ]);

        // Xử lý response danh mục
        const categoryData = await categoryRes.json();
        setCategory(categoryData);

        // Xử lý response bài viết chính
        const articlesData = await articlesRes.json();
        console.log('Articles API Response:', articlesData); // Debug log
        
        if (articlesData.success && Array.isArray(articlesData.data)) {
          setArticles(articlesData.data);
          setTotalArticles(articlesData.total || 0);
          setTotalPages(Math.ceil((articlesData.total || 0) / articlesPerPage));
        } else {
          // Fallback cho format cũ
          const articlesArray = articlesData.data || articlesData || [];
          setArticles(Array.isArray(articlesArray) ? articlesArray : []);
          setTotalArticles(articlesData.total || articlesArray.length || 0);
          setTotalPages(Math.ceil((articlesData.total || articlesArray.length || 0) / articlesPerPage));
        }

        // Xử lý response bài viết nổi bật
        const featuredData = await featuredRes.json();
        if (featuredData.success && Array.isArray(featuredData.data)) {
          setFeaturedArticles(featuredData.data);
        } else {
          const featuredArray = featuredData.data || featuredData || [];
          setFeaturedArticles(Array.isArray(featuredArray) ? featuredArray : []);
        }

        // Xử lý response danh mục liên quan
        const relatedData = await relatedRes.json();
        if (relatedData.success && Array.isArray(relatedData.data)) {
          setRelatedCategories(relatedData.data);
        } else {
          const relatedArray = relatedData.data || relatedData || [];
          setRelatedCategories(Array.isArray(relatedArray) ? relatedArray : []);
        }

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu danh mục:", error);
        // Reset state khi có lỗi
        setArticles([]);
        setFeaturedArticles([]);
        setRelatedCategories([]);
        setTotalArticles(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, [categorySlug, currentPage, searchTerm]);

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy danh mục</h1>
            <Link href="/goc-suc-khoe" className="text-primary hover:underline">
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link href="/" className="hover:text-primary">Bệnh và góc sức khỏe</Link>
            <span className="mx-2">/</span>
            <Link href="/goc-suc-khoe" className="hover:text-primary">Góc sức khỏe</Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-primary">{category.title}</span>
          </div>
        </div>
      </div>

      {/* Header của danh mục */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{category.title}</h1>
                <p className="text-gray-600 mt-1">
                  {totalArticles} bài viết trong danh mục này
                </p>
              </div>
            </div>
            {category.image_url && (
              <div className="w-16 h-16 relative">
                <Image
                  src={`https://nhathuoc.trafficnhanh.com/${category.image_url}`}
                  alt={category.title}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <form onSubmit={handleSearch} className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder={`Tìm kiếm trong ${category.title}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <Button type="submit">Tìm kiếm</Button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột nội dung chính */}
          <div className="lg:col-span-2">
            {articles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-2" />
                  <h3 className="text-lg font-medium">
                    {searchTerm ? `Không tìm thấy bài viết nào với từ khóa "${searchTerm}"` : 'Chưa có bài viết nào trong danh mục này'}
                  </h3>
                  <p className="text-sm mt-2">
                    {searchTerm ? 'Hãy thử tìm kiếm với từ khóa khác' : 'Vui lòng quay lại sau'}
                  </p>
                </div>
                {searchTerm && (
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    variant="outline"
                  >
                    Xóa tìm kiếm
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Bài viết nổi bật */}
            {featuredArticles.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-bold mb-4">Bài viết nổi bật</h2>
                <div className="space-y-4">
                  {featuredArticles.map((article) => (
                    <SidebarArticle key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}

            {/* Danh mục liên quan */}
            {relatedCategories.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-bold mb-4">Danh mục khác</h2>
                <div className="space-y-3">
                  {relatedCategories
                    .filter(cat => cat.slug !== categorySlug)
                    .slice(0, 6)
                    .map((cat) => {
                      const firstLetter = cat.title ? cat.title.charAt(0).toUpperCase() : '?';
                      return (
                        <Link
                          key={cat.id}
                          href={`/tin-tuc/benh-va-goc-suc-khoe/${cat.slug}`}
                          className="flex items-center p-2 hover:bg-gray-100 rounded-md group"
                        >
                          <div className="mr-4 relative w-12 h-12 flex-shrink-0">
                            {cat.image_url ? (
                              <Image
                                src={`https://nhathuoc.trafficnhanh.com/${cat.image_url}`}
                                alt={cat.title}
                                fill
                                className="rounded-md object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center rounded-md font-bold text-xl text-primary bg-gray-100">
                                {firstLetter}
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-gray-700 group-hover:text-primary">
                            {cat.title}
                          </span>
                        </Link>
                      );
                    })}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}