// // Gỡ bỏ "use client" để biến thành Server Component
// import Image from "next/image"
// import Link from "next/link"
// import { notFound } from "next/navigation" // Import hook `notFound`
// import { Calendar, User, Tag, Share2 } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import type { Post as PostType, PostCategory } from "@/types/ArticleCard"

// // Mở rộng interface Post để bao gồm cả content
// interface PostDetail extends PostType {
//   content: string;
//   categories: PostCategory[];
// }

// // Props type cho trang
// type Props = {
//   params: { 
//     slug: string;
//     subslug: string; 
//   };
// };

// // --- CÁC COMPONENT CON (Không thay đổi) ---
// const RelatedPostCard = ({ post }: { post: PostType }) => (
//   <Link href={`/goc-suc-khoe/${post.slug}`} className="block group">
//       <Card className="h-full overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
//           <div className="relative aspect-video">
//               <Image
//                   src={post.image_url || "/images/placeholder.jpg"}
//                   alt={post.title}
//                   fill
//                   className="object-cover transition-transform duration-300 group-hover:scale-105"
//                   sizes="(max-width: 768px) 50vw, 33vw"
//               />
//           </div>
//           <CardContent className="p-4">
//               <h4 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
//                   {post.title}
//               </h4>
//           </CardContent>
//       </Card>
//   </Link>
// );

// // --- HÀM LẤY DỮ LIỆU TRÊN SERVER ---
// async function getPostData(slug: string, subslug: string) {
//   const API_BASE_URL = process.env.API_URL || "http://localhost/server";
//   try {
//     // 1. Fetch bài viết chính
//     // Sử dụng subslug để lấy bài viết chi tiết
//     const postRes = await fetch(`${API_BASE_URL}/posts.php?action=doc_chi_tiet&slug=${subslug}`, {
//         next: { revalidate: 3600 } // Cache dữ liệu trong 1 giờ
//     });
    
//     if (!postRes.ok) {
//         // Nếu không tìm thấy bài viết, trả về trang 404
//         return notFound();
//     }
//     const post: PostDetail = await postRes.json();

//     // 2. Fetch các bài viết liên quan
//     let relatedPosts: PostType[] = [];
//     if (post.categories && post.categories.length > 0) {
//         const primaryCategorySlug = post.categories[0].slug;
//         const relatedRes = await fetch(`${API_BASE_URL}/posts.php?action=read_posts&category_slug=${primaryCategorySlug}&limit=4`, {
//             next: { revalidate: 3600 }
//         });
//         if(relatedRes.ok) {
//             const relatedData: PostType[] = await relatedRes.json();
//             // Loại bỏ bài viết hiện tại và lấy 3 bài
//             relatedPosts = relatedData.filter(p => p.id !== post.id).slice(0, 3);
//         }
//     }
    
//     return { post, relatedPosts };

//   } catch (error) {
//     console.error("Lỗi khi tải dữ liệu bài viết:", error);
//     // Nếu có lỗi mạng hoặc lỗi server, trả về trang 404
//     return notFound();
//   }
// }


// // --- COMPONENT CHÍNH ---
// // Chuyển thành hàm `async`
// export default async function PostDetailPage({ params }: Props) {
//   // Gọi hàm lấy dữ liệu trực tiếp
//   const { post, relatedPosts } = await getPostData(params.slug, params.subslug);
  
//   // Không cần `isLoading`, `error`, `useState`, `useEffect` nữa.
//   // Nếu `getPostData` chạy đến đây, nghĩa là đã có dữ liệu `post`.

//   const primaryCategory = post.categories?.[0];

//   return (
//     <div className="bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Breadcrumb */}
//         <div className="flex items-center text-sm text-muted-foreground mb-6">
//           <Link href="/" className="hover:text-primary">Trang chủ</Link>
//           <span className="mx-2">/</span>
//           {/* Dùng params.slug cho link danh mục cha */}
//           <Link href={`/tin-tuc/${params.slug}`} className="hover:text-primary">
//             {primaryCategory?.title || params.slug.replace(/-/g, ' ')}
//           </Link>
//           {/* Breadcrumb cho bài viết hiện tại */}
//           <span className="mx-2">/</span>
//           <span className="truncate max-w-xs">{post.title}</span>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Cột nội dung chính (trái) */}
//           <main className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-lg shadow-sm">
//             {/* Post Header */}
//             <header className="mb-6">
//               <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
//                 {post.title}
//               </h1>
//               <div className="flex items-center space-x-4 text-sm text-muted-foreground">
//                 <div className="flex items-center gap-2">
//                   <User size={14} />
//                   <span>{post.author_name || 'Nam An Pharmacy'}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Calendar size={14} />
//                   <time dateTime={post.published_at}>
//                     {new Date(post.published_at).toLocaleDateString('vi-VN', {
//                       day: '2-digit', month: '2-digit', year: 'numeric'
//                     })}
//                   </time>
//                 </div>
//               </div>
//             </header>

//             {/* Featured Image */}
//             {post.image_url && (
//               <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
//                 <Image
//                   src={post.image_url}
//                   alt={post.title}
//                   fill
//                   className="object-cover"
//                   priority // Ưu tiên tải ảnh này vì nó quan trọng
//                 />
//               </div>
//             )}

//             {/* Post Content */}
//             <article 
//               className="prose prose-lg max-w-none prose-img:rounded-lg prose-a:text-primary hover:prose-a:underline"
//               dangerouslySetInnerHTML={{ __html: post.content || '' }}
//             />
            
//             <Separator className="my-8" />

//             {/* Tags & Share */}
//             <footer className="flex flex-col sm:flex-row items-center justify-between gap-4">
//               {post.categories.length > 0 && (
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <Tag size={16} className="text-muted-foreground"/>
//                     {post.categories.map(cat => (
//                       <Link key={cat.id} href={`/tin-tuc/${cat.slug || params.slug}/${cat.slug}`}>
//                         <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200">{cat.title}</Badge>
//                       </Link>
//                     ))}
//                   </div>
//               )}
//               <div className="flex items-center gap-2">
//                   <span className="text-sm font-medium">Chia sẻ:</span>
//                   <Share2 size={18} className="cursor-pointer hover:text-primary"/>
//               </div>
//             </footer>
//           </main>

//           {/* Sidebar (phải) */}
//           <aside className="lg:col-span-1 space-y-6">
//             <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
//               <h3 className="text-lg font-bold mb-4 border-b pb-2">Về Tác giả</h3>
//               <div className="flex items-center gap-4">
//                   <div>
//                     <h4 className="font-semibold">{post.author_name || 'Nam An Pharmacy'}</h4>
//                     <p className="text-sm text-muted-foreground">Cung cấp thông tin sức khỏe đáng tin cậy.</p>
//                   </div>
//               </div>
//             </div>
//           </aside>
//         </div>
        
//         {/* Related Posts */}
//         {relatedPosts.length > 0 && (
//             <section className="mt-12">
//               <h2 className="text-2xl font-bold mb-6">Bài viết liên quan</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {relatedPosts.map(relatedPost => (
//                   <RelatedPostCard key={relatedPost.id} post={relatedPost} />
//                 ))}
//               </div>
//             </section>
//         )}
//       </div>
//     </div>
//   );
// } 