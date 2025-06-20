'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight } from "lucide-react";

//================================================================//
// 1. ĐỊNH NGHĨA DỮ LIỆU VÀ HÀM TIỆN ÍCH
//================================================================//

// Định nghĩa kiểu dữ liệu cho sản phẩm
export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  tag?: 'Tích điểm' | 'Khuyến mãi';
}

// Hàm tiện ích định dạng tiền tệ
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Dữ liệu giả lập - Trong thực tế, bạn sẽ fetch từ API
const mockProducts: Product[] = [
    { id: '1', name: 'Viên uống Blackmores Vitamin E 1000IU hỗ trợ làm đẹp da (30 viên)', imageUrl: '/product-placeholder.jpg', price: 295000, originalPrice: 350000, discountPercentage: 15 },
    { id: '2', name: 'Viên sủi Berocca Performance hương xoài giảm căng thẳng (Tuýp 10 viên)', imageUrl: '/product-placeholder.jpg', price: 105200, tag: 'Tích điểm' },
    { id: '3', name: 'Viên uống DHC Vitamin C 60 ngày giúp sáng da, mờ thâm (120 viên)', imageUrl: '/product-placeholder.jpg', price: 99000 },
    { id: '4', name: 'Viên uống Healthy Care Squalene 1000mg hỗ trợ sức khỏe làn da (200 viên)', imageUrl: '/product-placeholder.jpg', price: 330000 },
    { id: '5', name: 'Viên uống Kirkland Signature Vitamin C 1000mg tăng cường miễn dịch (500 viên)', imageUrl: '/product-placeholder.jpg', price: 507000, tag: 'Tích điểm' },
    { id: '6', name: 'Viên sủi Pluzzs Plus Vitamin C vị chanh hỗ trợ tăng sức đề kháng (Tuýp 20 viên)', imageUrl: '/product-placeholder.jpg', price: 107100 },
    { id: '7', name: 'Viên uống Pharmaton Energy chứa nhân sâm G115 và Vitamin (Vỉ 30 viên)', imageUrl: '/product-placeholder.jpg', price: 167900 },
    { id: '8', name: 'Viên uống D-Vitum Forte 2000 I.U. K2 MK-7 bổ sung vitamin D3 (60 viên)', imageUrl: '/product-placeholder.jpg', price: 419000, tag: 'Tích điểm' },
];


//================================================================//
// 2. ĐỊNH NGHĨA CÁC COMPONENT CON
//================================================================//

//----- COMPONENT: ProductCard -----//
function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="flex flex-col justify-between w-full h-full rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300 group">
      <CardContent className="p-0 relative">
        <div className="aspect-square w-full relative overflow-hidden bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {product.discountPercentage && (
          <Badge variant="destructive" className="absolute top-2 right-2 text-xs font-bold">
            -{product.discountPercentage}%
          </Badge>
        )}
        {product.tag === 'Tích điểm' && (
            <Badge className="absolute top-2 left-2 bg-green-100 text-green-700 border-green-300 text-xs font-semibold">
                Tích điểm
            </Badge>
        )}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-800 h-10 overflow-hidden text-ellipsis">
            {product.name}
          </h3>
          <div className="mt-2 flex flex-col items-start">
            <span className="text-lg font-bold text-blue-600">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          Chọn mua
        </Button>
      </CardFooter>
    </Card>
  );
}


//----- COMPONENT: ProductFilters (CẬP NHẬT) -----//
function ProductFilters() {
  const brands = ["Blackmores", "OstroVit", "Healthy Care", "Swisse", "Puritan's Pride"];
  const priceRanges = [
    { id: "range-1", label: "Dưới 100.000đ" },
    { id: "range-2", label: "100.000đ - 200.000đ" },
    { id: "range-3", label: "200.000đ - 500.000đ" },
    { id: "range-4", label: "Trên 500.000đ" },
  ];

  return (
    <div className="w-full rounded-lg border bg-white shadow-sm">
        {/* Phần danh mục không dùng accordion */}
        <div className="p-4 border-b">
            <h3 className="text-base font-bold mb-3">Danh mục sản phẩm</h3>
            <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-600">Thực phẩm chức năng</a></li>
                <li className="pl-3"><a href="#" className="font-semibold text-blue-600">Bổ sung Vitamin & Khoáng chất</a></li>
                <li className="pl-3"><a href="#" className="hover:text-blue-600">Hỗ trợ xương khớp</a></li>
                <li className="pl-3"><a href="#" className="hover:text-blue-600">Hỗ trợ tim mạch</a></li>
            </ul>
        </div>

        {/* Phần bộ lọc nâng cao */}
        <div className="p-4">
            <h3 className="text-base font-bold mb-2">Bộ lọc nâng cao</h3>
            <Accordion type="multiple" defaultValue={['price', 'brand']} className="w-full">
                <AccordionItem value="price">
                <AccordionTrigger className="text-sm font-semibold">Giá</AccordionTrigger>
                <AccordionContent>
                    <RadioGroup defaultValue="range-2" className="space-y-3 pt-2">
                    {priceRanges.map((range) => (
                        <div key={range.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={range.id} id={range.id} />
                        <Label htmlFor={range.id} className="font-normal cursor-pointer">{range.label}</Label>
                        </div>
                    ))}
                    </RadioGroup>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="brand">
                <AccordionTrigger className="text-sm font-semibold">Thương hiệu</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-3 pt-2">
                    {brands.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                        <Checkbox id={brand} />
                        <Label htmlFor={brand} className="font-normal cursor-pointer">{brand}</Label>
                        </div>
                    ))}
                    </div>
                </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
  );
}

//----- COMPONENT: ProductGrid -----//
function ProductGrid({title}: {title: string}) {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 p-4 bg-white rounded-lg border">
        <h1 className="text-lg font-bold text-gray-900 mb-2 md:mb-0">
          {title} ({mockProducts.length} sản phẩm)
        </h1>
        <div className="flex items-center space-x-2">
          <Label htmlFor="sort-by" className="text-sm text-gray-600 shrink-0">Sắp xếp theo</Label>
          <Select defaultValue="popular">
            <SelectTrigger id="sort-by" className="w-[180px] bg-white">
              <SelectValue placeholder="Phổ biến" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Phổ biến</SelectItem>
              <SelectItem value="price-asc">Giá: Tăng dần</SelectItem>
              <SelectItem value="price-desc">Giá: Giảm dần</SelectItem>
              <SelectItem value="newest">Mới nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

//----- COMPONENT: Breadcrumb -----//
function Breadcrumb() {
    return (
        <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-gray-600">
                <li><a href="#" className="hover:underline">Trang chủ</a></li>
                <li><ChevronRight size={16} /></li>
                <li><a href="#" className="hover:underline">Thực phẩm chức năng</a></li>
                <li><ChevronRight size={16} /></li>
                <li><span className="font-semibold text-gray-800">Bổ sung Vitamin & Khoáng chất</span></li>
            </ol>
        </nav>
    );
}

//================================================================//
// 3. COMPONENT TRANG CHÍNH (PAGE COMPONENT - CẬP NHẬT)
//================================================================//

export default function ProductsPage() {
  return (
    <div className="bg-gray-50">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb />
      

        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <aside className="w-full lg:w-1/4 xl:w-1/5 mb-8 lg:mb-0 shrink-0">
            <ProductFilters />
          </aside>
          <section className="w-full lg:w-3/4 xl:w-4/5">
            <ProductGrid title="Bổ sung Vitamin & Khoáng chất" />
          </section>
        </div>
        
        <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm xem thêm</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {mockProducts.slice(0, 5).map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
      </main>
    </div>
  );
} 