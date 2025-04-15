"use client";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type Category = {
  title: string;
  subcategories: string[];
};

const categories: Category[] = [
  {
    title: "Thực phẩm chức năng",
    subcategories: ["Vitamin & Khoáng chất", "Sinh lý - Nội tiết tố", "Cải thiện tăng cường chức năng", "Hỗ trợ điều trị", "Hỗ trợ tiêu hóa", "Thần kinh não", "Hỗ trợ làm đẹp", "Sức khỏe tim mạch", "Dinh dưỡng"],
  },
  {
    title: "Dược mỹ phẩm",
    subcategories: ["Chăm sóc da mặt", "Chăm sóc cơ thể", "Giải pháp làn da", "Chăm sóc tóc - da đầu", "Mỹ phẩm trang điểm", "Chăm sóc da vùng mắt", "Sản phẩm từ thiên nhiên"],
  },
  {
    title: "Thuốc",
    subcategories: ["Tra cứu thuốc", "Tra cứu dược chất", "Tra cứu dược liệu"],
  },
  {
    title: "Chăm sóc cá nhân",
    subcategories: ["Hỗ trọ tình dục", ],
  },
  {
    title: "Thiết bị y tế",
    subcategories: ["Máy đo huyết áp", "Máy đo đường huyết", "Nhiệt kế"],
  },
  {
    title: "Tiêm chủng",
    subcategories: ["Tiêm chủng cho trẻ em", "Tiêm chủng cho người lớn", "Tiêm chủng cho phụ nữ mang thai"],
  },
  {
    title: "Bệnh & Góc sức khỏe",
    subcategories: ["Bệnh tiểu đường", "Bệnh tim mạch", "Bệnh huyết áp", "Bệnh xương khớp"],
  },
  {
    title: "Hệ thống nhà thuốc",
    subcategories: ["Nhà thuốc gần bạn", "Nhà thuốc online"],
  },
];

export default function MobileMenu() {
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="left">
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Mở menu">
          <MenuIcon size={24} />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-full max-w-[90%] p-4 rounded-none border-r border-gray-200 shadow-xl flex flex-col">
        <VisuallyHidden>
          <DrawerHeader>
            <DrawerTitle>Menu di động</DrawerTitle>
          </DrawerHeader>
        </VisuallyHidden>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Image src="/images/logo.jpg" alt="Logo Nam An" width={160} height={40} />
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" aria-label="Đóng menu">
              <X size={24} />
            </Button>
          </DrawerClose>
        </div>

        {/* Đăng nhập */}
        <section className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-md mb-4">
          <p className="text-sm">Đăng nhập để hưởng những đặc quyền dành riêng cho thành viên.</p>
          <div className="flex gap-2 mt-3">
            <Button variant="secondary" className="bg-white text-blue-600 text-sm rounded-2xl">Đăng nhập</Button>
            <Button variant="outline" className="text-black border-white text-sm rounded-2xl">Đăng ký</Button>
          </div>
        </section>

        {/* Danh mục */}
        <nav className="space-y-2 flex-1 overflow-y-auto">
          {categories.map((category) => (
            <div key={category.title}>
              <button
                className="flex justify-between w-full text-left font-medium py-2"
                onClick={() => toggleMenu(category.title)}
                aria-expanded={openMenus.includes(category.title)}
              >
                <span className="text-base">{category.title}</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${openMenus.includes(category.title) ? "rotate-180" : ""}`}
                />
              </button>
              {openMenus.includes(category.title) && (
                <div className="text-sm text-white space-y-1 bg-[#1eafa5] py-2 rounded-md">
                  {category.subcategories.map((sub, idx) => (
                  <Link
                    key={idx}
                    href="#"
                    className={`px-4 block py-1 hover:underline ${
                      idx !== category.subcategories.length - 1 ? "border-b border-white/20" : ""
                    }`}
                  >
                    {sub}
                  </Link>
                ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Tải app */}
        <div className="bg-gray-100 p-3 mt-6 rounded-md">
          <p className="text-sm mb-2">Trải nghiệm tốt hơn với Zalo Mini App Nam An</p>
          <Button className="w-full text-sm">⬇ Quét QR </Button>
        </div>

        {/* Hotline */}
        <div className="mt-4 text-sm text-center text-blue-600 font-medium">
          📞 Tư vấn: 1800 6928 (Miễn phí)
        </div>
      </DrawerContent>
    </Drawer>
  );
}
