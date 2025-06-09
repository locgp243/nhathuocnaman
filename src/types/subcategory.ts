export interface Subcategory {
  id: string
  name: string
  slug: string
}

export type TPCNSubcategory =
  | "Bổ não"
  | "Tiêu hóa"
  | "Bổ mắt"
  | "Tăng cường miễn dịch"
  | "Bổ tim mạch"
  | "Vitamin tổng hợp"

export type ProductSubcategory = TPCNSubcategory
