"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface Partner {
  name: string
  logo: string
}

export default function PartnersNetwork() {
  const [windowWidth, setWindowWidth] = useState<number>(0)

  useEffect(() => {
    // Set initial window width
    setWindowWidth(window.innerWidth)

    // Update window width on resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const partners: Partner[] = [
    { name: "Sanofi", logo: "/placeholder.svg?text=Sanofi&width=80&height=40" },
    { name: "GSK", logo: "/placeholder.svg?text=GSK&width=80&height=40" },
    { name: "Pfizer", logo: "/placeholder.svg?text=Pfizer&width=80&height=40" },
    { name: "Bidiphar", logo: "/placeholder.svg?text=Bidiphar&width=80&height=40" },
    { name: "Domesco", logo: "/placeholder.svg?text=Domesco&width=80&height=40" },
    { name: "AstraZeneca", logo: "/placeholder.svg?text=AstraZeneca&width=80&height=40" },
    { name: "Bayer", logo: "/placeholder.svg?text=Bayer&width=80&height=40" },
    { name: "Imexpharm", logo: "/placeholder.svg?text=Imexpharm&width=80&height=40" },
    { name: "Haphaco", logo: "/placeholder.svg?text=Haphaco&width=80&height=40" },
    { name: "DHG Pharma", logo: "/placeholder.svg?text=DHG&width=80&height=40" },
    { name: "Nanson Pharma", logo: "/placeholder.svg?text=Nanson&width=80&height=40" },
  ]

  // Calculate positions for partners in a circular layout
  const getPartnerPositions = () => {
    const centerX = windowWidth > 768 ? 500 : windowWidth / 2
    const centerY = windowWidth > 768 ? 200 : 300
    const radius = windowWidth > 768 ? 300 : Math.min(windowWidth * 0.4, 200)

    return partners.map((partner, index) => {
      const angle = (index * 2 * Math.PI) / partners.length
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      return {
        ...partner,
        x: x,
        y: y,
      }
    })
  }

  const partnerPositions = getPartnerPositions()

  return (
    <div className="w-full bg-gray-50 py-12 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Header */}
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-green-800 inline-block relative">
              ĐỐI TÁC CỦA NAM AN
              <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400"></span>
            </h2>
          </div>

          {/* Network visualization */}
          <div className="relative h-[400px] md:h-[500px]">
            {/* Center text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-[200px] md:w-[300px] z-10">
              <p className="text-sm md:text-base text-green-700">
                Với hơn 12 năm hoạt động, Giá Thuốc Tốt đã hợp tác với hơn{" "}
                <span className="font-bold">1000+ đối tác</span> trong và ngoài nước
              </p>
            </div>

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
              {partnerPositions.map((partner, index) => (
                <line
                  key={`line-${index}`}
                  x1={windowWidth > 768 ? 500 : windowWidth / 2}
                  y1={windowWidth > 768 ? 200 : 300}
                  x2={partner.x}
                  y2={partner.y}
                  stroke="#e5e5e5"
                  strokeWidth="1"
                />
              ))}
            </svg>

            {/* Partner logos */}
            {partnerPositions.map((partner, index) => (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-4 shadow-md w-[80px] h-[80px] md:w-[100px] md:h-[100px] flex items-center justify-center"
                style={{
                  left: `${partner.x}px`,
                  top: `${partner.y}px`,
                  zIndex: 1,
                }}
              >
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={60}
                  height={30}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
