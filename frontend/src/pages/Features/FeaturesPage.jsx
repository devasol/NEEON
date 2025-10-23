import React from 'react';
import Features from '../../components/Features/Features';
import FirstHeader from "../../components/Home/Landing/FirstHeader/FirstHeader";
import MainHeader from "../../components/Home/Landing/MainHeader/MainHeader";
import Footer from "../../components/Home/Landing/Footer/Footer";

const FeaturesPage = () => {
  return (
    <>
      <FirstHeader />
      <MainHeader />
      <div>
        <Features />
      </div>
      <Footer />
    </>
  );
};

export default FeaturesPage;