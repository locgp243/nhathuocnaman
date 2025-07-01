// app/dat-hang-thanh-cong/page.tsx
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, PackageCheck } from "lucide-react";

// --- Định nghĩa Types cho dữ liệu đơn hàng ---
interface OrderItem {
    id: number;
    product_name: string;
    variant_name: string;
    quantity: number;
    price: number;
    image_url: string;
}

interface Order {
    id: number;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    notes: string | null;
    total_amount: number;
    payment_method: string;
    status: string;
    created_at: string;
    items: OrderItem[];
}

// --- Component chính để hiển thị nội dung ---
function OrderConfirmationContent() {
    const searchParams = useSearchParams();
  
    const orderId = searchParams.get('order_id');
    const token = searchParams.get('token'); 

    localStorage.setItem('access_token', token || ''); 

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            setError("Không tìm thấy mã đơn hàng trong URL.");
            setIsLoading(false);
            return;
        }

        const fetchOrderDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Thay thế URL này bằng URL API của bạn
                const response = await fetch(`https://nhathuoc.trafficnhanh.com/orders.php?action=chi_tiet_don_hang&id=${orderId}&token=${token}`);
                const result = await response.json();
                
                if (!result.success) {
                    throw new Error(result.message || "Không thể tải thông tin đơn hàng.");
                }
                setOrder(result.data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-10">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                <p className="text-lg">Đang tải thông tin đơn hàng của bạn...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
                <h2 className="text-xl font-semibold text-red-700">Đã xảy ra lỗi</h2>
                <p className="text-red-600 mt-2">{error}</p>
                 <Button asChild className="mt-6"><Link href="/">Quay về trang chủ</Link></Button>
            </div>
        );
    }
    
    if (!order) {
        return null; // Trường hợp này ít xảy ra nếu có lỗi đã được bắt
    }
    
    // Định dạng tiền tệ
    const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

    return (
        <div className="space-y-8">
            <div className="text-center py-8 bg-green-50 rounded-lg border border-green-200">
                <PackageCheck className="mx-auto h-16 w-16 text-green-500" />
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Cảm ơn bạn đã đặt hàng!</h1>
                <p className="mt-4 text-lg text-gray-600">Đơn hàng của bạn đã được ghi nhận thành công.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Thông tin đơn hàng</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Mã đơn hàng:</strong> #{order.id}</p>
                        <p><strong>Ngày đặt:</strong> {new Date(order.created_at).toLocaleString('vi-VN')}</p>
                        <p><strong>Trạng thái:</strong> <Badge>{order.status}</Badge></p>
                        <p><strong>Phương thức thanh toán:</strong> {order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : order.payment_method}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Thông tin người nhận</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Họ tên:</strong> {order.customer_name}</p>
                        <p><strong>Số điện thoại:</strong> {order.customer_phone}</p>
                        <p><strong>Địa chỉ giao hàng:</strong> {order.customer_address}</p>
                        <p><strong>Ghi chú:</strong> {order.notes || 'Không có'}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Chi tiết sản phẩm</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Ảnh</TableHead>
                                <TableHead>Sản phẩm</TableHead>
                                <TableHead>Đơn giá</TableHead>
                                <TableHead className="text-center">Số lượng</TableHead>
                                <TableHead className="text-right">Thành tiền</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Image src={`https://nhathuoc.trafficnhanh.com${item.image_url}`} alt={item.product_name} width={64} height={64} className="rounded border" />
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-medium">{item.product_name}</p>
                                        <p className="text-xs text-gray-500">{item.variant_name}</p>
                                    </TableCell>
                                    <TableCell>{currencyFormatter.format(item.price)}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right font-medium">{currencyFormatter.format(item.price * item.quantity)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="mt-6 text-right text-xl font-bold">
                        Tổng cộng: <span className="text-red-600">{currencyFormatter.format(order.total_amount)}</span>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center">
                 <Button asChild size="lg">
                    <Link href="/">Tiếp tục mua sắm</Link>
                </Button>
            </div>
        </div>
    );
}


// --- Component cha để bọc Suspense ---
// Suspense là cần thiết vì useSearchParams chỉ hoạt động trong Client Component được bọc bởi nó.
export default function OrderConfirmationPage() {
    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center text-center p-10">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                        <p className="text-lg">Đang tải trang...</p>
                    </div>
                }>
                    <OrderConfirmationContent />
                </Suspense>
            </div>
        </div>
    );
}