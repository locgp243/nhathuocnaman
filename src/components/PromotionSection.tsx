"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const bannerTabs = [
  {
    title: "MỪNG KHAI TRƯƠNG",
    description: "Ưu đãi cực khủng",
    image: "/images/banner-3.jpg",
  },
  {
    title: "IPHONE 16 PRO MAX",
    description: "Lên đời ngay",
    image: "/images/slider-2.webp",
  },
  {
    title: "OPPO FIND N5",
    description: "Ưu đãi tốt mua ngay",
    image: "/images/slider-3.webp",
  },
  {
    title: "GALAXY S25 ULTRA",
    description: "Giá tốt chốt ngay",
    image: "/images/slider-4.webp",
  },
  {
    title: "MACBOOK AIR M4",
    description: "Mua ngay",
    image: "/images/slider-5.webp",
  },
  {
    title: "MACBOOK AIR M5",
    description: "Mua ngay",
    image: "/images/slider-5.webp",
  },
]

export default function ProductShowcase() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerTabs.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const navigateBanner = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentBannerIndex((prev) =>
        prev === 0 ? bannerTabs.length - 1 : prev - 1
      )
    } else {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerTabs.length)
    }
  }

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  const startDragging = (e: React.MouseEvent) => {
    isDraggingRef.current = true
    startXRef.current = e.pageX - (scrollRef.current?.offsetLeft || 0)
    scrollLeftRef.current = scrollRef.current?.scrollLeft || 0
  }

  const stopDragging = () => {
    isDraggingRef.current = false
  }

  const handleDragging = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startXRef.current) * 1.5 // tốc độ kéo
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk
  }

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const activeTab = tabRefs.current[currentBannerIndex]
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      })
    }
  }, [currentBannerIndex])


  return (
    <div className="max-w-7xl m-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-4 h-[400px]">
        <div className="w-full h-full md:w-[65%] relative rounded-xl overflow-hidden">
          {/* Container ảnh */}
          <div className="w-full h-[320px] relative">
            {bannerTabs.map((tab, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  currentBannerIndex === index
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                )}
              >
                <Image
                  src={tab.image}
                  alt={`Banner ${index + 1}`}
                  fill
                  className="object-cover rounded-t-xl"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Nút prev */}
          <button
            onClick={() => navigateBanner("prev")}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors z-10"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Nút next */}
          <button
            onClick={() => navigateBanner("next")}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors z-10"
            aria-label="Next banner"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Tabs điều hướng */}
          <div
            ref={scrollRef}
            onMouseDown={startDragging}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
            onMouseMove={handleDragging}
            className="flex overflow-x-auto h-[80px] justify-between bg-white rounded-b-lg text-sm font-medium your-custom-scroll cursor-grab active:cursor-grabbing select-none"
          >
            {bannerTabs.map((tab, index) => (
              <button
                key={index}
                ref={(el) => {
                  tabRefs.current[index] = el
                }}
                onClick={() => setCurrentBannerIndex(index)}
                className={cn(
                  "py-4 px-3 whitespace-nowrap transition-all",
                  currentBannerIndex === index
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-black"
                )}
              >
                <div className="uppercase">{tab.title}</div>
                <div className="text-xs">{tab.description}</div>
              </button>
            ))}
          </div>
        </div>


        {/* Bên phải: banner nhỏ */}
        <div className="hidden md:flex md:w-[35%] flex-col gap-4 h-full justify-between">
          {["/images/slider-1.webp", "/images/slider-3.webp", "/images/slider-2.webp"].map(
            (img, idx) => (
              <div key={idx} className="relative w-full h-1/2">
                <Image
                  src={img}
                  alt={`Promotion ${idx}`}
                  fill
                  className="object-cover rounded-2xl shadow-lg"
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
