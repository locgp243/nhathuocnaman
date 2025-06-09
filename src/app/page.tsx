import HomeBanner from "@/components/HomeBanner";
import HomeSubCategories from "@/components/HomeSubCategories";
import Service from "@/components/Services";
import HomeRecommendProducts from "@/components/HomeRecommendProduct";
import HomeHotSaleProducts from "@/components/HomeHotSaleProducts";
import HomeProductCarouselCards from "@/components/HomeProductCarouselCards";
import HomeArticles from "@/components/HomeArticles";
export default function Home() {
  return (
    <>
        <HomeBanner />
        <HomeHotSaleProducts />
        <HomeSubCategories />
        <HomeRecommendProducts />
        <HomeProductCarouselCards
          mainCategorySlug="thuc-pham-chuc-nang"
          title="THỰC PHẨM CHỨC NĂNG"
          icon="/images/thucphamchucnang.png"
        />
        <HomeProductCarouselCards
          mainCategorySlug="duoc-my-pham"
          title="DƯỢC MỸ PHẨM"
          icon="/images/duocmypham.png"
        />
        <HomeProductCarouselCards
          mainCategorySlug="thuoc"
          title="THUỐC"
          icon="/images/thuoc.png"
        />
        <HomeProductCarouselCards
          mainCategorySlug="thiet-bi-y-te"
          title="THIẾT BỊ Y TẾ"
          icon="/images/thietbiyte.png"
        />
      <HomeArticles />
        <Service />
    </>
  );
}
