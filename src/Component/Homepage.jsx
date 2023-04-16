import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import genericFetch from "../helper/genericFetch";

import style from "../style/Homepage.module.css";
import group from "../assets/group.png";
import defaultCommunityImage from "../assets/defaultCommunityImage.png";
// import community from "../assets/defaultPostImage.png";

export default function Homepage() {
  const [userDetails, setUserDetails] = useState(null);
  const [allCommunities, setAllCommunities] = useState(null);
  const [joinedCommunities, setJoinedCommunities] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch user details, joined communities, and not other communities when the page is loaded.
  useEffect(() => {
    loadAll();
  }, []);

  /* This method loads all the data that is needed for this page from the API */
  const loadAll = async () => {
    setIsLoaded(false);
    await loadUserDetails();
    await loadJoinedCommunities();
    await loadAllCommunities();
    setIsLoaded(true);
  };

  /* This method loads user's detail by sending GET request to the API server */
  const loadUserDetails = async () => {
    let endpoint = `/users/${sessionStorage.getItem("user")}`;
    let query = {};
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage);
    if (errorMessage) {
      alert(errorMessage);
    } else {
      setUserDetails(data);
    }
  };

  /* This method loads user's joined communities by sending GET request to the API server */
  const loadJoinedCommunities = async () => {
    let endpoint = `/group-members`;
    let query = {
      userID: sessionStorage.getItem("user"),
    };
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage);

    // Get the user's joined community from the user's group member API
    const joinedCommunitiesFromMember = data[0].map((member) => member.group);

    if (errorMessage) {
      alert(errorMessage);
    } else {
      setJoinedCommunities(joinedCommunitiesFromMember);
    }
  };

  /* This method loads all the communites by sending GET request to the API server */
  const loadAllCommunities = async () => {
    let endpoint = `/groups`;
    let query = {};
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage);

    if (errorMessage) {
      alert(errorMessage);
    } else {
      setAllCommunities(data[0]);
    }
  };

  // Render the page
  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    const joinedCommunitiesIdList = joinedCommunities.map(
      (joinedCommunity) => joinedCommunity.id
    );
    // Filter other communites that user's not part of
    const otherCommunties = allCommunities.filter(
      (community) => !joinedCommunitiesIdList.includes(community.id)
    );

    console.log("all", allCommunities);
    console.log("joined", joinedCommunities);
    console.log("other", otherCommunties);

    return (
      <div className={style["homepage-wrapper"]}>
        {/* Headline */}
        <div className={style["headline"]}>
          <h1 className={style["active-text"]}>
            Welcome {userDetails.attributes.profile.username}
          </h1>
          <h2 className={style["inactive-text"]}>
            Find your commnunities today
          </h2>
        </div>

        {/* Communities */}
        <div className={style["homepage-communities"]}>
          {/* Joined Communities */}
          {joinedCommunities.length !== 0 && (
            <div>
              <span className={style["communites-section-title"]}>
                Joined Communities
              </span>
              <div className={style["communities-display"]}>
                {joinedCommunities.map((community) => (
                  <div className={style["community"]} key={community.id}>
                    <CommunityImage community={community} />
                    <span className={style["community-title"]}>{community.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Communities */}
          {otherCommunties.length !== 0 && (
            <div>
              <span className={style["communites-section-title"]}>
                Other Communities
              </span>
              <div className={style["communities-display"]}>
                {otherCommunties.map((community) => (
                  <div className={style["community"]} key={community.id}>
                    <CommunityImage community={community} />
                    <span className={style["community-title"]}>{community.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

// The purpose of this is to display community image
const CommunityImage = (props) => {
  return (
    <Link to={`/community/${props.community.id}`}>
      <img
        className={`${style["homepage-community-image"]}`}
        src={props.community.attributes.design.bannerProfileImage}
        alt="Community profile"
        onError={(e) => (e.currentTarget.src = defaultCommunityImage)}
      />
    </Link>
  );
};