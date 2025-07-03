'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { Checkbox } from "@/components/ui/checkbox";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

// MỚI: Import các hook và type cần thiết
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Product, Variant } from '@/types/product';
import ProductFilters from '@/components/ProductFilters';



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

const formatCurrency = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice)) return '0₫';
    return numericPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '₫';
};

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
        const imageUrl = primaryImageObject ? `https://nhathuoc.trafficnhanh.com${primaryImageObject.image_url}` : "";

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
    // const domain = "https://nhathuoc.trafficnhanh.com";
    return (
        <div className="mb-6">
            <div className="flex flex-wrap gap-3">
                {categories.filter(cat => cat && cat.slug).map((cat) => {
                    // const hasValidIcon = cat.icon && typeof cat.icon === 'string' && cat.icon.trim() !== '';
                    // const iconSrc = hasValidIcon ? `${domain}${cat.icon}` : '';
                    const href = parentPath === '/' ? `/${cat.slug}` : `${parentPath}/${cat.slug}`;

                    return (
                        <Link key={cat.id} href={href} className="flex flex-col items-center justify-center p-2 border rounded-lg w-28 h-24 text-center text-xs font-medium transition-colors bg-white border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50">
                            {/* <div className="w-10 h-10 relative mb-1">
                                <Image src={iconSrc} alt={cat.name} fill className="object-contain" onError={(e) => { e.currentTarget.src = ''; }} />
                            </div> */}
                            <span className="leading-tight">{cat.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

function ProductGrid({ products, title, sortBy, onSortChange }: { products: Product[]; title: string; sortBy: string; onSortChange: (value: string) => void; }) {
    const INITIAL_ITEM_COUNT = 8;
    const MORE_ITEM_COUNT = 4;
    const [visibleCount, setVisibleCount] = useState(INITIAL_ITEM_COUNT);

    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + MORE_ITEM_COUNT);
    };

    // Reset lại số lượng khi danh sách sản phẩm hoặc bộ lọc thay đổi
    useEffect(() => {
        setVisibleCount(INITIAL_ITEM_COUNT);
    }, [products]);

    const productsToShow = products.slice(0, visibleCount);
    const remainingCount = products.length - visibleCount;
    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 p-4 bg-white rounded-lg border">
                <h1 className="text-lg font-bold text-gray-900 mb-2 md:mb-0">{title} ({products.length} sản phẩm)</h1>
                <div className="flex items-center space-x-2">
                    <Label htmlFor="sort-by" className="text-sm text-gray-600 shrink-0">Sắp xếp theo</Label>
                    <Select value={sortBy} onValueChange={onSortChange}>
                        <SelectTrigger id="sort-by" className="w-[180px] bg-white"><SelectValue placeholder="Phổ biến" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="popular">Phổ biến</SelectItem>
                            <SelectItem value="price-asc">Giá: Tăng dần</SelectItem>
                            <SelectItem value="price-desc">Giá: Giảm dần</SelectItem>
                            <SelectItem value="newest">Mới nhất</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             {products.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
                        {productsToShow.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* ⭐ BƯỚC 3: HIỂN THỊ NÚT "XEM THÊM" */}
                    {remainingCount > 0 && (
                        <div className="mt-8 text-center">
                            <Button variant="outline" onClick={handleLoadMore}>
                                Xem thêm {remainingCount} sản phẩm
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center text-gray-500 py-16 border-2 border-dashed rounded-lg">
                    Không có sản phẩm nào phù hợp với bộ lọc.
                </div>
            )}
            {/* <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
                {products.map((product) => (<ProductCard key={product.id} product={product} />))}
            </div> */}
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


export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [pageTitle, setPageTitle] = useState<string>('');
    const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItemType[]>([]);
    const [subCategories, setSubCategories] = useState<Subcategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState('popular');

    const params = useParams();
    const pathname = usePathname();

    const [filters, setFilters] = useState<{ brands: string[], priceRange: string | null }>({ brands: [], priceRange: null });
    const [availableBrands, setAvailableBrands] = useState<string[]>([]);

    const filteredProducts = useMemo(() => {
        let tempProducts = [...products];

        // Lọc theo thương hiệu
        if (filters.brands.length > 0) {
            tempProducts = tempProducts.filter(p => p.brand_name && filters.brands.includes(p.brand_name));
            }

        // Lọc theo giá
        if (filters.priceRange) {
            const range = filters.priceRange;
                tempProducts = tempProducts.filter(p => {
                    const price = p.variants[0] ? parseFloat(p.variants[0].price) : 0;
                    if (range === "Dưới 100.000đ") return price < 100000;
                    if (range === "100.000đ - 200.000đ") return price >= 100000 && price <= 200000;
                    if (range === "200.000đ - 500.000đ") return price >= 200000 && price <= 500000;
                    if (range === "Trên 500.000đ") return price > 500000;
                    return true;
                });
            }
        
         const getDefaultPrice = (product: Product): number => {
            const defaultVariant = product.variants?.find(v => v.is_default === 1) || product.variants?.[0];
            return defaultVariant ? parseFloat(defaultVariant.price) : 0;
        };

        switch (sortBy) {
            case 'price-asc':
                tempProducts.sort((a, b) => getDefaultPrice(a) - getDefaultPrice(b));
                break;
            case 'price-desc':
                tempProducts.sort((a, b) => getDefaultPrice(b) - getDefaultPrice(a));
                break;
            case 'newest':
                tempProducts.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
                break;
            case 'popular':
            default:
                // Giữ nguyên thứ tự mặc định từ API (thường là phổ biến nhất)
                break;
        }
            
            return tempProducts;
        }, [products, filters, sortBy]);


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
                const brands = [...new Set(products.map(p => p.brand_name).filter(Boolean))] as string[];
                setAvailableBrands(brands);

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
                        <ProductFilters 
                            availableBrands={availableBrands}
                            onFilterChange={setFilters}
                        />
                    </aside>
                    <section className="w-full lg:w-3/4 xl:w-4/5">
                        <ProductGrid products={filteredProducts} title={pageTitle || 'Tất cả sản phẩm'} sortBy={sortBy}
                            onSortChange={setSortBy} />
                    </section>
                </div>
            </main>
        </div>
    );
}
