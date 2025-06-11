// components/ProductCarouselByMainCategory.tsx
"use client"

import { useEffect, useState, useCallback } from "react" // Thêm useCallback
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { API_BASE_URL } from "@/lib/api"

// 1. IMPORT DỮ LIỆU GIẢ TỪ FILE MOCK-DATA
// Dữ liệu này sẽ được dùng như một phương án dự phòng.
import { mockProducts, Product, ProductType, CategoryInfo } from "@/lib/mock-data"


// Interface cho Subcategory có thể dùng CategoryInfo từ mock-data
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Subcategory extends CategoryInfo {}

interface Props {
  mainCategorySlug: string
  title?: string
  icon?: string
}

export default function HomeProductCarouselCards({ mainCategorySlug, title, icon }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [selectedTypes, setSelectedTypes] = useState<Record<string, ProductType>>({})
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  // 2. TẠO MỘT HÀM DÙNG CHUNG ĐỂ XỬ LÝ DỮ LIỆU
  // Giúp tránh lặp lại code trong cả trường hợp gọi API thành công và thất bại.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const processAndSetData = useCallback((productData: Product[], subcategoryData: Subcategory[]) => {
    // Lọc sản phẩm theo mainCategorySlug (cần thiết khi dùng mock data)
    const relevantProducts = productData.filter(p => p.main_category_slug === mainCategorySlug);
    setProducts(relevantProducts);

    // Lấy danh mục con từ dữ liệu sản phẩm đã lọc
    const relevantSubcategoriesMap = new Map<string, Subcategory>();
    relevantProducts.forEach(p => {
        if (!relevantSubcategoriesMap.has(p.subcategory_name)) {
            relevantSubcategoriesMap.set(p.subcategory_name, {
                name: p.subcategory_name,
                slug: p.subcategory_slug,
            });
        }
    });
    setSubcategories(Array.from(relevantSubcategoriesMap.values()));
    
    // Set loại sản phẩm mặc định
    const defaultTypes: Record<string, ProductType> = {};
    relevantProducts.forEach((p) => {
      if (p.availableTypes && p.availableTypes.length > 0) {
        defaultTypes[p.id] = p.availableTypes[0];
      }
    });
    setSelectedTypes(defaultTypes);
  }, [mainCategorySlug]);


  // 3. CẬP NHẬT useEffect VỚI LOGIC TRY/CATCH ĐỂ DÙNG DỮ LIỆU DỰ PHÒNG
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Ưu tiên gọi API thật
        const [productResponse, subcategoryResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/get_product_by_main_category.php?main_category=${mainCategorySlug}`),
          fetch(`${API_BASE_URL}/get_sub_category_by_main.php?main_category=${mainCategorySlug}`)
        ]);

        if (!productResponse.ok || !subcategoryResponse.ok) {
            // Nếu một trong hai API lỗi, sẽ nhảy vào khối catch
            throw new Error('API request failed');
        }

        const productData = await productResponse.json();
        const subcategoryData = await subcategoryResponse.json();

        // Nếu API trả về mảng rỗng, cũng có thể coi là một trường hợp cần fallback
        if (productData.length === 0) {
            throw new Error('API returned no products');
        }

        console.log("✅ Dữ liệu được tải từ API thật.");
        processAndSetData(productData, subcategoryData);

      } catch (error) {
        // NẾU GỌI API THẤT BẠI (lỗi mạng, server sập, ...), SẼ DÙNG DỮ LIỆU GIẢ
        console.warn("⚠️ Lỗi khi tải dữ liệu từ API, sử dụng dữ liệu giả (mock data) làm phương án dự phòng.", error);
        
        // Dùng hàm xử lý chung với mock data
        // Trong mock-data.ts, chúng ta đã có mockSubcategories, nhưng ở đây ta sẽ tự tính lại để đảm bảo logic
        const fallbackSubcategories = Array.from(new Set(mockProducts.map(p => p.subcategory_name)))
            .map(name => ({ id: name, name, slug: name.toLowerCase().replace(/ /g, '-') }));
            
        processAndSetData(mockProducts, fallbackSubcategories);

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mainCategorySlug, processAndSetData]);


  const updateProductType = (productId: string, type: ProductType) => {
    setSelectedTypes((prev) => ({ ...prev, [productId]: type }))
  }

  const formatPrice = (price: number) =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  const filteredProducts = selectedSubcategory === "all"
    ? products
    : products.filter(p => p.subcategory_name === selectedSubcategory)

  // --- PHẦN GIAO DIỆN JSX GIỮ NGUYÊN ---
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          {icon && (
            <div className="bg-secondary text-white rounded-full p-2">
              <Image src={icon} alt="icon" width={24} height={24} />
            </div>
          )}
          <h2 className="text-2xl font-bold tracking-tight bg-destructive text-primary animate-bg-shimmer">{title}</h2>
        </div>

        <Tabs
          value={selectedSubcategory}
          onValueChange={(value) => setSelectedSubcategory(value)}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-transparent h-auto flex flex-wrap gap-2">
            <TabsTrigger
              value="all"
              className="bg-[#E5E7EB] text-[#333333] data-[state=active]:bg-[#F43F5E] data-[state=active]:text-white"
            >
              Tất cả
            </TabsTrigger>
            {subcategories.slice(0, 5).map((subcategory) => (
              <TabsTrigger
                key={subcategory.slug} // Dùng slug để đảm bảo key là duy nhất
                value={subcategory.name}
                className="bg-[#E5E7EB] text-[#333333] data-[state=active]:bg-[#F43F5E] data-[state=active]:text-white"
              >
                {subcategory.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {[...Array(5)].map((_, index) => (
              <CarouselItem key={index} className="basis-1/2 pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <Card className="bg-white h-full">
                  <CardContent className="p-3 space-y-3">
                    <Skeleton className="w-full h-[150px] rounded" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : filteredProducts.length > 0 ? (
        <Carousel opts={{ align: "start", loop: filteredProducts.length > 5 }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {filteredProducts.map(product => (
              <CarouselItem key={product.id} className="basis-1/2 pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <Card className="bg-[#FFFFFF] shadow-md hover:shadow-lg text-black relative overflow-hidden h-full border border-[#E5E7EB]">
                  <Badge className="absolute top-2 left-2 bg-[#F43F5E] text-[#FFFFFF] animate-sparkle">Giảm {product.discount}%</Badge>
                  <Badge className="absolute top-2 right-2 bg-secondary text-white animate-sparkle">{product.subcategory_name}</Badge>
                  <CardContent className="p-3">
                    <div className="flex justify-center mb-3">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={150}
                        height={200}
                        className="object-contain h-[150px]"
                      />
                    </div>
                    <h3 className="font-medium text-sm mb-2 h-10 line-clamp-2 text-[#333333]">{product.name}</h3>
                    <div className="h-[40px] mb-2">
                      {product.availableTypes.length > 1 ? (
                        <div className="flex flex-wrap gap-1">
                          {product.availableTypes.map((type) => (
                            <Button
                              key={type}
                              variant={selectedTypes[product.id] === type ? "default" : "outline"}
                              size="sm"
                              className={`px-2 py-0 h-8 text-xs animate-bg-shimmer ${
                                selectedTypes[product.id] === type
                                  ? "bg-rose-500 hover:bg-rose-600 text-white"
                                  : "text-gray-700 border-gray-300"
                              }`}
                              onClick={() => updateProductType(product.id, type)}
                            >
                              {type}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 flex items-center h-full">
                          Loại: {product.availableTypes[0]}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-rose-600 font-bold">
                        {formatPrice(product.prices[selectedTypes[product.id]]?.discounted || 0)}₫
                      </p>
                      <p className="text-gray-500 text-sm line-through">
                        {formatPrice(product.prices[selectedTypes[product.id]]?.original || 0)}₫
                      </p>
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-rose-500 hover:bg-rose-600 text-white">
                      Thêm Giỏ Hàng
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 w-12 h-12 rounded-full bg-rose-500 text-white hover:bg-rose-600" />
          <CarouselNext className="right-1 w-12 h-12 rounded-full bg-rose-500 text-white hover:bg-rose-600" />
        </Carousel>
      ) : (
        <div className="text-center text-[#333333] py-10 text-sm">Không có sản phẩm nào được tìm thấy.</div>
      )}
    </div>
  )
}