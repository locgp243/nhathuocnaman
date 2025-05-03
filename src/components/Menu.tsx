  'use client';

  import { useState } from "react";
  import { ChevronDown } from "lucide-react";
  import { Card, CardContent } from "@/components/ui/card";
  import Image from "next/image";
  import Link from "next/link";
  import { slugify } from "@/lib/slugify"; // 🆕 import slugify

  const menuData = [
    {
      title: "Thực phẩm chức năng",
      sub: [
        {
          title: "Vitamin & Khoáng chất",
          items: [
            "Bổ sung Canxi & Vitamin D",
            "Vitamin tổng hợp",
            "Dầu cá, Omega 3, DHA",
            "Vitamin C các loại",
            "Bổ sung Sắt & Axit Folic",
          ],
        },
        { title: "Sinh lý - Nội tiết tố", items: [] },
        { title: "Cải thiện tăng cường chức năng", items: [] },
        { title: "Hỗ trợ điều trị", items: [] },
        { title: "Hỗ trợ tiêu hóa", items: [] },
        { title: "Thần kinh não", items: [] },
        { title: "Hỗ trợ làm đẹp", items: [] },
        { title: "Sức khỏe tim mạch", items: [] },
      ],
    },
    {
      title: "Dược mỹ phẩm",
      sub: [
      {
        title: "Vitamin & Khoáng chất",
        items: [
          "Bổ sung Canxi & Vitamin D",
          "Vitamin tổng hợp",
          "Dầu cá, Omega 3, DHA",
          "Vitamin C các loại",
          "Bổ sung Sắt & Axit Folic",
        ],
      },
      { title: "Sinh lý - Nội tiết tố", items: [] },
      { title: "Cải thiện tăng cường chức năng", items: [] },
      { title: "Hỗ trợ điều trị", items: [] },
      { title: "Hỗ trợ tiêu hóa", items: [] },
      { title: "Thần kinh não", items: [] },
      { title: "Hỗ trợ làm đẹp", items: [] },
      { title: "Sức khỏe tim mạch", items: [] },
      ],
    },
    { title: "Thuốc", sub: [] },
    { title: "Chăm sóc sức khỏe", sub: [] },
    { title: "Thiết bị y tế", sub: [] },
    { title: "Tiêm chủng", sub: [] },
    { title: "Bệnh & Góc sức khỏe", sub: [] },
    { title: "Hệ thống nhà thuốc", sub: [] },
  ];

  const bestSellers = [
    {
      name: "Viên uống NutriGrow",
      price: "480.000đ",
      image: "/sample1.jpg",
    },
    {
      name: "Siro Canxi-D3-K2",
      price: "105.000đ",
      image: "/sample2.jpg",
    },
    {
      name: "Brauer Baby D3+K2",
      price: "396.000đ",
      image: "/sample3.jpg",
    },
  ];

  export default function Menu() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number>(0);
    const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (title: string) => {
      if (hideTimeout) clearTimeout(hideTimeout);
      setActiveMenu(title);
    };

    const handleMouseLeave = () => {
      const timeout = setTimeout(() => {
        setActiveMenu(null);
      }, 200);
      setHideTimeout(timeout);
    };

    return (
      <header className="bg-[#309d94] shadow-sm border-b z-50 relative sm:flex hidden">
        <nav className="max-w-7xl mx-auto px-4 flex items-center content-center gap-10 h-14 text-white">
          {menuData.map((item) => (
            <div
              key={item.title}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.title)}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-1 text-sm font-medium hover:text-yellow-300 transition">
                {item.title} <ChevronDown size={14} />
              </button>

              {activeMenu === item.title && item.title === "Thực phẩm chức năng" && (
                <div className="absolute left-0 top-full mt-2 p-4 w-[950px] bg-white border rounded-lg shadow-xl z-50 text-black flex">
                  {/* Left: Category list */}
                  <div className="w-1/4 border-r bg-gray-50">
                    {item.sub.map((cat, idx) => (
                      <div
                        key={cat.title}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        className={`px-4 py-3 cursor-pointer hover:bg-blue-100 text-sm ${
                          hoveredIndex === idx ? "bg-blue-100 font-semibold" : ""
                        }`}
                      >
                        {cat.title}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col w-3/4">
                    {/* Middle: Sub-items */}
                    <div className="p-4">
                      {item.sub[hoveredIndex]?.items?.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4">
                          {item.sub[hoveredIndex].items.map((subItem) => {
                            const parentSlug = slugify(item.title);
                            const childSlug = slugify(item.sub[hoveredIndex].title);
                            // const subSlug = slugify(subItem);

                            return (
                              <Link
                                key={subItem}
                                href={`/danh-muc/${parentSlug}/${childSlug}`}
                              >
                                <Card className="cursor-pointer hover:border-blue-500 transition">
                                  <CardContent className="p-4 text-sm text-gray-700 font-medium">
                                    {subItem}
                                  </CardContent>
                                </Card>
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Không có nội dung</div>
                      )}
                    </div>

                    {/* Right: Best sellers */}
                    <div className="border-l p-4">
                      <div className="flex gap-2">
                        <h4 className="text-sm font-semibold mb-2">Bán chạy nhất</h4> |
                        <Link href="/san-pham" className="text-blue-600 text-sm font-medium mb-2 block">
                          Xem tất cả
                        </Link>
                      </div>
                      <div className="flex flex-col space-y-3">
                        {bestSellers.map((product) => (
                          <div key={product.name} className="flex gap-3 items-center text-sm">
                            <Image
                              width={48}
                              height={48}
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <div className="line-clamp-2">{product.name}</div>
                              <div className="text-blue-600 font-medium">{product.price}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Simple Dropdown for other menu items */}
              {activeMenu === item.title &&
                item.title !== "Thực phẩm chức năng" &&
                item.sub.length > 0 && (
                  <div className="absolute left-0 top-full mt-2 w-[280px] bg-white border rounded-lg shadow-lg z-50 text-black">
                    {item.sub.map((subItem) => (
                      <div
                        key={subItem.title}
                        className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer transition"
                      >
                        {subItem.title}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>
      </header>
    );
  }
