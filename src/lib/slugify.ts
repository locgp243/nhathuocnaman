// lib/slugify.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Bỏ dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "") // Bỏ ký tự đặc biệt
    .replace(/\s+/g, "-") // Chuyển khoảng trắng thành dấu -
    .replace(/-+/g, "-") // Loại bỏ nhiều dấu - liên tiếp
    .replace(/^-+|-+$/g, ""); // Bỏ dấu - đầu và cuối
}
