import Image from "next/image"
import { Banner } from "@/types/banner"
import { API_BASE_URL } from "@/lib/api"

interface RightBannersProps {
  banners: Banner[];
}

export function RightBanners({ banners }: RightBannersProps) {
  return (
    <div className="hidden md:flex md:w-[30%] flex-col gap-4 h-full">
      {banners.map((banner, index) => (
        <div 
          key={`right-${banner.title}-${index}`} 
          className="relative w-full flex-1 group cursor-pointer"
        >
          <Image
            src={`${API_BASE_URL}${banner.image}`}
            alt={banner.title}
            fill
            className="object-cover rounded-2xl shadow-lg"
          />
          <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-50" />
        </div>
      ))}
    </div>
  )
}