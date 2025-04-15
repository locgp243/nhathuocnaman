import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import Image from "next/image"

export default function Slider() {
  const images = [
    "/images/topbar-slider-1.png",
    "/images/topbar-slider-2.png",
  ]

  return (
    <Carousel className="w-full mx-auto">
      <div className="relative">
        <CarouselContent className="h-full">
          {images.map((src, index) => (
            <CarouselItem key={index} className="h-full">
              <Image
                src={src}
                width={1200}
                height={600}
                alt={`Slide ${index}`}
                className="h-full object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-0 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-black rounded-full w-6 h-6" />
        <CarouselNext className="right-0 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-black rounded-full w-6 h-6" />
      </div>
    </Carousel>



  )
}
