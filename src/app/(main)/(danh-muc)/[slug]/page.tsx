'use client';

import { useState, useEffect, memo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Service from "@/components/Services";
import { Skeleton } from "@/components/ui/skeleton"; // MỚI: Thêm Skeleton

// MỚI: Import hook và toast
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// --- INTERFACES (Không thay đổi) ---
interface ApiSubcategory {
    id: string;
    parent_id: string;
    title: string;
    slug: string;
    image_url: string | null;
}

interface Subcategory {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
}

interface Variant {
    id: number;
    unit_name: string;
    price: string;
    original_price: string;
}

interface ProductImage {
    image_url: string;
    is_primary: number;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    brand_name: string;
    is_hotsale: number;
    images?: ProductImage[];
    variants: Variant[];
    subcategory_name?: string;
}

// --- HÀM TIỆN ÍCH (Không thay đổi) ---
const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice)) return '0';
    return numericPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// --- COMPONENT CON (Không thay đổi) ---
const SubCategoryIcon = memo(function SubCategoryIcon({ category, parentSlug }: { category: Subcategory, parentSlug: string }) {
    const domain = "https://nhathuoc.trafficnhanh.com";
    const hasValidIcon = category.icon && typeof category.icon === 'string' && category.icon.trim() !== '';
    const iconSrc = hasValidIcon ? `${domain}${category.icon}` : null;
    const handleCategoryClick = () => {
        localStorage.setItem("title_sub_categories", category.name);
    };
    return (
        <Link
            href={`/${parentSlug}/${category.slug}`}
            onClick={handleCategoryClick}
            className="flex flex-col items-center text-center group"
        >
            <div className="relative w-10 h-10 mb-2">
                {iconSrc && (
                    <Image
                        src={iconSrc}
                        alt={category.name || 'Danh mục'}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                )}
            </div>
            <h3 className="text-xs font-medium text-gray-800 mb-1 line-clamp-2 h-8">{category.name}</h3>
        </Link>
    );
});
SubCategoryIcon.displayName = 'SubCategoryIcon';

// --- COMPONENT CHÍNH CỦA TRANG ---
export default function MainCategoryPage() {
    // --- STATE MANAGEMENT ---
    const [products, setProducts] = useState<Product[]>([]);
    const [subCategories, setSubCategories] = useState<Subcategory[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>({});
    const [title, setTitle] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // MỚI: State cho lỗi

    const params = useParams();
    const slug = params.slug as string;

    // MỚI: Lấy hàm addToCart từ Context
    const { addToCart } = useCart();

    // --- DATA FETCHING ---
    useEffect(() => {
        const savedTitle = localStorage.getItem("title_main_categories");
        setTitle(savedTitle);
    }, []);

    useEffect(() => {
        if (!slug) return;
        setIsLoading(true);
        setError(null); // Reset lỗi khi fetch lại

        const fetchData = async () => {
            try {
                const [subCategoriesRes, productsRes] = await Promise.all([
                    fetch(`https://nhathuoc.trafficnhanh.com/categories.php?action=doc_danh_muc_con&slug=${slug}`),
                    fetch(`https://nhathuoc.trafficnhanh.com/products.php?action=theo_danh_muc_chinh&category_slug=${slug}`)
                ]);

                if (!subCategoriesRes.ok || !productsRes.ok) {
                    throw new Error("Lỗi mạng khi tải dữ liệu.");
                }

                const subCategoriesData: ApiSubcategory[] = await subCategoriesRes.json();
                const productsData: Product[] = await productsRes.json();

                if (Array.isArray(subCategoriesData)) {
                    const formattedSubCategories = subCategoriesData.map(cat => ({
                        id: cat.id,
                        name: cat.title,
                        slug: cat.slug,
                        icon: cat.image_url
                    }));
                    setSubCategories(formattedSubCategories);
                }

                if (Array.isArray(productsData)) {
                    setProducts(productsData);
                    const defaultTypes: Record<string, string> = {};
                    productsData.forEach((p) => {
                        if (p.variants?.length > 0) {
                            // Ưu tiên variant có is_default=1, nếu không thì lấy cái đầu tiên
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const defaultVariant = p.variants.find((v: any) => v.is_default === 1) || p.variants[0];
                            defaultTypes[p.id] = defaultVariant.unit_name;
                        }
                    });
                    setSelectedTypes(defaultTypes);
                }
            } catch (err) {
                console.error("Đã có lỗi xảy ra khi fetch dữ liệu:", err);
                setError("Không thể tải dữ liệu cho danh mục này. Vui lòng thử lại sau."); // MỚI: Set lỗi
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    // --- HÀM XỬ LÝ SỰ KIỆN ---

    const updateProductType = useCallback((productId: string, type: string) => {
        setSelectedTypes((prev) => ({ ...prev, [productId]: type }));
    }, []);

    // MỚI: Hàm thêm sản phẩm vào giỏ hàng
    const handleAddToCart = useCallback((e: React.MouseEvent, product: Product) => {
        e.stopPropagation(); // Ngăn sự kiện click lan ra Card cha

        const selectedUnitName = selectedTypes[product.id];
        const selectedVariant = product.variants?.find(v => v.unit_name === selectedUnitName);

        if (!selectedVariant) {
            toast.error("Đã xảy ra lỗi", { description: "Không tìm thấy loại sản phẩm được chọn." });
            return;
        }

        const primaryImageObject = product.images?.find(img => img.is_primary) || product.images?.[0];
        const imageUrl = primaryImageObject ? `https://nhathuoc.trafficnhanh.com${primaryImageObject.image_url}` : '/placeholder-image.png';

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
                onClick: () => (window.location.href = '/gio-hang'),
            },
        });
    }, [selectedTypes, addToCart]);


    // THAY ĐỔI: Giao diện loading và error
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 space-y-6 py-4 animate-pulse">
                <Skeleton className="h-6 w-1/3" />
                <Card className="p-4">
                    <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-4">
                        {[...Array(10)].map((_, i) => <div key={i} className="flex flex-col items-center"><Skeleton className="w-10 h-10 rounded-full" /><Skeleton className="h-4 w-12 mt-2" /></div>)}
                    </div>
                </Card>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="container mx-auto text-center p-10 text-lg font-semibold text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 space-y-6 py-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem><BreadcrumbLink href="/">Trang chủ</BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/${slug}`} className="text-primary font-semibold">{title || 'Danh mục'}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {subCategories.length > 0 && (
                    <div className="bg-white rounded-lg p-4">
                        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-4">
                            {subCategories.map((category) => (
                                <SubCategoryIcon key={category.id} category={category} parentSlug={slug} />
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Tất cả sản phẩm</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {products.map((product) => {
                            const availableTypes = product.variants ? [...new Set(product.variants.map(v => v.unit_name))] : [];
                            const selectedVariant = product.variants?.find(v => v.unit_name === selectedTypes[product.id]) || product.variants?.[0];
                            const price = selectedVariant ? parseFloat(selectedVariant.price) : 0;
                            const originalPrice = selectedVariant ? parseFloat(selectedVariant.original_price) : 0;
                            const discountPercent = (originalPrice > 0 && originalPrice > price) ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
                            const domain = "https://nhathuoc.trafficnhanh.com";
                            const primaryImageObject = product.images?.find(img => img.is_primary) || product.images?.[0];
                            const primaryImage = primaryImageObject ? `${domain}${primaryImageObject.image_url}` : null;

                            return (
                                <Card key={product.id} className="bg-white text-black relative overflow-hidden h-full flex flex-col group">
                                    <div className="absolute top-2 left-0 right-2 flex justify-between items-start z-10 px-2">
                                        <div>{discountPercent > 0 && <Badge className="bg-rose-500">Giảm {discountPercent}%</Badge>}</div>
                                        <div className="flex flex-col items-end space-y-1">{product.brand_name && <Badge variant="secondary">{product.brand_name}</Badge>}</div>
                                    </div>
                                    <CardContent className="p-3 flex flex-col flex-grow">
                                        <Link href={`/san-pham/${product.slug}`} className="flex-grow">
                                            <div className="relative flex justify-center items-center w-full h-[150px] mb-3 mt-4">
                                                {primaryImage && (<Image src={primaryImage} alt={product.name} fill className="object-contain group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.currentTarget.style.display = 'none'; }} />)}
                                            </div>
                                            <h3 className="font-medium text-sm mb-2 h-10 line-clamp-2">{product.name}</h3>
                                        </Link>
                                        <div className="h-[40px] mb-2">
                                            {availableTypes.length > 1 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {availableTypes.map((type) => (
                                                        <Button key={type} variant={selectedTypes[product.id] === type ? "default" : "outline"} size="sm"
                                                            className={`px-2 py-0 h-8 text-xs ${selectedTypes[product.id] === type ? "bg-rose-500 hover:bg-rose-600 text-white" : "text-gray-700 border-gray-300"}`}
                                                            onClick={() => updateProductType(product.id, type)}
                                                        >{type}</Button>
                                                    ))}
                                                </div>
                                            ) : (<div className="text-xs text-gray-500 flex items-center h-full">Loại: {availableTypes[0] || 'Mặc định'}</div>)}
                                        </div>
                                        <div className="space-y-1 mt-auto">
                                            {selectedVariant ? (
                                                <>
                                                    <p className="text-rose-600 font-bold text-lg">{formatPrice(price)}₫<span className="text-gray-600 font-normal text-sm"> / {selectedVariant.unit_name}</span></p>
                                                    {discountPercent > 0 && <p className="text-gray-500 text-sm line-through">{formatPrice(originalPrice)}₫</p>}
                                                </>
                                            ) : <div className="h-[48px]"></div>}
                                        </div>
                                        {/* THAY ĐỔI: Cập nhật nút bấm */}
                                        <Button
                                            size="sm"
                                            className="w-full mt-3 bg-rose-500 hover:bg-rose-600 text-white"
                                            onClick={(e) => handleAddToCart(e, product)}
                                        >
                                            Thêm vào giỏ hàng
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>

                <Service />
            </div>
        </div>
    )
}