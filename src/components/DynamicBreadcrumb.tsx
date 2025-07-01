// hooks/useBreadcrumb.ts
import { useState, useEffect } from 'react';

//================================================================//
// 1. ĐỊNH NGHĨA TYPES
//================================================================//
export interface BreadcrumbPart {
  name: string;
  href?: string;
}

export interface CategoryPath {
  category_name?: string | null;
  subcategory_name?: string | null;
  maincategory_name?: string | null;
  category_slug?: string | null;
  subcategory_slug?: string | null;
  maincategory_slug?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categories_full_path?: CategoryPath[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Các thuộc tính khác
}

//================================================================//
// 2. UTILITY FUNCTIONS
//================================================================//

/**
 * Tạo breadcrumb tạm thời từ URL slugs
 */
export const buildInitialBreadcrumbFromSlugs = (slugs: string[]): BreadcrumbPart[] => {
  const homeCrumb: BreadcrumbPart = { name: 'Trang chủ', href: '/' };
  
  if (slugs.length === 0) return [homeCrumb];
  
  let currentPath = '';
  const builtPaths = slugs.map((slug, index) => {
    currentPath += `/${slug}`;
    const displayName = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const isLast = index === slugs.length - 1;
    return {
      name: displayName,
      href: isLast ? undefined : currentPath,
    };
  });
  
  return [homeCrumb, ...builtPaths];
};

/**
 * Tìm path trong categories_full_path khớp với URL slugs
 */
export const findMatchingCategoryPath = (
  allPaths: CategoryPath[], 
  urlSlugs: string[]
): CategoryPath | null => {
  return allPaths.find(path => {
    const pathSlugs = [];
    
    // Xây dựng mảng slug từ path theo thứ tự
    if (path.maincategory_slug) pathSlugs.push(path.maincategory_slug);
    if (path.subcategory_slug) pathSlugs.push(path.subcategory_slug);
    if (path.category_slug) pathSlugs.push(path.category_slug);
    
    // Kiểm tra độ dài và so sánh từng phần tử
    return pathSlugs.length === urlSlugs.length && 
           pathSlugs.every((slug, index) => slug === urlSlugs[index]);
  }) || null;
};

/**
 * Xây dựng breadcrumb chính thức từ API path
 */
export const buildBreadcrumbFromApiPath = (path: CategoryPath): BreadcrumbPart[] => {
  const crumbs: BreadcrumbPart[] = [{ name: 'Trang chủ', href: '/' }];
  
  const segments = [];
  
  // Thêm các cấp theo thứ tự từ cao đến thấp
  if (path.maincategory_name && path.maincategory_slug) {
    segments.push({ name: path.maincategory_name, slug: path.maincategory_slug });
  }
  
  if (path.subcategory_name && path.subcategory_slug) {
    segments.push({ name: path.subcategory_name, slug: path.subcategory_slug });
  }
  
  if (path.category_name && path.category_slug) {
    segments.push({ name: path.category_name, slug: path.category_slug });
  }

  // Xây dựng href tích lũy
  let currentHref = '';
  segments.forEach((segment, index) => {
    currentHref += `/${segment.slug}`;
    const isLast = index === segments.length - 1;
    
    crumbs.push({
      name: segment.name,
      href: isLast ? undefined : currentHref,
    });
  });

  return crumbs;
};

//================================================================//
// 3. BREADCRUMB HOOK
//================================================================//
export interface UseBreadcrumbOptions {
  urlSlugs: string[];
  apiEndpoint?: string;
  enableApiCall?: boolean;
}

export interface UseBreadcrumbReturn {
  breadcrumbPaths: BreadcrumbPart[];
  title: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook tái sử dụng để xây dựng breadcrumb
 */
export const useBreadcrumb = (options: UseBreadcrumbOptions): UseBreadcrumbReturn => {
  const { urlSlugs, apiEndpoint, enableApiCall = true } = options;
  
  const [breadcrumbPaths, setBreadcrumbPaths] = useState<BreadcrumbPart[]>([]);
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Luôn tạo breadcrumb tạm thời trước
    const initialPaths = buildInitialBreadcrumbFromSlugs(urlSlugs);
    setBreadcrumbPaths(initialPaths);
    setTitle(initialPaths[initialPaths.length - 1]?.name || 'Trang');
    
    // Nếu không có API endpoint hoặc không enable API call, dừng ở đây
    if (!enableApiCall || !apiEndpoint || urlSlugs.length === 0) {
      return;
    }

    const fetchAndUpdateBreadcrumb = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data: Product[] = await response.json();
        
        if (data.length > 0 && data[0].categories_full_path) {
          const matchingPath = findMatchingCategoryPath(
            data[0].categories_full_path, 
            urlSlugs
          );
          
          if (matchingPath) {
            // Cập nhật breadcrumb từ API
            const finalPaths = buildBreadcrumbFromApiPath(matchingPath);
            setBreadcrumbPaths(finalPaths);
            setTitle(finalPaths[finalPaths.length - 1]?.name || 'Trang');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Giữ nguyên breadcrumb tạm thời khi có lỗi
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndUpdateBreadcrumb();
  }, [urlSlugs.join('/'), apiEndpoint, enableApiCall]);

  return {
    breadcrumbPaths,
    title,
    isLoading,
    error,
  };
};

//================================================================//
// 4. BREADCRUMB COMPONENT TÁI SỬ DỤNG
//================================================================//
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  paths: BreadcrumbPart[];
  className?: string;
}

export function Breadcrumb({ paths, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`mb-6 ${className}`}>
      <ol className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
        {paths.map((path, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && <ChevronRight size={14} className="text-gray-400" />}
            {path.href ? (
              <Link 
                href={path.href} 
                className="hover:text-blue-600 transition-colors duration-200"
              >
                {path.name}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{path.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

//================================================================//
// 5. HELPER FUNCTIONS CHO CÁC TRƯỜNG HỢP KHÁC
//================================================================//

/**
 * Tạo breadcrumb cho trang sản phẩm đơn lẻ
 */
export const buildProductBreadcrumb = (
  categoryPaths: BreadcrumbPart[], 
  productName: string
): BreadcrumbPart[] => {
  return [
    ...categoryPaths.map(path => ({ ...path, href: path.href })), // Đảm bảo tất cả đều có href
    { name: productName } // Sản phẩm không có href
  ];
};

/**
 * Tạo breadcrumb cho trang tìm kiếm
 */
export const buildSearchBreadcrumb = (searchQuery: string): BreadcrumbPart[] => {
  return [
    { name: 'Trang chủ', href: '/' },
    { name: 'Tìm kiếm', href: '/search' },
    { name: `"${searchQuery}"` }
  ];
};

/**
 * Tạo breadcrumb cho trang thông tin tĩnh
 */
export const buildStaticBreadcrumb = (pages: Array<{ name: string; href?: string }>): BreadcrumbPart[] => {
  return [
    { name: 'Trang chủ', href: '/' },
    ...pages
  ];
};