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
import Modal from "./Component/Modal";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [navStyle, setNavStyle] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);
  const [modalStyle, setModalStyle] = useState(null);

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

  /* This method closes the modal */
  const closeModal = () => {
    setIsModalOpen(false); // Reset modal open state
    setModalStyle(null); // Reset modal styles
    setModalContent(null); // Reset modal content
    setModalTitle(null) // Reset modal title
  }

  /* This method opens the modal */
  const openModal = ({content, title, style}) => {
    setModalContent(content);
    setModalStyle(style);
    setModalTitle(title);
    setIsModalOpen(true);
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
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path="/community/:communityId" element={<CommunityPage openModal={openModal} closeModal={closeModal} />} />
              <Route path="/community/:communityId/create-post" element={<CreatePost />} /> {/* probably exist a cleaner way */}
              <Route path="/" element={<LoginOrProfile login={login} />} />
            </Routes>
          </div>
        </header>
        {/* UI Elements */}
        <div>
          {/* Modal */}
          <Modal 
            show={isModalOpen}
            onClose={closeModal}
            modalTitle={modalTitle}
            modalStyle={modalStyle}
          >
            {modalContent}
          </Modal>
        </div>

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
      <ProfilePage />
    );
  }
}