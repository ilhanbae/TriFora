import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import Notification from "./Notification";
import Modal from "./Modal";
import genericFetch from "../helper/genericFetch";
import style from "../style/NavAchiever.module.css";
import defaultProfileImage from "../assets/defaultProfileImage.png";

export default function NavAchiever(props) {
  const [showDropDownMenu, setShowDropDownMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isRegisterNavActive, setIsRegisterNavActive] = useState(false);
  const [isLoginNavActive, setIsLoginNavActive] = useState(false);
  const location = useLocation(); // For current router location
  const navigate = useNavigate(); // For navigation
  const dropDownMenuRef = useRef(null); // Create a ref for dropdown menu
  
  /* This hook traces active navs using router location */
  useEffect(() => {
    traceActiveNavs(location);
  }, [location]);

  /* This hook loads user profile whenever user token exists */
  useEffect(() => {
    if (sessionStorage.getItem("user")) {
      loadUserProfile();
    }
  }, [sessionStorage.getItem("user")])

  /* This hook check if mousedown DOM event occurs outside the dropdown menu. */
  useEffect(() => {
    const outSideClickHandler = (event) => {
      if (
        dropDownMenuRef.current &&
        !dropDownMenuRef.current.contains(event.target)
      ) {
        setShowDropDownMenu(false);
      }
    };
    document.addEventListener("mousedown", outSideClickHandler);
    return () => {
      document.removeEventListener("mousedown", outSideClickHandler);
    };
  });

  /* This method loads user profile by sending API request */
  const loadUserProfile = async () => {
    let endpoint = `/users/${sessionStorage.getItem("user")}`;
    let query = {};
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage);
    if (errorMessage) {
      // console.log(errorMessage)
      props.openToast({ type: "error", message: "Profile" });
    } else {
      if (data.attributes.profile.profileImage === "") {
        setUserProfile(defaultProfileImage);
      } else {
        setUserProfile(data.attributes.profile.profileImage);
      }
    }
  };
  
  /* This method toggles drop down menu */
  const toggleDropDownMenu = () => {
    setShowDropDownMenu(!showDropDownMenu);
  };

  /* This method toggles profile modal */
  const toggleProfileModal = () => {
    setOpenProfile(!openProfile);
  };

  /* This method toggles notification modal */
  const toggleNotificationModal = () => {
    setOpenNotification(!openNotification);
  };

  /* This method scrolls the window to top */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  /* This method updates active navs by using router location. */
  const traceActiveNavs = (location) => {
    // console.log(location);
    switch(location.pathname) {
      case "/":
        setIsLoginNavActive(false);
        setIsRegisterNavActive(false);
        break;
      case "/register":
        setIsLoginNavActive(false);
        setIsRegisterNavActive(true);
        break;
      case "/login":
        setIsRegisterNavActive(false);
        setIsLoginNavActive(true);
        break;
      default:
        setIsRegisterNavActive(false);
        setIsLoginNavActive(false);
    }
  }

  /* This method handles logo navigation */
  const logoNavHandler = () => {
    scrollToTop();
    navigate('/');
  }  

  /* This method handles register navigation */
  const registerNavHandler = () => {
    navigate('/register');
  }

  /* This method handles login navigation */
  const loginNavHandler = () => {
    navigate('/login');
  }

  /* This method handles logout navigation */
  const logoutNavHandler = () => {
    toggleDropDownMenu();
    props.logout();
    navigate('/');
  }

  // Set drop down icon style
  const dropDownIconStyle = showDropDownMenu ? "up-icon" : "down-icon";

  // Set register nav style
  const registerNavStyle = isRegisterNavActive ? "nav-item__active" : "nav-item"

  // Set login nav style
  const loginNavStyle = isLoginNavActive ? "nav-item__active" : "nav-item"

  return (
    <div className={style["headerNav"]}>
      {/* Logo */}
      <div className={style["left-items"]}>
        <span 
          className={style["logo"]}
          onClick={logoNavHandler}  
        >Trifora</span>
      </div>

      {/* Logged-Out Navigation */}
      {!sessionStorage.getItem("token") && (
        <div className={style["right-items"]}>
          <ul className={style["nav-list"]}>
            {/* Sign Up */}
            <li 
              className={style[registerNavStyle]}
              onClick={registerNavHandler}  
            >
              <span>Sign up</span>
            </li>
            {/* Login */}
            <li 
              className={style[loginNavStyle]}
              onClick={loginNavHandler}
            >
              <span>Login</span>
            </li>
          </ul>
        </div>
      )}

      {/* Logged-In Navigation */}
      {sessionStorage.getItem("token") && (
        <div
          className={style["profile-dropdown"]}
          ref={dropDownMenuRef}
        >
          {/* Profile Icon */}
          <img
            src={userProfile}
            className={style["profile-icon"]}
            alt="profile icon"
            onClick={toggleDropDownMenu}
          />
          <div>
            {/* Drop Down Icon */}
            <span
              className={style[dropDownIconStyle]}
              onClick={toggleDropDownMenu}
            ></span>
            {/* Drown Down Menu */}
            {showDropDownMenu && (
              <div style={{ position: "relative" }}>
                <ul className={style["dropdown-menu"]}>
                  <li
                    className={style["dropdown-menu-item"]}
                    onClick={toggleProfileModal}
                  >
                    <span>My Profile</span>
                  </li>
                  <li
                    className={style["dropdown-menu-item"]}
                    onClick={toggleNotificationModal}
                  >
                    <span>Notifications</span>
                  </li>
                  <li 
                    className={style["dropdown-menu-item"]}
                    onClick={logoutNavHandler}  
                  >
                    <span>Log Out</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Profile Modal */}
            <Modal
              show={openProfile}
              onClose={toggleProfileModal}
              modalStyle={{
                width: "90%",
                height: "90%",
              }}
            >
              <ProfilePage
                profile_id={sessionStorage.getItem("user")}
                redirect_community={toggleProfileModal}
                toggleProfile={toggleProfileModal}
                openToast={props.openToast}
              />
            </Modal>

            {/* Notification Modal */}
            <Modal
              show={openNotification}
              onClose={toggleNotificationModal}
              modalStyle={{
                width: "90%",
                height: "90%",
              }}
            >
              <Notification openToast={props.openToast} />
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
}