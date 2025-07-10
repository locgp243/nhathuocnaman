import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, User, Tag, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { API_BASE_URL } from "@/lib/api"
import type { Post as PostType, PostCategory } from "@/types/ArticleCard"

// --- TYPES ---
interface PostDetail extends PostType {
    content: string;
    categories: PostCategory[];
    author_avatar?: string;
    published_at: string;
}

interface ApiResponse {
    success: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    total?: number;
}

// --- COMPONENT CON ---
const RelatedPostCard = ({ post }: { post: PostType }) => (
    <Link href={`/bai-viet/${post.slug}`} className="block group">
        <Card className="h-full overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative aspect-video">
                <Image
                    src={`${API_BASE_URL}${post.image_url || "/placeholder.jpg"}`}
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

// --- HÀM LẤY DỮ LIỆU ---
async function getPostData(slug: string) {
    try {
        const postRes = await fetch(`${API_BASE_URL}/posts.php?action=doc_chi_tiet&slug=${slug}`, {
            next: { revalidate: 3600 } 
        });
        
        if (!postRes.ok) {
            console.error(`HTTP Error: ${postRes.status} - ${postRes.statusText}`);
            return { post: null, relatedPosts: [] };
        }

        // Kiểm tra content type trước khi parse JSON
        const contentType = postRes.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            // console.error('Response is not JSON:', contentType);
            // const text = await postRes.text();
            // console.error('Response text:', text.substring(0, 500));
            return { post: null, relatedPosts: [] };
        }

        const postResult: ApiResponse = await postRes.json();
        if (!postResult.success || !postResult.data) {
            // console.error('API returned unsuccessful response:', postResult);
            return { post: null, relatedPosts: [] };
        }
        const post: PostDetail = postResult.data;

        let relatedPosts: PostType[] = [];
        const primaryCategorySlug = post.categories?.[0]?.slug;

        if (primaryCategorySlug) {
            try {
                const relatedRes = await fetch(`${API_BASE_URL}/posts.php?action=doc_tat_ca&category_slug=${primaryCategorySlug}&limit=4`);
                if (relatedRes.ok) {
                    const relatedContentType = relatedRes.headers.get('content-type');
                    if (relatedContentType && relatedContentType.includes('application/json')) {
                        const relatedResult: ApiResponse = await relatedRes.json();
                        if (relatedResult.success && Array.isArray(relatedResult.data)) {
                            relatedPosts = relatedResult.data.filter((p: PostType) => p.id !== post.id).slice(0, 3);
                        }
                    } else {
                        console.error('Related posts response is not JSON:', relatedContentType);
                    }
                }
            } catch (relatedError) {
                console.error('Error fetching related posts:', relatedError);
                // Không throw error, chỉ để relatedPosts = []
            }
        }
        
        return { post, relatedPosts };
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu bài viết:", error);
        return { post: null, relatedPosts: [] };
    }
}

// --- COMPONENT PAGE CHÍNH ---
export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    // ⭐ SỬA LỖI: Await params trước khi sử dụng
    const { slug } = await params;
    const { post, relatedPosts } = await getPostData(slug);
    
    if (!post) {
        return notFound();
    }
    
    const primaryCategory = post.categories?.[0];

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-muted-foreground mb-6 flex-wrap">
                    <Link href="/" className="hover:text-primary">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <Link href="/tin-tuc/benh-va-goc-suc-khoe/" className="hover:text-primary">Bệnh & Góc Sức Khỏe</Link>
                    {primaryCategory && (
                         <>
                            <span className="mx-2">/</span>
                            <span className="hover:text-primary">{primaryCategory.title}</span>
                        </>
                    )}
                    <span className="mx-2">/</span>
                    <span className="font-medium text-foreground truncate max-w-xs">{post.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <main className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-lg shadow-sm">
                        <header className="mb-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
                                {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <User size={14} />
                                    <span>{post.author_name || 'Nhà thuốc Nam An'}</span>
                                </div>
                                {post.published_at && (
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        <time dateTime={post.published_at}>
                                            {new Date(post.published_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </time>
                                    </div>
                                )}
                            </div>
                        </header>

                        {post.image_url && (
                            <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
                                <Image
                                    src={`${API_BASE_URL}${post.image_url}`}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 66vw" 

                                />
                            </div>
                        )}

                        <article 
                            className="!prose !prose-lg max-w-none !prose-img:rounded-lg !prose-a:text-primary hover:prose-a:underline"
                            dangerouslySetInnerHTML={{ __html: post.content || '' }}
                        />


                        
                        <Separator className="my-8" />

                        {/* Tags & Share */}
                        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {post.categories && post.categories.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Tag size={16} className="text-muted-foreground"/>
                                    {post.categories.map(cat => (
                                        <Badge key={cat.id} variant="secondary" className="cursor-pointer hover:bg-gray-200">
                                            {cat.title}
                                        </Badge>
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
                                    <h4 className="font-semibold">{post.author_name || 'Nam An Pharmacy'}</h4>
                                    <p className="text-sm text-muted-foreground">Cung cấp thông tin sức khỏe đáng tin cậy.</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
        
                {/* Related Posts */}
                {relatedPosts && relatedPosts.length > 0 && (
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