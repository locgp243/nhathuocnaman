import { Toaster } from "@/components/ui/sonner"
import { Inter as FontSans } from "next/font/google"
import "@/app/globals.css" // Vẫn dùng global CSS chung

import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
})

export const metadata = {
  title: 'Xác thực | Nhà Thuốc ABC',
  description: 'Đăng nhập hoặc đăng ký tài khoản.',
}

// Đây là layout chỉ dành riêng cho các trang bên trong group (auth)
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {/* Chỉ render nội dung của page, không có Header hay Footer chung */}
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
