import Posts from "../../components/Posts/Posts.jsx";
import FirstHeader from "../../components/Home/Landing/FirstHeader/FirstHeader.jsx";
import MainHeader from "../../components/Home/Landing/MainHeader/MainHeader.jsx";
import Footer from "../../components/Home/Landing/Footer/Footer.jsx";

const PostsPage = () => {
  return (
    <>
      <FirstHeader />
      <MainHeader />
      <Posts />
      <Footer />
    </>
  );
};

export default PostsPage;
