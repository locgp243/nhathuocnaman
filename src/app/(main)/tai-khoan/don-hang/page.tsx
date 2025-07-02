'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, PackageOpen, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

// Import các component dùng chung
import { useAuth } from '@/contexts/AuthContext';
import UserSidebar from '@/components/UserSidebar';

// --- Type Definitions ---
interface Order {
    id: number;
    order_code: string;
    status: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled' | 'returned';
    total_amount: string;
    created_at: string;
    representative_image_url: string | null;
    item_count: number;
}

const TABS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'processing', label: 'Đang xử lý' },
    { key: 'shipping', label: 'Đang giao' },
    { key: 'completed', label: 'Đã giao' },
    { key: 'cancelled', label: 'Đã hủy' },
    { key: 'returned', label: 'Trả hàng' },
];

const STATUS_INFO: { 
    [key: string]: { 
        label: string; 
        className: string; 
    } 
} = {
    pending: {
        label: 'Chờ xác nhận',
        className: 'bg-gray-100 text-gray-800 border-gray-300',
    },
    processing: {
        label: 'Đang xử lý',
        className: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    shipping: {
        label: 'Đang giao',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    completed: {
        label: 'Đã giao',
        className: 'bg-green-100 text-green-800 border-green-300',
    },
    cancelled: {
        label: 'Đã hủy',
        className: 'bg-red-100 text-red-800 border-red-300',
    },
    returned: {
        label: 'Trả hàng',
        className: 'bg-orange-100 text-orange-800 border-orange-300',
    },
};

// --- Main Component ---
export default function MyOrdersPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => { 
        if (isAuthLoading || !user) {
            return;
        }

        const fetchOrders = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                router.push('/dang-nhap');
                return;
            }

            try {
                const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL || 'https://nhathuoc.trafficnhanh.com';
                const response = await fetch(`${API_DOMAIN}/orders.php?action=don_hang_cua_toi`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || 'Không thể tải danh sách đơn hàng.');
                }
                setOrders(result.data || []);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setError(err.message);
                toast.error("Lỗi tải đơn hàng", { description: err.message });
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user, isAuthLoading, router]);

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'all') return true;
        return order.status === activeTab;
    });

    const formatCurrency = (amount: string) => {
        const numberAmount = parseFloat(amount);
        if (isNaN(numberAmount)) return 'N/A';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numberAmount);
    }
 
    if (isAuthLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin text-sky-500" /></div>;
    }
    
    return (
        <div className="bg-gray-100/50 min-h-screen">
            <div className="container mx-auto max-w-7xl py-8 px-4">
                <div className="mb-6 text-sm">
                    <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <Link href="/tai-khoan" className="text-gray-500 hover:text-primary">Tài khoản</Link>
                    <span className="mx-2">/</span>
                    <span className="font-semibold text-gray-800">Đơn hàng của tôi</span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <UserSidebar />

                    <main className="lg:col-span-3">
                         <h1 className="text-2xl font-bold text-gray-800 mb-4">Đơn hàng của tôi</h1>
                         <div className="relative mb-6">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                             <Input placeholder="Tìm theo tên đơn, mã đơn, hoặc tên sản phẩm..." className="pl-10 h-12" />
                         </div>

                        <Card>
                            <CardContent className="p-0">
                                <div className="flex border-b overflow-x-auto">
                                    {TABS.map(tab => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`py-3 px-4 text-sm font-semibold whitespace-nowrap ${activeTab === tab.key ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="p-4 min-h-[400px]">
                                    {isLoading ? (
                                        <div className="flex justify-center items-center h-full pt-16"><Loader2 className="animate-spin text-primary h-10 w-10"/></div>
                                    ) : error ? (
                                        <div className="text-center text-red-500 pt-16"><p>{error}</p></div>
                                    ) : filteredOrders.length === 0 ? (
                                        <div className="text-center py-16">
                                            <PackageOpen size={64} className="mx-auto text-gray-300" />
                                            <h3 className="mt-4 text-lg font-semibold">Bạn chưa có đơn hàng nào.</h3>
                                            <p className="mt-1 text-sm text-gray-500">Cùng khám phá hàng ngàn sản phẩm tại Nhà thuốc!</p>
                                            <Button className="mt-6" onClick={() => router.push('/')}>Khám phá ngay</Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {filteredOrders.map(order => (
                                                <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                                    <div className="p-4 border-b">
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="font-semibold text-gray-800">Mã đơn hàng: {order.order_code}</span>
                                                            <span className={`font-bold uppercase ${STATUS_INFO[order.status]?.className || ''}`}>{STATUS_INFO[order.status]?.label || order.status}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                                                    </div>
                                                    <div className="p-4 flex items-center gap-4">
                                                        <Image 
                                                           src={`${process.env.NEXT_PUBLIC_API_URL || 'https://nhathuoc.trafficnhanh.com'}/${order.representative_image_url || 'images/default-product.png'}`}
                                                           alt="Product" 
                                                           width={80} 
                                                           height={80} 
                                                           className="rounded-md object-cover border"
                                                        />
                                                        <div className="flex-grow">
                                                            <p className="text-sm font-semibold">Đơn hàng có {order.item_count} sản phẩm</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-500">Tổng tiền</p>
                                                            <p className="font-bold text-primary">{formatCurrency(order.total_amount)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-gray-50 p-4 flex justify-end gap-2">
                                                        <Button variant="outline" size="sm">Mua lại</Button>
                                                        <Button size="sm" onClick={() => router.push(`/dat-hang-thanh-cong/?order_id=${order.id}&token=${localStorage.getItem('auth_token')}`)}>Xem chi tiết</Button>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    )}    
                                </div>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>
        </div>
    );
}