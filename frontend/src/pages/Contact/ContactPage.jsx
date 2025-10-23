import React from 'react';
import Contact from '../../components/Contact/Contact';
import FirstHeader from "../../components/Home/Landing/FirstHeader/FirstHeader";
import MainHeader from "../../components/Home/Landing/MainHeader/MainHeader";
import Footer from "../../components/Home/Landing/Footer/Footer";

const ContactPage = () => {
  return (
    <>
      <FirstHeader />
      <MainHeader />
      <div>
        <Contact />
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;