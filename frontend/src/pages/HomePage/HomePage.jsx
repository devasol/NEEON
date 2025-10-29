import React, { useEffect } from "react";
import FirstHeader from "../../components/Home/Landing/FirstHeader/FirstHeader.jsx";
import MainHeader from "../../components/Home/Landing/MainHeader/MainHeader.jsx";
import Categories from "../../components/Home/Landing/Categories/Categories.jsx";
import LandingMain from "../../components/Home/Landing/LandingMain/LandingMain.jsx";
import ProductCard from "../../components/Home/ProductCard/ProductCard.jsx";
import TopStories from "../../components/Home/TopStories/TopStories.jsx";
import NewsSection from "../../components/Home/NewsSection/NewsSection.jsx";
import Footer from "../../components/Home/Landing/Footer/Footer.jsx";

function HomePage() {
  useEffect(function () {
    document.title = "Neeon | Home";
  }, []);
  return (
    <>
      <FirstHeader />
      <MainHeader />
      <Categories />
      <LandingMain />
      <ProductCard />
      <TopStories />
      <NewsSection />
      <Footer />
    </>
  );
}

export default HomePage;
