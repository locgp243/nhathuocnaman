"use client";

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { API_BASE_URL } from '@/lib/api';
import type { Post, PostCategory } from "@/types/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";

// --- Component Skeleton ---
const ArticlesSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
        <div className="lg:col-span-1">
            <div className="bg-gray-200/50 rounded-lg h-full p-4 space-y-3">
                <Skeleton className="h-64 rounded-md" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex space-x-3 p-2">
                    <Skeleton className="w-24 h-20 rounded-md flex-shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// --- Component con ---
const FeaturedArticleCard = ({ article }: { article: Post }) => (
    <Link href={`/bai-viet/${article.slug}`} className="block group h-full">
        <Card className="h-full overflow-hidden transition-shadow duration-300 bg-transparent border-none shadow-none hover:shadow-xl">
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                    src={`${API_BASE_URL}${article.image_url}`}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {article.category_title && (
                    <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-primary text-primary-foreground text-xs">{article.category_title}</Badge>
                    </div>
                )}
            </div>
            <CardContent className="p-4 px-1">
                <h2 className="font-bold text-lg leading-tight text-gray-800 mb-3 transition-colors duration-300 group-hover:text-primary">
                    {article.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{article.excerpt}</p>
            </CardContent>
        </Card>
    </Link>
);

const ArticleItemCard = ({ article }: { article: Post }) => (
    <Link href={`/bai-viet/${article.slug}`} className="block group">
        <div className="flex gap-4">
            <div className="w-28 h-24 relative flex-shrink-0">
                <Image src={`${API_BASE_URL}${article.image_url}`} alt={article.title} fill className="object-cover rounded-md" sizes="25vw" />
            </div>
            <div className="flex-1 flex flex-col justify-center">
                {article.category_title && (
                    <div className="mb-1">
                        <Badge variant="secondary" className="text-xs">{article.category_title}</Badge>
                    </div>
                )}
                <h3 className="font-semibold text-sm leading-tight text-gray-800 line-clamp-3 transition-colors duration-300 group-hover:text-primary">
                    {article.title}
                </h3>
            </div>
        </div>
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
                        className={`whitespace-nowrap px-4 py-2 cursor-pointer transition-all duration-300 flex-shrink-0 ${activeSlug === category.slug ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
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
export default function HomeArticles() {
    const [categories, setCategories] = useState<PostCategory[]>([]);
    const [featuredArticle, setFeaturedArticle] = useState<Post | null>(null);
    const [otherArticles, setOtherArticles] = useState<Post[]>([]);
    const [activeCategorySlug, setActiveCategorySlug] = useState("featured");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch danh mục
        fetch(`${API_BASE_URL}/categories.php?action=doc_danh_muc_bai_viet`)
          .then((res) => res.json())
          .then((data) => {
            if(Array.isArray(data)){
                const featuredCategory: PostCategory = { id: "0", title: "Bài viết nổi bật", slug: "featured" };
                setCategories([featuredCategory, ...data]);
            }
          })
          .catch((err) => console.error("Lỗi khi tải danh mục:", err));
    }, []);

    useEffect(() => {   
        setIsLoading(true);
        let endpoint = `${API_BASE_URL}/posts.php?action=doc_tat_ca&limit=7`;
        
        if (activeCategorySlug === "featured") {
            endpoint += '&featured=true';
        } else {
            endpoint += `&category_slug=${activeCategorySlug}`;
        }

        fetch(endpoint)
            .then((res) => res.json())
            .then((result: { success: boolean, data?: Post[] }) => {
                // ⭐ SỬA LẠI: Lấy mảng bài viết từ thuộc tính `data` của object trả về
                const posts = (result.success && Array.isArray(result.data)) ? result.data : [];
                
                if (posts.length > 0) {
                    setFeaturedArticle(posts[0]);
                    setOtherArticles(posts.slice(1)); // Lấy tất cả các bài còn lại
                } else {
                    setFeaturedArticle(null);
                    setOtherArticles([]);
                }
            })
            .catch((err) => {
                console.error("Lỗi khi tải bài viết:", err);
                setFeaturedArticle(null);
                setOtherArticles([]);
            })
            .finally(() => setIsLoading(false));
            
    }, [activeCategorySlug]);

    // Chia các bài viết còn lại thành 2 cột
    const newsColumn1 = otherArticles.slice(0, Math.ceil(otherArticles.length / 2));
    const newsColumn2 = otherArticles.slice(Math.ceil(otherArticles.length / 2));

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-2xl font-bold tracking-tight text-primary">GÓC SỨC KHỎE</h2>
                <Link href="/tin-tuc/benh-va-goc-suc-khoe" className="text-sm font-medium text-primary hover:text-secondary">Xem tất cả</Link>
            </div>
            
            <CategoryTabs categories={categories} activeSlug={activeCategorySlug} onSelect={setActiveCategorySlug} />

            {isLoading ? (
                <ArticlesSkeleton />
            ) : featuredArticle ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
                    <div className="lg:col-span-1">
                        <FeaturedArticleCard article={featuredArticle} />
                    </div>
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
                    Không có bài viết nào trong danh mục này.
                </div>
            )}
        </div>
    );
};