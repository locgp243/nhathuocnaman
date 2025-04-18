import type React from "react"
import Link from "next/link"
import {
  Brain,
  Pill,
  Heart,
  Shield,
  Stethoscope,
  FlaskConical,
  Apple,
  Syringe,
  Sparkles,
  Eye,
  Gem,
  HeartHandshake,
} from "lucide-react"

interface CategoryProps {
  icon: React.ReactNode
  title: string
  count: number
  href: string
}

const CategoryCard = ({ icon, title, count, href }: CategoryProps) => {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="text-blue-500 mb-2">{icon}</div>
      <h3 className="text-center text-sm font-medium mb-1">{title}</h3>
      <p className="text-xs text-gray-500">{count} sản phẩm</p>
    </Link>
  )
}

export default function FeatureCategories() {
  const categories = [
    {
      icon: <Brain size={24} />,
      title: "Thần kinh não",
      count: 92,
      href: "/categories/than-kinh-nao",
    },
    {
      icon: <Pill size={24} />,
      title: "Vitamin & Khoáng chất",
      count: 172,
      href: "/categories/vitamin-khoang-chat",
    },
    {
      icon: <Heart size={24} />,
      title: "Sức khỏe tim mạch",
      count: 42,
      href: "/categories/suc-khoe-tim-mach",
    },
    {
      icon: <Shield size={24} />,
      title: "Tăng sức đề kháng, miễn dịch",
      count: 62,
      href: "/categories/tang-suc-de-khang",
    },
    {
      icon: <Stethoscope size={24} />,
      title: "Hỗ trợ tiêu hóa",
      count: 113,
      href: "/categories/ho-tro-tieu-hoa",
    },
    {
      icon: <FlaskConical size={24} />,
      title: "Sinh lý - Nội tiết tố",
      count: 82,
      href: "/categories/sinh-ly-noi-tiet-to",
    },
    {
      icon: <Apple size={24} />,
      title: "Dinh dưỡng",
      count: 58,
      href: "/categories/dinh-duong",
    },
    {
      icon: <Syringe size={24} />,
      title: "Hỗ trợ điều trị",
      count: 180,
      href: "/categories/ho-tro-dieu-tri",
    },
    {
      icon: <Sparkles size={24} />,
      title: "Giải pháp làn da",
      count: 100,
      href: "/categories/giai-phap-lan-da",
    },
    {
      icon: <Eye size={24} />,
      title: "Chăm sóc đa mắt",
      count: 212,
      href: "/categories/cham-soc-da-mat",
    },
    {
      icon: <Gem size={24} />,
      title: "Hỗ trợ làm đẹp",
      count: 25,
      href: "/categories/ho-tro-lam-dep",
    },
    {
      icon: <HeartHandshake size={24} />,
      title: "Hỗ trợ tình dục",
      count: 42,
      href: "/categories/ho-tro-tinh-duc",
    },
  ]

  return (
    <div className="max-w-7xl m-auto py-6 px-4">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-blue-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">DANH MỤC SẢN PHẨM</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              icon={category.icon}
              title={category.title}
              count={category.count}
              href={category.href}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
