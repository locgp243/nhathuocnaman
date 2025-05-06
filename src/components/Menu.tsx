"use client"

import { useState, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { slugify } from "@/lib/slugify"

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
      {
        title: "Sinh lý - Nội tiết tố",
        items: [
          "Tăng cường sinh lý nam",
          "Tăng cường sinh lý nữ",
          "Cân bằng nội tiết tố",
          "Giảm triệu chứng tiền mãn kinh",
        ],
      },
      {
        title: "Cải thiện tăng cường chức năng",
        items: [
          "Hỗ trợ tăng cường sức đề kháng",
          "Hỗ trợ tăng cường miễn dịch",
          "Hỗ trợ tăng cường sức khỏe sinh lý",
          "Hỗ trợ tăng cường sức khỏe tiêu hóa",
          "Hỗ trợ tăng cường sức khỏe thần kinh",
        ],
      },
      {
        title: "Hỗ trợ điều trị",
        items: [
          "Hỗ trợ điều trị tiểu đường",
          "Hỗ trợ điều trị huyết áp",
          "Hỗ trợ điều trị mỡ máu",
          "Hỗ trợ điều trị gout",
          "Hỗ trợ điều trị viêm khớp",
        ],
      },
      {
        title: "Hỗ trợ tiêu hóa",
        items: [
          "Hỗ trợ tiêu hóa cho trẻ em",
          "Hỗ trợ tiêu hóa cho người lớn",
          "Hỗ trợ tiêu hóa cho người già",
          "Hỗ trợ tiêu hóa cho người bệnh",
        ],
      },
      {
        title: "Thần kinh não",
        items: [
          "Hỗ trợ tăng cường trí nhớ",
          "Hỗ trợ giảm căng thẳng",
          "Hỗ trợ giảm lo âu",
          "Hỗ trợ giảm stress",
          "Hỗ trợ giảm mệt mỏi",
        ],
      },
      {
        title: "Hỗ trợ làm đẹp",
        items: [
          "Hỗ trợ làm đẹp da",
          "Hỗ trợ làm đẹp tóc",
          "Hỗ trợ làm đẹp móng",
          "Hỗ trợ làm đẹp toàn thân",
          "Hỗ trợ làm đẹp từ bên trong",
        ],
      },
      {
        title: "Sức khỏe tim mạch",
        items: [
          "Hỗ trợ sức khỏe tim mạch",
          "Hỗ trợ huyết áp",
          "Hỗ trợ cholesterol",
          "Hỗ trợ tuần hoàn máu",
          "Hỗ trợ sức khỏe mạch máu",
        ],
      },
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
      {
        title: "Sinh lý - Nội tiết tố",
        items: [
          "Tăng cường sinh lý nam",
          "Tăng cường sinh lý nữ",
          "Cân bằng nội tiết tố",
          "Giảm triệu chứng tiền mãn kinh",
        ],
      },
      {
        title: "Cải thiện tăng cường chức năng",
        items: [
          "Hỗ trợ tăng cường sức đề kháng",
          "Hỗ trợ tăng cường miễn dịch",
          "Hỗ trợ tăng cường sức khỏe sinh lý",
          "Hỗ trợ tăng cường sức khỏe tiêu hóa",
          "Hỗ trợ tăng cường sức khỏe thần kinh",
        ],
      },
      {
        title: "Hỗ trợ điều trị",
        items: [
          "Hỗ trợ điều trị tiểu đường",
          "Hỗ trợ điều trị huyết áp",
          "Hỗ trợ điều trị mỡ máu",
          "Hỗ trợ điều trị gout",
          "Hỗ trợ điều trị viêm khớp",
        ],
      },
      {
        title: "Hỗ trợ tiêu hóa",
        items: [
          "Hỗ trợ tiêu hóa cho trẻ em",
          "Hỗ trợ tiêu hóa cho người lớn",
          "Hỗ trợ tiêu hóa cho người già",
          "Hỗ trợ tiêu hóa cho người bệnh",
        ],
      },
      {
        title: "Thần kinh não",
        items: [
          "Hỗ trợ tăng cường trí nhớ",
          "Hỗ trợ giảm căng thẳng",
          "Hỗ trợ giảm lo âu",
          "Hỗ trợ giảm stress",
          "Hỗ trợ giảm mệt mỏi",
        ],
      },
      {
        title: "Hỗ trợ làm đẹp",
        items: [
          "Hỗ trợ làm đẹp da",
          "Hỗ trợ làm đẹp tóc",
          "Hỗ trợ làm đẹp móng",
          "Hỗ trợ làm đẹp toàn thân",
          "Hỗ trợ làm đẹp từ bên trong",
        ],
      },
      {
        title: "Sức khỏe tim mạch",
        items: [
          "Hỗ trợ sức khỏe tim mạch",
          "Hỗ trợ huyết áp",
          "Hỗ trợ cholesterol",
          "Hỗ trợ tuần hoàn máu",
          "Hỗ trợ sức khỏe mạch máu",
        ],
      },
    ],
  },
  {
    title: "Thuốc",
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
      {
        title: "Sinh lý - Nội tiết tố",
        items: [
          "Tăng cường sinh lý nam",
          "Tăng cường sinh lý nữ",
          "Cân bằng nội tiết tố",
          "Giảm triệu chứng tiền mãn kinh",
        ],
      },
      {
        title: "Cải thiện tăng cường chức năng",
        items: [
          "Hỗ trợ tăng cường sức đề kháng",
          "Hỗ trợ tăng cường miễn dịch",
          "Hỗ trợ tăng cường sức khỏe sinh lý",
          "Hỗ trợ tăng cường sức khỏe tiêu hóa",
          "Hỗ trợ tăng cường sức khỏe thần kinh",
        ],
      },
      {
        title: "Hỗ trợ điều trị",
        items: [
          "Hỗ trợ điều trị tiểu đường",
          "Hỗ trợ điều trị huyết áp",
          "Hỗ trợ điều trị mỡ máu",
          "Hỗ trợ điều trị gout",
          "Hỗ trợ điều trị viêm khớp",
        ],
      },
      {
        title: "Hỗ trợ tiêu hóa",
        items: [
          "Hỗ trợ tiêu hóa cho trẻ em",
          "Hỗ trợ tiêu hóa cho người lớn",
          "Hỗ trợ tiêu hóa cho người già",
          "Hỗ trợ tiêu hóa cho người bệnh",
        ],
      },
      {
        title: "Thần kinh não",
        items: [
          "Hỗ trợ tăng cường trí nhớ",
          "Hỗ trợ giảm căng thẳng",
          "Hỗ trợ giảm lo âu",
          "Hỗ trợ giảm stress",
          "Hỗ trợ giảm mệt mỏi",
        ],
      },
      {
        title: "Hỗ trợ làm đẹp",
        items: [
          "Hỗ trợ làm đẹp da",
          "Hỗ trợ làm đẹp tóc",
          "Hỗ trợ làm đẹp móng",
          "Hỗ trợ làm đẹp toàn thân",
          "Hỗ trợ làm đẹp từ bên trong",
        ],
      },
      {
        title: "Sức khỏe tim mạch",
        items: [
          "Hỗ trợ sức khỏe tim mạch",
          "Hỗ trợ huyết áp",
          "Hỗ trợ cholesterol",
          "Hỗ trợ tuần hoàn máu",
          "Hỗ trợ sức khỏe mạch máu",
        ],
      },
    ],
  },
  {
    title: "Chăm sóc sức khỏe",
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
      {
        title: "Sinh lý - Nội tiết tố",
        items: [
          "Tăng cường sinh lý nam",
          "Tăng cường sinh lý nữ",
          "Cân bằng nội tiết tố",
          "Giảm triệu chứng tiền mãn kinh",
        ],
      },
      {
        title: "Cải thiện tăng cường chức năng",
        items: [
          "Hỗ trợ tăng cường sức đề kháng",
          "Hỗ trợ tăng cường miễn dịch",
          "Hỗ trợ tăng cường sức khỏe sinh lý",
          "Hỗ trợ tăng cường sức khỏe tiêu hóa",
          "Hỗ trợ tăng cường sức khỏe thần kinh",
        ],
      },
      {
        title: "Hỗ trợ điều trị",
        items: [
          "Hỗ trợ điều trị tiểu đường",
          "Hỗ trợ điều trị huyết áp",
          "Hỗ trợ điều trị mỡ máu",
          "Hỗ trợ điều trị gout",
          "Hỗ trợ điều trị viêm khớp",
        ],
      },
      {
        title: "Hỗ trợ tiêu hóa",
        items: [
          "Hỗ trợ tiêu hóa cho trẻ em",
          "Hỗ trợ tiêu hóa cho người lớn",
          "Hỗ trợ tiêu hóa cho người già",
          "Hỗ trợ tiêu hóa cho người bệnh",
        ],
      },
      {
        title: "Thần kinh não",
        items: [
          "Hỗ trợ tăng cường trí nhớ",
          "Hỗ trợ giảm căng thẳng",
          "Hỗ trợ giảm lo âu",
          "Hỗ trợ giảm stress",
          "Hỗ trợ giảm mệt mỏi",
        ],
      },
      {
        title: "Hỗ trợ làm đẹp",
        items: [
          "Hỗ trợ làm đẹp da",
          "Hỗ trợ làm đẹp tóc",
          "Hỗ trợ làm đẹp móng",
          "Hỗ trợ làm đẹp toàn thân",
          "Hỗ trợ làm đẹp từ bên trong",
        ],
      },
      {
        title: "Sức khỏe tim mạch",
        items: [
          "Hỗ trợ sức khỏe tim mạch",
          "Hỗ trợ huyết áp",
          "Hỗ trợ cholesterol",
          "Hỗ trợ tuần hoàn máu",
          "Hỗ trợ sức khỏe mạch máu",
        ],
      },
    ],
  },
  {
    title: "Thiết bị y tế",
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
      {
        title: "Sinh lý - Nội tiết tố",
        items: [
          "Tăng cường sinh lý nam",
          "Tăng cường sinh lý nữ",
          "Cân bằng nội tiết tố",
          "Giảm triệu chứng tiền mãn kinh",
        ],
      },
      {
        title: "Cải thiện tăng cường chức năng",
        items: [
          "Hỗ trợ tăng cường sức đề kháng",
          "Hỗ trợ tăng cường miễn dịch",
          "Hỗ trợ tăng cường sức khỏe sinh lý",
          "Hỗ trợ tăng cường sức khỏe tiêu hóa",
          "Hỗ trợ tăng cường sức khỏe thần kinh",
        ],
      },
      {
        title: "Hỗ trợ điều trị",
        items: [
          "Hỗ trợ điều trị tiểu đường",
          "Hỗ trợ điều trị huyết áp",
          "Hỗ trợ điều trị mỡ máu",
          "Hỗ trợ điều trị gout",
          "Hỗ trợ điều trị viêm khớp",
        ],
      },
      {
        title: "Hỗ trợ tiêu hóa",
        items: [
          "Hỗ trợ tiêu hóa cho trẻ em",
          "Hỗ trợ tiêu hóa cho người lớn",
          "Hỗ trợ tiêu hóa cho người già",
          "Hỗ trợ tiêu hóa cho người bệnh",
        ],
      },
      {
        title: "Thần kinh não",
        items: [
          "Hỗ trợ tăng cường trí nhớ",
          "Hỗ trợ giảm căng thẳng",
          "Hỗ trợ giảm lo âu",
          "Hỗ trợ giảm stress",
          "Hỗ trợ giảm mệt mỏi",
        ],
      },
      {
        title: "Hỗ trợ làm đẹp",
        items: [
          "Hỗ trợ làm đẹp da",
          "Hỗ trợ làm đẹp tóc",
          "Hỗ trợ làm đẹp móng",
          "Hỗ trợ làm đẹp toàn thân",
          "Hỗ trợ làm đẹp từ bên trong",
        ],
      },
      {
        title: "Sức khỏe tim mạch",
        items: [
          "Hỗ trợ sức khỏe tim mạch",
          "Hỗ trợ huyết áp",
          "Hỗ trợ cholesterol",
          "Hỗ trợ tuần hoàn máu",
          "Hỗ trợ sức khỏe mạch máu",
        ],
      },
    ],
  },
  {
    title: "Tiêm chủng",
    sub: [],
  },
  {
    title: "Bệnh & Góc sức khỏe",
    sub: [
      { title: "Bệnh", items: [] },
      { title: "Góc sức khỏe", items: [] },
      { title: "Bệnh lý", items: [] },
    ],
  },
  { title: "Hệ thống nhà thuốc", sub: [] },
]

const bestSellers = [
  {
    name: "Viên uống NutriGrow",
    price: "480.000đ",
    image: "/images/sanpham1.webp",
  },
  {
    name: "Siro Canxi-D3-K2",
    price: "105.000đ",
    image: "/images/sanpham2.webp",
  },
  {
    name: "Brauer Baby D3+K2",
    price: "396.000đ",
    image: "/images/sanpham3.webp",
  },
]

export default function Menu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number>(0)
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null)
  const menuRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleMouseEnter = (title: string) => {
    if (hideTimeout) clearTimeout(hideTimeout)
    setActiveMenu(title)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveMenu(null)
    }, 200)
    setHideTimeout(timeout)
  }

  // Function to check if the menu item is "Bệnh & Góc sức khỏe"
  const isBenhGocSucKhoe = (title: string) => {
    return title === "Bệnh & Góc sức khỏe"
  }

  // Function to check if the menu should show the mega menu
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const shouldShowMegaMenu = (title: string) => {
    return (
      activeMenu === title && !isBenhGocSucKhoe(title) && (menuData.find((item) => item.title === title)?.sub?.length ?? 0) > 0
    )
  }

  // Function to check if the menu should show the dropdown menu
  const shouldShowDropdown = (title: string) => {
    return activeMenu === title && isBenhGocSucKhoe(title)
  }

  return (
    <header className="bg-[#309d94] shadow-sm border-b z-50 relative sm:flex hidden">
      <nav className="relative max-w-7xl mx-auto px-4 flex items-center content-center gap-10 h-14 text-white">
        {menuData.map((item, index) => (
          <div
            key={item.title}
            className="relative"
            ref={(el) => {
              menuRefs.current[index] = el;
            }}
            onMouseEnter={() => handleMouseEnter(item.title)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-1 text-sm font-medium hover:text-yellow-300 transition">
              {item.title} <ChevronDown size={14} />
            </button>

            {/* Dropdown for "Bệnh & Góc sức khỏe" */}
            {shouldShowDropdown(item.title) && (
              <div
                className="absolute left-0 top-full mt-2 w-[280px] bg-white border rounded-lg shadow-lg z-50 text-black"
                onMouseEnter={() => {
                  if (hideTimeout) clearTimeout(hideTimeout)
                }}
                onMouseLeave={handleMouseLeave}
              >
                {item.sub.map((subItem) => (
                  <div key={subItem.title} className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer transition">
                    {subItem.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Fixed position mega menu */}
      {activeMenu && !isBenhGocSucKhoe(activeMenu) && (
        <div
          className="absolute left-0 top-14 z-50 w-full"
          onMouseEnter={() => {
            if (hideTimeout) clearTimeout(hideTimeout)
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto">
            {(() => {
              const activeMenuData = menuData.find((item) => item.title === activeMenu);
              return (activeMenuData?.sub?.length ?? 0) > 0;
            })() && (
              <div className="p-4 bg-white border rounded-b-lg shadow-xl text-black flex w-full">
                {/* Left: Category list */}
                <div className="w-1/4 border-r bg-gray-50">
                  {menuData
                    .find((item) => item.title === activeMenu)
                    ?.sub.map((cat, idx) => (
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

                {/* Right: Sub-items + optional best sellers */}
                <div className="flex flex-col w-3/4">
                  <div className="p-4">
                    {(menuData.find((item) => item.title === activeMenu)?.sub[hoveredIndex]?.items?.length ?? 0) > 0 ? (
                      <div className="grid grid-cols-3 gap-4">
                        {menuData
                          .find((item) => item.title === activeMenu)
                          ?.sub[hoveredIndex].items.map((subItem) => {
                            const parentSlug = slugify(activeMenu)
                            const childSlug = slugify(
                              menuData.find((item) => item.title === activeMenu)?.sub[hoveredIndex].title || "",
                            )

                            return (
                              <Link key={subItem} href={`/danh-muc/${parentSlug}/${childSlug}`}>
                                <Card className="cursor-pointer hover:border-blue-500 transition">
                                  <CardContent className="p-4 text-sm text-gray-700 font-medium">{subItem}</CardContent>
                                </Card>
                              </Link>
                            )
                          })}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Không có nội dung</div>
                    )}
                  </div>

                  <div className="border-t p-4">
                    <div className="flex gap-2 items-center">
                      <h4 className="text-sm font-semibold mb-0">Bán chạy nhất</h4> |
                      <Link href="/san-pham" className="text-blue-600 text-sm font-medium block">
                        Xem tất cả
                      </Link>
                    </div>
                    <div className="flex gap-4 mt-3">
                      {bestSellers.map((product) => (
                        <div key={product.name} className="flex gap-3 items-center text-sm">
                          <Image
                            width={48}
                            height={48}
                            src={product.image || "/placeholder.svg?height=48&width=48"}
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
          </div>
        </div>
      )}
    </header>
  )
}
