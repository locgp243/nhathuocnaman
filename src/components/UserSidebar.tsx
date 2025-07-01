// components/account/UserSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Import hook để lấy đường dẫn hiện tại
import { User, ShoppingCart, MapPin, LogOut, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext'; // Import để dùng hàm logout
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner'; // Import để hiển thị thông báo

// Component con cho mỗi mục menu
const SidebarMenuItem = ({ href, icon: Icon, text }: { href: string; icon: React.ElementType; text: string; }) => {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại
  const isActive = pathname === href; // So sánh để xác định active

  return (
    <Link href={href}>
      <div className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-sky-100 text-sky-700 font-bold' : 'hover:bg-gray-100'}`}>
        <Icon className="mr-3 h-5 w-5" />
        <span>{text}</span>
        <ChevronRight className="ml-auto h-4 w-4" />
      </div>
    </Link>
  );
};

// Component Sidebar chính
export default function UserSidebar() {
  const { user, logout } = useAuth(); // Lấy user và hàm logout từ context
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công");
    router.push('/');
  };

  if (!user) return null; // Nếu không có user thì không hiển thị sidebar

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL || 'https://nhathuoc.trafficnhanh.com';
  const fullAvatarUrl = user.avatar ? `${API_DOMAIN}/${user.avatar}` : undefined;

  return (
    <aside className="lg:col-span-1">
      <Card className="p-4 bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white">
            <AvatarImage src={fullAvatarUrl} alt={user.full_name} />
            <AvatarFallback className="text-xl">{getInitials(user.full_name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-md">Tài khoản của</p>
            <p className="font-bold text-lg">{user.full_name}</p>
          </div>
        </div>
      </Card>
      <Card className="mt-4 p-2">
        <SidebarMenuItem href="/tai-khoan" icon={User} text="Thông tin tài khoản" />
        <SidebarMenuItem href="/tai-khoan/don-hang" icon={ShoppingCart} text="Đơn hàng của tôi" />
        <SidebarMenuItem href="/tai-khoan/dia-chi" icon={MapPin} text="Quản lý địa chỉ" />
        <div className="mt-2 border-t pt-2">
          <button onClick={handleLogout} className="w-full">
            <div className="flex items-center p-3 rounded-lg cursor-pointer transition-colors text-red-600 hover:bg-red-50">
              <LogOut className="mr-3 h-5 w-5" />
              <span>Đăng xuất</span>
            </div>
          </button>
        </div>
      </Card>
    </aside>
  );
}