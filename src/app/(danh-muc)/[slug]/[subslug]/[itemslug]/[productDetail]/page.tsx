'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Minus, Plus, Star } from "lucide-react";

//================================================================//
// 1. DATABASE VÀ ĐỊNH NGHĨA KIỂU DỮ LIỆU
//================================================================//

// Dữ liệu mới nhất từ API response của bạn
const apiResponse = {
  "success": true,
  "data": {
    "id": 2,
    "brand_id": 11,
    "supplier_id": 1,
    "name": "Thuốc Panadol Extra",
    "slug": "thuoc-panadol-extra",
    "prescription_type": "non-prescription",
    "registration_number": "VN-22 Panadol",
    "origin": "Anh",
    "description": "Panadol Extra là thuốc giảm đau, hạ sốt hiệu quả, chứa Paracetamol và Caffeine giúp tăng cường tác dụng giảm đau.",
    "ingredients": "Mỗi viên nén chứa: Paracetamol 500mg, Caffeine 65mg.",
    "indications": "Giảm các triệu chứng đau từ nhẹ đến vừa như đau đầu, đau nửa đầu, đau cơ, đau bụng kinh, đau họng, đau răng. Hạ sốt.",
    "contraindications": "Quá mẫn với paracetamol, caffeine hoặc bất kỳ tá dược nào của thuốc. Bệnh nhân suy gan nặng.",
    "dosage_instructions": "Người lớn và trẻ em từ 12 tuổi trở lên: Uống 1-2 viên mỗi 4-6 giờ nếu cần. Không quá 8 viên trong 24 giờ.",
    "side_effects": "Hiếm gặp: phát ban da, phản ứng dị ứng.",
    "precautions": "Không dùng chung với các thuốc khác có chứa paracetamol. Tham khảo ý kiến bác sĩ nếu triệu chứng kéo dài.",
    "storage_instructions": "Bảo quản nơi khô ráo, dưới 30°C.",
    "meta_title": "Panadol Extra - Giảm Đau, Hạ Sốt Nhanh (Hộp 10 vỉ)",
    "meta_description": "Mua thuốc Panadol Extra giúp giảm nhanh các cơn đau đầu, đau răng, hạ sốt. Sản phẩm chính hãng, an toàn và hiệu quả.",
    "meta_keywords": "panadol, giảm đau, hạ sốt, đau đầu",
    "status": "active",
    "is_featured": 1,
    "is_hotsale": 1,
    "view_count": 0,
    "created_at": "2025-06-17 08:17:32",
    "updated_at": "2025-06-18 10:57:56",
    "brand_name": null,
    "supplier_name": "Công ty Dược phẩm Phân phối ABC",
    "variants": [
      {
        "id": 2,
        "product_id": 2,
        "sku": "PAN-EXT-BOX100",
        "unit_name": "Hộp",
        "packing_specs": "Hộp 10 vỉ x 10 viên",
        "price": "125000.00",
        "original_price": "130000.00",
        "barcode": null,
        "is_default": 1,
        "created_at": "2025-06-17 08:17:32",
        "updated_at": "2025-06-17 08:17:32"
      },
      {
        "id": 3,
        "product_id": 2,
        "sku": "PAN-EXT-VI10",
        "unit_name": "Vỉ",
        "packing_specs": "Vỉ 10 viên",
        "price": "13000.00",
        "original_price": null,
        "barcode": null,
        "is_default": 0,
        "created_at": "2025-06-17 08:17:32",
        "updated_at": "2025-06-17 08:17:32"
      }
    ],
    "images": [
      {
        "id": 2,
        "image_url": "/uploads/products/panadol-extra.jpg",
        "is_primary": 1
      }
    ],
    "categories_full_path": [
      {
        "category_id": 26,
        "category_name": "Amoxicillin",
        "category_slug": "amoxicillin",
        "subcategory_id": 25,
        "subcategory_name": "Thuốc kháng sinh",
        "subcategory_slug": "thuoc-khang-sinh",
        "maincategory_id": 24,
        "maincategory_name": "Thuốc",
        "maincategory_slug": "thuoc"
      }
    ],
    "category_ids": [26]
  }
};

// Định nghĩa Typescript cho dữ liệu
interface Variant { id: number; sku: string; unit_name: string; packing_specs: string; price: string; original_price: string | null; is_default: number; }
interface CategoryPath { maincategory_name: string; subcategory_name: string; category_name: string; }
interface ProductDetail {
    slug: string;
    name: string; registration_number: string; origin: string; description: string; ingredients: string; indications: string; contraindications: string; dosage_instructions: string; side_effects: string; precautions: string; storage_instructions: string; brand_name: string | null; supplier_name: string; variants: Variant[]; images: { image_url: string }[]; categories_full_path: CategoryPath[];
    rating?: number; reviewCount?: number; commentCount?: number;
}

const formatCurrency = (amount: number | string) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount));

//================================================================//
// 2. ĐỊNH NGHĨA CÁC COMPONENT CON
//================================================================//

const Breadcrumb = ({ name, path }: { name: string; path: CategoryPath }) => (
    <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1 text-sm text-gray-600 flex-wrap">
            <li><a href="" className="hover:underline">Trang chủ</a></li>
            <li><ChevronRight size={16} /></li>
            <li><a href="#" className="hover:underline">{path.maincategory_name}</a></li>
            <li><ChevronRight size={16} /></li>
            <li><a href="#" className="hover:underline">{path.subcategory_name}</a></li>
            <li><ChevronRight size={16} /></li>
            <li><a href="#" className="hover:underline">{path.category_name}</a></li>
            <li><ChevronRight size={16} /></li>
            <li className="font-semibold text-gray-800 truncate">{name}</li>
        </ol>
    </nav>
);

const ProductImageGallery = ({ images }: { images: { image_url: string }[] }) => {
    const [selectedImage, setSelectedImage] = useState(images[0].image_url);
    return (<div className="flex flex-col gap-4"><div className="aspect-square w-full relative border rounded-lg overflow-hidden bg-white"><Image src={selectedImage} alt="Product Image" fill className="object-contain p-4" /></div><div className="flex gap-3 justify-center">{images.map((img, index) => (<button key={index} onClick={() => setSelectedImage(img.image_url)} className={`w-16 h-16 relative border-2 rounded-md overflow-hidden transition-all ${selectedImage === img.image_url ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'}`}><Image src={img.image_url} alt={`Thumbnail ${index + 1}`} fill className="object-contain" /></button>))}</div></div>);
};

const QuantitySelector = () => {
    const [quantity, setQuantity] = useState(1);
    return (<div className="flex items-center"><Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="rounded-r-none h-10"><Minus className="h-4 w-4" /></Button><Input type="text" value={quantity} readOnly className="w-12 h-10 text-center rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 border-x-0" /><Button variant="outline" size="icon" onClick={() => setQuantity(q => q + 1)} className="rounded-l-none h-10"><Plus className="h-4 w-4" /></Button></div>);
};

const PurchaseBox = ({ selectedVariant }: { selectedVariant: Variant }) => (
    <div className="sticky top-6 p-4 border rounded-lg bg-white shadow-md">
        <p className="text-2xl font-bold text-red-600">
            {formatCurrency(selectedVariant.price)}
            <span className="text-base font-normal text-gray-600">/{selectedVariant.unit_name}</span>
            {selectedVariant.original_price && <span className="ml-3 text-base font-normal text-gray-400 line-through">{formatCurrency(selectedVariant.original_price)}</span>}
        </p>
        <div className="flex justify-between items-center mt-4"><span className="font-semibold">Số lượng</span><QuantitySelector /></div>
        <div className="flex flex-col gap-3 mt-4"><Button size="lg" className="w-full">Mua ngay</Button><Button variant="outline" size="lg" className="w-full">Thêm vào giỏ hàng</Button></div>
    </div>
);

//----- COMPONENT: Cụm thông tin song song với ảnh (ĐÃ CẬP NHẬT) -----//
const ProductTopInfo = ({ product, selectedVariant, onVariantChange }: { product: ProductDetail, selectedVariant: Variant, onVariantChange: (variantId: number) => void }) => {
    
    const summary = useMemo(() => [
        { label: "Danh mục", value: product.categories_full_path[0]?.category_name || 'Đang cập nhật', isLink: true },
        { label: "Số đăng ký", value: product.registration_number },
        { label: "Quy cách", value: selectedVariant.packing_specs },
        { label: "Xuất xứ thương hiệu", value: product.origin },
        { label: "Nhà sản xuất", value: product.supplier_name },
        { label: "Thành phần", value: product.ingredients, isLink: true },
        { label: "Mô tả sản phẩm", value: product.description, isLink: false },
    ], [product, selectedVariant]);

    return (
        <div>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                <div className="flex flex-col gap-x-3 text-sm text-gray-500 mt-2 flex-wrap">
                    <span>Thương hiệu: <a href="#" className="text-blue-600">{product.brand_name || 'Đang cập nhật'}</a></span>
                    <span>SKU: {selectedVariant.sku}</span>
                    {product.rating && <span> <span className="font-semibold text-gray-800">{product.rating}</span><Star size={16} className="text-yellow-400 fill-yellow-400 inline-block ml-1" /></span>}
                </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
                 <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium text-gray-500">Chọn đơn vị tính</span>
                    <div className="flex gap-2">
                        {product.variants.map(variant => (
                            <Button key={variant.id} onClick={() => onVariantChange(variant.id)} variant="outline" className={`rounded-full ${variant.id === selectedVariant.id ? 'border-blue-500 border-2 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-300'}`}>{variant.unit_name}</Button>
                        ))}
                    </div>
                </div>
                {summary.map((item) => (
                    <div key={item.label} className="grid grid-cols-10 gap-4 text-sm">
                        <dt className="col-span-4 text-gray-500">{item.label}</dt>
                        <dd className={`col-span-6 ${item.isLink ? 'text-blue-600 hover:underline cursor-pointer' : 'text-gray-800'}`}>{item.value}</dd>
                    </div>
                ))}
            </div>
        </div>
    );
};

//----- COMPONENT: Nội dung chi tiết dạng Tabs (ĐÃ CẬP NHẬT) -----//
const ProductDetailsTabs = ({ product }: { product: ProductDetail }) => {
    // Tab "Mô tả" đã được loại bỏ
    const tabs = useMemo(() => [
        { id: 'indications', title: 'Chỉ định', content: <p>{product.indications}</p>},
        { id: 'dosage', title: 'Liều dùng & Cách dùng', content: <p>{product.dosage_instructions}</p>},
        { id: 'contraindications', title: 'Chống chỉ định', content: <p>{product.contraindications}</p>},
        { id: 'side_effects', title: 'Tác dụng phụ', content: <p>{product.side_effects}</p>},
        { id: 'precautions', title: 'Thận trọng', content: <p>{product.precautions}</p>},
        { id: 'storage', title: 'Bảo quản', content: <p>{product.storage_instructions}</p>},
    ], [product]);
    
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    return (<div><div className="border-b border-gray-200"><div className="flex space-x-6 overflow-x-auto">
        {tabs.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-3 text-base font-semibold transition-colors shrink-0 ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>{tab.title}</button>))}
    </div></div><div className="py-6"><div className="prose max-w-none text-gray-800 leading-relaxed">{tabs.find(t => t.id === activeTab)?.content}</div></div></div>);
};


//================================================================//
// 3. COMPONENT TRANG CHÍNH
//================================================================//
export default function ProductDetailPage() {
    const productData = apiResponse.data;

    const [selectedVariant, setSelectedVariant] = useState<Variant>(
        () => productData.variants.find(v => v.is_default === 1) || productData.variants[0]
    );
    
    const handleVariantChange = (variantId: number) => {
        const newVariant = productData.variants.find(v => v.id === variantId);
        if (newVariant) { setSelectedVariant(newVariant); }
    };
    
    const displayData: ProductDetail = { ...productData, rating: 5 };

    return (
        <div className="bg-white">
            <main className="container mx-auto px-4 py-6">
                {displayData.categories_full_path[0] && <Breadcrumb name={displayData.name} path={displayData.categories_full_path[0]} />}
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 xl:gap-12">
                    <div className="lg:col-span-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div><ProductImageGallery images={displayData.images} /></div>
                            <div><ProductTopInfo product={displayData} selectedVariant={selectedVariant} onVariantChange={handleVariantChange} /></div>
                        </div>
                        <Separator className="my-10" />
                        <ProductDetailsTabs product={displayData} />
                    </div>
                    <div className="lg:col-span-2">
                        <PurchaseBox selectedVariant={selectedVariant} />
                    </div>
                </div>
            </main>
        </div>
    );
}