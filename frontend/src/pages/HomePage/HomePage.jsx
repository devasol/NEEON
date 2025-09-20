import React from "react";
import FirstHeader from "../../components/Home/Landing/FirstHeader/FirstHeader";
import MainHeader from "../../components/Home/Landing/MainHeader/MainHeader";
import Categories from "../../components/Home/Landing/Categories/Categories";
import LandingMain from "../../components/Home/Landing/LandingMain/LandingMain";
import ProductCard from "../../components/Home/ProductCard/ProductCard";
import TopStories from "../../components/Home/TopStories/TopStories";
import NewsSection from "../../components/Home/NewsSection/NewsSection";

function HomePage() {
  return (
    <>
      <FirstHeader />
      <MainHeader />
      <Categories />
      <LandingMain />
      <ProductCard />
      <TopStories />
      <NewsSection />
    </>
  );
}

export default HomePage;
