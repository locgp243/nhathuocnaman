"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Tag, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Post as PostType, PostCategory } from "@/types/ArticleCard" // Sử dụng lại type đã định nghĩa

// Mở rộng interface Post để bao gồm cả content
interface PostDetail extends PostType {
  content: string;
  categories: PostCategory[]; // Đảm bảo categories có trong type
}

// Component con cho một bài viết liên quan
const RelatedPostCard = ({ post }: { post: PostType }) => (
    <Link href={`/goc-suc-khoe/${post.slug}`} legacyBehavior>
        <a className="block group">
            <Card className="h-full overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative aspect-video">
                    <Image
                        src={post.image_url || "/images/placeholder.jpg"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 33vw"
                    />
                </div>
                <CardContent className="p-4">
                    <h4 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                    </h4>
                </CardContent>
            </Card>
        </a>
    </Link>
);


// Component chính cho trang chi tiết
export default function PostDetailPage({ params }: { params: {
  subslug: string, slug: string 
} }) {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = "http://localhost/server"; // Thay đổi nếu cần

  useEffect(() => {
    if (!params.slug) return;

    const fetchPostData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("params: ", params)
        // 1. Fetch bài viết chính
        const postRes = await fetch(`${API_BASE_URL}/posts.php?action=doc_chi_tiet&slug=${params.subslug}`);
        if (!postRes.ok) {
            throw new Error("Không tìm thấy bài viết.");
        }
        const postData: PostDetail = await postRes.json();
        setPost(postData);

        // 2. Fetch các bài viết liên quan (dựa trên danh mục chính của bài viết hiện tại)
        if (postData.categories && postData.categories.length > 0) {
          const primaryCategorySlug = postData.categories[0].slug;
          const relatedRes = await fetch(`${API_BASE_URL}/posts.php?action=read_posts&category_slug=${primaryCategorySlug}&limit=4`);
          const relatedData: PostType[] = await relatedRes.json();
          
          // Loại bỏ bài viết hiện tại ra khỏi danh sách liên quan và lấy 3 bài
          setRelatedPosts(relatedData.filter(p => p.id !== postData.id).slice(0, 3));
        }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi khi tải bài viết.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostData();
  }, [params.slug, API_BASE_URL]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Đang tải bài viết...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">{error}</div>;
  }

  if (!post) {
    return null; // Hoặc một component 404 Not Found
  }
  
  const primaryCategory = post.categories?.[0];

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/goc-suc-khoe" className="hover:text-primary">Góc sức khỏe</Link>
          {primaryCategory && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/goc-suc-khoe/danh-muc/${primaryCategory.slug}`} className="hover:text-primary">
                {primaryCategory.title}
              </Link>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột nội dung chính (trái) */}
          <main className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-lg shadow-sm">
            {/* Post Header */}
            <header className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User size={14} />
                  <span>{post.author_name || 'Nam An Pharmacy'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString('vi-VN', {
                      day: '2-digit', month: '2-digit', year: 'numeric'
                    })}
                  </time>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.image_url && (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
                <Image
                  src={post.image_url}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Post Content */}
            <article 
              className="prose prose-lg max-w-none prose-img:rounded-lg prose-a:text-primary hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
            
            <Separator className="my-8" />

            {/* Tags & Share */}
            <footer className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {post.categories.length > 0 && (
                     <div className="flex items-center gap-2 flex-wrap">
                        <Tag size={16} className="text-muted-foreground"/>
                        {post.categories.map(cat => (
                            <Link key={cat.id} href={`/goc-suc-khoe/danh-muc/${cat.slug}`} legacyBehavior>
                                <a className="text-xs">
                                <Badge variant="secondary">{cat.title}</Badge>
                                </a>
                            </Link>
                        ))}
                    </div>
                )}
               <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Chia sẻ:</span>
                    {/* Thêm các link chia sẻ thực tế ở đây */}
                    <Share2 size={18} className="cursor-pointer hover:text-primary"/>
               </div>
            </footer>
          </main>

          {/* Sidebar (phải) */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Có thể thêm các component sidebar như "Chuyên mục nổi bật", "Bài viết xem nhiều" ở đây */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-bold mb-4 border-b pb-2">Về Tác giả</h3>
              <div className="flex items-center gap-4">
                  {/* <Image src="/path/to/author-avatar.jpg" width={60} height={60} alt={post.author_name} className="rounded-full"/> */}
                  <div>
                      <h4 className="font-semibold">{post.author_name || 'Nam An Pharmacy'}</h4>
                      <p className="text-sm text-muted-foreground">Cung cấp thông tin sức khỏe đáng tin cậy.</p>
                  </div>
              </div>
            </div>
          </aside>
        </div>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
            <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Bài viết liên quan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPosts.map(relatedPost => (
                        <RelatedPostCard key={relatedPost.id} post={relatedPost} />
                    ))}
                </div>
            </section>
        )}
      </div>
    </div>
  );
}