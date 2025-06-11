"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Banner } from "@/types/banner"
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api"

// Mock data - thay thế bằng API call thực tế
const MOCK_MAIN_BANNERS: Banner[] = [
  {
    title: "Kiểm tra sức khỏe",
    image: "/images/slider-5.webp",
    link: "#",
    sortOrder: 6,
    active: true,
  },
  {
    title: "Tư vấn với Dược Sĩ",
    image: "/images/banner-6.jpg",
    link: "#",
    sortOrder: 2,
    active: true,
  },
  {
    title: "Tìm nhà thuốc",
    image: "/images/banner-7.jpg",
    link: "#",
    sortOrder: 3,
    active: true,
  },
  {
    title: "Đơn của tôi",
    image: "/images/banner-8.jpg",
    link: "#",
    sortOrder: 4,
    active: true,
  },
  {
    title: "Tiêm vaccine",
    image: "/images/slider-5.webp",
    link: "#",
    sortOrder: 5,
    active: true,
  },
  {
    title: "Cần mua thuốc",
    image: "/images/banner-1.webp",
    link: "#",
    sortOrder: 1,
    active: true,
  },
]

const MOCK_RIGHT_BANNERS: Banner[] = [
  {
    title: "Khuyến mãi",
    image: "/images/slider-1.webp",
    link: "#",
    sortOrder: 1,
    active: true,
  },
  {
    title: "Sản phẩm mới",
    image: "/images/slider-3.webp",
    link: "#",
    sortOrder: 2,
    active: true,
  },
  {
    title: "Sản phẩm bán chạy",
    image: "/images/slider-2.webp",
    link: "#",
    sortOrder: 3,
    active: true,
  },
]

// Constants
const AUTO_SLIDE_INTERVAL = 5000
const DRAG_SENSITIVITY = 1.5

export default function HomeBanner() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [mainBanners, setMainBanners] = useState<Banner[]>(MOCK_MAIN_BANNERS)
  const [rightBanners, setRightBanners] = useState<Banner[]>(MOCK_RIGHT_BANNERS)

  // Refs
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  // Utility function to sort banners by order
  const sortBannersByOrder = useCallback((banners: Banner[]) => {
    return banners
      .filter(banner => banner.active)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }, [])

  // Fetch main banners
  const fetchMainBanners = useCallback(async () => {
    try {
      // Uncomment khi có API thực tế
      const response = await fetch(API_ENDPOINTS.MAIN_BANNER)
      const data = await response.json()
      
      if (Array.isArray(data) && data.length > 0) {
        const sortedBanners = sortBannersByOrder(data)
        setMainBanners(sortedBanners)
      }
    } catch (error) {
      console.error("Failed to fetch main banners:", error)
      // Fallback to mock data
      setMainBanners(sortBannersByOrder(MOCK_MAIN_BANNERS))
    }
  }, [sortBannersByOrder])

  // Fetch right banners  
  const fetchRightBanners = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.RIGHT_BANNER)
      const data = await response.json()
      
      if (Array.isArray(data) && data.length > 0) {
        console.log("Banner right data:", data)
        const sortedBanners = sortBannersByOrder(data)
        setRightBanners(sortedBanners)
      }
    } catch (error) {
      console.error("Failed to fetch right banners:", error)
      // Fallback to mock data
      setRightBanners(sortBannersByOrder(MOCK_RIGHT_BANNERS))
    }
  }, [sortBannersByOrder])

  // Auto slide effect
  useEffect(() => {
    if (mainBanners.length === 0) return

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % mainBanners.length)
    }, AUTO_SLIDE_INTERVAL)

    return () => clearInterval(interval)
  }, [mainBanners.length])

  // Auto scroll to active tab
  useEffect(() => {
    const scrollContainer = scrollRef.current
    const activeTab = tabRefs.current[currentBannerIndex]

    if (scrollContainer && activeTab) {
      const containerRect = scrollContainer.getBoundingClientRect()
      const tabRect = activeTab.getBoundingClientRect()

      const offset =
        tabRect.left -
        containerRect.left +
        scrollContainer.scrollLeft -
        containerRect.width / 2 +
        tabRect.width / 2

      scrollContainer.scrollTo({
        left: offset,
        behavior: "smooth",
      })
    }
  }, [currentBannerIndex])

  // Initial data fetch
  useEffect(() => {
    fetchMainBanners()
    fetchRightBanners()
  }, [fetchMainBanners, fetchRightBanners])

  // Navigation handlers
  const navigateBanner = useCallback((direction: "prev" | "next") => {
    setCurrentBannerIndex((prev) => {
      if (direction === "prev") {
        return prev === 0 ? mainBanners.length - 1 : prev - 1
      }
      return (prev + 1) % mainBanners.length
    })
  }, [mainBanners.length])

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true
    startXRef.current = e.pageX - (scrollRef.current?.offsetLeft || 0)
    scrollLeftRef.current = scrollRef.current?.scrollLeft || 0
  }, [])

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return
    e.preventDefault()
    
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startXRef.current) * DRAG_SENSITIVITY
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk
  }, [])

  // Early return if no data
  if (mainBanners.length === 0) {
    return (
      <div className="max-w-7xl m-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 h-[400px]">
          {/* Main Banner Skeleton */}
          <div className="w-full h-full md:w-[65%] relative">
            <Skeleton className="w-full h-[320px] rounded-t-xl" />
            <div className="flex h-[80px] bg-white rounded-b-lg gap-2 p-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-12 flex-1 min-w-[100px]" />
              ))}
            </div>
          </div>
          
          {/* Right Banner Skeleton */}
          <div className="hidden md:flex md:w-[35%] flex-col gap-4 h-full">
            <Skeleton className="w-full flex-1 rounded-2xl" />
            <Skeleton className="w-full flex-1 rounded-2xl" />
            <Skeleton className="w-full flex-1 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl m-auto px-4 py-6  animate-bg-shimmer">
      <div className="flex flex-col md:flex-row gap-4 h-[400px]">
        {/* Main Banner Section */}
        <div className="w-full h-full md:w-[65%] relative rounded-xl overflow-hidden">
          {/* Banner Images Container */}
          <div className="w-full h-[320px] relative">
            {mainBanners.map((banner, index) => (
              <div
                key={`${banner.title}-${index}`}
                className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  currentBannerIndex === index
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                )}
              >
                <Image
                  src={`${API_BASE_URL}${banner.image}`}
                  alt={banner.title}
                  fill
                  className="object-cover rounded-t-xl"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => navigateBanner("prev")}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors z-10"
            aria-label="Banner trước"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={() => navigateBanner("next")}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors z-10"
            aria-label="Banner tiếp theo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Navigation Tabs */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex overflow-x-auto h-[80px] bg-white rounded-b-lg text-sm font-medium cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mainBanners.map((banner, index) => (
              <button
                key={`tab-${banner.title}-${index}`}
                ref={(el) => {
                  tabRefs.current[index] = el
                }}
                onClick={() => setCurrentBannerIndex(index)}
                className={cn(
                  "py-4 px-3 whitespace-nowrap transition-all min-w-fit",
                  currentBannerIndex === index
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-black"
                )}
              >
                <div className="uppercase">{banner.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Banner Section */}
        <div className="hidden md:flex md:w-[35%] flex-col gap-4 h-full">
          {rightBanners.map((banner, index) => (
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
      </div>
    </div>
  )
}