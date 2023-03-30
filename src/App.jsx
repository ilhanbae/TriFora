/* This is our starting point of our application. This is the level that will handle
the routing of requests, and also the one that will manage communication between sibling
components at a lower level. */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CommunityPage from "./Component/CommunityPage";
import "./App.css";


export default function App() {
  // The app component maintains whether or not the login or logout actions were triggerd.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // On logout, pull the session token and user from session storage and update the 
  // user's logged in status. This can be called from the header component where the user can 
  // click 'log out' option.
  const logout = () => {
    sessionStorage.removeItem("token"); // the user's password token
    sessionStorage.removeItem("user"); // the user's id
    setIsLoggedIn(false);
  }

  // On login, update user's logged in status. This can be called from any components 
  // that is somewhat linked in to the login page, i.e. it has a navigation tab/button to login page.
  const login = () => {
    setIsLoggedIn(true);
  }

  return (
    /* The app is wrapped in a router component, that will render the appropriate
    content based on the URL path. Since this is a single page app, it allows some
    degree of direct linking via the URL rather than by parameters. */
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <header className="App-header">

          {/* Insert Navbar here */}

          <div className="maincontent" id="mainContent">
            <Routes>

              {/* Insert all other page routes here */}

              <Route path="/community/:communityId" element={<CommunityPage />} />

              {/* Insert default page route here */}

            </Routes>
          </div>
        </header>
      </div>
    </Router>
  );
}