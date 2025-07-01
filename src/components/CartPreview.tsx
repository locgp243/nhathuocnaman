// src/components/layout/HeaderCartPreview.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
// THAY ĐỔI: Import HoverCard thay cho Popover
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export default function HeaderCartPreview() {
  const { cartItems, itemCount } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN');
  };

  const recentItems = cartItems.slice(-5).reverse();

  if (!isClient) {
    return (
      <Button variant="ghost" size="icon" className="relative" asChild>
        {/* Dùng Link ở đây để đảm bảo SSR render ra thẻ a */}
        <Link href="/gio-hang">
          <ShoppingCart className="h-6 w-6" />
        </Link>
      </Button>
    );
  }

  // SỬ DỤNG HOVERCARD THAY VÌ POPOVER
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      {/* THAY ĐỔI QUAN TRỌNG:
        - HoverCardTrigger sẽ đảm nhận việc hiển thị preview khi hover.
        - Chúng ta bọc nó trong một thẻ <Link> để xử lý việc click chuyển trang.
        - Thuộc tính `asChild` cho phép Link truyền các thuộc tính của nó xuống Button bên trong.
      */}
      <HoverCardTrigger asChild>
        <Link href="/gio-hang" passHref>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-6 w-6 text-primary" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {itemCount}
              </span>
            )}
          </Button>
        </Link>
      </HoverCardTrigger>
      
      {/* Chỉ hiển thị content khi có sản phẩm */}
      {itemCount > 0 && (
        <HoverCardContent className="w-80 mr-4" align="end">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">Sản phẩm mới thêm</h4>
            <div className="space-y-2">
              {recentItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="rounded-md border object-contain"
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.type}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(item.price)}₫</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex items-center justify-between">
              <p className="text-sm">
                {itemCount > 5 ? `và ${itemCount - 5} sản phẩm khác...` : `${itemCount} sản phẩm trong giỏ hàng`}
              </p>
              <Button size="sm" asChild>
                {/* Nút này vẫn giữ nguyên để người dùng có thể click vào xem chi tiết từ preview */}
                <Link href="/gio-hang">Xem giỏ hàng</Link>
              </Button>
            </div>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
}