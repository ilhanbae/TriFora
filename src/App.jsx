/* This is our starting point of our application. This is the level that will handle
the routing of requests, and also the one that will manage communication between sibling
components at a lower level. */
import React, { useState, useEffect } from "react";
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

export default function App() {
  // The app component maintains whether or not the login or logout actions were triggerd.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [navStyle, setNavStyle] = useState(2);

// toggleModal will both show and hide the modal dialog, depending on current state.  Note that the
// contents of the modal dialog are set separately before calling toggle - this is just responsible
// for showing and hiding the component
function toggleModal(app) {
  app.setState({
    openModal: !app.state.openModal
  });
}


// the App class defines the main rendering method and state information for the app
class App extends React.Component {

  // the app holds a few state items : whether or not the modal dialog is open, whether or not we need to refresh 
  // the post list, and whether or not the login or logout actions have been triggered, which will change what the 
  // user can see (many features are only available when you are logged in)
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      refreshPosts: false,
      logout: false,
      login: false,
    };

    // in the event we need a handle back to the parent from a child component,
    // we can create a reference to this and pass it down.
    this.mainContent = React.createRef();

    // since we are passing the following methods to a child component, we need to 
    // bind them, otherwise the value of "this" will mean the child, and not the app 
    this.doRefreshPosts = this.doRefreshPosts.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  // on logout, pull the session token and user from session storage and update state
  logout = () =>{
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    this.setState({
      logout: true,
      login: false
    });
    
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

          <NavAchiever logout={logout} navStyle={navStyle} />

          <div>
            <Routes>
              <Route path="/register" element={<RegisterForm login={login} />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/login" element={<LoginOrProfile login={login} />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path="community/:communityId" element={<CommunityPage />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/" element={<LoginOrProfile login={login} />} />
              <Route path="/community/:communityId/post_page/:postID" element={<Post_Page login={login}/>} />
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
      <ProfilePage />
    );
  }
}
