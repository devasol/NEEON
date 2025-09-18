import React from "react";
import FirstHeader from "../../components/Home/Landing/FirstHeader/FirstHeader";
import MainHeader from "../../components/Home/Landing/MainHeader/MainHeader";
import Categories from "../../components/Home/Landing/Categories/Categories";
import LandingMain from "../../components/Home/Landing/LandingMain/LandingMain";

function HomePage() {
  return (
    <>
      <FirstHeader />
      <MainHeader />
      <Categories />
      <LandingMain />
    </>
  );
}

export default HomePage;
