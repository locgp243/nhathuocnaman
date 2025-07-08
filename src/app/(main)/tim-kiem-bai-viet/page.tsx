"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types/ArticleCard";
import { API_BASE_URL } from "@/lib/api";

// --- Components Con ---
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
      <h3 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-3">{article.title}</h3>
      {article.category_title && <p className="text-xs text-gray-500 mt-1">{article.category_title}</p>}
    </div>
  </Link>
);
// --- Component Chính Của Trang ---
function SearchPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
    const [searchResults, setSearchResults] = useState<Post[]>([]);
    const [sidebarFeatured, setSidebarFeatured] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSearchData = async () => {
            if (!searchTerm) {
                setSearchResults([]);
                setIsLoading(false);
                return;
            }
            
            setIsLoading(true);
            try {
                // Gọi cả hai API song song để tối ưu
                const [searchRes, featuredRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/posts.php?action=tim_bai_viet&q=${encodeURIComponent(searchTerm)}`),
                    fetch(`${API_BASE_URL}/posts.php?action=doc_tat_ca&featured=true&limit=5`)
                ]);

                // Xử lý kết quả tìm kiếm
                const searchResultData = await searchRes.json();
                if (searchResultData.success && Array.isArray(searchResultData.data)) {
                    setSearchResults(searchResultData.data);
                } else {
                    setSearchResults([]);
                }

                // Xử lý bài viết nổi bật cho sidebar
                const featuredResultData = await featuredRes.json();
                if (featuredResultData.success && Array.isArray(featuredResultData.data)) {
                    setSidebarFeatured(featuredResultData.data);
                }

            } catch (error) {
                console.error("Lỗi khi tìm kiếm bài viết:", error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchData();
    }, [searchTerm]); // Chạy lại mỗi khi searchTerm thay đổi

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Cập nhật URL để người dùng có thể chia sẻ link tìm kiếm
        router.push(`/tim-kiem-bai-viet?q=${encodeURIComponent(inputValue)}`);
        setSearchTerm(inputValue);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white py-2 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">Trang chủ</Link>
                        <span className="mx-2">/</span>
                        <span className="font-medium text-primary">Tìm kiếm bài viết</span>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="container mx-auto px-4 py-8">
                {/* Search Bar */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                        <div className="flex-1 relative">
                            <Input
                                type="text"
                                placeholder="Tìm kiếm bài viết, bệnh, triệu chứng..."
                                className="pl-10 h-12"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                        <Button type="submit" className="h-12 px-6">Tìm kiếm</Button>
                    </form>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cột nội dung chính (trái) */}
                    <main className="lg:col-span-2">
                        <h1 className="text-2xl font-bold mb-4">
                            Kết quả tìm kiếm cho: <span className="text-primary">{searchTerm}</span>
                        </h1>
                        {isLoading ? (
                            <p>Đang tìm kiếm...</p>
                        ) : searchResults.length > 0 ? (
                            <div className="space-y-6">
                                {searchResults.map(article => (
                                    <ArticleCard key={article.id} article={article} /> // Tái sử dụng card nhỏ
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                                <p>Không tìm thấy bài viết nào phù hợp.</p>
                            </div>
                        )}
                    </main>

                    {/* Sidebar (phải) */}
                    <aside className="lg:col-span-1 space-y-6">
                        {sidebarFeatured.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <h2 className="text-lg font-bold mb-4">Bài viết xem nhiều</h2>
                                <div className="space-y-4">
                                    {sidebarFeatured.map((article) => (
                                        <SidebarArticle key={article.id} article={article} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}

// Dùng Suspense để đọc searchParams từ URL một cách an toàn
export default function SearchPageWrapper() {
    return (
        <Suspense fallback={<div className="text-center p-10">Đang tải trang...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}