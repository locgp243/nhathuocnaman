'use client';
import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Minus, Plus, Star, ShoppingCart, Info, CheckCircle } from "lucide-react";

//================================================================//
// 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU (Bổ sung kiểu cho sản phẩm liên quan)
//================================================================//
// Các interface này khớp với cấu trúc JSON đã được làm giàu,
// đảm bảo không có trường dữ liệu nào bị bỏ sót.

interface Variant {
    id: number;
    sku: string;
    unit_name: string;
    packing_specs: string;
    price: string;
    original_price: string | null;
    is_default: number;
    barcode: string | null;
}

interface ImageType {
    id: number;
    image_url: string;
    is_primary: number;
}

interface CategoryPath {
    maincategory_id: number | null;
    maincategory_name: string | null;
    maincategory_slug: string | null;
    subcategory_id: number | null;
    subcategory_name: string | null;
    subcategory_slug: string | null;
    category_id: number;
    category_name: string;
    category_slug: string;
}

interface ProductDetail {
    id: number;
    slug: string;
    name: string;
    description: string;
    ingredients: string;
    indications: string;
    contraindications: string;
    dosage_instructions: string;
    side_effects: string;
    precautions: string;
    storage_instructions: string;
    brand_name: string | null;
    supplier_name: string;
    variants: Variant[];
    images: ImageType[];
    categories_full_path: CategoryPath[];
    rating?: number;
    reviewCount?: number;
    stock_status?: 'in_stock' | 'out_of_stock' | 'pre_order';
    registration_number?: string;
    origin?: string;
}

// *** MỚI: Kiểu dữ liệu cho thẻ sản phẩm trong danh sách liên quan ***
interface ProductCardType {
    id: number;
    slug: string;
    name: string;
    image_url: string; // Chỉ cần ảnh chính
    price: string;
    original_price: string | null;
    unit_name: string; // Đơn vị tính của variant mặc định
    category_id: number;
    category_name: string;
}

// *** MỚI: Kiểu dữ liệu cho nút lọc danh mục ***
interface CategoryFilterType {
    id: number;
    name: string;
}


// Helper function định dạng tiền tệ
const formatCurrency = (amount: number | string) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount)).replace(/\s/g, '');


//================================================================//
// 2. CÁC COMPONENT CON (Giữ nguyên và bổ sung)
//================================================================//

//--- Component Skeleton Loader ---//
const ProductPageSkeleton = () => (
    <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 xl:gap-12">
            <div className="lg:col-span-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Image Skeleton */}
                    <div className="flex flex-col gap-4">
                        <div className="aspect-square w-full bg-gray-200 rounded-lg"></div>
                        <div className="flex gap-3 justify-center">
                            <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
                            <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
                            <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
                        </div>
                    </div>
                    {/* Info Skeleton */}
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-300 rounded w-full"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-px bg-gray-200 my-5"></div>
                        <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                        <div className="space-y-3 pt-4">
                            <div className="h-6 bg-gray-200 rounded w-full"></div>
                            <div className="h-6 bg-gray-200 rounded w-full"></div>
                            <div className="h-6 bg-gray-200 rounded w-full"></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Purchase Box Skeleton */}
            <div className="lg:col-span-2">
                <div className="hidden lg:block p-5 border rounded-lg bg-white space-y-4">
                    <div className="h-10 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="h-12 bg-gray-200 rounded w-full"></div>
                    <div className="h-12 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
        </div>
    </div>
);

//--- Component Breadcrumb (Logic hoàn chỉnh) ---//
const Breadcrumb = ({ name, path }: { name: string; path: CategoryPath }) => (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <ol className="flex items-center gap-1.5 text-gray-500 flex-wrap">
            <li><Link href="/" className="hover:text-blue-600 hover:underline">Trang chủ</Link></li>

            {/* Cấp 1: Main Category */}
            {path.maincategory_name && path.maincategory_slug && (
                <>
                    <li><ChevronRight size={16} /></li>
                    <li><Link href={`/danh-muc/${path.maincategory_slug}`} className="hover:text-blue-600 hover:underline">{path.maincategory_name}</Link></li>
                </>
            )}

            {/* Cấp 2: Sub Category */}
            {path.subcategory_name && path.subcategory_slug && (
                 <>
                    <li><ChevronRight size={16} /></li>
                    <li><Link href={`/danh-muc/${path.subcategory_slug}`} className="hover:text-blue-600 hover:underline">{path.subcategory_name}</Link></li>
                </>
            )}

            {/* Cấp 3: Category cuối */}
             {path.category_name && path.category_slug && (
                 <>
                    <li><ChevronRight size={16} /></li>
                    <li><Link href={`/danh-muc/${path.category_slug}`} className="hover:text-blue-600 hover:underline">{path.category_name}</Link></li>
                </>
            )}

            {/* Tên sản phẩm */}
            <li><ChevronRight size={16} /></li>
            <li className="font-medium text-gray-700 truncate" title={name}>{name}</li>
        </ol>
    </nav>
);

//--- Component Thư viện ảnh (Logic hoàn chỉnh) ---//
const ProductImageGallery = ({ images, productName }: { images: ImageType[], productName: string }) => {
    const initialImage = useMemo(() => images.find(img => img.is_primary === 1) || images[0], [images]);
    const [selectedImage, setSelectedImage] = useState(initialImage?.image_url);

    useEffect(() => {
        setSelectedImage(initialImage?.image_url);
    }, [initialImage]);

    if (!initialImage) return <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500">Không có ảnh sản phẩm</div>;

    return (
        <div className="flex flex-col gap-4">
            <div className="aspect-square w-full relative border rounded-lg overflow-hidden group bg-gray-50">
                <Image
                    src={`https://nhathuoc.trafficnhanh.com/${selectedImage!}`}
                    alt={`Ảnh sản phẩm ${productName}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                />
            </div>
            {/* Chỉ hiển thị dải thumbnail nếu có nhiều hơn 1 ảnh */}
            {images.length > 1 && (
                <div className="flex gap-3 -mx-4 px-4 overflow-x-auto pb-2">
                    {images.map((img) => (
                        <button
                            key={img.id}
                            onClick={() => setSelectedImage(img.image_url)}
                            className={`w-20 h-20 relative border-2 rounded-md overflow-hidden transition-all shrink-0 ${selectedImage === img.image_url ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200 hover:border-blue-400'}`}
                        >
                            <Image src={`https://nhathuoc.trafficnhanh.com/${img.image_url}`} alt={`Thumbnail ${img.id}`} fill className="object-contain p-1" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

//--- Component Chọn số lượng (Hoàn chỉnh) ---//
const QuantitySelector = ({ value, onChange }: { value: number, onChange: (value: number) => void }) => (
    <div className="flex items-center">
        <Button variant="outline" size="icon" onClick={() => onChange(Math.max(1, value - 1))} className="rounded-r-none h-10 shadow-sm">
            <Minus className="h-4 w-4" />
        </Button>
        <Input type="text" value={value} readOnly className="w-12 h-10 text-center rounded-none focus-visible:ring-transparent focus-visible:ring-offset-0 border-y-gray-300 border-x-0"/>
        <Button variant="outline" size="icon" onClick={() => onChange(value + 1)} className="rounded-l-none h-10 shadow-sm">
            <Plus className="h-4 w-4" />
        </Button>
    </div>
);


//--- Component Thông tin chính của sản phẩm (Bổ sung hiển thị đầy đủ) ---//
const ProductTopInfo = ({ product, selectedVariant, onVariantChange }: { product: ProductDetail, selectedVariant: Variant, onVariantChange: (variantId: number) => void }) => (
    <div className="flex flex-col">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
        <div className="flex items-center gap-x-4 text-sm text-gray-500 mt-3 flex-wrap">
            <span>Thương hiệu: <Link href="#" className="text-blue-600 hover:underline font-medium">{product.brand_name || 'Đang cập nhật'}</Link></span>
            <Separator orientation='vertical' className='h-4' />
            <span>SKU: {selectedVariant.sku || 'N/A'}</span>
            {product.rating && product.reviewCount && (
                <span className='flex items-center gap-1.5'>
                    <Separator orientation='vertical' className='h-4' />
                    <span className="font-semibold text-gray-800">{product.rating}</span>
                    <Star size={15} className="text-yellow-400 fill-yellow-400" />
                    <a href="#reviews" className='text-gray-500 hover:underline'>({product.reviewCount} đánh giá)</a>
                </span>
            )}
        </div>
        <Separator className="my-5" />
        <div className="space-y-4">
            <div className="flex items-start gap-4">
                <span className="font-semibold text-gray-700 text-sm min-w-[90px] pt-1.5">Loại</span>
                <div className="flex gap-2 flex-wrap">
                    {product.variants.map(variant => (
                        <Button key={variant.id} onClick={() => onVariantChange(variant.id)} variant="outline" className={`rounded-lg transition-all duration-200 ${variant.id === selectedVariant.id ? 'border-blue-600 border-2 bg-blue-50 text-blue-700 font-semibold shadow-sm' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}>
                            {variant.unit_name}
                        </Button>
                    ))}
                </div>
            </div>
             <div className='mt-4 border-t border-gray-200'>
                <dl className="divide-y divide-gray-200">
                    <div className="grid grid-cols-3 gap-4 px-1 py-3 text-sm"><dt className="text-gray-500">Quy cách</dt><dd className="col-span-2 text-gray-800 font-medium">{selectedVariant.packing_specs || 'Đang cập nhật'}</dd></div>
                    <div className="grid grid-cols-3 gap-4 px-1 py-3 text-sm"><dt className="text-gray-500">Số đăng ký</dt><dd className="col-span-2 text-gray-800 font-medium">{product.registration_number || 'Đang cập nhật'}</dd></div>
                    <div className="grid grid-cols-3 gap-4 px-1 py-3 text-sm"><dt className="text-gray-500">Xuất xứ</dt><dd className="col-span-2 text-gray-800 font-medium">{product.origin || 'Đang cập nhật'}</dd></div>
                    <div className="grid grid-cols-3 gap-4 px-1 py-3 text-sm"><dt className="text-gray-500">Nhà cung cấp</dt><dd className="col-span-2 text-gray-800 font-medium">{product.supplier_name || 'Đang cập nhật'}</dd></div>
                </dl>
             </div>
        </div>
    </div>
);


//--- Component Tab chi tiết (Hoàn chỉnh) ---//
const ProductDetailsTabs = ({ product }: { product: ProductDetail }) => {
    const tabs = useMemo(() => [
        { id: 'description', title: 'Mô tả', content: product.description },
        { id: 'indications', title: 'Chỉ định', content: product.indications },
        { id: 'dosage', title: 'Liều dùng', content: product.dosage_instructions },
        { id: 'side_effects', title: 'Tác dụng phụ', content: product.side_effects },
        { id: 'precautions', title: 'Thận trọng', content: product.precautions },
        { id: 'storage', title: 'Bảo quản', content: product.storage_instructions },
    ].filter(tab => tab.content && tab.content.trim() !== ''), [product]);

    const [activeTab, setActiveTab] = useState(tabs[0]?.id);

    useEffect(() => {
        // Reset active tab if the product changes and the old active tab no longer exists
        if (!tabs.find(t => t.id === activeTab)) {
            setActiveTab(tabs[0]?.id);
        }
    }, [tabs, activeTab]);

    if (!activeTab) return null;

    return (
        <div>
            <div className="border-b border-gray-200">
                <div className="flex space-x-1 sm:space-x-4 overflow-x-auto -mb-px">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-3 px-3 text-sm sm:text-base font-semibold transition-colors shrink-0 ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-gray-300'}`}>
                            {tab.title}
                        </button>
                    ))}
                </div>
            </div>
            <div className="py-6">
                <div className="prose prose-base max-w-none text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: tabs.find(t => t.id === activeTab)?.content || '' }}/>
            </div>
        </div>
    );
};


//--- Component Card Mua hàng (Hoàn chỉnh) ---//
const PurchaseCard = ({ product, selectedVariant, quantity, onQuantityChange }: { product: ProductDetail, selectedVariant: Variant, quantity: number, onQuantityChange: (value: number) => void }) => {
    const price = Number(selectedVariant.price);
    const originalPrice = selectedVariant.original_price ? Number(selectedVariant.original_price) : null;
    const discountPercent = originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    const savings = originalPrice && originalPrice > price ? originalPrice - price : 0;
    const isInStock = product.stock_status === 'in_stock';

    const handleAddToCart = () => { console.log(`Đã thêm ${quantity} x ${selectedVariant.unit_name} (${product.name}) vào giỏ`); };
    const handleBuyNow = () => { console.log(`Mua ngay ${quantity} x ${selectedVariant.unit_name} (${product.name})`); };

    return (
        <>
            {/* --- Box cho Desktop --- */}
            <div className="hidden lg:block sticky top-6 p-5 border rounded-lg bg-white shadow-lg">
                <div className="flex justify-between items-baseline">
                    <p className="text-3xl font-bold text-red-600">{formatCurrency(price)}</p>
                    {discountPercent > 0 && <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">-{discountPercent}%</span>}
                </div>
                {originalPrice && (
                    <div className="mt-1">
                        <span className="text-base text-gray-400 line-through">{formatCurrency(originalPrice)}</span>
                        {savings > 0 && <span className="ml-2 text-sm text-gray-600 font-medium">(Tiết kiệm {formatCurrency(savings)})</span>}
                    </div>
                )}
                <div className="text-lg font-medium text-gray-700 mt-1">/ {selectedVariant.unit_name}</div>
                <Separator className='my-4' />
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Số lượng</span>
                    <QuantitySelector value={quantity} onChange={onQuantityChange} />
                </div>
                {isInStock ? (
                     <div className="flex items-center gap-2 text-sm text-green-600 mt-4">
                        <CheckCircle size={16}/> Tình trạng: <span className="font-bold">Còn hàng</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-sm text-red-600 mt-4">
                        <Info size={16}/> Tình trạng: <span className="font-bold">Tạm hết hàng</span>
                    </div>
                )}
                <div className="flex flex-col gap-3 mt-4">
                    <Button size="lg" className="w-full h-12 text-lg font-semibold" onClick={handleBuyNow} disabled={!isInStock}>Mua ngay</Button>
                    <Button variant="outline" size="lg" className="w-full h-12 text-lg font-semibold flex items-center gap-2" onClick={handleAddToCart} disabled={!isInStock}>
                        <ShoppingCart className="h-5 w-5" />
                        Thêm vào giỏ hàng
                    </Button>
                </div>
            </div>

            {/* --- Thanh cho Mobile --- */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-3 shadow-top-lg z-50">
                 <div className="flex justify-between items-center gap-3">
                    <QuantitySelector value={quantity} onChange={onQuantityChange} />
                    <Button size="lg" className="flex-grow h-12" onClick={handleAddToCart} disabled={!isInStock}>
                         <ShoppingCart className="h-5 w-5 mr-2" /> Thêm vào giỏ
                    </Button>
                 </div>
            </div>
        </>
    );
};

//================================================================//
// 3. *** MỚI: CÁC COMPONENT CHO SẢN PHẨM LIÊN QUAN ***
//================================================================//

//--- Component Thẻ Sản Phẩm cho lưới sản phẩm liên quan ---//
const ProductCard = ({ product }: { product: ProductCardType }) => {
    const price = Number(product.price);
    const originalPrice = product.original_price ? Number(product.original_price) : null;
    const hasDiscount = originalPrice && originalPrice > price;

    return (
        <div className="group flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
            <Link href={`/san-pham/${product.slug}`} className="block overflow-hidden p-4 relative">
                 {hasDiscount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full z-10">
                        - {Math.round(((originalPrice - price) / originalPrice) * 100)}%
                    </div>
                )}
                <div className="relative aspect-square">
                     <Image
                        src={`https://nhathuoc.trafficnhanh.com/${product.image_url}`}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            </Link>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-base font-semibold text-gray-800 h-12 overflow-hidden">
                    <Link href={`/san-pham/${product.slug}`} className="hover:text-blue-600 line-clamp-2">{product.name}</Link>
                </h3>
                <div className="mt-auto pt-4">
                    <div className="flex flex-col items-start">
                        <span className="text-lg font-bold text-red-600">{formatCurrency(price)}</span>
                        {hasDiscount && (
                             <span className="text-sm text-gray-400 line-through">{formatCurrency(originalPrice)}</span>
                        )}
                        <span className="text-sm text-gray-500 mt-1">/ {product.unit_name}</span>
                    </div>
                    <Button className="w-full mt-3" variant="outline">Chọn mua</Button>
                </div>
            </div>
        </div>
    );
};


//--- Component Khung Sản phẩm liên quan (Gồm logic fetch và filter) ---//
const RelatedProducts = ({ currentProduct }: { currentProduct: ProductDetail }) => {
    const [allProducts, setAllProducts] = useState<ProductCardType[]>([]);
    const [categories, setCategories] = useState<CategoryFilterType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Lấy ID danh mục chính của sản phẩm hiện tại để fetch các sản phẩm liên quan
        const mainCategoryId = currentProduct.categories_full_path[0]?.maincategory_id;
        if (!mainCategoryId) {
            setIsLoading(false);
            return;
        }

        const fetchRelatedProducts = async () => {
            setIsLoading(true);
            try {
                // Giả lập gọi API, thay bằng API thật của bạn
                // Ví dụ: Lấy 20 sản phẩm cùng danh mục chính
                const response = await fetch(`https://nhathuoc.trafficnhanh.com/products.php?action=doc_danh_sach&maincategory_id=${mainCategoryId}&limit=20`);
                const result = await response.json();

                if (result.success && Array.isArray(result.data)) {
                    // Lọc bỏ sản phẩm hiện tại khỏi danh sách liên quan
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const related = result.data.filter((p: any) => p.id !== currentProduct.id);
                    setAllProducts(related);

                    // Trích xuất các danh mục con độc nhất từ danh sách sản phẩm liên quan
                    const uniqueCategories = related.reduce((acc: Map<number, string>, product: ProductCardType) => {
                        if (product.category_id && product.category_name) {
                            acc.set(product.category_id, product.category_name);
                        }
                        return acc;
                    }, new Map());

                    const categoryFilters: CategoryFilterType[] = Array.from(uniqueCategories, ([id, name]) => ({ id, name }));
                    setCategories(categoryFilters);
                }
            } catch (error) {
                console.error("Failed to fetch related products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRelatedProducts();
    }, [currentProduct]);

    // Lọc sản phẩm dựa trên danh mục được chọn
    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'all') {
            return allProducts;
        }
        return allProducts.filter(p => p.category_id === selectedCategory);
    }, [selectedCategory, allProducts]);

    if (isLoading) {
        return (
             <div className="container mx-auto px-4 py-8">
                 <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                     {Array.from({ length: 6 }).map((_, i) => (
                         <div key={i} className="border rounded-lg bg-white p-4 space-y-3">
                             <div className="aspect-square bg-gray-200 rounded"></div>
                             <div className="h-5 bg-gray-200 rounded w-full"></div>
                             <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                             <div className="h-6 bg-gray-200 rounded w-1/2 mt-4"></div>
                         </div>
                     ))}
                 </div>
             </div>
        );
    }
    
    // Chỉ hiển thị section nếu có sản phẩm liên quan
    if (filteredProducts.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-50/70">
            <div className="container mx-auto px-4 py-10 md:py-16">
                 <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Sản phẩm liên quan</h2>

                {/* Bộ lọc theo danh mục */}
                {categories.length > 1 && (
                     <div className="mb-8 flex items-center flex-wrap gap-2">
                         <Button
                            onClick={() => setSelectedCategory('all')}
                            variant={selectedCategory === 'all' ? 'default' : 'outline'}
                            className="rounded-full"
                        >
                            Tất cả
                        </Button>
                         {categories.map(cat => (
                             <Button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                                className="rounded-full"
                            >
                                {cat.name}
                            </Button>
                         ))}
                     </div>
                )}
                 
                 {/* Lưới sản phẩm */}
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                     {filteredProducts.slice(0, 12).map(product => ( // Giới hạn hiển thị 12 sản phẩm
                         <ProductCard key={product.id} product={product} />
                     ))}
                 </div>
            </div>
        </div>
    );
};


//================================================================//
// 4. COMPONENT TRANG CHÍNH (Hoàn chỉnh, đã tích hợp)
//================================================================//
type Props = {
  params: {
    slug: string;
  };
  // Bạn cũng có thể thêm searchParams nếu cần
  // searchParams: { [key: string]: string | string[] | undefined };
};

export default function ProductDetailPage({ params }: Props) {
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { slug } = params;

    const productId = 1; // Lấy từ URL params trong ứng dụng thực tế
    console.log(`Fetching product with ID: ${slug}`);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                // URL API thật của bạn
                const response = await fetch(`https://nhathuoc.trafficnhanh.com/products.php?action=doc_chi_tiet&slug=${slug}`);

                const result = await response.json();
                if (result.success && result.data) {
                    // Thêm dữ liệu giả cho các trường mới để test UI
                     const mockData: ProductDetail = {
                        ...result.data,
                        rating: 4.8,
                        reviewCount: 25,
                        stock_status: 'in_stock',
                        registration_number: 'VN-12345-23',
                        origin: 'Việt Nam'
                    };
                    setProduct(mockData);
                    const defaultVariant = mockData.variants.find((v: Variant) => v.is_default === 1) || mockData.variants[0];
                    setSelectedVariant(defaultVariant);
                } else {
                    throw new Error(result.message || 'Không thể lấy dữ liệu sản phẩm.');
                }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleVariantChange = (variantId: number) => {
        const newVariant = product?.variants.find(v => v.id === variantId);
        if (newVariant) setSelectedVariant(newVariant);
    };

    if (isLoading) {
        return <ProductPageSkeleton />;
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-red-50 text-center p-4">
                <h2 className="text-xl font-bold text-red-700 mb-2">Đã xảy ra lỗi khi tải sản phẩm</h2>
                <p className="text-red-600">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-6">Thử lại</Button>
            </div>
        );
    }

    if (!product || !selectedVariant) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold text-gray-600">Không tìm thấy thông tin sản phẩm.</p>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <main className="container mx-auto px-4 py-6 md:py-8">
                {product.categories_full_path[0] && (
                    <Breadcrumb name={product.name} path={product.categories_full_path[0]} />
                )}
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-x-8 gap-y-10 xl:gap-x-12">
                    {/* Cột trái: Thông tin chính */}
                    <div className="lg:col-span-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ProductImageGallery images={product.images} productName={product.name} />
                            <ProductTopInfo product={product} selectedVariant={selectedVariant} onVariantChange={handleVariantChange}/>
                        </div>
                        <Separator className="my-8 md:my-10" />
                        <ProductDetailsTabs product={product} />
                    </div>

                    {/* Cột phải (Desktop) & Thanh dưới (Mobile) */}
                    <div className="lg:col-span-2">
                        <PurchaseCard product={product} selectedVariant={selectedVariant} quantity={quantity} onQuantityChange={setQuantity}/>
                    </div>
                </div>
            </main>

             {/* *** MỚI: Tích hợp Section Sản phẩm liên quan *** */}
             <div className="mt-8 lg:mt-12 pb-24 lg:pb-0">
                <RelatedProducts currentProduct={product} />
             </div>
        </div>
    );
}