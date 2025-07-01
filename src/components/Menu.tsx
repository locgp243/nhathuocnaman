"use client"

import { useEffect, useState, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { API_BASE_URL } from "@/lib/api"

// === START: INTERFACES ĐÃ ĐƯỢC CẬP NHẬT CHO CHÍNH XÁC ===
// Interface này mô tả đúng dữ liệu sản phẩm trong mảng 'promos' từ API
interface PromoProduct {
  id: number;
  name: string;
  slug: string;
  sale_price: string;
  price: string; // Đây là giá gốc
  image_url: string | null;
}

interface CategoryBase {
  id: string
  title: string
  slug: string
  position: number
  active: boolean
  extend: boolean
  image_url: string | null
}

// Đây là danh mục cấp 3 (menu item)
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MenuItem extends CategoryBase {
  // Không có promos ở cấp này
}

// Đây là danh mục cấp 2 (sub menu), chứa các promos
interface MenuSub extends CategoryBase {
  items: MenuItem[]
  promos: PromoProduct[] // Mảng promos thuộc về danh mục cấp 2
}

interface MenuMain extends CategoryBase {
  sub: MenuSub[]
  category_type: string
}
// === END: INTERFACES ĐÃ ĐƯỢC CẬP NHẬT ===


export default function Menu() {
  // Giữ nguyên state và logic của bạn
  const [menuData, setMenuData] = useState<MenuMain[]>([
    { id: "1", title: "Thực phẩm chức năng", slug: "thuc-pham-chuc-nang", position: 1, active: true, extend: true, image_url: null, sub: [], category_type: "product" },
    { id: "2", title: "Dược mỹ phẩm", slug: "duoc-my-pham", position: 2, active: true, extend: true, image_url: null, sub: [], category_type: "product" },
    { id: "3", title: "Thuốc", slug: "thuoc", position: 3, active: true, extend: true, image_url: null, sub: [], category_type: "product" },
    { id: "4", title: "Chăm sóc cá nhân", slug: "cham-soc-ca-nhan", position: 4, active: true, extend: true, image_url: null, sub: [], category_type: "product" },
    { id: "5", title: "Thiết bị y tế", slug: "thiet-bi-y-te", position: 5, active: true, extend: true, image_url: null, sub: [], category_type: "product" },
    { id: "6", title: "Bệnh & Góc sức khỏe", slug: "benh-goc-suc-khoe", position: 6, active: true, extend: false, image_url: null, sub: [], category_type: "post" },
  ])
  
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number>(0)
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null)
  const menuRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    fetch("https://nhathuoc.trafficnhanh.com/categories.php?")
      .then((res) => res.json())
      .then((data: MenuMain[]) => {
        const mergedData = data.map((apiItem) => {
          const localConfig = menuData.find(m => m.id === apiItem.id);
          return {
            ...apiItem,
            active: localConfig?.active ?? apiItem.active,
            extend: localConfig?.extend ?? apiItem.extend,
          };
        });
        mergedData.sort((a, b) => (a.position || 0) - (b.position || 0));
        setMenuData(mergedData);
        console.log("Menu data loaded and merged: ", mergedData);
      })
      .catch((err) => console.error("Lỗi khi load menu:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = (menuId: string) => {
    if (hideTimeout) clearTimeout(hideTimeout);
    const menuItem = menuData.find(item => item.id === menuId);
    
    if (menuItem?.active) {
      setActiveMenu(menuId);
      setHoveredIndex(0);
    }
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setActiveMenu(null), 300);
    setHideTimeout(timeout);
  }

  const getMenuConfigById = (id: string | null) => {
    if (!id) return undefined;
    return menuData.find(item => item.id === id);
  }

  const currentActiveMenuConfig = getMenuConfigById(activeMenu);

  const getActiveSubItems = (menuItem: MenuMain | undefined) => {
    return menuItem?.sub?.filter(sub => sub.active) || [];
  }

  const getActiveItemsInSub = (subItem: MenuSub | undefined) => {
    return subItem?.items?.filter(item => item.active) || [];
  }


  return (
    <header className="bg-primary shadow-sm border-b z-50 relative sm:flex hidden animate-bg-flow">
      <nav className="relative max-w-7xl mx-auto px-4 flex items-center gap-10 h-14 text-white">
        {menuData.filter(item => item.active).map((item, index) => (
          <div
            key={item.id}
            className="relative"
            ref={(el) => { menuRefs.current[index] = el; }}
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              className="cursor-pointer flex items-center gap-1 text-md font-medium hover:text-yellow-300 transition-colors duration-200"
              onClick={() => {
                localStorage.setItem("title_main_categories", item.title);
                // Sửa lại logic điều hướng cho đúng
                const prefix = item.category_type === "post" ? "/tin-tuc" : "";
                window.location.href = `${prefix}/${item.slug}`;
              }}
            >
              {item.title} 
              {item.active && (item.extend || getActiveSubItems(item).length > 0) && <ChevronDown size={14} />}
            </button>

            {/* Simple Menu Dropdown: Logic của bạn được giữ nguyên */}
            {activeMenu === item.id && item.active && !item.extend && getActiveSubItems(item).length > 0 && (
              <div
                className="absolute left-0 top-full mt-2 w-[320px] bg-white border rounded-lg shadow-xl z-50 text-black"
                onMouseEnter={() => hideTimeout && clearTimeout(hideTimeout)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="p-4">
                  <div className="space-y-1">
                    {getActiveSubItems(item).map((subItem: MenuSub) => (
                      <Link
                        key={subItem.id}
                        href={`/tin-tuc/${item.slug}/${subItem.slug}`}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md cursor-pointer transition-colors duration-200"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {subItem.image_url ? (
                            <Image width={20} height={20} src={`${API_BASE_URL}${subItem.image_url}`} alt={subItem.title} className="rounded-full object-cover" />
                          ) : (
                            <span className="text-blue-600 text-xs font-medium">
                              {subItem.title.charAt(0)}
                            </span>
                          )}
                        </div>
                        <span className="flex-1">{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Mega Menu Dropdown: Logic của bạn được giữ nguyên */}
      {currentActiveMenuConfig && currentActiveMenuConfig.active && currentActiveMenuConfig.extend && getActiveSubItems(currentActiveMenuConfig).length > 0 && (
        <div
          className="absolute left-0 top-14 z-50 w-full"
          onMouseEnter={() => hideTimeout && clearTimeout(hideTimeout)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto">
            <div className="p-4 bg-white border rounded-b-lg shadow-xl text-black flex w-full">
              {/* Sidebar Categories: ĐÃ CẬP NHẬT VỚI LINK */}
              <div className="w-1/4 border-r bg-gray-50">
                  {getActiveSubItems(currentActiveMenuConfig).map((cat: MenuSub, idx: number) => {
                      // Lấy slug của danh mục cha (cấp 1)
                      const parentSlugL1 = currentActiveMenuConfig.slug;
                      // Tạo đường dẫn URL hoàn chỉnh cho danh mục cấp 2
                      const href = `/${parentSlugL1}/${cat.slug}`;

                      return (
                          <Link key={cat.id} href={href}>
                              <div
                                  onMouseEnter={() => setHoveredIndex(idx)}
                                  className={`px-4 py-3 cursor-pointer hover:bg-blue-100 text-sm transition-colors duration-200 ${
                                      getActiveSubItems(currentActiveMenuConfig)[hoveredIndex]?.id === cat.id ? "bg-blue-100 font-semibold" : ""
                                  }`}
                              >
                                  <div className="flex items-center gap-3">
                                      <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                                          {cat.image_url !== null ? (
                                              <Image width={18} height={18} src={`${API_BASE_URL}${cat.image_url}`} alt={cat.title} className="rounded-full object-cover" />
                                          ) : (
                                              <span className="text-blue-700 text-xs font-medium">
                                                  {cat.title.charAt(0)}
                                              </span>
                                          )}
                                      </div>
                                      <span>{cat.title}</span>
                                  </div>
                              </div>
                          </Link>
                      );
                  })}
              </div>

              {/* Main Content: Logic của bạn được giữ nguyên */}
              <div className="flex flex-col w-3/4">
                <div className="p-4 flex-grow"> {/* Thêm flex-grow để đẩy section promo xuống dưới */}
                  {(() => {
                    const activeSubCategories = getActiveSubItems(currentActiveMenuConfig);
                    const currentHoveredSubCategory = activeSubCategories[hoveredIndex];
                    const activeMenuItems = getActiveItemsInSub(currentHoveredSubCategory);

                    if (activeMenuItems.length > 0) {
                      return (
                        <div className="grid grid-cols-3 gap-4">
                          {activeMenuItems.map((menuItem: MenuItem) => {
                            const parentSlugL1 = currentActiveMenuConfig.slug;
                            const parentSlugL2 = currentHoveredSubCategory.slug;
                            return (
                              <Link key={menuItem.id} href={`/${parentSlugL1}/${parentSlugL2}/${menuItem.slug}`}>
                                <Card className="cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200 h-full">
                                  <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        {menuItem.image_url !== null ? (
                                          <Image width={24} height={24} src={`${API_BASE_URL}${menuItem.image_url}`} alt={menuItem.title} className="rounded-lg object-cover"/>
                                        ): (
                                          <span className="text-white text-xs font-medium">
                                            {menuItem.title.charAt(0)}
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-sm text-gray-700 font-medium">
                                        {menuItem.title}
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            );
                          })}
                        </div>
                      );
                    } else {
                      return (
                        <div className="text-sm text-gray-500 text-center py-8">
                          Chưa có mục con active trong danh mục này
                        </div>
                      );
                    }
                  })()}
                </div>

                {/* === START: PROMOTIONS SECTION ĐÃ ĐƯỢC THAY THẾ === */}
                <div className="border-t p-4 mt-auto"> {/* Thêm mt-auto để đẩy section này xuống dưới cùng */}
                  <div className="flex gap-2 items-center mb-3">
                    <h4 className="text-sm font-semibold text-gray-800">🔥 Ưu đãi nổi bật</h4>
                  </div>
                  {(() => {
                    // Lấy ra danh mục cấp 2 đang được hover
                    const activeSubCategories = getActiveSubItems(currentActiveMenuConfig);
                    const currentHoveredSubCategory = activeSubCategories[hoveredIndex];
                    // Lấy mảng promos từ danh mục đó
                    const promos = currentHoveredSubCategory?.promos || [];

                    // Nếu có sản phẩm promo thì hiển thị
                    if (promos.length > 0) {
                      return (
                        <div className="grid grid-cols-2 gap-4">
                          {promos.map((promo: PromoProduct) => (
                            <Link key={promo.id} href={`/san-pham/${promo.slug}`} className="group">
                              <Card className="p-3 hover:border-blue-500 transition-colors duration-200 h-full">
                                <div className="flex gap-3 items-center">
                                  <div className="flex-shrink-0">
                                    {promo.image_url && (
                                      <Image
                                        src={`${API_BASE_URL}${promo.image_url}`}
                                        alt={promo.name}
                                        width={80}
                                        height={80}
                                        className="rounded-md object-cover border"
                                      />
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 line-clamp-2 leading-tight">
                                      {promo.name}
                                    </p>
                                    <div className="flex items-baseline gap-2 mt-1">
                                      <p className="text-base font-semibold text-red-600">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(promo.sale_price))}
                                      </p>
                                      {/* Chỉ hiển thị giá gốc nếu nó khác giá bán */}
                                      {Number(promo.price) > Number(promo.sale_price) && (
                                        <p className="text-xs text-gray-500 line-through">
                                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(promo.price))}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      );
                    } else {
                      // Nếu không có thì hiển thị thông báo
                      return (
                        <div className="text-sm text-gray-500 text-center py-4">
                          Chưa có ưu đãi nổi bật.
                        </div>
                      );
                    }
                  })()}
                </div>
                {/* === END: PROMOTIONS SECTION === */}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}