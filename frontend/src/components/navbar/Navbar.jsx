import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useSelector } from "react-redux";
import { signout } from "../../api/internal";
import { resetUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
function Navbar() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.auth);
  const handleSignout = async () => {
    await signout()
    dispatch(resetUser());
  }
  return (
    <>
      <nav className={styles.navbar}>
        <NavLink to="/" className={`${styles.logo} ${styles.inActiveStyle}`}>
          CoinBounce
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Home
        </NavLink>

        <NavLink
          to="crypto"
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Cryptocurrencis
        </NavLink>

        <NavLink
          to="blogs"
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Blogs
        </NavLink>

        <NavLink
          to="submit"
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Submit a Blog
        </NavLink>

        {isAuthenticated ? (
          <NavLink
            className={({ isActive }) =>
              isActive ? styles.activeStyle : styles.inActiveStyle
            }
          >
            <button className={styles.signoutButton} onClick={handleSignout}>Sign Out</button>
          </NavLink>
        ) : (
          <div>
            {" "}
            <NavLink
              to="login"
              className={({ isActive }) =>
                isActive ? styles.activeStyle : styles.inActiveStyle
              }
            >
              <button className={styles.loginButton}>Sign In</button>
            </NavLink>
            <NavLink
              to="signup"
              className={({ isActive }) =>
                isActive ? styles.activeStyle : styles.inActiveStyle
              }
            >
              <button className={styles.signupButton}>Sign Up</button>
            </NavLink>
          </div>
        )}
      </nav>
      <div className={styles.lineSeparator}></div>
    </>
  );
}

export default Navbar;
