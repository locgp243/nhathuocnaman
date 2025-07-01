// app/tai-khoan/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Camera, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

// Import Context và Sidebar mới
import { useAuth } from '@/contexts/AuthContext';
import UserSidebar from '@/components/UserSidebar'; // Import sidebar mới
import { Input } from '@/components/ui/input';

export default function UserInfoPage() {
    const router = useRouter();
    // Lấy state và các hàm từ "trung tâm" AuthContext
    const { user, updateUser, isLoading: isAuthLoading } = useAuth();

    // ⭐ BƯỚC 1: THÊM CÁC STATE CẦN THIẾT
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        email: ''
    });
    
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL || 'https://nhathuoc.trafficnhanh.com';

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                phone: user.phone || '',
                email: user.email || ''
            });
        }
    }, [user]);

      const handleEditToggle = () => {
        if (!isEditing && user) {
            // Khi bắt đầu chỉnh sửa, lấy dữ liệu mới nhất từ user context
            setFormData({
                full_name: user.full_name || '',
                phone: user.phone || '',
                email: user.email || ''
            });
        }
        setIsEditing(!isEditing);
    };

     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = async () => {
        if (!user) return;
        setIsSubmitting(true);
        const token = localStorage.getItem('auth_token');

        try {
            const response = await fetch(`${API_DOMAIN}/users.php?action=cap_nhat_thong_tin`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' // Gửi dạng JSON
                },
                body: JSON.stringify(formData) // Gửi dữ liệu từ form
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Cập nhật thông tin thất bại.');
            
            // Cập nhật lại state toàn cục
            updateUser(formData); 
            
            toast.success("Cập nhật thông tin thành công!");
            setIsEditing(false); // Thoát khỏi chế độ chỉnh sửa

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error("Lỗi", { description: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };



    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) handleAvatarUpload(file);
    };

    const handleAvatarUpload = async (file: File) => {
        if (!user) return;
        setIsUploading(true);
        
        const token = localStorage.getItem('auth_token');
        const formData = new FormData();
        // API chỉ cần file avatar, user_id đã có trong token
        formData.append('avatar', file);

        try {
            const response = await fetch(`${API_DOMAIN}/users.php?action=cap_nhat_thong_tin`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Cập nhật ảnh thất bại.');
            
            // SAU KHI THÀNH CÔNG: KHÔNG CẦN FETCH LẠI
            // Chỉ cần gọi hàm `updateUser` từ context để đồng bộ state
            // Giả sử API trả về user object mới sau khi update
            updateUser(result.user); // Hoặc updateUser({ avatar: newAvatarPath })

            toast.success("Cập nhật ảnh đại diện thành công!");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error("Lỗi Upload", { description: err.message });
        } finally {
            setIsUploading(false);
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
    };
    
    // Đã chuyển handleLogout sang UserSidebar
    // Đã chuyển getInitials sang UserSidebar

    // Nếu chưa load xong hoặc chưa đăng nhập, chuyển hướng
    if (isAuthLoading) {
        return <div className="flex justify-center items-center h-96"><Loader2 className="h-16 w-16 animate-spin text-sky-500" /></div>;
    }

    if (!user) {
        router.push('/dang-nhap');
        return null; // Render null trong khi chuyển hướng
    }

    const fullAvatarUrl = user.avatar ? `${API_DOMAIN}/${user.avatar}` : undefined;

    return (
        <div className="bg-gray-50 py-8">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="mb-6 text-sm">
                    {/* Breadcrumb */}
                    <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <span className="font-semibold text-primary">Thông tin cá nhân</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* SỬ DỤNG SIDEBAR MỚI */}
                    <UserSidebar />

                    <main className="lg:col-span-3">
                        <Card className="p-8">
                            <h1 className="text-2xl font-bold mb-8 border-b pb-4">Thông tin cá nhân</h1>

                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />

                            <div className="flex flex-col items-center mb-8">
                                <button
                                    onClick={handleAvatarClick} disabled={isUploading}
                                    className="relative group rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                >
                                    <Avatar className="h-24 w-24 border-2 border-gray-200">
                                        <AvatarImage src={fullAvatarUrl} alt={user.full_name} />
                                        <AvatarFallback className="text-3xl">{user.full_name.split(' ').map(n=>n[0]).join('').toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    {!isUploading && (
                                        <div className="absolute bottom-0 right-0 p-1.5 bg-white border rounded-full text-gray-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Camera className="h-4 w-4" />
                                        </div>
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-full">
                                            <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
                                        </div>
                                    )}
                                </button>
                            </div>

                            <div className="space-y-6 text-sm mt-8">
                                <div className="flex justify-between items-center min-h-[40px]">
                                    <span className="text-gray-500 w-1/3">ID Thành viên</span>
                                    <span className="font-medium text-right text-gray-400">#{user.id}</span>
                                </div>
                                <div className="flex justify-between items-center min-h-[40px]">
                                    <span className="text-gray-500 w-1/3">Họ và tên</span>
                                    {isEditing ? (
                                        <Input name="full_name" value={formData.full_name} onChange={handleInputChange} className="font-medium" disabled={isSubmitting} />
                                    ) : (
                                        <span className="font-medium text-right">{user.full_name || 'Chưa cập nhật'}</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center min-h-[40px]">
                                    <span className="text-gray-500 w-1/3">Số điện thoại</span>
                                    {isEditing ? (
                                        <Input name="phone" value={formData.phone} onChange={handleInputChange} className="font-medium" disabled={isSubmitting} />
                                    ) : (
                                        <span className="font-medium text-right">{user.phone || 'Chưa cập nhật'}</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center min-h-[40px]">
                                    <span className="text-gray-500 w-1/3">Email</span>
                                    {isEditing ? (
                                        <Input name="email" value={formData.email} onChange={handleInputChange} className="font-medium" disabled={isSubmitting} />
                                    ) : (
                                        <span className="font-medium text-right">{user.email || 'Chưa cập nhật'}</span>
                                    )}
                                </div>
                            </div>
                            
                            {/* ⭐ BƯỚC 4: HIỂN THỊ NÚT BẤM CÓ ĐIỀU KIỆN */}
                            <div className="mt-10 flex justify-center gap-4">
                                {isEditing ? (
                                    <>
                                        <Button variant="outline" onClick={handleEditToggle} disabled={isSubmitting}>
                                            <X className="mr-2 h-4 w-4" /> Hủy
                                        </Button>
                                        <Button size="lg" onClick={handleUpdateProfile} disabled={isSubmitting}>
                                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                            Lưu thay đổi
                                        </Button>
                                    </>
                                ) : (
                                    <Button size="lg" onClick={handleEditToggle}>
                                        <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa thông tin
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </main>
                </div>
            </div>
        </div>
    );
}