"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Truck, Store, CreditCard, Landmark, CircleDollarSign, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
// --- Định nghĩa Types cho các đơn vị hành chính ---
interface Province {
  code: number;
  name: string;
}
interface District {
  code: number;
  name: string;
}
interface Ward {
  code: number;
  name: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart, itemCount } = useCart();
  
  // --- STATE QUẢN LÝ FORM VÀ TRẠNG THÁI ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [isVatRequested, setIsVatRequested] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // State cho form thông tin
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    address_street: '',
    notes: '',
    payment_method: 'cod',
  });

  // State cho các dropdown địa chỉ
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<{ code?: number; name?: string }>({});
  const [selectedDistrict, setSelectedDistrict] = useState<{ code?: number; name?: string }>({});
  const [selectedWard, setSelectedWard] = useState<{ code?: number; name?: string }>({});
  const [isAddressLoading, setAddressLoading] = useState(false);

  // Chống lỗi Hydration Mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // --- LOGIC FETCH ĐỊA CHỈ TỪ API CÔNG CỘNG ---
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        if (!response.ok) throw new Error('Không thể tải danh sách tỉnh/thành.');
        const data = await response.json();
        setProvinces(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (!selectedProvince.code) return;
    const fetchDistricts = async () => {
      setAddressLoading(true);
      setDistricts([]); setWards([]); setSelectedDistrict({}); setSelectedWard({});
      try {
        const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`);
        if (!response.ok) throw new Error('Không thể tải danh sách quận/huyện.');
        const data = await response.json();
        setDistricts(data.districts);
      } catch (err) { console.error(err); }
      finally { setAddressLoading(false); }
    };
    fetchDistricts();
  }, [selectedProvince.code]);
  
  useEffect(() => {
    if (!selectedDistrict.code) return;
    const fetchWards = async () => {
      setAddressLoading(true);
      setWards([]); setSelectedWard({});
      try {
        const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`);
        if (!response.ok) throw new Error('Không thể tải danh sách phường/xã.');
        const data = await response.json();
        setWards(data.wards);
      } catch (err) { console.error(err); }
      finally { setAddressLoading(false); }
    };
    fetchWards();
  }, [selectedDistrict.code]);

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handlePaymentChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, payment_method: value }));
  }, []);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (itemCount === 0) {
        // Dùng toast cho nhất quán
        toast.error("Giỏ hàng của bạn đang trống.", {
            description: "Vui lòng thêm sản phẩm vào giỏ trước khi thanh toán."
        });
        return;
    }
    
    setIsSubmitting(true);
    setError(null);

    // --- CẬP NHẬT 1: KIỂM TRA ĐỊA CHỈ ---
    if (deliveryMethod === 'delivery' && (!formData.address_street || !selectedWard.name || !selectedDistrict.name || !selectedProvince.name)) {
        setError("Vui lòng điền đầy đủ thông tin địa chỉ nhận hàng.");
        setIsSubmitting(false);
        return;
    }

    const fullAddress = deliveryMethod === 'delivery' 
      ? `${formData.address_street}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`
      : 'Nhận tại nhà thuốc';
    
    // --- CẬP NHẬT 2: GỬI KÈM GIÁ SẢN PHẨM ĐỂ SERVER XÁC THỰC ---
    // Backend cần `price` để tính toán lại tổng tiền một cách an toàn
    const itemsToSubmit = cartItems.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price // Gửi kèm giá từ client
    }));

    const apiFormData = new FormData();
    // `action` nên nằm trong URL để rõ ràng hơn, nhưng gửi trong body cũng được
    apiFormData.append('customer_name', formData.customer_name);
    apiFormData.append('customer_phone', formData.customer_phone);
    apiFormData.append('customer_address', fullAddress);
    apiFormData.append('customer_email', formData.customer_email);
    apiFormData.append('notes', formData.notes);
    apiFormData.append('payment_method', formData.payment_method);
    apiFormData.append('cart_items', JSON.stringify(itemsToSubmit));

    try {
        // --- CẬP NHẬT 3: LẤY TOKEN VÀ CHUẨN BỊ HEADERS ---
        const token = localStorage.getItem('auth_token');
        
        const headers = new Headers(); // Dùng new Headers() để dễ quản lý

        // Nếu người dùng đã đăng nhập (có token), thêm nó vào header
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }
        
        // --- CẬP NHẬT 4: GỬI REQUEST VỚI HEADERS MỚI ---
        const response = await fetch('https://nhathuoc.trafficnhanh.com/orders.php?action=tao_don_hang', {
            method: 'POST',
            headers: headers, // <-- Thêm headers vào request
            body: apiFormData,
        });
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || 'Có lỗi xảy ra, không thể đặt hàng.');
        }
        
        // Đặt hàng thành công
        toast.success("Đặt hàng thành công!", {
            description: "Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng."
        });
        
        clearCart();
        
        // Chuyển hướng đến trang cảm ơn với token truy cập đơn hàng
        router.push(`/dat-hang-thanh-cong?order_id=${result.order_id}&token=${result.access_token}`);
        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        setError(err.message);
        toast.error("Đặt hàng thất bại", { description: err.message });
    } finally {
        setIsSubmitting(false);
    }
};
  
useEffect(() => {
  // useEffect này chỉ chạy một lần sau khi component được mount và isClient là true
  // Nó đảm bảo người dùng không thể vào trang checkout nếu giỏ hàng trống
  if (isClient && itemCount === 0) {
    console.log("Giỏ hàng trống, chuyển về trang chủ.");
    router.replace('/');
  }
  // Bằng cách không đưa itemCount vào mảng phụ thuộc, nó sẽ không chạy lại khi bạn clearCart()
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [isClient, router])

  // --- TÍNH TOÁN GIÁ TRỊ ĐƠN HÀNG ---
  const subtotal = useMemo(() => cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);
  const shippingFee = deliveryMethod === 'delivery' ? 15000 : 0;
  const total = subtotal + shippingFee;
  
  if (!isClient) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
        </div>
      );
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cột trái: Thông tin và lựa chọn */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Chọn hình thức nhận hàng</CardTitle></CardHeader>
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
              <CardHeader><CardTitle>Thông tin người đặt</CardTitle></CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="customer_name">Họ và tên</Label><Input id="customer_name" name="customer_name" value={formData.customer_name} onChange={handleInputChange} required /></div>
                  <div><Label htmlFor="customer_phone">Số điện thoại</Label><Input id="customer_phone" name="customer_phone" type="tel" value={formData.customer_phone} onChange={handleInputChange} required /></div>
                </div>
                <div><Label htmlFor="customer_email">Email (Tùy chọn)</Label><Input id="customer_email" name="customer_email" type="email" value={formData.customer_email} onChange={handleInputChange} /></div>
                <div><Label htmlFor="notes">Ghi chú (Tùy chọn)</Label><Textarea id="notes" name="notes" placeholder="Lưu ý cho người bán..." value={formData.notes} onChange={handleInputChange} /></div>
              </CardContent>
            </Card>
            
            {deliveryMethod === 'delivery' && (
              <Card>
                <CardHeader><CardTitle>Địa chỉ nhận hàng</CardTitle></CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select onValueChange={(value) => setSelectedProvince(JSON.parse(value))}><SelectTrigger><SelectValue placeholder="Chọn Tỉnh/Thành phố" /></SelectTrigger><SelectContent>{provinces.map(p => <SelectItem key={p.code} value={JSON.stringify(p)}>{p.name}</SelectItem>)}</SelectContent></Select>
                    <Select onValueChange={(value) => setSelectedDistrict(JSON.parse(value))} disabled={!selectedProvince.code || isAddressLoading}><SelectTrigger><SelectValue placeholder={isAddressLoading ? "Đang tải..." : "Chọn Quận/Huyện"} /></SelectTrigger><SelectContent>{districts.map(d => <SelectItem key={d.code} value={JSON.stringify(d)}>{d.name}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Select onValueChange={(value) => setSelectedWard(JSON.parse(value))} disabled={!selectedDistrict.code || isAddressLoading}><SelectTrigger><SelectValue placeholder={isAddressLoading ? "Đang tải..." : "Chọn Phường/Xã"} /></SelectTrigger><SelectContent>{wards.map(w => <SelectItem key={w.code} value={JSON.stringify(w)}>{w.name}</SelectItem>)}</SelectContent></Select>
                     <Input placeholder="Số nhà, tên đường" name="address_street" value={formData.address_street} onChange={handleInputChange} required={deliveryMethod === 'delivery'} />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card><CardContent className="pt-6 flex items-center justify-between"><Label htmlFor="vat-request" className="font-semibold">Yêu cầu xuất hóa đơn (VAT)</Label><Switch id="vat-request" checked={isVatRequested} onCheckedChange={setIsVatRequested} /></CardContent></Card>

            <Card>
              <CardHeader><CardTitle>Chọn phương thức thanh toán</CardTitle></CardHeader>
              <CardContent className="pt-6">
                 <RadioGroup value={formData.payment_method} onValueChange={handlePaymentChange} className="space-y-2">
                    <Label htmlFor="cod" className="flex items-center gap-3 border p-4 rounded-md cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500"><RadioGroupItem value="cod" id="cod" /><CircleDollarSign className="w-5 h-5 text-green-600" />Thanh toán khi nhận hàng (COD)</Label>
                    <Label className="flex items-center gap-3 border p-4 rounded-md cursor-not-allowed opacity-50"><RadioGroupItem value="atm" id="atm" disabled /><Landmark className="w-5 h-5 text-blue-600" />Thanh toán bằng thẻ ATM/Internet Banking</Label>
                    <Label className="flex items-center gap-3 border p-4 rounded-md cursor-not-allowed opacity-50"><RadioGroupItem value="card" id="card" disabled /><CreditCard className="w-5 h-5 text-orange-600" />Thanh toán bằng thẻ quốc tế Visa, Master,...</Label>
                 </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white rounded-lg shadow sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng ({itemCount})</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-start justify-between gap-3">
                      <Image src={item.image} alt={item.name} width={50} height={50} className="rounded border flex-shrink-0"/>
                      <div className="flex-grow"><p className="font-medium text-sm line-clamp-2">{item.name}</p><p className="text-xs text-gray-500">{item.type} x {item.quantity}</p></div>
                      <p className="text-sm font-semibold whitespace-nowrap">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between"><span>Tạm tính</span><span>{subtotal.toLocaleString('vi-VN')}₫</span></div>
                <div className="flex justify-between"><span>Phí vận chuyển</span><span>{shippingFee.toLocaleString('vi-VN')}₫</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Tổng tiền</span><span className="text-red-600">{total.toLocaleString('vi-VN')}₫</span></div>
              </div>
              {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
              <Button type="submit" className="w-full mt-4 bg-red-500 hover:bg-red-600 text-lg py-6" disabled={isSubmitting || itemCount === 0}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? 'Đang đặt hàng...' : `Thanh toán ${total.toLocaleString('vi-VN')}₫`}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}