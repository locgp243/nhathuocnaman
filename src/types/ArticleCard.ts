// Định nghĩa kiểu dữ liệu cho danh mục bài viết
export interface PostCategory {
  id: string;
  title: string;
  slug: string;
  image_url?: string | null;
}

// Định nghĩa kiểu dữ liệu cho một bài viết
export interface Post {
  created_at: string | number | Date;
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null; // Đổi tên từ featured_image_url cho nhất quán
  published_at: string;
  author_name: string;
  category_title?: string; // Tên danh mục chính để hiển thị badge
  category_slug?: string;
  primary_category_slug?: string; // Slug của danh mục chính
}