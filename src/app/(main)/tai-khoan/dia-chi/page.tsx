'use client';

import { useState, useEffect, FC, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, PlusCircle, MapPin, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import UserSidebar from '@/components/UserSidebar'; // Đảm bảo đường dẫn này đúng

// --- Cấu hình API ---
const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL || 'https://nhathuoc.trafficnhanh.com';

// --- Định nghĩa Types ---
interface Address {
    id: number;
    full_name: string;
    phone: string;
    province_name: string;
    district_name: string;
    ward_name: string;
    street_address: string;
    is_default: number; // 0 hoặc 1
}

// ============================================================================
// --- Component con: AddressFormModal (Modal Thêm/Sửa địa chỉ) ---
// ============================================================================
const AddressFormModal: FC<{ isOpen: boolean, onClose: (isSuccess: boolean) => void, address: Address | null }> = ({ isOpen, onClose, address }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        full_name: '', phone: '', province_name: '', district_name: '', ward_name: '', street_address: '', is_default: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (address) { // Chế độ sửa
                setFormData({ ...address, is_default: address.is_default === 1 });
            } else if (user) { // Chế độ thêm mới
                setFormData({
                    full_name: user.full_name || '', phone: user.phone || '',
                    province_name: '', district_name: '', ward_name: '', street_address: '', is_default: false
                });
            }
        }
    }, [address, isOpen, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem('auth_token');

        try {
            const action = address ? 'update_address' : 'add_address';
            const bodyPayload = { ...formData, is_default: formData.is_default ? 1 : 0 };
            if (address) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (bodyPayload as any).id = address.id;
            }

            const response = await fetch(`${API_DOMAIN}/addresses.php?action=${action}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyPayload)
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Thao tác thất bại.');

            toast.success(address ? "Cập nhật địa chỉ thành công!" : "Thêm địa chỉ mới thành công!");
            onClose(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error("Lỗi", { description: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose(false)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{address ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</DialogTitle>
                </DialogHeader>
                <form id="address-form" onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <Input name="full_name" placeholder="Họ và tên" value={formData.full_name} onChange={handleInputChange} disabled={isSubmitting} required />
                    <Input name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleInputChange} disabled={isSubmitting} required />
                    <Input name="province_name" placeholder="Tỉnh/Thành phố" value={formData.province_name} onChange={handleInputChange} required />
                    <Input name="district_name" placeholder="Quận/Huyện" value={formData.district_name} onChange={handleInputChange} required />
                    <Input name="ward_name" placeholder="Phường/Xã" value={formData.ward_name} onChange={handleInputChange} required />
                    <Input name="street_address" placeholder="Số nhà, tên đường..." value={formData.street_address} onChange={handleInputChange} required />
                    <div className="flex items-center space-x-2 mt-2">
                        <Checkbox id="is_default" checked={formData.is_default} onCheckedChange={(checked) => setFormData(p => ({ ...p, is_default: !!checked }))} />
                        <label htmlFor="is_default" className="text-sm font-medium leading-none cursor-pointer">Đặt làm địa chỉ mặc định</label>
                    </div>
                </form>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Hủy</Button></DialogClose>
                    <Button type="submit" form="address-form" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Hoàn tất
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


// ============================================================================
// --- Component con: AddressCard (Card hiển thị từng địa chỉ) ---
// ============================================================================
const AddressCard: FC<{ address: Address, onEdit: (addr: Address) => void, onDelete: (id: number) => void, onSetDefault: (id: number) => void }> = ({ address, onEdit, onDelete, onSetDefault }) => {
    const fullAddress = `${address.street_address}, ${address.ward_name}, ${address.district_name}, ${address.province_name}`;
    return (
        <Card className="p-4 transition-all hover:border-primary">
            <div className="flex justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-base text-gray-800">{address.full_name}</span>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <span className="text-gray-600">{address.phone}</span>
                    </div>
                    <p className="text-sm text-gray-500">{fullAddress}</p>
                    {address.is_default === 1 && (
                        <span className="mt-2 inline-block text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Mặc định</span>
                    )}
                </div>
                <div className="flex flex-col items-end justify-between shrink-0">
                    <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(address)}><Edit className="h-4 w-4"/> Sửa</Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => onDelete(address.id)}><Trash2 className="h-4 w-4"/> Xóa</Button>
                    </div>
                    {address.is_default !== 1 && (
                        <Button variant="outline" size="sm" onClick={() => onSetDefault(address.id)}>Thiết lập mặc định</Button>
                    )}
                </div>
            </div>
        </Card>
    );
};


// ============================================================================
// --- Component Cha: AddressBookPage (Trang chính) ---
// ============================================================================
export default function AddressBookPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const fetchAddresses = useCallback(async () => {
        setIsLoading(true);
        const token = localStorage.getItem('auth_token');
        if (!token) { router.push('/dang-nhap'); return; }

        try {
            const response = await fetch(`${API_DOMAIN}/addresses.php?action=get_my_addresses`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Lỗi tải địa chỉ.');
            setAddresses(result.data || []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error("Lỗi", { description: err.message });
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (!isAuthLoading && user) {
            fetchAddresses();
        }
    }, [user, isAuthLoading, fetchAddresses]);

    const handleAction = async (action: 'delete_address' | 'set_default_address', addressId: number, successMessage: string) => {
        if (action === 'delete_address' && !window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
            return;
        }
        
        const token = localStorage.getItem('auth_token');
        try {
            const response = await fetch(`${API_DOMAIN}/addresses.php?action=${action}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: addressId })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Thao tác thất bại.');
            
            toast.success(successMessage);
            fetchAddresses(); // Tải lại danh sách sau khi thành công
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error("Lỗi", { description: err.message });
        }
    };
    
    const onModalClose = (isSuccess: boolean) => {
        setShowModal(false);
        if (isSuccess) fetchAddresses();
    };

    if (isAuthLoading || !user) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin text-sky-500" /></div>;
    }

    return (
        <div className="bg-gray-100 py-8">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="mb-6 text-sm">
                    <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <Link href="/tai-khoan" className="text-gray-500 hover:text-primary">Tài khoản</Link>
                    <span className="mx-2">/</span>
                    <span className="font-semibold text-gray-800">Địa chỉ của tôi</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <UserSidebar />
                    <main className="lg:col-span-3">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Quản lý sổ địa chỉ</h1>
                            <Button onClick={() => { setEditingAddress(null); setShowModal(true); }}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Thêm địa chỉ mới
                            </Button>
                        </div>
                        
                        {isLoading ? (
                           <div className="space-y-4">
                                <Card className="p-4 h-[110px] animate-pulse bg-gray-200"></Card>
                                <Card className="p-4 h-[110px] animate-pulse bg-gray-200"></Card>
                           </div>
                        ) : addresses.length === 0 ? (
                           <div className="text-center py-16 border-2 border-dashed rounded-lg">
                               <MapPin size={64} className="mx-auto text-gray-300" />
                               <h3 className="mt-4 text-lg font-semibold">Bạn chưa có địa chỉ nào.</h3>
                               <p className="mt-1 text-sm text-gray-500">Thêm địa chỉ mới để giao hàng nhanh hơn!</p>
                           </div>
                        ) : (
                           <div className="space-y-4">
                                {addresses.map(address => (
                                    <AddressCard 
                                        key={address.id} 
                                        address={address} 
                                        onEdit={(addr) => { setEditingAddress(addr); setShowModal(true); }}
                                        onDelete={(id) => handleAction('delete_address', id, 'Xóa địa chỉ thành công!')}
                                        onSetDefault={(id) => handleAction('set_default_address', id, 'Đặt làm mặc định thành công!')}
                                    />
                                ))}
                           </div>
                        )}
                    </main>
                </div>
            </div>
            <AddressFormModal isOpen={showModal} onClose={onModalClose} address={editingAddress}/>
        </div>
    );
}