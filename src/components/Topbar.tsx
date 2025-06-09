'use client'

import { Truck, BadgeCheck, Smartphone } from 'lucide-react'

export default function Topbar() {
  return (
    <div className="bg-secondary h-10 overflow-hidden">
      <div className="max-w-[1200px] mx-auto h-full text-[18px] text-white font-medium px-4 flex items-center">
        <div className="relative w-full overflow-hidden group">
          <div className="flex gap-10 animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
            <div className="flex items-center gap-1">
              <BadgeCheck size={24} className="text-[#001952]" />
              Sản phẩm <span className="font-bold">Chính hãng - Xuất VAT</span> đầy đủ
            </div>
            <div className="flex items-center gap-1">
              <Smartphone size={24} className="text-red-600" />
              <span className="text-red-600 font-bold">Vào Zalo Mini App</span> - Tích điểm & nhận ưu đãi
            </div>
            <div className="flex items-center gap-1">
              <Truck size={24} className="text-[#001952]" />
              <span className="font-bold">Giao nhanh - Miễn phí</span> cho đơn từ 300K
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
