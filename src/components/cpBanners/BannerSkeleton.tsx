import { Skeleton } from "@/components/ui/skeleton"

export function BannerSkeleton() {
  return (
    <div className="max-w-7xl m-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-4 h-[400px]">
        {/* Main Banner Skeleton */}
        <div className="w-full h-full md:w-[70%] relative">
          <Skeleton className="w-full h-[320px] rounded-t-xl" />
          <div className="flex h-[80px] bg-white rounded-b-lg gap-2 p-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-12 flex-1 min-w-[100px]" />
            ))}
          </div>
        </div>
        
        {/* Right Banner Skeleton */}
        <div className="hidden md:flex md:w-[30%] flex-col gap-4 h-full">
          <Skeleton className="w-full flex-1 rounded-2xl" />
          <Skeleton className="w-full flex-1 rounded-2xl" />
          <Skeleton className="w-full flex-1 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}