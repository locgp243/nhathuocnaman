// page.tsx
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation" // Import hook `notFound`
import { Calendar, User, Tag, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Post as PostType, PostCategory } from "@/types/ArticleCard"
import { API_BASE_URL } from "@/lib/api"
// Mở rộng interface Post để bao gồm cả content
interface PostDetail extends PostType {
  content: string;
  categories: PostCategory[];
}

// --- CÁC COMPONENT CON (Không thay đổi) ---
const RelatedPostCard = ({ post }: { post: PostType }) => (
  <Link href={`/goc-suc-khoe/${post.slug}`} className="block group">
    <Card className="h-full overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <div className="relative aspect-video">
        <Image
          src={`https://nhathuoc.trafficnhanh.com${post.image_url || ""}`}
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
  </Link>
);

// --- HÀM LẤY DỮ LIỆU TRÊN SERVER ---
async function getPostData(slug: string, subslug: string) {
    try {
        // 1. Fetch bài viết chính
        const postRes = await fetch(`${API_BASE_URL}/posts.php?action=doc_chi_tiet&slug=${subslug}`, {
            next: { revalidate: 3600 } 
        });
        
        if (!postRes.ok) {
            return notFound(); // Nếu API lỗi, trả về trang 404
        }

        // ⭐ SỬA LỖI 1: Bóc tách đúng cấu trúc { success, data }
        const postResult = await postRes.json();
        if (!postResult.success || !postResult.data) {
            return notFound(); // Nếu API báo lỗi hoặc không có data, trả về 404
        }
        const post: PostDetail = postResult.data;

        // 2. Fetch các bài viết liên quan
        let relatedPosts: PostType[] = [];
        const primaryCategorySlug = post.categories?.[0]?.slug;

        if (primaryCategorySlug) {
            // ⭐ SỬA LỖI 2: Dùng đúng action `get_all_posts`
            const relatedRes = await fetch(`${API_BASE_URL}/posts.php?action=doc_tat_ca&category_slug=${primaryCategorySlug}&limit=4`);
            
            if(relatedRes.ok) {
                // ⭐ SỬA LỖI 3: Bóc tách đúng cấu trúc { success, data }
                const relatedResult = await relatedRes.json();
                if (relatedResult.success && Array.isArray(relatedResult.data)) {
                    // Loại bỏ bài viết hiện tại và lấy 3 bài
                    relatedPosts = relatedResult.data.filter((p: PostType) => p.id !== post.id).slice(0, 3);
                }
            }
        }
        
        return { post, relatedPosts };

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu bài viết:", error);
        return notFound();
    }
}

// --- COMPONENT CHÍNH ---
// SỬA LỖI: Await params trước khi sử dụng (Next.js 15)
export default async function PostDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string; subslug: string }> 
}) {
  // Await params trước khi sử dụng
  const resolvedParams = await params;
  const { post, relatedPosts } = await getPostData(resolvedParams.slug, resolvedParams.subslug);
  
  const primaryCategory = post.categories?.[0];

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href={`/tin-tuc/${resolvedParams.slug}`} className="hover:text-primary capitalize">
            {/* Sử dụng title từ API nếu có, nếu không thì dùng slug */}
            {primaryCategory?.title || resolvedParams.slug.replace(/-/g, ' ')}
          </Link>
          <span className="mx-2">/</span>
          <span className="truncate max-w-xs">{post.title}</span>
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
                  <span>{post.author_name}</span>
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
                  src={`https://nhathuoc.trafficnhanh.com${post.image_url}`}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority // Ưu tiên tải ảnh này vì nó quan trọng
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
              {post.categories && post.categories.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag size={16} className="text-muted-foreground"/>
                    {post.categories.map(cat => (
                      // SỬA LỖI LOGIC NHỎ: Link tag nên trỏ đến trang danh mục của nó
                      <Link key={cat.id} href={`/tin-tuc/${cat.slug}`}>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200">{cat.title}</Badge>
                      </Link>
                    ))}
                  </div>
              )}
              <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Chia sẻ:</span>
                  <Share2 size={18} className="cursor-pointer hover:text-primary"/>
              </div>
            </footer>
          </main>

          {/* Sidebar (phải) */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <h3 className="text-lg font-bold mb-4 border-b pb-2">Về Tác giả</h3>
              <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-semibold">{post.author_name}</h4>
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