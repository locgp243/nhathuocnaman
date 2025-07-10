"use client"

import { useState, useEffect, useCallback } from "react";
import { Banner } from "@/types/banner";
import { API_ENDPOINTS } from "@/lib/api";
import { BannerSkeleton } from "./BannerSkeleton";
import { MainBanner } from "./MainBanner";
import { RightBanners } from "./RightBanners";

export default function HomeBanner() {
  const [mainBanners, setMainBanners] = useState<Banner[]>([]);
  const [rightBanners, setRightBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sortBannersByOrder = useCallback((banners: Banner[]) => {
    return banners.filter(banner => banner.active).sort((a, b) => a.sortOrder - b.sortOrder);
  }, []);

  useEffect(() => {
    const fetchAllBanners = async () => {
      try {
        const [mainResponse, rightResponse] = await Promise.all([
          fetch(API_ENDPOINTS.MAIN_BANNER),
          fetch(API_ENDPOINTS.RIGHT_BANNER)
        ]);

        const mainData = await mainResponse.json();
        const rightData = await rightResponse.json();

        if (Array.isArray(mainData)) {
          setMainBanners(sortBannersByOrder(mainData));
        }
        if (Array.isArray(rightData)) {
          setRightBanners(sortBannersByOrder(rightData));
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllBanners();
  }, [sortBannersByOrder]);

  if (isLoading) {
    return <BannerSkeleton />;
  }
  
  return (
    <div className="max-w-7xl m-auto px-4 py-6 animate-bg-shimmer">
      <div className="flex flex-col md:flex-row gap-4 h-[400px]">
        {mainBanners.length > 0 && <MainBanner banners={mainBanners} />}
        {rightBanners.length > 0 && <RightBanners banners={rightBanners} />}
      </div>
    </div>
  );
}