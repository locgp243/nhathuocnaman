// 'use client';

// import { useState, useEffect } from 'react';
// import { Loader2, PlusCircle, MapPin, Trash2, Edit, Home } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Checkbox } from '@/components/ui/checkbox';
// import { toast } from 'sonner';

// // Import các component dùng chung
// import { useAuth } from '@/contexts/AuthContext';
// import UserSidebar from '@/components/account/UserSidebar';

// // --- Type Definitions ---
// interface Address {
//     id: number;
//     user_id: number;
//     full_name: string;
//     phone: string;
//     province_name: string;
//     district_name: string;
//     ward_name: string;
//     street_address: string;
//     is_default: number; // 0 hoặc 1
// }

// // --- Main Component ---
// export default function AddressBookPage() {
//     const { user, isLoading } = useAuth();
//     const [addresses, setAddresses] = useState<Address[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [showModal, setShowModal] = useState(false);
//     const [editingAddress, setEditingAddress] = useState<Address | null>(null);

//     // Fetch addresses when user is loaded
//     useEffect(() => {
//         if (!isLoading && user) {
//             fetchAddresses();
//         }
//     }, [user, isLoading]);

//     const fetchAddresses = async () => {
//         setIsLoading(true);
//         const token = localStorage.getItem('auth_token');
//         try {
//             const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL || 'https://nhathuoc.trafficnhanh.com';
//             const response = await fetch(`${API_DOMAIN}/addresses.php?action=get_my_addresses`, {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//             const result = await response.json();
//             if (!response.ok) throw new Error(result.error || 'Lỗi tải địa chỉ.');
//             setAddresses(result.data || []);
//         } catch (err: any) {
//             toast.error(err.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };
    
//     // --- Các hàm xử lý hành động ---
//     const handleAddNew = () => {
//         setEditingAddress(null);
//         setShowModal(true);
//     };

//     const handleEdit = (address: Address) => {
//         setEditingAddress(address);
//         setShowModal(true);
//     };
    
//     const handleDelete = async (addressId: number) => {
//         // ... Logic gọi API xóa địa chỉ ...
//         toast.success("Xóa địa chỉ thành công!");
//         await fetchAddresses(); // Tải lại danh sách
//     };

//     const handleSetDefault = async (addressId: number) => {
//         // ... Logic gọi API đặt làm mặc định ...
//         toast.success("Đặt làm mặc định thành công!");
//         await fetchAddresses(); // Tải lại danh sách
//     }

//     const onModalClose = (isSuccess: boolean) => {
//         setShowModal(false);
//         if (isSuccess) {
//             fetchAddresses(); // Tải lại danh sách nếu có thay đổi
//         }
//     }

//     // Xử lý loading ban đầu
//     if (isLoading) {
//         return <div className="flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin text-sky-500" /></div>;
//     }

//     return (
//         <div className="bg-gray-50 py-8">
//             <div className="container mx-auto max-w-7xl px-4">
//                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//                     <UserSidebar />
//                     <main className="lg:col-span-3">
//                         <div className="flex justify-between items-center mb-6">
//                             <h1 className="text-2xl font-bold text-gray-800">Quản lý sổ địa chỉ</h1>
//                             <Button onClick={handleAddNew}>
//                                 <PlusCircle className="mr-2 h-4 w-4" /> Thêm địa chỉ mới
//                             </Button>
//                         </div>
                        
//                         {isLoading ? (
//                            <div className="flex justify-center p-16"><Loader2 className="animate-spin text-primary h-10 w-10"/></div>
//                         ) : addresses.length === 0 ? (
//                            <div className="text-center py-16 border-2 border-dashed rounded-lg">
//                                 <MapPin size={64} className="mx-auto text-gray-300" />
//                                 <h3 className="mt-4 text-lg font-semibold">Bạn chưa có địa chỉ nào.</h3>
//                                 <p className="mt-1 text-sm text-gray-500">Thêm địa chỉ mới để giao hàng nhanh hơn!</p>
//                            </div>
//                         ) : (
//                            <div className="space-y-4">
//                                 {addresses.map(address => (
//                                     <AddressCard 
//                                         key={address.id} 
//                                         address={address} 
//                                         onEdit={handleEdit}
//                                         onDelete={handleDelete}
//                                         onSetDefault={handleSetDefault}
//                                     />
//                                 ))}
//                            </div>
//                         )}
//                     </main>
//                 </div>
//             </div>
//             {/* Modal/Dialog để thêm/sửa địa chỉ */}
//             <AddressFormModal 
//                 isOpen={showModal} 
//                 onClose={onModalClose}
//                 address={editingAddress}
//             />
//         </div>
//     );
// }


// // --- Sub-component: Address Card ---
// function AddressCard({ address, onEdit, onDelete, onSetDefault }: { address: Address, onEdit: (addr: Address) => void, onDelete: (id: number) => void, onSetDefault: (id: number) => void }) {
//     const fullAddress = `${address.street_address}, ${address.ward_name}, ${address.district_name}, ${address.province_name}`;
//     return (
//         <Card className="p-4">
//             <div className="flex justify-between">
//                 <div>
//                     <div className="flex items-center gap-2 mb-2">
//                         <span className="font-bold text-lg">{address.full_name}</span>
//                         <div className="h-4 w-px bg-gray-300"></div>
//                         <span className="text-gray-600">{address.phone}</span>
//                     </div>
//                     <p className="text-sm text-gray-500">{fullAddress}</p>
//                      <div className="flex items-center gap-2 mt-2">
//                         <Home className="h-4 w-4 text-gray-400" />
//                         <span className="text-xs text-gray-500">Nhà</span>
//                         {address.is_default === 1 && (
//                             <span className="ml-2 text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Mặc định</span>
//                         )}
//                     </div>
//                 </div>
//                 <div className="flex flex-col items-end gap-2">
//                     <div className="flex gap-2">
//                         <Button variant="ghost" size="sm" onClick={() => onEdit(address)}><Edit className="h-4 w-4 mr-1"/> Sửa</Button>
//                         <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => onDelete(address.id)}><Trash2 className="h-4 w-4 mr-1"/> Xóa</Button>
//                     </div>
//                     {address.is_default !== 1 && (
//                         <Button variant="outline" size="sm" onClick={() => onSetDefault(address.id)}>Thiết lập mặc định</Button>
//                     )}
//                 </div>
//             </div>
//         </Card>
//     );
// }

// // --- Sub-component: Address Form Modal ---
// function AddressFormModal({ isOpen, onClose, address }: { isOpen: boolean, onClose: (isSuccess: boolean) => void, address: Address | null }) {
//     const [formData, setFormData] = useState({
//         full_name: '', phone: '', province_name: '', district_name: '', ward_name: '', street_address: '', is_default: false
//     });
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     useEffect(() => {
//         if (address) {
//             setFormData({ ...address, is_default: address.is_default === 1 });
//         } else {
//             // Reset form for new address
//             setFormData({ full_name: '', phone: '', province_name: '', district_name: '', ward_name: '', street_address: '', is_default: false });
//         }
//     }, [address, isOpen]);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
        
//         const action = address ? 'update_address' : 'add_address';
//         const body = address ? { ...formData, id: address.id } : formData;

//         // ... Logic gọi API để thêm/sửa địa chỉ ...
//         // Sau khi thành công:
//         toast.success(address ? "Cập nhật địa chỉ thành công!" : "Thêm địa chỉ mới thành công!");
//         onClose(true); // Đóng modal và báo hiệu thành công để tải lại danh sách
//         setIsSubmitting(false);
//     };

//     if (!isOpen) return null;

//     return (
//         <Dialog open={isOpen} onOpenChange={(open) => !open && onClose(false)}>
//             <DialogContent className="sm:max-w-[425px]">
//                 <DialogHeader>
//                     <DialogTitle>{address ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</DialogTitle>
//                     <DialogDescription>Điền thông tin người nhận và địa chỉ giao hàng.</DialogDescription>
//                 </DialogHeader>
//                 <form onSubmit={handleSubmit} className="grid gap-4 py-4">
//                     <Input name="full_name" placeholder="Họ và tên" value={formData.full_name} onChange={/*...*/}/>
//                     <Input name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={/*...*/}/>
//                     {/* TODO: Thay thế các Input này bằng Dropdown/Select để chọn Tỉnh/Huyện/Xã */}
//                     <Input name="province_name" placeholder="Tỉnh/Thành phố" value={formData.province_name} onChange={/*...*/}/>
//                     <Input name="district_name" placeholder="Quận/Huyện" value={formData.district_name} onChange={/*...*/}/>
//                     <Input name="ward_name" placeholder="Phường/Xã" value={formData.ward_name} onChange={/*...*/}/>
//                     <Input name="street_address" placeholder="Số nhà, tên đường..." value={formData.street_address} onChange={/*...*/}/>
//                     <div className="flex items-center space-x-2">
//                         <Checkbox id="is_default" checked={formData.is_default} onCheckedChange={(checked) => setFormData(p => ({...p, is_default: !!checked}))}/>
//                         <label htmlFor="is_default" className="text-sm font-medium leading-none">Đặt làm địa chỉ mặc định</label>
//                     </div>
//                 </form>
//                 <DialogFooter>
//                     <DialogClose asChild><Button type="button" variant="outline">Hủy</Button></DialogClose>
//                     <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
//                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                         Hoàn tất
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }