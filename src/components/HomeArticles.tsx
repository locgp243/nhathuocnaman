"use client";

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { API_BASE_URL } from '@/lib/api'; // Giả sử bạn đã định nghĩa API_BASE_URL trong config
// --- Types (Không đổi) ---
interface PostCategory {
  id: string;
  title: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  image_url: string;
  category_title: string;
}

// --- Component Skeleton (Không đổi) ---
const ArticlesSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
      <div className="lg:col-span-1">
        <div className="bg-gray-200/50 rounded-lg h-full p-4 space-y-3">
          <div className="bg-gray-300/50 h-64 rounded-md"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300/50 rounded w-1/4"></div>
            <div className="h-6 bg-gray-300/50 rounded w-full"></div>
            <div className="h-4 bg-gray-300/50 rounded w-full mt-2"></div>
            <div className="h-4 bg-gray-300/50 rounded w-2/3"></div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex space-x-3 p-2 bg-gray-200/50 rounded-lg">
            <div className="bg-gray-300/50 w-24 h-20 rounded-md flex-shrink-0"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-300/50 rounded w-1/3"></div>
              <div className="h-4 bg-gray-300/50 rounded w-full"></div>
              <div className="h-4 bg-gray-300/50 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
);

// --- Sub-components (Không đổi) ---
const FeaturedArticleCard = ({ article }: { article: Post }) => (
    <Link href={`/tin-tuc/goc-suc-khoe/${article.slug}`} className="block group h-full">
        <Card className="h-full overflow-hidden transition-shadow duration-300 bg-transparent border-none shadow-none hover:shadow-xl">
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                    src={`https://nhathuoc.trafficnhanh.com/${article.image_url}`}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {article.category_title && (
                    <div className="absolute top-3 left-3">
                        <Badge className="bg-primary text-white text-xs border-none">
                            {article.category_title}
                        </Badge>
                    </div>
                )}
            </div>
            <CardContent className="p-4 px-1">
                <h2 className="font-bold text-lg leading-tight text-gray-800 mb-3 transition-colors duration-300 group-hover:text-primary">
                    {article.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {article.excerpt}
                </p>
            </CardContent>
        </Card>
    </Link>
);

const ArticleItemCard = ({ article }: { article: Post }) => (
  
    <Link key={article.id} href={`/tin-tuc/goc-suc-khoe/${article.slug}`} className="block group">
        <Card className="overflow-hidden transition-shadow duration-300 cursor-pointer bg-transparent border-none shadow-none hover:shadow-lg rounded-lg">
            <div className="flex gap-4">
                <div className="w-28 h-24 relative flex-shrink-0">
                    <Image
                        src={`${API_BASE_URL}${article.image_url}`}
                        alt={article.title}
                        fill
                        className="object-cover rounded-md"
                        sizes="25vw"
                    />
                </div>
                <CardContent className="p-0 flex-1 flex flex-col justify-center">
                    {article.category_title && (
                        <div className="mb-2">
                            <Badge variant="secondary" className="text-xs bg-secondary/20 text-secondary border-secondary/30">
                                {article.category_title}
                            </Badge>
                        </div>
                    )}
                    <h3 className="font-semibold text-sm leading-tight text-gray-800 line-clamp-3 transition-colors duration-300 group-hover:text-primary">
                        {article.title}
                    </h3>
                </CardContent>
            </div>
        </Card>
    </Link>
);

const CategoryTabs = ({ categories, activeSlug, onSelect }: { categories: PostCategory[], activeSlug: string, onSelect: (slug: string) => void }) => (
    <div className="relative mb-6">
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-2">
                {categories.map((category) => (
                    <Badge
                        key={category.id}
                        variant={activeSlug === category.slug ? "default" : "secondary"}
                        className={`whitespace-nowrap px-4 py-2 cursor-pointer transition-all duration-300 flex-shrink-0 border-none ${
                            activeSlug === category.slug
                                ? "bg-primary text-white shadow-md"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300/70 hover:text-primary"
                        }`}
                        onClick={() => onSelect(category.slug)}
                    >
                        {category.title}
                    </Badge>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    </div>
);


// --- Component Chính ---
const HomeArticles = () => {
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Post | null>(null);
  const [newsColumn1, setNewsColumn1] = useState<Post[]>([]);
  const [newsColumn2, setNewsColumn2] = useState<Post[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState("featured");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch danh mục (Không đổi)
  useEffect(() => {
    fetch(`${API_BASE_URL}/categories.php?action=doc_danh_muc_bai_viet`)
      .then((res) => res.json())
      .then((data: PostCategory[]) => {
        console.log("Danh mục bài viết:", data);
        const featuredCategory: PostCategory = { id: "0", title: "Bài viết nổi bật", slug: "featured" };
        setCategories([featuredCategory, ...data]);
      })
      .catch((err) => console.error("Lỗi khi tải danh mục:", err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE_URL]);

  // Fetch bài viết (ĐÃ CẬP NHẬT LOGIC)
  useEffect(() => {
    setIsLoading(true);

    // Bắt đầu với endpoint cơ bản, luôn luôn lấy bài viết nổi bật (is_featured=true)
    let endpoint = `${API_BASE_URL}/posts.php?action=doc_tat_ca&featured=true&limit=7`;

    // Nếu một danh mục cụ thể được chọn (không phải tab "Bài viết nổi bật"),
    // thì thêm điều kiện lọc theo danh mục đó.
    if (activeCategorySlug !== "featured") {
        endpoint += `&category_slug=${activeCategorySlug}`;
    }

    fetch(endpoint)
      .then((res) => res.json())
      .then((data: Post[] | null) => {
        console.log("Bài viết:", data);
        if (data && data.length > 0) {
          setFeaturedArticle(data[0]);
          setNewsColumn1(data.slice(1, 4));
          setNewsColumn2(data.slice(4, 7));
        } else {
          setFeaturedArticle(null);
          setNewsColumn1([]);
          setNewsColumn2([]);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải bài viết:", err);
        setFeaturedArticle(null);
        setNewsColumn1([]);
        setNewsColumn2([]);
      })
      .finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategorySlug, API_BASE_URL]); // Phụ thuộc vẫn giữ nguyên

  return (
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Góc sức khỏe</h1>
          <Link href="/tin-tuc/goc-suc-khoe" className="text-sm font-medium text-primary hover:text-secondary transition-colors duration-300">
            Xem tất cả
          </Link>
        </div>

        {/* Category Navigation */}
        <CategoryTabs
            categories={categories}
            activeSlug={activeCategorySlug}
            onSelect={setActiveCategorySlug}
        />

        {/* Main Content */}
        {isLoading ? (
          <ArticlesSkeleton />
        ) : featuredArticle ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
            {/* Left Column - Featured Article */}
            <div className="lg:col-span-1">
              <FeaturedArticleCard article={featuredArticle} />
            </div>

            {/* Middle & Right Columns */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-6">
                    {newsColumn1.map((article) => <ArticleItemCard key={article.id} article={article} />)}
                </div>
                <div className="space-y-6">
                    {newsColumn2.map((article) => <ArticleItemCard key={article.id} article={article} />)}
                </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 bg-gray-100 rounded-lg col-span-full">
            Không có bài viết nổi bật nào để hiển thị.
          </div>
        )}
      </div>
  );
};

export default HomeArticles;