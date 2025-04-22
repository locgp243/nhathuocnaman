"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

interface Partner {
  name: string
  logo: string
  initialX: number
  initialY: number
  angle: number
}

export default function RotatingPartnersNetwork() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [partners, setPartners] = useState<Partner[]>([])
  const [rotation, setRotation] = useState(0)

  // Initialize partners data
  const partnersData = [
    { name: "Sanofi", logo: "/images/sanofi.png" },
    { name: "GSK", logo: "/images/gsk.png" },
    { name: "Pfizer", logo: "/images/pfize.png" },
    { name: "Bidiphar", logo: "/images/bidiphar.jpg" },
    { name: "Domesco", logo: "/images/domesco.jpg" },
    { name: "AstraZeneca", logo: "/images/astrazeneca.png" },
    { name: "Bayer", logo: "/images/bayer.jpg" },
    { name: "Imexpharm", logo: "/images/imexpharm.png" },
    { name: "Haphaco", logo: "/images/hapharco.png" },
    // { name: "DHG Pharma", logo: "/p},  
    // { name: "Nanson Pharma", logo: "/p0" },
  ]

  // Update container size and initialize partner positions
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        const height = containerRef.current.offsetHeight
        setContainerSize({ width, height })

        // Calculate initial positions only when container size changes
        const centerX = width / 2
        const centerY = height / 2
        const radius = Math.min(centerX, centerY) * 0.8

        const initializedPartners = partnersData.map((partner, index) => {
          const angle = (index * 2 * Math.PI) / partnersData.length
          const initialX = centerX + radius * Math.cos(angle)
          const initialY = centerY + radius * Math.sin(angle)

          return {
            ...partner,
            initialX,
            initialY,
            angle,
          }
        })

        setPartners(initializedPartners)
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  // Start rotation animation
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotation((prev) => (prev + 0.005) % (2 * Math.PI))
    }, 50)

    return () => clearInterval(rotationInterval)
  }, [])

  // Calculate current positions based on rotation
  const getPartnerPositions = () => {
    if (partners.length === 0) return []

    const centerX = containerSize.width / 2
    const centerY = containerSize.height / 2

    return partners.map((partner) => {
      // Apply rotation to the initial angle
      const rotatedAngle = partner.angle + rotation

      // Calculate new position based on rotated angle but keeping the same radius
      const x =
        centerX + (partner.initialX - centerX) * Math.cos(rotation) - (partner.initialY - centerY) * Math.sin(rotation)
      const y =
        centerY + (partner.initialX - centerX) * Math.sin(rotation) + (partner.initialY - centerY) * Math.cos(rotation)

      return {
        ...partner,
        x,
        y,
        rotatedAngle,
      }
    })
  }

  const partnerPositions = getPartnerPositions()

  return (
    <div className="w-full py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
           <div className="bg-white rounded-full p-2">
              <Image src="/images/doitac.jpg" alt="Logo" width={24} height={24} className="object-contain" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">ĐỐI TÁC CỦA NAM AN</h2>
        </div>
        <div ref={containerRef} className="relative h-[400px] md:h-[600px]">
          {/* Center text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-[200px] md:w-[300px] z-10 bg-opacity-90 p-4 rounded-lg">
            <p className="text-lg md:text-sm text-green-700">
              Với hơn 12 năm hoạt động, Nam An đã hợp tác với hơn{" "}
              <span className="font-bold">1000+ đối tác</span> trong và ngoài nước
            </p>
          </div>

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            {partnerPositions.map((partner, index) => (
              <line
                key={`line-${index}`}
                x1={containerSize.width / 2}
                y1={containerSize.height / 2}
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
              className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-3 md:p-4 shadow-md w-[80px] h-[80px] md:w-[100px] md:h-[100px] flex flex-col items-center justify-center"
              style={{
                left: `${partner.x}px`,
                top: `${partner.y}px`,
                zIndex: 1,
              }}
            >
              <Image
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                width={50}
                height={25}
                className="object-contain mb-1"
              />
              <span className="text-[8px] md:text-xs text-center font-medium">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
