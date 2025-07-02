// File: app/layout.tsx

import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Nên khai báo các weight em dùng
});

export const metadata: Metadata = {
  title: "Nhà Thuốc Nam An",
  description: "Nhà Thuốc Nam An bán thuốc online, giao hàng tận nơi, uy tín, chất lượng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={roboto.variable}>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}