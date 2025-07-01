'use client';

import { useState, useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

// MỚI: Import các hook và type cần thiết
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Product, Variant } from '@/types/product';

// INTERFACES ĐÃ ĐƯỢC CẬP NHẬT VÀ CHUẨN HÓA
interface BreadcrumbItemType {
    title: string;
    href?: string;
}

interface Subcategory {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
}

interface CategoryData {
    categoryInfo: { name: string; slug: string; };
    breadcrumb: BreadcrumbItemType[];
    products: Product[];
}

interface ApiResponse {
    success: boolean;
    data?: CategoryData;
    message?: string;
}

// HÀM TIỆN ÍCH
const formatCurrency = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice)) return '0₫';
    return numericPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '₫';
};


// ===================================================================
// === COMPONENT CON - ĐÃ TÍCH HỢP GIỎ HÀNG ==========================
// ===================================================================

function ProductCard({ product }: { product: Product }) {
    // MỚI: Tích hợp hook để sử dụng giỏ hàng và điều hướng
    const router = useRouter();
    const { addToCart } = useCart();

    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
        // Chọn variant mặc định thông minh hơn
        product.variants?.find(v => v.is_default === 1) || product.variants?.[0] || null
    );

    // MỚI: Hàm xử lý thêm vào giỏ hàng
    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn không cho Link của card điều hướng trang

        if (!selectedVariant) {
            toast.error("Vui lòng chọn một loại sản phẩm.");
            return;
        }

        const primaryImageObject = product.images?.find(img => img.is_primary) || product.images?.[0];
        const imageUrl = primaryImageObject ? `https://nhathuoc.trafficnhanh.com${primaryImageObject.image_url}` : "/placeholder.svg";

        const itemToAdd = {
            productId: String(product.id),
            variantId: String(selectedVariant.id),
            name: product.name,
            image: imageUrl,
            price: Number(selectedVariant.price),
            quantity: 1,
            type: selectedVariant.unit_name,
        };

        addToCart(itemToAdd);

        toast.success("Đã thêm vào giỏ hàng!", {
            description: `${product.name} (${selectedVariant.unit_name})`,
            action: {
                label: "Xem giỏ",
                onClick: () => router.push('/gio-hang'),
            },
        });
    };

    // Logic hiển thị không đổi
    const domain = "https://nhathuoc.trafficnhanh.com";
    const placeholderProduct = "/placeholder.svg";
    const primaryImageObject = product.images?.find(img => img.is_primary) || product.images?.[0];
    const primaryImage = primaryImageObject ? `${domain}${primaryImageObject.image_url}` : placeholderProduct;

    const price = selectedVariant ? parseFloat(selectedVariant.price) : 0;
    const originalPrice = selectedVariant ? parseFloat(selectedVariant.original_price) : 0;
    const discountPercent = (originalPrice > 0 && originalPrice > price) ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    const availableTypes = product.variants ? [...new Set(product.variants.map(v => v.unit_name))] : [];

    return (
        <Card className="flex flex-col justify-between w-full h-full rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300 group">
            <CardContent className="p-0 relative">
                <Link href={`/san-pham/${product.slug}`} className="block">
                    <div className="aspect-square w-full relative overflow-hidden bg-gray-100">
                        <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 20vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.currentTarget.src = placeholderProduct; }}
                        />
                    </div>
                </Link>

                <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                    <div className="flex flex-col space-y-1">
                        {discountPercent > 0 && (
                            <Badge variant="destructive" className="text-xs font-bold">-{discountPercent}%</Badge>
                        )}
                        {product.is_hotsale === 1 && (
                            <Badge className="bg-green-100 text-green-700 border-green-300 text-xs font-semibold">Hot Sale</Badge>
                        )}
                    </div>
                    {product.brand_name && (
                        <Badge variant="secondary" className="text-xs">{product.brand_name}</Badge>
                    )}
                </div>

                <div className="p-3">
                    <Link href={`/san-pham/${product.slug}`} className="block">
                        <h3 className="text-sm font-semibold text-gray-800 h-12 overflow-hidden text-ellipsis line-clamp-2 hover:text-blue-600">
                            {product.name}
                        </h3>
                    </Link>

                    {availableTypes.length > 1 && (
                        <div className="mt-2 mb-2 h-[28px] overflow-hidden">
                            <div className="flex flex-wrap gap-1">
                                {availableTypes.map((type) => {
                                    const variant = product.variants?.find(v => v.unit_name === type);
                                    return (
                                        <Button
                                            key={type}
                                            variant={selectedVariant?.unit_name === type ? "default" : "outline"}
                                            size="sm"
                                            className={`px-2 py-0 h-6 text-xs ${selectedVariant?.unit_name === type ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-700 border-gray-300"}`}
                                            onClick={(e) => { e.stopPropagation(); if (variant) setSelectedVariant(variant); }}
                                        >
                                            {type}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="mt-2 flex flex-col items-start h-[48px]">
                        {selectedVariant && (
                            <>
                                <span className="text-lg font-bold text-blue-600">
                                    {formatCurrency(price)}
                                    <span className="text-gray-600 font-normal text-sm"> / {selectedVariant.unit_name}</span>
                                </span>
                                {discountPercent > 0 && (
                                    <span className="text-xs text-gray-500 line-through">{formatCurrency(originalPrice)}</span>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-3 pt-0">
                {/* THAY ĐỔI: Cập nhật nút bấm */}
                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    onClick={handleAddToCart}
                >
                    Thêm vào giỏ hàng
                </Button>
            </CardFooter>
        </Card>
    );
}


function SubCategoryMenu({ categories, parentPath }: { categories: Subcategory[]; parentPath: string; }) {
    const domain = "https://nhathuoc.trafficnhanh.com";
    return (
        <div className="mb-6">
            <div className="flex flex-wrap gap-3">
                {categories.filter(cat => cat && cat.slug).map((cat) => {
                    const hasValidIcon = cat.icon && typeof cat.icon === 'string' && cat.icon.trim() !== '';
                    const iconSrc = hasValidIcon ? `${domain}${cat.icon}` : '/placeholder.svg';
                    const href = parentPath === '/' ? `/${cat.slug}` : `${parentPath}/${cat.slug}`;

                    return (
                        <Link key={cat.id} href={href} className="flex flex-col items-center justify-center p-2 border rounded-lg w-28 h-24 text-center text-xs font-medium transition-colors bg-white border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50">
                            <div className="w-10 h-10 relative mb-1">
                                <Image src={iconSrc} alt={cat.name} fill className="object-contain" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
                            </div>
                            <span className="leading-tight">{cat.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

function ProductFilters() {
    // Component không đổi
    const brands = ["Blackmores", "OstroVit", "Healthy Care", "Swisse", "Puritan's Pride"];
    const priceRanges = ["Dưới 100.000đ", "100.000đ - 200.000đ", "200.000đ - 500.000đ", "Trên 500.000đ"];
    return (
        <div className="w-full rounded-lg border bg-white shadow-sm">
            <div className="p-4">
                <h3 className="text-base font-bold mb-2">Bộ lọc nâng cao</h3>
                <Accordion type="multiple" defaultValue={['price', 'brand']} className="w-full">
                    <AccordionItem value="price"><AccordionTrigger className="text-sm font-semibold">Giá</AccordionTrigger>
                        <AccordionContent>
                            <RadioGroup defaultValue="range-2" className="space-y-3 pt-2">
                                {priceRanges.map((range, i) => (<div key={i} className="flex items-center space-x-2"><RadioGroupItem value={range} id={range} /><Label htmlFor={range} className="font-normal cursor-pointer">{range}</Label></div>))}
                            </RadioGroup>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="brand"><AccordionTrigger className="text-sm font-semibold">Thương hiệu</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3 pt-2">
                                {brands.map((brand) => (<div key={brand} className="flex items-center space-x-2"><Checkbox id={brand} /><Label htmlFor={brand} className="font-normal cursor-pointer">{brand}</Label></div>))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}


function ProductGrid({ products, title }: { products: Product[]; title: string; }) {
    // Component không đổi
    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 p-4 bg-white rounded-lg border">
                <h1 className="text-lg font-bold text-gray-900 mb-2 md:mb-0">{title} ({products.length} sản phẩm)</h1>
                <div className="flex items-center space-x-2">
                    <Label htmlFor="sort-by" className="text-sm text-gray-600 shrink-0">Sắp xếp theo</Label>
                    <Select defaultValue="popular">
                        <SelectTrigger id="sort-by" className="w-[180px] bg-white"><SelectValue placeholder="Phổ biến" /></SelectTrigger>
                        <SelectContent><SelectItem value="popular">Phổ biến</SelectItem><SelectItem value="price-asc">Giá: Tăng dần</SelectItem><SelectItem value="price-desc">Giá: Giảm dần</SelectItem><SelectItem value="newest">Mới nhất</SelectItem></SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
                {products.map((product) => (<ProductCard key={product.id} product={product} />))}
            </div>
        </div>
    );
}


function CustomBreadcrumb({ items }: { items: BreadcrumbItemType[] }) {
    // Component không đổi, đổi tên để tránh xung đột
    return (
        <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-gray-600 flex-wrap">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-1">
                        {index > 0 && <ChevronRight size={16} />}
                        {index === items.length - 1 || !item.href ? (<span className="font-semibold text-gray-800">{item.title}</span>) : (<Link href={item.href} className="hover:underline">{item.title}</Link>)}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

// ===================================================================
// === COMPONENT CHÍNH CỦA TRANG =======================================
// ===================================================================

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [pageTitle, setPageTitle] = useState<string>('');
    const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItemType[]>([]);
    const [subCategories, setSubCategories] = useState<Subcategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const params = useParams();
    const pathname = usePathname();

    const getCurrentSlug = () => {
        if (!params) return '';
        if (typeof params.itemslug === 'string') return params.itemslug;
        if (typeof params.subslug === 'string') return params.subslug;
        if (Array.isArray(params.slug)) return params.slug[params.slug.length - 1];
        if (typeof params.slug === 'string') return params.slug;
        return '';
    };
 
    const currentSlug = getCurrentSlug();

    useEffect(() => {
        if (!currentSlug) {
            setIsLoading(false);
            setError("Không thể xác định danh mục từ URL.");
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [mainDataRes, subCategoriesRes] = await Promise.all([
                    fetch(`https://nhathuoc.trafficnhanh.com/products.php?action=lay_du_lieu_danh_muc&category_slug=${currentSlug}`),
                    fetch(`https://nhathuoc.trafficnhanh.com/categories.php?action=doc_danh_muc_con&slug=${currentSlug}`)
                ]);
            
                if (!mainDataRes.ok) throw new Error(`Lỗi API dữ liệu chính: ${mainDataRes.statusText}`);
                const mainResult: ApiResponse = await mainDataRes.json();
                if (!mainResult.success || !mainResult.data) throw new Error(mainResult.message || 'API chính trả về lỗi.');

                const { categoryInfo, breadcrumb, products } = mainResult.data;
                setPageTitle(categoryInfo.name);
                setBreadcrumbItems([{ title: "Trang chủ", href: "/" }, ...breadcrumb]);
                setProducts(Array.isArray(products) ? products : []);

                if (subCategoriesRes.ok) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const subCategoriesData: any[] = await subCategoriesRes.json();
                    if (Array.isArray(subCategoriesData)) {
                        setSubCategories(subCategoriesData.map(cat => ({ id: cat.id, name: cat.title, slug: cat.slug, icon: cat.image_url })));
                    }
                } else {
                    console.warn("Không thể fetch danh mục con hoặc không có danh mục con.");
                    setSubCategories([]);
                }

            } catch (err) {
                console.error("Lỗi khi fetch dữ liệu:", err);
                setError(err instanceof Error ? err.message : 'Có lỗi không xác định xảy ra.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentSlug]);

    // MỚI: Giao diện Skeleton khi tải trang
    if (isLoading) {
        return (
            <div className="bg-gray-50">
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <Skeleton className="h-28 w-full mb-6" />
                    <div className="flex flex-col lg:flex-row lg:space-x-8">
                        <aside className="w-full lg:w-1/4 xl:w-1/5 mb-8 lg:mb-0 shrink-0">
                            <Skeleton className="h-96 w-full rounded-lg" />
                        </aside>
                        <section className="w-full lg:w-3/4 xl:w-4/5">
                            <Skeleton className="h-16 w-full rounded-lg mb-6" />
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-lg" />)}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return <div className="text-center p-10 text-red-600">Lỗi: {error}</div>;
    }

    const parentPath = pathname;

    return (
        <div className="bg-gray-50">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <CustomBreadcrumb items={breadcrumbItems} />
                {subCategories.length > 0 && (
                    <SubCategoryMenu categories={subCategories} parentPath={parentPath} />
                )}
                <div className="flex flex-col lg:flex-row lg:space-x-8">
                    <aside className="w-full lg:w-1/4 xl:w-1/5 mb-8 lg:mb-0 shrink-0">
                        <ProductFilters />
                    </aside>
                    <section className="w-full lg:w-3/4 xl:w-4/5">
                        <ProductGrid products={products} title={pageTitle || 'Tất cả sản phẩm'} />
                    </section>
                </div>
            </main>
        </div>
    );
}
