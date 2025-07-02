"use client";

import { useState, useEffect, useMemo, useCallback, FC } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Truck, Store, Landmark, CircleDollarSign, Loader2, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// --- Types ---
interface Address {
    id: number;
    full_name: string;
    phone: string;
    province_name: string;
    district_name: string;
    ward_name: string;
    street_address: string;
    is_default: number;
}
interface Province { code: number; name: string; }
interface District { code: number; name: string; }
interface Ward { code: number; name: string; }

// ============================================================================
// --- COMPONENT CHỌN ĐỊA CHỈ ---
// ============================================================================
const AddressSelector: FC<{ 
    savedAddresses: Address[], 
    selectedAddressId: number | 'new' | null, 
    onSelectAddress: (id: number | 'new') => void 
}> = ({ savedAddresses, selectedAddressId, onSelectAddress }) => {
    return (
        <RadioGroup 
            value={String(selectedAddressId)} 
            onValueChange={(value) => onSelectAddress(value === 'new' ? 'new' : parseInt(value))}
            className="space-y-3"
        >
            {savedAddresses.map(address => (
                <Label key={address.id} htmlFor={`addr-${address.id}`} className="flex items-start gap-3 border p-4 rounded-md cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                    <RadioGroupItem value={String(address.id)} id={`addr-${address.id}`} className="mt-1" />
                    <div className="flex-grow text-sm">
                        <div className="flex justify-between font-bold">
                            <span>{address.full_name} - {address.phone}</span>
                            {address.is_default === 1 && <Badge variant="secondary">Mặc định</Badge>}
                        </div>
                        <p className="text-gray-600">{`${address.street_address}, ${address.ward_name}, ${address.district_name}, ${address.province_name}`}</p>
                    </div>
                </Label>
            ))}
             <Label htmlFor="addr-new" className="flex items-center gap-3 border p-4 rounded-md cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                <RadioGroupItem value="new" id="addr-new" />
                <PlusCircle className="w-5 h-5" />
                <span>Giao đến địa chỉ mới</span>
            </Label>
        </RadioGroup>
    );
}

// ============================================================================
// --- COMPONENT TRANG THANH TOÁN CHÍNH ---
// ============================================================================
export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, clearCart, itemCount } = useCart();
    const { user, isLoading: isAuthLoading } = useAuth();
  
   const { subtotal } = useMemo(() => {
        // Tính tổng tiền của TẤT CẢ sản phẩm trong giỏ hàng
        const currentSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        
        // Phí vận chuyển chỉ tính khi có sản phẩm
        const currentShippingFee = currentSubtotal > 0 ? 15000 : 0; 
        
        return {
            subtotal: currentSubtotal,
            shippingFee: currentShippingFee,
            total: currentSubtotal + currentShippingFee
        };
    }, [cartItems]); // Tính lại mỗi khi giỏ hàng thay đổi
  
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
    
    // State cho form
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        address_street: '',
        notes: '',
        payment_method: 'cod',
    });

    // State cho địa chỉ
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | 'new' | null>(null);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvinceName, setSelectedProvinceName] = useState('');
    const [selectedDistrictName, setSelectedDistrictName] = useState('');
    const [selectedWardName, setSelectedWardName] = useState('');
    
    // Tự động điền thông tin khi có user
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                customer_name: user.full_name || '',
                customer_phone: user.phone || '',
                customer_email: user.email || ''
            }));
        }
    }, [user]);

    // Lấy danh sách địa chỉ đã lưu
    useEffect(() => {
        if (!user) {
            setSelectedAddressId('new');
            return;
        }

        const fetchSavedAddresses = async () => {
            const token = localStorage.getItem('auth_token');
            try {
                const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL || 'https://nhathuoc.trafficnhanh.com';
                const response = await fetch(`${API_DOMAIN}/addresses.php?action=get_my_addresses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                if (result.success && result.data.length > 0) {
                    setSavedAddresses(result.data);
                    const defaultAddress = result.data.find((addr: Address) => addr.is_default === 1) || result.data[0];
                    setSelectedAddressId(defaultAddress.id);
                } else {
                    setSelectedAddressId('new');
                }
            } catch (err) {
                console.error("Lỗi tải địa chỉ đã lưu:", err);
                setSelectedAddressId('new');
            }
        };
        fetchSavedAddresses();
    }, [user]);
    
    // Các useEffect fetch Tỉnh/Huyện/Xã
    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/p/').then(res => res.json()).then(data => setProvinces(data));
    }, []);

    const handleProvinceChange = (value: string) => {
        const province = JSON.parse(value);
        setSelectedProvinceName(province.name);
        setDistricts([]); setWards([]); setSelectedDistrictName(''); setSelectedWardName('');
        fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`).then(res => res.json()).then(data => setDistricts(data.districts));
    }
    const handleDistrictChange = (value: string) => {
        const district = JSON.parse(value);
        setSelectedDistrictName(district.name);
        setWards([]); setSelectedWardName('');
        fetch(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`).then(res => res.json()).then(data => setWards(data.wards));
    }

    // Xử lý submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (itemCount === 0) { toast.error("Giỏ hàng của bạn đang trống."); return; }
        setIsSubmitting(true);

        let fullAddress = '';
        const finalCustomerInfo = { ...formData };

        if (deliveryMethod === 'delivery') {
            if (selectedAddressId === 'new') {
                if (!formData.address_street || !selectedWardName || !selectedDistrictName || !selectedProvinceName) {
                    toast.error("Vui lòng điền đầy đủ thông tin địa chỉ mới.");
                    setIsSubmitting(false);
                    return;
                }
                fullAddress = `${formData.address_street}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`;
            } else {
                const selectedAddr = savedAddresses.find(addr => addr.id === selectedAddressId);
                if (!selectedAddr) {
                    toast.error("Vui lòng chọn một địa chỉ giao hàng.");
                    setIsSubmitting(false);
                    return;
                }
                fullAddress = `${selectedAddr.street_address}, ${selectedAddr.ward_name}, ${selectedAddr.district_name}, ${selectedAddr.province_name}`;
                finalCustomerInfo.customer_name = selectedAddr.full_name;
                finalCustomerInfo.customer_phone = selectedAddr.phone;
            }
        } else {
            fullAddress = 'Nhận tại nhà thuốc';
        }

        const itemsToSubmit = cartItems.map(item => ({ variantId: item.variantId, quantity: item.quantity }));
        const apiFormData = new FormData();
        apiFormData.append('customer_name', finalCustomerInfo.customer_name);
        apiFormData.append('customer_phone', finalCustomerInfo.customer_phone);
        apiFormData.append('customer_address', fullAddress);
        apiFormData.append('customer_email', finalCustomerInfo.customer_email);
        apiFormData.append('notes', formData.notes);
        apiFormData.append('payment_method', formData.payment_method);
        apiFormData.append('cart_items', JSON.stringify(itemsToSubmit));

        try {
            const token = localStorage.getItem('auth_token');
            const headers = new Headers();
            if (token) { headers.append('Authorization', `Bearer ${token}`); }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://nhathuoc.trafficnhanh.com'}/orders.php?action=tao_don_hang`, {
                method: 'POST',
                headers: headers,
                body: apiFormData,
            });
            const result = await response.json();
            if (!result.success) { throw new Error(result.message || 'Lỗi đặt hàng.'); }

            toast.success("Đặt hàng thành công!");
            clearCart();
            router.push(`/dat-hang-thanh-cong?order_id=${result.order_id}`);
            
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error("Đặt hàng thất bại", { description: err.message });
        } finally {
            setIsSubmitting(false);
        }
  };
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Lấy ra name và value từ ô input đang được gõ
    const { name, value } = e.target;
    // Cập nhật lại state formData, chỉ thay đổi trường có `name` tương ứng
    setFormData(prev => ({ ...prev, [name]: value }));
}, []); // useCallback với mảng rỗng để đảm bảo hàm không bị tạo lại không cần thiết

    const total = useMemo(() => subtotal + (deliveryMethod === 'delivery' ? 15000 : 0), [subtotal, deliveryMethod]);
    
    if (isAuthLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin text-blue-500" /></div>;
    }

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Cột trái: Thông tin và lựa chọn */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader><CardTitle>1. Chọn hình thức nhận hàng</CardTitle></CardHeader>
                            <CardContent>
                                <RadioGroup value={deliveryMethod} onValueChange={(value: 'delivery' | 'pickup') => setDeliveryMethod(value)} className="space-y-2">
                                    <Label htmlFor="delivery" className="flex items-center gap-3 border p-4 rounded-md cursor-pointer hover:bg-gray-100 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                                        <RadioGroupItem value="delivery" id="delivery" /> <Truck className="w-5 h-5" /> Giao hàng tận nơi
                                    </Label>
                                    <Label htmlFor="pickup" className="flex items-center gap-3 border p-4 rounded-md cursor-pointer hover:bg-gray-100 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                                        <RadioGroupItem value="pickup" id="pickup" /> <Store className="w-5 h-5" /> Nhận tại nhà thuốc
                                    </Label>
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>2. Thông tin giao hàng</CardTitle></CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                {user && savedAddresses.length > 0 && deliveryMethod === 'delivery' ? (
                                    <AddressSelector savedAddresses={savedAddresses} selectedAddressId={selectedAddressId} onSelectAddress={setSelectedAddressId} />
                                ) : null}
                                
                                {(selectedAddressId === 'new' || !user) && deliveryMethod === 'delivery' && (
                                    <div className="space-y-4 border-t pt-4 mt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input placeholder="Họ và tên người nhận" name="customer_name" value={formData.customer_name} onChange={handleInputChange} required />
                                            <Input placeholder="Số điện thoại người nhận" name="customer_phone" value={formData.customer_phone} onChange={handleInputChange} required />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <Select onValueChange={handleProvinceChange}><SelectTrigger><SelectValue placeholder="Chọn Tỉnh/Thành phố" /></SelectTrigger><SelectContent>{provinces.map(p => <SelectItem key={p.code} value={JSON.stringify(p)}>{p.name}</SelectItem>)}</SelectContent></Select>
                                            <Select onValueChange={handleDistrictChange} disabled={!selectedProvinceName}><SelectTrigger><SelectValue placeholder="Chọn Quận/Huyện" /></SelectTrigger><SelectContent>{districts.map(d => <SelectItem key={d.code} value={JSON.stringify(d)}>{d.name}</SelectItem>)}</SelectContent></Select>
                                            <Select onValueChange={(value) => setSelectedWardName(JSON.parse(value).name)} disabled={!selectedDistrictName}><SelectTrigger><SelectValue placeholder="Chọn Phường/Xã" /></SelectTrigger><SelectContent>{wards.map(w => <SelectItem key={w.code} value={JSON.stringify(w)}>{w.name}</SelectItem>)}</SelectContent></Select>
                                        </div>
                                        <Input placeholder="Số nhà, tên đường" name="address_street" value={formData.address_street} onChange={handleInputChange} required={selectedAddressId === 'new'} />
                                    </div>
                                )}

                                {/* Vẫn hiển thị thông tin người đặt nếu là khách vãng lai */}
                                {!user && deliveryMethod !== 'delivery' && (
                                     <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input placeholder="Họ và tên" name="customer_name" value={formData.customer_name} onChange={handleInputChange} required />
                                            <Input placeholder="Số điện thoại" name="customer_phone" value={formData.customer_phone} onChange={handleInputChange} required />
                                        </div>
                                     </div>
                                )}
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader><CardTitle>3. Chọn phương thức thanh toán</CardTitle></CardHeader>
                            <CardContent className="pt-6">
                                 <RadioGroup value={formData.payment_method} onValueChange={(val) => setFormData(p => ({...p, payment_method: val}))} className="space-y-2">
                                     <Label htmlFor="cod" className="flex items-center gap-3 border p-4 rounded-md cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500"><RadioGroupItem value="cod" id="cod" /><CircleDollarSign className="w-5 h-5 text-green-600" />Thanh toán khi nhận hàng (COD)</Label>
                                     <Label className="flex items-center gap-3 border p-4 rounded-md cursor-not-allowed opacity-50"><RadioGroupItem value="atm" id="atm" disabled /><Landmark className="w-5 h-5 text-blue-600" />Thanh toán bằng thẻ ATM/Internet Banking</Label>
                                 </RadioGroup>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>4. Thông tin bổ sung</CardTitle></CardHeader>
                            <CardContent className="pt-6">
                                <div><Label htmlFor="notes">Ghi chú (Tùy chọn)</Label><Textarea id="notes" name="notes" placeholder="Lưu ý cho người bán..." value={formData.notes} onChange={handleInputChange} /></div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Cột phải: Tóm tắt đơn hàng */}
                    <div className="lg:col-span-1">
                        <div className="p-6 bg-white rounded-lg shadow sticky top-24">
                            <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng ({itemCount})</h2>
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 border-b pb-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-start justify-between gap-3">
                                        <Image src={item.image} alt={item.name} width={50} height={50} className="rounded border flex-shrink-0"/>
                                        <div className="flex-grow"><p className="font-medium text-sm line-clamp-2">{item.name}</p><p className="text-xs text-gray-500">{item.type} x {item.quantity}</p></div>
                                        <p className="text-sm font-semibold whitespace-nowrap">{((item.price * item.quantity) || 0).toLocaleString('vi-VN')}₫</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t mt-4 pt-4 space-y-2">
                                <div className="flex justify-between"><span>Tạm tính</span><span>{(subtotal || 0).toLocaleString('vi-VN')}₫</span></div>
                                <div className="flex justify-between"><span>Phí vận chuyển</span><span>{(deliveryMethod === 'delivery' ? 15000 : 0).toLocaleString('vi-VN')}₫</span></div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Tổng tiền</span><span className="text-red-600">{(total || 0).toLocaleString('vi-VN')}₫</span></div>
                            </div>
                            <Button type="submit" className="w-full mt-4 bg-red-500 hover:bg-red-600 text-lg py-6" disabled={isSubmitting || itemCount === 0}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isSubmitting ? 'Đang xử lý...' : `Đặt hàng`}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}