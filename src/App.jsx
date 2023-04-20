/* This is our starting point of our application. This is the level that will handle
the routing of requests, and also the one that will manage communication between sibling
components at a lower level. */
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import NavAchiever from "./Component/NavAchiever";
import RegisterForm from "./Component/RegisterForm";
import ForgotPasswordPage from "./Component/ForgotPasswordPage";
import LoginForm from "./Component/LoginForm";
import ProfilePage from "./Component/ProfilePage";
import EditProfilePage from "./Component/EditProfilePage";
import CommunityPage from "./Component/CommunityPage";
import CreatePost from "./Component/CreatePost";
import HomepageA from "./Component/HomepageA";
import HomepageB from "./Component/HomepageB";
import HomepageC from "./Component/HomepageC";
import Notification from "./Component/Notification";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [navStyle, setNavStyle] = useState(2);

  /* This method changes nav style */
  const navSwitch = (headerStyle) => {
    if (headerStyle !== navStyle) {
      setNavStyle(headerStyle)
    }
  }

  /* On logout, pull the session token and user from session storage and update the 
  user's logged in status. This can be called from the header component where the user can 
  click 'log out' option. */
  const logout = () => {
    sessionStorage.removeItem("token"); // the user's password token
    sessionStorage.removeItem("user"); // the user's id
    setIsLoggedIn(false);
  }

  /* On login, update user's logged in status. This can be called from any components 
  that is somewhat linked in to the login page, i.e. it has a navigation tab/button to login page. */
  const login = () => {
    setIsLoggedIn(true);
  }

  return (
    /* The app is wrapped in a router component, that will render the appropriate
    content based on the URL path. Since this is a single page app, it allows some
    degree of direct linking via the URL rather than by parameters. */
    <Router basename={process.env.PUBLIC_URL}>
      <div>
        <header>
          {/* Navigation */}
          <NavAchiever logout={logout} navStyle={navStyle} />
          <div>
            <Routes>
              {/* Pages */}
              <Route path="/register" element={<RegisterForm login={login} />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/login" element={<LoginOrProfile login={login} />} />
              <Route path="/profile/:profileId" element={<ProfilePage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path="/community/:communityId" element={<CommunityPage />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/" element={<LoginOrProfile login={login} />} />
            </Routes>
          </div>
        </header>

      </div>
    </Router>
  );
}

// If the user is not logged in, show the Login Form. Otherwise, show the Profile Page
const LoginOrProfile = (props) => {
  if (!sessionStorage.getItem("token")) {
    console.log("LOGGED OUT");
    return (
      <div>
        <LoginForm login={props.login} />
      </div>
    );
  } else {
    console.log("Logged In");
    return (
      // <HomepageA />
      // <HomepageB />
      <HomepageC />
      // <ProfilePage />
    );
  }
}