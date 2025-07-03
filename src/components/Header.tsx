'use client';

// Các import gốc của em giữ nguyên
import { useState } from 'react';
import { memo, FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Bell, LogOut, User, Phone, Search, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import MenuMobile from "./MenuMobile";
import CartPreview from "./CartPreview";

// ⭐ BƯỚC 1: IMPORT `useAuth` TỪ CONTEXT
import { useAuth } from '@/contexts/AuthContext';

const UserAuth: FC = memo(() => {
  const router = useRouter();

  // ⭐ BƯỚC 2: BỎ TẤT CẢ STATE CỤC BỘ, THAY BẰNG `useAuth`
  // Component này giờ không cần `useState` và `useEffect` nữa.
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    // ⭐ BƯỚC 3: SỬ DỤNG TRỰC TIẾP HÀM `logout` TỪ CONTEXT
    logout(); // Chỉ cần gọi hàm này là đủ, mọi việc đã được xử lý ở trung tâm.
    
    toast.success("Đăng xuất thành công!");
    router.push('/');
    router.refresh(); 
  };

  const getInitials = (name: string): string => {
    if (!name) return 'A';
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase().substring(0, 2);
  };

  // State loading để tránh lỗi và hiển thị bộ xương (skeleton)
  if (isLoading) {
    return <div className="w-40 h-10 bg-gray-200 rounded-md animate-pulse"></div>;
  }

  // Giao diện khi đã đăng nhập
  if (user) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nhathuoc.trafficnhanh.com';
    const avatarUrl = user.avatar ? `${API_BASE_URL}/${user.avatar}` : undefined;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 text-left transition-transform duration-200 hover:scale-105">
            <Avatar className="h-9 w-9 border-2 border-black/50">
              <AvatarImage src={avatarUrl} alt={user.full_name} />
              <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
            </Avatar>
            <div className="text-black leading-tight hidden xl:block">
              <span className="text-xs font-light">Xin chào,</span>
              <p className="text-sm font-semibold truncate max-w-[120px]">{user.full_name}</p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel>{user.full_name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/tai-khoan')}>
            <User className="mr-2 h-4 w-4" />
            <span>Thông tin tài khoản</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/tai-khoan/don-hang')}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Đơn hàng của tôi</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-600 focus:bg-red-50">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Giao diện khi chưa đăng nhập
  return (
    <Link href="/dang-nhap" className="flex items-center gap-2 text-left text-black transition-transform duration-200 hover:scale-105">
      <User className="h-9 w-9 p-1.5 bg-black/20 rounded-full"/>
      <div className="leading-tight hidden xl:block">
        <span className="text-sm font-light">Tài khoản</span>
        <p className="font-semibold">Đăng nhập</p>
      </div>
    </Link>
  );
});
UserAuth.displayName = 'UserAuth';

const SearchBar = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        // Không tìm kiếm nếu chuỗi rỗng
        if (searchQuery.trim() === '') {
            return;
      }
      console.log("Searching for:", searchQuery);
        // Chuyển hướng đến trang tìm kiếm với từ khóa trên URL
        router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex-1 max-w-2xl">
            <div className="relative">
                <Input 
                    placeholder="Bạn cần tìm gì?" 
                    className="h-12 text-base text-black pl-5 pr-12 rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button 
                    size="icon" 
                    className="absolute top-1/2 right-2 -translate-y-1/2 h-9 w-9 rounded-full bg-primary/90 hover:bg-primary"
                    onClick={handleSearch}
                >
                    <Search className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------------
// COMPONENT 2: NotificationBell - Tách riêng để dễ quản lý
// ----------------------------------------------------------------------------
const NotificationBell: FC = () => {
    const notificationCount = 5; // Dữ liệu giả lập
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 p-0 text-black hover:bg-black/20">
                    <Bell className="h-6 w-6" />
                    {notificationCount > 0 && (
                        <Badge variant="destructive" className="text-primary absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">{notificationCount}</Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
             <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
                <p className="font-medium">Đơn hàng #54321 đã được xác nhận.</p>
                <p className="text-xs text-muted-foreground">5 phút trước</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
                <p className="font-medium">Khuyến mãi đặc biệt dành riêng cho bạn!</p>
                <p className="text-xs text-muted-foreground">2 giờ trước</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary cursor-pointer">
                Xem tất cả
              </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );
};

// ----------------------------------------------------------------------------
// COMPONENT 3: CallToAction - Tách riêng nút gọi mua hàng
// ----------------------------------------------------------------------------
const CallToAction: FC = () => (
    <div className="flex items-center gap-2 text-black">
        <Phone size={32} className="text-black"/>
        <div className="leading-tight hidden lg:block">
            <span className="text-xs">Gọi mua hàng</span>
            <p className="text-lg font-bold">1800.2097</p>
        </div>
    </div>
);


// ============================================================================
// COMPONENT HEADER CHÍNH - Giờ đã gọn gàng và cân bằng hơn
// ============================================================================
export default function Header() {
  return (
    <header className="bg-white text-black shadow-md">
        <div className="max-w-7xl mx-auto px-4">
            {/* ---- PC/Desktop Header ---- */}
            <div className="hidden lg:flex items-center justify-between h-20 gap-4">
                {/* 1. Phần bên trái: Logo (co lại khi cần) */}
                <div className="flex-shrink-0">
                    <Link href="/">
                        <Image src="/images/logo.jpg" alt="Logo" width={160} height={45} className="object-contain"/>
                    </Link>
                </div>

                {/* 2. Phần giữa: Search (chiếm toàn bộ không gian còn lại) */}
                <div className="flex-1 max-w-2xl">
                  <div className="relative">
                    <SearchBar />
                  </div>
                </div>

                {/* 3. Phần bên phải: Các hành động */}
                <div className="flex items-center gap-3">
                    <CallToAction />
                    <div className="h-8 w-px bg-white/30"></div> {/* Dấu ngăn cách */}
                    <NotificationBell />
                    <CartPreview />
                    <div className="h-8 w-px bg-white/30"></div> {/* Dấu ngăn cách */}
                    <UserAuth />
                </div>
            </div>

            {/* ---- Mobile Header ---- */}
            <div className="lg:hidden flex items-center justify-between h-16">
                <MenuMobile />
                <Link href="/">
                    <Image src="/images/logo.jpg" alt="Logo" width={120} height={40} className="object-contain" />
                </Link>
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="text-white"><Search size={24} /></Button>
                    <CartPreview /> {/* Dùng lại CartPreview cho mobile */}
                </div>
            </div>
        </div>
    </header>
  );
}