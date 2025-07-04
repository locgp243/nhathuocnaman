"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu as MenuIcon, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

// Lấy lại cấu trúc MenuMain từ file Menu.tsx hoặc file types chung
interface MenuSub { id: string; title: string; slug: string; }
interface MenuMain { id: string; title: string; slug: string; sub: MenuSub[]; category_type: string; position: number; }

export default function MobileMenu() {
    const { user } = useAuth();
    const router = useRouter();
    const [menuData, setMenuData] = useState<MenuMain[]>([]);
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}categories.php?action=get_full_menu`)
          .then((res) => res.json())
          .then((result) => {
            if (Array.isArray(result)) {
              console.log("data: ", result)
                result.sort((a: MenuMain, b: MenuMain) => (a.position || 0) - (b.position || 0));
                setMenuData(result);
            }
          })
          .catch((err) => console.error("Lỗi khi tải menu mobile:", err));
    }, []);

    const toggleMenu = (title: string) => {
        setOpenMenus(prev => prev.includes(title) ? prev.filter(item => item !== title) : [...prev, title]);
    };

    const handleNavigate = (path: string) => {
        router.push(path);
        setIsDrawerOpen(false);
    }

    return (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="left">
            <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Mở menu"><MenuIcon size={24} /></Button>
            </DrawerTrigger>

          <DrawerContent className="h-full max-w-[90%] p-4 flex flex-col bg-white">
                 <DrawerHeader className="p-0 mb-4">
                    <div className="flex items-center justify-between w-full">
                        
                        <Link href="/">
                            <Image src="/images/logo.jpg" alt="Logo Nam An" width={160} height={40} />
                        </Link>
                        
                        <DrawerClose asChild>
                            <Button variant="ghost" size="icon" aria-label="Đóng menu">
                                <X size={24} />
                            </Button>
                        </DrawerClose>
                    </div>
                    
                    <DrawerTitle className="sr-only">Menu chính</DrawerTitle>
                </DrawerHeader>

                <section className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-md mb-4 flex-shrink-0">
                    {user ? (
                        <div>
                            <p className="text-sm">Xin chào, <strong>{user.full_name}</strong>!</p>
                            <Button onClick={() => handleNavigate('/tai-khoan')} variant="secondary" className="bg-white/90 hover:bg-white text-blue-600 text-sm rounded-2xl mt-3">Quản lý tài khoản</Button>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm">Đăng nhập để có trải nghiệm tốt nhất.</p>
                            <div className="flex gap-2 mt-3">
                                <Button onClick={() => handleNavigate('/dang-nhap')} variant="secondary" className="bg-white text-blue-600 text-sm rounded-2xl">Đăng nhập</Button>
                                <Button onClick={() => handleNavigate('/dang-ky')} variant="outline" className="text-blue-600 border-white text-sm rounded-2xl">Đăng ký</Button>
                            </div>
                        </div>
                    )}
                </section>
                
                <nav className="space-y-1 flex-1 overflow-y-auto">
                    {menuData.map((category) => (
                        <div key={category.id}>
                            <button
                                className="flex justify-between items-center w-full text-left font-semibold py-3"
                                onClick={() => category.sub.length > 0 ? toggleMenu(category.title) : handleNavigate(category.category_type === 'post' ? `/tin-tuc/${category.slug}` : `/${category.slug}`)}
                            >
                                <span className="text-base">{category.title}</span>
                                {category.sub.length > 0 && <ChevronDown size={18} className={`transition-transform ${openMenus.includes(category.title) ? "rotate-180" : ""}`} />}
                            </button>
                            {openMenus.includes(category.title) && (
                                <div className="pl-4 border-l-2 border-primary/50 space-y-1 pb-2">
                                    {category.sub.map((sub) => (
                                        <div key={sub.id} onClick={() => handleNavigate(`/${category.slug}/${sub.slug}`)} className="block py-2 text-sm text-gray-700 hover:text-primary cursor-pointer">
                                            {sub.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
                
                <div className="bg-gray-100 p-3 mt-6 rounded-md flex-shrink-0">
                    <p className="text-sm mb-2">Trải nghiệm tốt hơn với Zalo Mini App Nam An</p>
                    <Button className="w-full text-sm">⬇ Quét QR </Button>
                </div>

                <div className="mt-4 text-sm text-center text-blue-600 font-medium flex-shrink-0">
                    📞 Tư vấn: 1800 6928 (Miễn phí)
                </div>
            </DrawerContent>
        </Drawer>
    );
}