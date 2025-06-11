// lib/mock-data.ts

/**
 * ===================================================================================
 * TYPE & INTERFACE DEFINITIONS
 * Định nghĩa cấu trúc dữ liệu để đảm bảo tính nhất quán
 * ===================================================================================
 */
import { Subcategory } from "@/types/subcategory"; 

// Các loại đơn vị sản phẩm có thể có
export type ProductType = "Hộp" | "Vỉ" | "Ống" | "Chai" | "Gói" | "Hũ" | "Lọ" | "Tuýp";

// Cấu trúc của một đối tượng sản phẩm
export interface Product {
    id: string;
    name: string;
    slug: string;
    image: string;
    category_id: string;
    price: string;
    discount: number;
    rating: number;
    installment: boolean;
    availableTypes: ProductType[];
    prices: Partial<{
        [key in ProductType]: {
            original: number;
            discounted: number;
        };
    }>;
    created_at: string;
    category_name: string;
    category_slug: string;
    subcategory_name: string;
    subcategory_slug: string;
    main_category_name: string;
    main_category_slug: string;
}

// Cấu trúc cho các loại danh mục
export interface CategoryInfo {
    name: string;
    slug: string;
}


/**
 * ===================================================================================
 * MOCK PRODUCT DATA
 * Dữ liệu sản phẩm giả dựa trên JSON bạn cung cấp
 * ===================================================================================
 */
export const mockProducts: Product[] = [
    {
        "id": "109",
        "name": "Máy đo huyết áp cổ tay Omron HEM-6121",
        "slug": "may-do-huyet-ap-omron-hem-6121",
        "image": "/images/sanpham-thietbi1.webp",
        "category_id": "8",
        "price": "690000.00",
        "discount": 10,
        "rating": 5,
        "installment": true,
        "availableTypes": ["Hộp"],
        "prices": { "Hộp": { "original": 690000, "discounted": 621000 } },
        "created_at": "2025-06-04 09:38:10",
        "category_name": "Máy đo cổ tay",
        "category_slug": "may-do-co-tay",
        "subcategory_name": "Máy đo huyết áp",
        "subcategory_slug": "may-do-huyet-ap",
        "main_category_name": "Thiết Bị Y Tế",
        "main_category_slug": "thiet-bi-y-te"
    },
    {
        "id": "105",
        "name": "Viên sủi Vitamin C 2000mg",
        "slug": "vien-sui-vitamin-c-2000mg",
        "image": "/images/sanpham2.webp",
        "category_id": "1",
        "price": "95000.00",
        "discount": 15,
        "rating": 4,
        "installment": false,
        "availableTypes": ["Tuýp"],
        "prices": { "Tuýp": { "original": 95000, "discounted": 80750 } },
        "created_at": "2025-05-30 03:49:36",
        "category_name": "Bổ sung Canxi & Vitamin D",
        "category_slug": "bo-sung-canxi-vitamin-d",
        "subcategory_name": "Vitamin & Khoáng chất",
        "subcategory_slug": "vitamin-khoang-chat",
        "main_category_name": "Thực phẩm chức năng",
        "main_category_slug": "thuc-pham-chuc-nang"
    },
    {
        "id": "103",
        "name": "Viên uống bổ não DHA cho người lớn tuổi",
        "slug": "vien-uong-bo-nao-dha",
        "image": "/images/tpcn3.webp",
        "category_id": "1",
        "price": "260000.00",
        "discount": 10,
        "rating": 5,
        "installment": true,
        "availableTypes": ["Hộp", "Lọ"],
        "prices": { "Lọ": { "original": 200000, "discounted": 180000 }, "Hộp": { "original": 260000, "discounted": 234000 } },
        "created_at": "2025-05-30 03:31:10",
        "category_name": "Bổ sung Canxi & Vitamin D",
        "category_slug": "bo-sung-canxi-vitamin-d",
        "subcategory_name": "Vitamin & Khoáng chất",
        "subcategory_slug": "vitamin-khoang-chat",
        "main_category_name": "Thực phẩm chức năng",
        "main_category_slug": "thuc-pham-chuc-nang"
    },
    {
        "id": "102",
        "name": "Viên bổ gan giải độc gan",
        "slug": "vien-bo-gan-giai-doc",
        "image": "/images/tpcn2.webp",
        "category_id": "1",
        "price": "220000.00",
        "discount": 15,
        "rating": 4,
        "installment": false,
        "availableTypes": ["Hộp"],
        "prices": { "Hộp": { "original": 220000, "discounted": 187000 } },
        "created_at": "2025-05-30 03:31:10",
        "category_name": "Bổ sung Canxi & Vitamin D",
        "category_slug": "bo-sung-canxi-vitamin-d",
        "subcategory_name": "Vitamin & Khoáng chất",
        "subcategory_slug": "vitamin-khoang-chat",
        "main_category_name": "Thực phẩm chức năng",
        "main_category_slug": "thuc-pham-chuc-nang"
    },
    {
        "id": "101",
        "name": "Viên uống Canxi D3 cho người lớn",
        "slug": "vien-uong-canxi-d3-cho-nguoi-lon",
        "image": "/images/tpcn1.webp",
        "category_id": "1",
        "price": "180000.00",
        "discount": 20,
        "rating": 5,
        "installment": true,
        "availableTypes": ["Hộp", "Vỉ"],
        "prices": { "Vỉ": { "original": 30000, "discounted": 24000 }, "Hộp": { "original": 180000, "discounted": 144000 } },
        "created_at": "2025-05-30 03:31:10",
        "category_name": "Bổ sung Canxi & Vitamin D",
        "category_slug": "bo-sung-canxi-vitamin-d",
        "subcategory_name": "Vitamin & Khoáng chất",
        "subcategory_slug": "vitamin-khoang-chat",
        "main_category_name": "Thực phẩm chức năng",
        "main_category_slug": "thuc-pham-chuc-nang"
    },
    {
        "id": "13",
        "name": "Thuốc dạ dày Yumangel",
        "slug": "thuoc-da-day-yumangel",
        "image": "/images/sanpham4.webp",
        "category_id": "9",
        "price": "55000.00",
        "discount": 10,
        "rating": 4,
        "installment": false,
        "availableTypes": ["Gói", "Hộp"],
        "prices": { "Gói": { "original": 55000, "discounted": 49500 }, "Hộp": { "original": 120000, "discounted": 108000 } },
        "created_at": "2025-05-27 08:25:03",
        "category_name": "Dạ dày",
        "category_slug": "da-day",
        "subcategory_name": "Thuốc dạ dày",
        "subcategory_slug": "thuoc-da-day",
        "main_category_name": "Thuốc",
        "main_category_slug": "thuoc"
    },
    {
        "id": "12",
        "name": "Omeprazole 20mg",
        "slug": "omeprazole-20mg",
        "image": "/images/sanpham4.webp",
        "category_id": "6",
        "price": "80000.00",
        "discount": 12,
        "rating": 5,
        "installment": true,
        "availableTypes": ["Hộp"],
        "prices": { "Hộp": { "original": 80000, "discounted": 70400 } },
        "created_at": "2025-05-23 11:36:50",
        "category_name": "Amoxicillin",
        "category_slug": "amoxicillin",
        "subcategory_name": "Thuốc kháng sinh",
        "subcategory_slug": "thuoc-khang-sinh",
        "main_category_name": "Thuốc",
        "main_category_slug": "thuoc"
    },
    {
        "id": "11",
        "name": "Ibuprofen 400mg",
        "slug": "ibuprofen-400mg",
        "image": "/images/sanpham4.webp",
        "category_id": "6",
        "price": "60000.00",
        "discount": 15,
        "rating": 5,
        "installment": false,
        "availableTypes": ["Hộp", "Chai"],
        "prices": { "Chai": { "original": 75000, "discounted": 63750 }, "Hộp": { "original": 60000, "discounted": 51000 } },
        "created_at": "2025-05-23 11:36:50",
        "category_name": "Amoxicillin",
        "category_slug": "amoxicillin",
        "subcategory_name": "Thuốc kháng sinh",
        "subcategory_slug": "thuoc-khang-sinh",
        "main_category_name": "Thuốc",
        "main_category_slug": "thuoc"
    },
    {
        "id": "10",
        "name": "Paracetamol 500mg",
        "slug": "paracetamol-500mg",
        "image": "/images/sanpham4.webp",
        "category_id": "6",
        "price": "45000.00",
        "discount": 10,
        "rating": 4,
        "installment": false,
        "availableTypes": ["Hộp", "Vỉ"],
        "prices": { "Vỉ": { "original": 12000, "discounted": 10800 }, "Hộp": { "original": 45000, "discounted": 40500 } },
        "created_at": "2025-05-23 11:36:50",
        "category_name": "Amoxicillin",
        "category_slug": "amoxicillin",
        "subcategory_name": "Thuốc kháng sinh",
        "subcategory_slug": "thuoc-khang-sinh",
        "main_category_name": "Thuốc",
        "main_category_slug": "thuoc"
    },
    {
        "id": "4",
        "name": "Dầu gội dược liệu Thorakao",
        "slug": "dau-goi-thorakao",
        "image": "/images/sanpham4.webp",
        "category_id": "5",
        "price": "110000.00",
        "discount": 12,
        "rating": 5,
        "installment": false,
        "availableTypes": ["Chai"],
        "prices": { "Chai": { "original": 110000, "discounted": 96800 } },
        "created_at": "2025-05-23 09:50:03",
        "category_name": "Dầu gội trị rụng tóc",
        "category_slug": "dau-goi-tri-rung",
        "subcategory_name": "Dưỡng tóc",
        "subcategory_slug": "duong-toc",
        "main_category_name": "Dược mỹ phẩm",
        "main_category_slug": "duoc-my-pham"
    },
    {
        "id": "3",
        "name": "Sữa rửa mặt Senka Perfect Whip",
        "slug": "senka-perfect-whip",
        "image": "/images/sanpham3.webp",
        "category_id": "4",
        "price": "95000.00",
        "discount": 10,
        "rating": 4,
        "installment": false,
        "availableTypes": ["Tuýp", "Hộp"],
        "prices": { "Hộp": { "original": 180000, "discounted": 162000 }, "Tuýp": { "original": 95000, "discounted": 85500 } },
        "created_at": "2025-05-23 09:50:03",
        "category_name": "Sữa rửa mặt",
        "category_slug": "sua-rua-mat",
        "subcategory_name": "Chăm sóc da",
        "subcategory_slug": "cham-soc-da",
        "main_category_name": "Dược mỹ phẩm",
        "main_category_slug": "duoc-my-pham"
    },
    {
        "id": "2",
        "name": "Viên sủi Vitamin C 1000mg",
        "slug": "vien-sui-vitamin-c-1000mg",
        "image": "/images/sanpham2.webp",
        "category_id": "1",
        "price": "95000.00",
        "discount": 15,
        "rating": 4,
        "installment": false,
        "availableTypes": ["Tuýp"],
        "prices": { "Tuýp": { "original": 95000, "discounted": 80750 } },
        "created_at": "2025-05-30 03:49:36",
        "category_name": "Bổ sung Canxi & Vitamin D",
        "category_slug": "bo-sung-canxi-vitamin-d",
        "subcategory_name": "Vitamin & Khoáng chất",
        "subcategory_slug": "vitamin-khoang-chat",
        "main_category_name": "Thực phẩm chức năng",
        "main_category_slug": "thuc-pham-chuc-nang"
    },
    {
        "id": "1",
        "name": "Viên uống Canxi D3 cho người lớn",
        "slug": "vien-uong-canxi-d3",
        "image": "/images/sanpham1.webp",
        "category_id": "1",
        "price": "180000.00",
        "discount": 20,
        "rating": 5,
        "installment": true,
        "availableTypes": ["Hộp", "Vỉ"],
        "prices": { "Vỉ": { "original": 45000, "discounted": 36000 }, "Hộp": { "original": 180000, "discounted": 144000 } },
        "created_at": "2025-05-23 09:36:51",
        "category_name": "Bổ sung Canxi & Vitamin D",
        "category_slug": "bo-sung-canxi-vitamin-d",
        "subcategory_name": "Vitamin & Khoáng chất",
        "subcategory_slug": "vitamin-khoang-chat",
        "main_category_name": "Thực phẩm chức năng",
        "main_category_slug": "thuc-pham-chuc-nang"
    }
];


/**
 * ===================================================================================
 * DERIVED MOCK DATA
 * Tự động trích xuất dữ liệu danh mục từ danh sách sản phẩm ở trên
 * để đảm bảo tính đồng bộ.
 * ===================================================================================
 */

// Helper function to get unique categories based on a key
const getUniqueCategories = (key: keyof Product): CategoryInfo[] => {
    const uniqueMap = new Map<string, CategoryInfo>();
    mockProducts.forEach(product => {
        const name = product[key] as string;
        const slug = product[`${key.replace('_name', '_slug')}` as keyof Product] as string;
        if (name && !uniqueMap.has(name)) {
            uniqueMap.set(name, { name, slug });
        }
    });
    return Array.from(uniqueMap.values());
};

export const mockMainCategories: CategoryInfo[] = getUniqueCategories('main_category_name');
export const mockCategories: CategoryInfo[] = getUniqueCategories('category_name');

const getUniqueSubcategoriesFromProducts = (): Subcategory[] => {
    const uniqueMap = new Map<string, Subcategory>();
    mockProducts.forEach(product => {
        // Chỉ thêm vào map nếu nó chưa tồn tại
        if (product.subcategory_name && !uniqueMap.has(product.subcategory_name)) {
            uniqueMap.set(product.subcategory_name, {
                // SỬA Ở ĐÂY: Tạo đối tượng Subcategory hoàn chỉnh
                id: product.category_id, // Dùng tạm category_id hoặc slug làm id duy nhất cho mock data
                name: product.subcategory_name,
                slug: product.subcategory_slug
            });
        }
    });
    return Array.from(uniqueMap.values());
};

export const mockSubcategories: Subcategory[] = getUniqueSubcategoriesFromProducts();

/**
 * ===================================================================================
 * HIERARCHICAL MOCK DATA
 * Dữ liệu có cấu trúc phân cấp, rất hữu ích để xây dựng menu, điều hướng
 * ===================================================================================
 */

export interface SubCategoryWithChildren extends CategoryInfo {
    children: CategoryInfo[];
}

export interface MainCategoryWithChildren extends CategoryInfo {
    children: SubCategoryWithChildren[];
}

const buildCategoryTree = (): MainCategoryWithChildren[] => {
    const mainCategoryMap = new Map<string, MainCategoryWithChildren>();

    mockProducts.forEach(product => {
        // Lấy hoặc tạo danh mục chính
        let mainCat = mainCategoryMap.get(product.main_category_name);
        if (!mainCat) {
            mainCat = {
                name: product.main_category_name,
                slug: product.main_category_slug,
                children: []
            };
            mainCategoryMap.set(product.main_category_name, mainCat);
        }

        // Lấy hoặc tạo danh mục con trong danh mục chính
        let subCat = mainCat.children.find(s => s.name === product.subcategory_name);
        if (!subCat) {
            subCat = {
                name: product.subcategory_name,
                slug: product.subcategory_slug,
                children: []
            };
            mainCat.children.push(subCat);
        }
        
        // Lấy hoặc tạo danh mục cấp 3 trong danh mục con
        let finalCat = subCat.children.find(c => c.name === product.category_name);
        if (!finalCat) {
            finalCat = {
                name: product.category_name,
                slug: product.category_slug,
            };
            subCat.children.push(finalCat);
        }
    });

    return Array.from(mainCategoryMap.values());
};

export const mockAllCategories: MainCategoryWithChildren[] = buildCategoryTree();