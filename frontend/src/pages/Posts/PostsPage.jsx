import Posts from "../../components/Posts/Posts";
import FirstHeader from "../../components/Home/Landing/FirstHeader/FirstHeader";
import MainHeader from "../../components/Home/Landing/MainHeader/MainHeader";
import Footer from "../../components/Home/Landing/Footer/Footer";

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
