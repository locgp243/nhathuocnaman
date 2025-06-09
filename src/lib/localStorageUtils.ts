const CLICK_HISTORY_KEY = "subcategory_click_history"

/**
 * Lưu tên subcategory vào localStorage
 */
export function saveSubcategoryToHistory(subcategory: string) {
  if (!subcategory) return
  try {
    const stored = localStorage.getItem(CLICK_HISTORY_KEY)
    const history: string[] = stored ? JSON.parse(stored) : []
    history.push(subcategory)
    localStorage.setItem(CLICK_HISTORY_KEY, JSON.stringify(history))
  } catch (error) {
    console.error("Lỗi khi lưu lịch sử subcategory:", error)
  }
}

/**
 * Lấy danh sách lịch sử subcategory từ localStorage
 */
export function getClickHistory(): string[] {
  try {
    const stored = localStorage.getItem(CLICK_HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Trả về danh sách subcategory phổ biến nhất theo lịch sử click
 */
export function getPopularSubcategories(history: string[], limit = 5): string[] {
  const counts: Record<string, number> = {}
  history.forEach(sub => {
    counts[sub] = (counts[sub] || 0) + 1
  })

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([subcategory]) => subcategory)
}
