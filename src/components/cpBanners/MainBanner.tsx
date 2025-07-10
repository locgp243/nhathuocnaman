"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Banner } from "@/types/banner"
import { API_BASE_URL } from "@/lib/api"

// Constants
const AUTO_SLIDE_INTERVAL = 5000
const DRAG_SENSITIVITY = 1.5

interface MainBannerProps {
  banners: Banner[];
}

export function MainBanner({ banners }: MainBannerProps) {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)

  // Refs
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  // Auto slide effect
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Auto scroll to active tab
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const activeTab = tabRefs.current[currentBannerIndex];
    if (scrollContainer && activeTab) {
      const offset = activeTab.offsetLeft + activeTab.clientWidth / 2 - scrollContainer.clientWidth / 2;
      scrollContainer.scrollTo({ left: offset, behavior: "smooth" });
    }
  }, [currentBannerIndex]);

  // Navigation handlers
  const navigateBanner = useCallback((direction: "prev" | "next") => {
    setCurrentBannerIndex((prev) => {
      if (direction === "prev") {
        return prev === 0 ? banners.length - 1 : prev - 1;
      }
      return (prev + 1) % banners.length;
    });
  }, [banners.length]);

  // Drag handlers (Giữ nguyên logic của em, đã tốt)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  }, []);
  const handleMouseUp = useCallback(() => { isDraggingRef.current = false; }, []);
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * DRAG_SENSITIVITY;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  }, []);

  return (
    // <--- THAY ĐỔI 1: Chỉ áp dụng chiều cao 400px cho desktop
    <div className="w-full md:w-[70%] relative rounded-xl overflow-hidden shadow-lg md:h-[400px]">
      
      {/* Container chung cho ảnh và nút, để định vị các nút dễ hơn */}
      <div className="relative">
        {/* <--- THAY ĐỔI 2: Dùng aspect-ratio thay cho h-[320px] */}
        <div className="w-full aspect-[2/1] bg-gray-200 md:aspect-auto md:h-[320px] relative">
          {banners.map((banner, index) => (
            <div
              key={`${banner.title}-${index}`}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-in-out",
                currentBannerIndex === index ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <Image
                src={`${API_BASE_URL}${banner.image}`}
                alt={banner.title}
                fill
                // <--- THAY ĐỔI 3: Thêm sizes để tối ưu ảnh cho mobile
                sizes="(max-width: 768px) 100vw, 70vw"
                // Bỏ rounded-t-xl vì div cha đã có overflow-hidden
                className="object-cover" 
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* <--- THAY ĐỔI 4: Điều chỉnh vị trí nút để nằm trong vùng ảnh */}
        <button
          onClick={() => navigateBanner("prev")}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 md:p-2 hover:bg-white transition-colors z-10"
          aria-label="Banner trước"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => navigateBanner("next")}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 md:p-2 hover:bg-white transition-colors z-10"
          aria-label="Banner tiếp theo"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Tabs (Giữ nguyên) */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex overflow-x-auto h-[80px] bg-white text-sm font-medium cursor-grab active:cursor-grabbing select-none border-t border-gray-100"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {banners.map((banner, index) => (
          <button
            key={`tab-${banner.title}-${index}`}
            ref={(el) => { tabRefs.current[index] = el; }}
            onClick={() => setCurrentBannerIndex(index)}
            className={cn(
              "py-4 px-3 whitespace-nowrap transition-all min-w-fit flex-1 md:flex-none",
              currentBannerIndex === index ? "text-red-600 border-b-2 border-red-600 font-semibold" : "text-gray-600 hover:text-black"
            )}
          >
            <div className="uppercase">{banner.title}</div>
          </button>
        ))}
      </div>
    </div>
  )
}