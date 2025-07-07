'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

export default function StandaloneRegisterPage() {
    const router = useRouter();
    
    // --- STATE CHO FORM ---
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState(''); // ⭐ THAY ĐỔI: Từ email sang phone
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // --- Kiểm tra đầu vào ---
        if (password !== rePassword) {
            toast.error("Mật khẩu không khớp!");
            return;
        }
        if (password.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }
        // Có thể thêm kiểm tra định dạng số điện thoại ở đây

        setIsLoading(true);

        try {
            // ⭐ THAY ĐỔI: Chuẩn bị dữ liệu với `phone`
            const userData = {
                fullName: fullName,
                phone: phone,
                password: password
            };

            const response = await fetch('https://nhathuoc.trafficnhanh.com/users.php?action=dang_ky', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Đã có lỗi xảy ra từ máy chủ.');
            }

            toast.success("Đăng ký thành công!", {
                description: `Chào mừng ${fullName}! Bạn sẽ được chuyển đến trang đăng nhập.`,
            });
            
            router.push('/dang-nhap');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error("Đăng ký thất bại", {
                description: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col">
            {/* Header của trang đăng ký */}
            <header className="bg-white border-b sticky top-0 z-20">
                <div className="container mx-auto px-4 lg:px-16">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <Image src="/images/logo.jpg" alt="Logo" width={160} height={40} className="object-contain" />
                            </Link> 
                            <h2 className="text-xl ml-4 pl-4 border-l border-gray-300">Đăng ký</h2>
                        </div>
                        <a href="#" className="text-sm text-primary hover:underline">Bạn cần giúp đỡ?</a>
                    </div>
                </div>
            </header>

            {/* Nội dung chính */}
            <main className="flex-grow w-full bg-primary">
                <div className="container mx-auto flex items-center justify-center lg:justify-end h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/5569eb94c3c6711559b384235286595e.png')" }}>
                    
                    {/* Form Đăng ký */}
                    <div className="w-full max-w-md bg-white rounded-md shadow-lg p-8 my-12">
                        <h3 className="text-xl font-semibold mb-6">Đăng ký</h3>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="fullName">Họ và tên</Label>
                                    <Input
                                        id="fullName" type="text" placeholder="Nguyễn Văn A" required
                                        className="p-3 h-12 mt-1" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isLoading}
                                    />
                                </div>
                                {/* ⭐ THAY ĐỔI: Input cho Số điện thoại */}
                                <div>
                                    <Label htmlFor="phone">Số điện thoại</Label>
                                    <Input
                                        id="phone" type="tel" placeholder="Số điện thoại của bạn" required
                                        className="p-3 h-12 mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isLoading}
                                    />
                                </div>
                                <div className="relative">
                                    <Label htmlFor="password">Mật khẩu</Label>
                                    <Input
                                        id="password" type={showPassword ? "text" : "password"} placeholder="Mật khẩu (ít nhất 6 ký tự)" required
                                        className="p-3 h-12 mt-1" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-muted-foreground">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div>
                                    <Label htmlFor="re-password">Nhập lại mật khẩu</Label>
                                    <Input
                                        id="re-password" type={showPassword ? "text" : "password"} placeholder="Nhập lại mật khẩu của bạn" required
                                        className="p-3 h-12 mt-1" value={rePassword} onChange={(e) => setRePassword(e.target.value)} disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-primary text-white py-3 h-12 rounded-sm mt-6 hover:bg-orange-600 transition-colors font-semibold" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                ĐĂNG KÝ
                            </Button>
                        </form>

                        <div className="mt-8 text-center text-sm">
                            <span className="text-gray-400">Bạn đã có tài khoản?</span>
                            <Link href="/dang-nhap" className="text-primary font-semibold hover:underline ml-1">Đăng nhập</Link>
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Footer */}
            <footer className="text-center py-8 text-xs text-gray-500 bg-gray-100">
                <p>&copy; 2025 Nhà Thuốc Nam An. Mọi quyền được bảo lưu.</p>
            </footer>
        </div>
    );
}