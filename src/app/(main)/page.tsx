import HomeSubCategories from "@/components/HomeSubCategories";
import Service from "@/components/Services";
import HomeRecommendProducts from "@/components/HomeRecommendProduct";
import HomeHotSaleProducts from "@/components/HomeHotSaleProducts";
import HomeProductCarouselCards from "@/components/HomeProductCarouselCards";
import HomeArticles from "@/components/HomeArticles";
import HomeBanner from '@/components/cpBanners/HomeBanner';
export default function Home() {
  return (
    <>
        <HomeBanner />
        <HomeRecommendProducts />
        <HomeHotSaleProducts />
        <HomeSubCategories />
        <HomeProductCarouselCards
          mainCategorySlug="thuc-pham-chuc-nang"
          title="THỰC PHẨM CHỨC NĂNG"
        />
        <HomeProductCarouselCards
          mainCategorySlug="duoc-my-pham"
          title="DƯỢC MỸ PHẨM"
        />
        <HomeProductCarouselCards
          mainCategorySlug="thuoc"
          title="THUỐC"
        />
        <HomeProductCarouselCards
          mainCategorySlug="thiet-bi-y-te"
          title="THIẾT BỊ Y TẾ"
        />
      <HomeArticles />
        <Service />
    </>
  );
}
