export const API_BASE_URL = "https://nhathuoc.trafficnhanh.com/"

export const API_ENDPOINTS = {
  MAIN_BANNER: `${API_BASE_URL}/banners.php?position=main`,
  RIGHT_BANNER: `${API_BASE_URL}/banners.php?position=right`,
  PRODUCTS: `${API_BASE_URL}/products.php`,
  SUBCATEGORIES: `${API_BASE_URL}/get_product_sub_categories.php`,
  GET_SUBCATEGORY_BY_MAIN_CATEGORY: `${API_BASE_URL}/get_subcategory_by_main_category.php`,
}
  