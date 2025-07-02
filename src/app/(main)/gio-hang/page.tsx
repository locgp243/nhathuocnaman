"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Trash2, Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- CÁC ĐỊNH NGHĨA TYPES ---
interface ServerVariant {
  id: number;
  product_id: number;
  unit_name: string;
  price: string;
  original_price: string;
}
interface ServerProduct {
  id: number;
  name: string;
  slug: string;
  images: { image_url: string; is_primary: number }[];
  variants: ServerVariant[];
}
interface DisplayCartItem {
  id: string;
  productId: string;
  variantId: string; // <-- Đã thêm để đảm bảo có trong kiểu dữ liệu
  name: string;
  image: string;
  price: number;
  quantity: number;
  type: string;
  slug: string;
  availableVariants: ServerVariant[];
}

// --- COMPONENT CHÍNH ---
export default function ShoppingCartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, updateVariant } = useCart();

  const [displayItems, setDisplayItems] = useState<DisplayCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Dòng debug để kiểm tra dữ liệu nhận được từ Context
  console.log("Dữ liệu giỏ hàng NHẬN ĐƯỢC từ Context:", cartItems);

  useEffect(() => {
    // Component đã được mount ở phía client
    setIsClient(true);
  }, []);

  // --- LOGIC FETCH VÀ TRỘN DỮ LIỆU ---
  useEffect(() => {
    // Chỉ chạy logic này ở phía client
    if (!isClient) return;

    const fetchProductDetails = async () => {
      if (cartItems.length === 0) {
        setDisplayItems([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);

      // Lấy danh sách ID sản phẩm không trùng lặp để gọi API
      const productIds = [...new Set(cartItems.map(item => item.productId))];
      const formData = new FormData();
      productIds.forEach(id => formData.append('product_ids[]', id));

      try {
        const response = await fetch(`https://nhathuoc.trafficnhanh.com/products.php?action=lay_san_pham_tu_gio_hang`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error("Lỗi mạng hoặc server không phản hồi.");
        
        const serverProducts: ServerProduct[] = await response.json();
        const serverProductsMap = new Map(serverProducts.map(p => [p.id.toString(), p]));

        // Gộp dữ liệu từ Context (localStorage) với dữ liệu mới nhất từ server
        const enrichedItems = cartItems.map(localItem => {
          const productInfo = serverProductsMap.get(localItem.productId);
          // Nếu không tìm thấy thông tin sản phẩm trên server, bỏ qua sản phẩm này
          if (!productInfo) return null;

          const primaryImage = productInfo.images.find(img => img.is_primary === 1)?.image_url || productInfo.images[0]?.image_url || "/placeholder.svg";
          
          const imageBaseUrl = "http://nhathuoc.trafficnhanh.com";
          const imageUrl = primaryImage.startsWith('http') ? primaryImage : `${imageBaseUrl}${primaryImage}`;

          // Lấy giá mới nhất của variant hiện tại
          const currentVariant = productInfo.variants.find(v => v.unit_name === localItem.type);
          const latestPrice = currentVariant ? parseFloat(currentVariant.price) : localItem.price;

          return {
            ...localItem, // Giữ lại productId, variantId, quantity, type, id từ local
            name: productInfo.name,
            image: imageUrl,
            price: latestPrice,
            slug: productInfo.slug,
            availableVariants: productInfo.variants,
          };
        }).filter((item): item is DisplayCartItem => item !== null); // Lọc bỏ các sản phẩm không tìm thấy

        setDisplayItems(enrichedItems);
      } catch (err) {
        console.error("Lỗi khi fetch chi tiết sản phẩm:", err);
        setError("Không thể tải dữ liệu giỏ hàng. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [cartItems, isClient]);

  // Đồng bộ hóa các item được chọn khi giỏ hàng thay đổi
  useEffect(() => {
    if (displayItems.length > 0) {
      setSelectedItems(displayItems.map((item) => item.id));
      setSelectAll(true);
    } else {
      setSelectedItems([]);
      setSelectAll(false);
    }
  }, [displayItems]);

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
  const handleVariantChange = useCallback((item: DisplayCartItem, newVariantName: string) => {
    const newVariantData = item.availableVariants.find(v => v.unit_name === newVariantName);
    if (!newVariantData) return;
    
    // Gửi đầy đủ thông tin variant mới, bao gồm cả variantId
    updateVariant(item.id, {
      type: newVariantData.unit_name,
      price: parseFloat(newVariantData.price),
      variantId: String(newVariantData.id)
    });
  }, [updateVariant]);

  const handleQuantityChange = useCallback((itemId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  }, [updateQuantity]);

  const handleSelectItem = useCallback((itemId: string) => {
    setSelectedItems(prevSelected => {
      const newSelected = prevSelected.includes(itemId)
        ? prevSelected.filter(id => id !== itemId)
        : [...prevSelected, itemId];
      setSelectAll(displayItems.length > 0 && newSelected.length === displayItems.length);
      return newSelected;
    });
  }, [displayItems.length]);

  const handleSelectAll = useCallback(() => {
    const newSelectAll = !selectAll;
    setSelectedItems(newSelectAll ? displayItems.map(item => item.id) : []);
    setSelectAll(newSelectAll);
  }, [selectAll, displayItems]);

  const handleRemoveSelected = useCallback(() => {
    selectedItems.forEach(id => removeFromCart(id));
  }, [selectedItems, removeFromCart]);

  // --- HÀM TIỆN ÍCH VÀ TÍNH TOÁN ---
  const formatPrice = (price: number) => price.toLocaleString('vi-VN');

  const { subtotal, total, shippingFee } = useMemo(() => {
    const currentSubtotal = displayItems.reduce((total, item) => {
      return selectedItems.includes(item.id) ? total + item.price * item.quantity : total;
    }, 0);
    
    const currentShippingFee = currentSubtotal > 0 ? 15000 : 0;

    return {
      subtotal: currentSubtotal,
      shippingFee: currentShippingFee,
      total: currentSubtotal + currentShippingFee
    };
  }, [displayItems, selectedItems]);


  // --- GIAO DIỆN ---
  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 pb-10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold">Giỏ hàng ({displayItems.length} sản phẩm)</h1>
              <button onClick={handleRemoveSelected} className="text-red-500 hover:underline disabled:text-gray-400 disabled:no-underline" disabled={selectedItems.length === 0}>
                Xoá ({selectedItems.length})
              </button>
            </div>
            <div className="border-b pb-4">
              <div className="grid grid-cols-12 gap-4 text-sm text-gray-600 mb-2 items-center">
                  <div className="col-span-6 flex items-center">
                      <Checkbox id="select-all" checked={selectAll} onCheckedChange={handleSelectAll} className="mr-2 data-[state=checked]:bg-blue-500"/>
                      <label htmlFor="select-all" className="cursor-pointer">Chọn tất cả</label>
                  </div>
                  <div className="col-span-2 text-center">Đơn giá</div>
                  <div className="col-span-2 text-center">Số lượng</div>
                  <div className="col-span-2 text-right">Thành tiền</div>
              </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-10"><Loader2 className="h-10 w-10 animate-spin text-blue-500" /></div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
            ) : displayItems.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>Giỏ hàng của bạn đang trống.</p>
                <Button onClick={() => router.push('/')} className="mt-4">Tiếp tục mua sắm</Button>
              </div>
            ) : (
              displayItems.map((item) => (
                <div key={item.id} className="py-4 border-b">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6 flex items-center">
                      <Checkbox checked={selectedItems.includes(item.id)} onCheckedChange={() => handleSelectItem(item.id)} className="mr-4 data-[state=checked]:bg-blue-500"/>
                      <Image src={item.image} alt={item.name} width={80} height={80} className="object-contain mr-4 rounded border"/>
                      <div className="flex-grow">
                        <p className="font-medium text-sm mb-2 line-clamp-2">{item.name}</p>
                        <Select value={item.type} onValueChange={(newVariantName) => handleVariantChange(item, newVariantName)}>
                          <SelectTrigger className="w-full md:w-[180px] h-9 text-xs"><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                          <SelectContent>{item.availableVariants.map(variant => (<SelectItem key={variant.id} value={variant.unit_name}>{variant.unit_name}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="col-span-2 text-center text-sm">{formatPrice(item.price)}₫</div>
                    <div className="col-span-2">
                      <div className="flex items-center justify-center border rounded-md max-w-[100px] mx-auto">
                        <button onClick={() => handleQuantityChange(item.id, item.quantity, -1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-md"><Minus size={16} /></button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, item.quantity, 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-md"><Plus size={16} /></button>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-end">
                      <span className="font-medium text-red-500 text-sm">{formatPrice(item.price * item.quantity)}₫</span>
                      <button onClick={() => removeFromCart(item.id)} className="ml-4 text-gray-400 hover:text-red-500" aria-label="Remove item"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">{formatPrice(subtotal)}₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển (Tạm tính)</span>
                  <span className="font-medium">{formatPrice(shippingFee)}₫</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Tổng tiền</span>
                  <span className="text-red-500">{formatPrice(total)}₫</span>
                </div>
                <Button onClick={() => router.push("/thanh-toan")} disabled={selectedItems.length === 0} className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-3 rounded-md">
                  Mua hàng ({selectedItems.length})
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
