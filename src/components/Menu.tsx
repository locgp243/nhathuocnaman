"use client"

import { useEffect, useState, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { API_BASE_URL } from "@/lib/api"

// --- Interfaces (giữ nguyên như lần cập nhật trước) ---
interface Product {
  id: string
  name: string
  price: string
  image: string | null
  slug: string
  discount?: string
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

interface MenuItem extends CategoryBase {
  promos: Product[]
}

interface MenuSub extends CategoryBase {
  items: MenuItem[]
}

interface MenuMain extends CategoryBase {
  sub: MenuSub[]
  category_type: string
}

export default function Menu() {
  const [menuData, setMenuData] = useState<MenuMain[]>([
    // Initial state (IDs là chuỗi, thêm image_url)
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
        // Sắp xếp menu cấp cao nhất theo position
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
    
    // Chỉ set activeMenu nếu bản thân menuItem đó active và có sub-items (nếu extend=false) hoặc là mega menu (extend=true)
    // Hoặc nếu là menu đơn giản không có sub-items nhưng vẫn muốn nó active khi hover (ví dụ: chỉ là link) thì bỏ check item.sub.length
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

  // Lọc các sub-items và items dựa trên cờ active của chúng
  const getActiveSubItems = (menuItem: MenuMain | undefined) => {
    return menuItem?.sub?.filter(sub => sub.active) || [];
  }

  const getActiveItemsInSub = (subItem: MenuSub | undefined) => {
    return subItem?.items?.filter(item => item.active) || [];
  }


  return (
    <header className="bg-primary shadow-sm border-b z-50 relative sm:flex hidden animate-bg-flow">
      <nav className="relative max-w-7xl mx-auto px-4 flex items-center gap-10 h-14 text-white">
        {/* Lọc các mục menu chính có active = true */}
        {menuData.filter(item => item.active).map((item, index) => (
          <div
            key={item.id}
            className="relative"
            ref={(el) => { menuRefs.current[index] = el; }}
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              className="flex items-center gap-1 text-md font-medium hover:text-yellow-300 transition-colors duration-200"
              onClick={() => {
                localStorage.setItem("title_main_categories", item.title);
                const prefix = item.category_type === "post" ? "/tin-tuc" : "";
                window.location.href = `${prefix}/${item.slug}`;
              }}

            >
              {item.title} 
              {/* Chevron chỉ hiển thị nếu item.active (đã được lọc) 
                  VÀ (nó là mega menu HOẶC nó là simple menu và CÓ sub-items active) */}
              {item.active && (item.extend || getActiveSubItems(item).length > 0) && <ChevronDown size={14} />}
            </button>

            {/* Simple Menu Dropdown: chỉ hiển thị nếu item này đang active, bản thân nó active, extend = false VÀ CÓ sub-items active */}
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
                            <Image width={20} height={20} src={subItem.image_url} alt={subItem.title} className="rounded-full object-cover" />
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
                  {/* Thông báo này sẽ không hiển thị nếu đã lọc ở trên */}
                  {/* {getActiveSubItems(item).length === 0 && (
                    <div className="text-sm text-gray-500 text-center py-4">
                      Chưa có danh mục con active
                    </div>
                  )} */}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Mega Menu Dropdown: chỉ hiển thị nếu currentActiveMenuConfig tồn tại, active, extend = true VÀ CÓ sub-items active */}
      {currentActiveMenuConfig && currentActiveMenuConfig.active && currentActiveMenuConfig.extend && getActiveSubItems(currentActiveMenuConfig).length > 0 && (
        <div
          className="absolute left-0 top-14 z-50 w-full"
          onMouseEnter={() => hideTimeout && clearTimeout(hideTimeout)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto">
            <div className="p-4 bg-white border rounded-b-lg shadow-xl text-black flex w-full">
              {/* Sidebar Categories: Lọc các sub-item active */}
              <div className="w-1/4 border-r bg-gray-50">
                {getActiveSubItems(currentActiveMenuConfig).map((cat: MenuSub, idx: number) => (
                  <div
                    key={cat.id}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    className={`px-4 py-3 cursor-pointer hover:bg-blue-100 text-sm transition-colors duration-200 ${
                      // Cần lấy index dựa trên mảng đã lọc
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
                ))}
              </div>

              {/* Main Content */}
              <div className="flex flex-col w-3/4">
                <div className="p-4">
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
                              <Link key={menuItem.id} href={`/danh-muc/${parentSlugL1}/${parentSlugL2}/${menuItem.slug}`}>
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

                {/* Promotions Section - Vẫn là rỗng */}
                <div className="border-t p-4">
                  <div className="flex gap-2 items-center mb-3">
                    <h4 className="text-sm font-semibold text-gray-800">🔥 Ưu đãi nổi bật</h4>
                  </div>
                   <div className="text-sm text-gray-500 text-center py-4">
                      Chưa có ưu đãi
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}