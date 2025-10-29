import React from 'react';
import Contact from '../../components/Contact/Contact.jsx';
import FirstHeader from "../../components/Home/Landing/FirstHeader/FirstHeader.jsx";
import MainHeader from "../../components/Home/Landing/MainHeader/MainHeader.jsx";
import Footer from "../../components/Home/Landing/Footer/Footer.jsx";

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