// File: app/(main)/layout.tsx

import Topbar from "@/components/Topbar";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";

// Đổi tên function thành MainLayout để dễ phân biệt
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Topbar />
      <Header />
      <Menu />
      <main> {/* Thêm thẻ main cho ngữ nghĩa và styling */}
        {children} {/* Đây là nơi page.tsx của trang chủ, sản phẩm... được đưa vào */}
      </main>
      <Footer />
    </>
  );
}