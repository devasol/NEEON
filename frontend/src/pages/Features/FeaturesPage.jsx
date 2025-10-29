import React from 'react';
import Features from '../../components/Features/Features.jsx';
import FirstHeader from "../../components/Home/Landing/FirstHeader/FirstHeader.jsx";
import MainHeader from "../../components/Home/Landing/MainHeader/MainHeader.jsx";
import Footer from "../../components/Home/Landing/Footer/Footer.jsx";

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