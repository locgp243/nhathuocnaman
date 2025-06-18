// src/lib/localStorageUtils.ts

// CHANGED: Đổi key để tránh xung đột với dữ liệu cũ (lưu tên thay vì slug)
const HISTORY_KEY = 'categoryClickHistory_slugs'; 
const MAX_HISTORY_SIZE = 30;

/**
 * Lấy lịch sử các SLUG danh mục đã click từ localStorage.
 */
export const getClickHistory = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Lỗi khi đọc lịch sử từ localStorage", error);
    return [];
  }
};

/**
 * Lưu một SLUG danh mục vào lịch sử click.
 * Nếu slug đã tồn tại, nó sẽ được đưa lên đầu danh sách.
 */
export const saveCategoryToHistory = (categorySlug: string): void => {
  if (typeof window === 'undefined' || !categorySlug) return;
  try {
    const history = getClickHistory();
    
    // Xóa slug nếu đã tồn tại để đưa lên đầu
    const existingIndex = history.indexOf(categorySlug);
    if (existingIndex > -1) {
      history.splice(existingIndex, 1);
    }

    // Luôn thêm slug vừa click vào đầu danh sách
    history.unshift(categorySlug);

    const newHistory = history.slice(0, MAX_HISTORY_SIZE);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Lỗi khi lưu lịch sử vào localStorage", error);
  }
};