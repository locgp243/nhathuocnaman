'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Facebook, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// ⭐ BƯỚC 1: IMPORT `useAuth` ĐỂ GIAO TIẾP VỚI TRẠNG THÁI TOÀN CỤC
import { useAuth } from '@/contexts/AuthContext';

// Component Icon Google (không đổi)
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" width="22px" height="22px" {...props}><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4,12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20,11.045,0,20-8.955,20-20,.001-2.662-.422-5.234-1.226-7.617z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4,16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.978,36.218,44,30.608,44,24c0-2.662-.422-5.234-1.226-7.617z"></path>
    </svg>
  );
}
export default function StandaloneLoginPage() {
    const router = useRouter();
    
    // ⭐ BƯỚC 2: KẾT NỐI VỚI AUTH CONTEXT
    const { login, user, isLoading: isAuthLoading } = useAuth();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // ⭐ BƯỚC 3: TỐI ƯU LOGIC CHUYỂN HƯỚNG
    // Dùng state từ context để quyết định, đáng tin cậy hơn là đọc localStorage thủ công
    useEffect(() => {
        // Chỉ chạy logic sau khi context đã kiểm tra xong
        if (!isAuthLoading && user) {
            toast.info("Bạn đã đăng nhập.", {
                description: "Đang chuyển hướng về trang chủ..."
            });
            router.push('/');
        }
    }, [user, isAuthLoading, router]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // ⭐ BƯỚC 4: SỬ DỤNG ACTION CHUẨN VÀ URL TỪ BIẾN MÔI TRƯỜNG (khuyến khích)
            const apiUrl = 'https://nhathuoc.trafficnhanh.com';
            const response = await fetch(`${apiUrl}/users.php?action=dang_nhap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Đã có lỗi xảy ra.');
            }

            // ⭐ BƯỚC 5: DÙNG HÀM `login` TỪ CONTEXT ĐỂ CẬP NHẬT TRẠNG THÁI
            // Không cần lưu vào localStorage thủ công nữa
            if (result.user && result.token) {
                // Sửa lại key `fullName` thành `full_name` để khớp với API
                const userData = {
                    ...result.user,
                    full_name: result.user.full_name 
                };
                login(userData, result.token);

                toast.success("Đăng nhập thành công!", {
                    description: `Chào mừng trở lại, ${result.user.full_name}.`,
                });
                
                // ⭐ BƯỚC 6: CHUYỂN HƯỚNG MƯỢT MÀ, KHÔNG TẢI LẠI TRANG
                router.push('/');
            } else {
                throw new Error('Dữ liệu trả về không hợp lệ.');
            }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error("Đăng nhập thất bại", {
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Nếu người dùng đã đăng nhập thì không cần render form nữa
    if (isAuthLoading || user) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    

    return (
        <div className="w-full min-h-screen flex flex-col">
            {/* Phần Header, Main, Footer không thay đổi */}
            <header className="bg-white border-b sticky top-0 z-20">
                <div className="container mx-auto px-4 lg:px-16">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <Image src="/images/logo.jpg" alt="Logo" width={160} height={40} className="object-contain"/>
                            </Link>
                            <h2 className="text-xl ml-4 pl-4 border-l border-gray-300">Đăng nhập</h2>
                        </div>
                        <a href="#" className="text-sm text-primary hover:underline">Bạn cần giúp đỡ?</a>
                    </div>
                </div>
            </header>

            <main className="flex-grow w-full bg-primary">
                <div className="container mx-auto flex items-center justify-center lg:justify-end h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/5569eb94c3c6711559b384235286595e.png')" }}>
                    <div className="w-full max-w-md bg-white rounded-md shadow-lg p-8 my-12">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">Đăng nhập</h3>
                            <div className="border border-orange-500 text-orange-500 text-xs px-2 py-1 rounded-sm cursor-pointer hover:bg-orange-50">
                                Đăng nhập với mã QR
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <Input
                                    id="identifier" type="text" placeholder="SĐT" required
                                    className="p-3 h-12" value={identifier} onChange={(e) => setIdentifier(e.target.value)} disabled={isLoading}
                                />
                                <div className="relative">
                                    <Input
                                        id="password" type={showPassword ? "text" : "password"} placeholder="Mật khẩu" required
                                        className="p-3 h-12" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-primary text-white py-3 h-12 rounded-sm mt-4 hover:bg-orange-600 transition-colors font-semibold" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                ĐĂNG NHẬP
                            </Button>

                            <div className="flex justify-between items-center mt-3 text-xs text-blue-500">
                                <Link href="/quen-mat-khau" className="hover:underline">Quên mật khẩu</Link>
                                <Link href="/dang-nhap-sms" className="hover:underline">Đăng nhập với SMS</Link>
                            </div>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                            <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-gray-400">HOẶC</span></div>
                        </div>

                        <div className="flex items-center justify-around sm:flex-row gap-4">
                            <Button variant="outline" disabled={isLoading} onClick={() => toast.info("Chức năng đang được phát triển")}>
                                <Facebook className="mr-2 h-5 w-5 text-blue-600" /> Facebook
                            </Button>
                            <Button variant="outline" disabled={isLoading} onClick={() => toast.info("Chức năng đang được phát triển")}>
                                <GoogleIcon className="mr-2" /> Google
                            </Button>
                        </div>

                        <div className="mt-8 text-center text-sm">
                            <span className="text-gray-400">Bạn mới biết đến Nhà Thuốc?</span>
                            <Link href="/dang-ky" className="text-primary font-semibold hover:underline ml-1">Đăng ký</Link>
                        </div>
                    </div>
                </div>
            </main>
            
            <footer className="text-center py-8 text-xs text-gray-500 bg-gray-100">
                <p>&copy; 2025 Nhà Thuốc Nam An. Mọi quyền được bảo lưu.</p>
            </footer>
        </div>
    );
}

