"use client"

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonProductCards({ count = 5 }: { count?: number }) {
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2 md:-ml-4">
        {[...Array(count)].map((_, index) => (
          <CarouselItem
            key={index}
            className="basis-1/2 pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
          >
            <Card className="bg-white h-full">
              <CardContent className="p-3 space-y-3">
                <Skeleton className="w-full h-[150px] rounded" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
