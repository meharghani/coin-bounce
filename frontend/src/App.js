import Navbar from "./components/navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import styles from "./App.module.css";
import Protected from "./components/protected/Protected";
import Error from "./pages/error/Error";
import Login from "./pages/login/Login";
import { useSelector } from "react-redux";
import Signup from "./pages/signup/Signup";
import Crypto from "./pages/crypto/Crypto";
import Blog from "./pages/blog/Blog";
import SubmitBlog from "./pages/submitBlog/SubmitBlog";
import BlogDetails from "./pages/blogDetails/BlogDetails";
import UpdateBlog from "./pages/blog/updateBlog/UpdateBlog";

function App() {
  const isAuth = useSelector((state) => state.user.auth);
  return (
    <div className={styles.container}>
      <BrowserRouter>
        <div className={styles.layout}>
          <Navbar />
          <Routes>
            <Route
              path="/"
              exact
              element={
                <div className={styles.main}>
                  <Home />
                </div>
              }
            />
            <Route
              path="crypto"
              exact
              element={
                <div className={styles.main}>
                  <Crypto />
                </div>
              }
            />
            <Route
              path="blogs"
              exact
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main}>
                    <Blog />
                  </div>
                </Protected>
              }
            />
            <Route
              path="blog/:id"
              exact
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main}>
                    <BlogDetails />
                  </div>
                </Protected>
              }
            />
            <Route
              path="blog-update/:id"
              exact
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main}>
                    <UpdateBlog />
                  </div>
                </Protected>
              }
            />
            <Route
              path="submit"
              exact
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main}>
                    <SubmitBlog />
                  </div>
                </Protected>
              }
            />
            <Route
              path="login"
              exact
              element={
                <div className={styles.main}>
                  <Login />
                </div>
              }
            />
            <Route
              path="signup"
              exact
              element={
                <div className={styles.main}>
                  <Signup />
                </div>
              }
            />
            <Route
              path="*"
              element={
                <div className={styles.main}>
                  <Error />
                </div>
              }
            ></Route>
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
