import PromotionSection from "@/components/PromotionSection";
import HotSales from "@/components/HotSales";
import ProductCategory from "@/components/PromotionProduct";
import CosmeticsCategory from "@/components/PromotionCosmetics";
import FeatureCategories from "@/components/FeatureCategories";
import PromotionMedicine from "@/components/PromotionMedicine";
import ArticleNew from "@/components/ArticleNew";
import Service from "@/components/Services";
import RotatingPartnersNetwork from "@/components/Partner";

export default function Home() {
  return (
    <>
        <PromotionSection />
        <HotSales />
        <ProductCategory />
        <CosmeticsCategory />
        <FeatureCategories />
        <PromotionMedicine />
        <RotatingPartnersNetwork/>
        <ArticleNew />
        <Service />
      
    </>
  );
}
