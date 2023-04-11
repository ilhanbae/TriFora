import React, { useState } from "react";
import "../style/Homepage.css";
import group from "../assets/group.png";
import community from "../assets/defaultPostImage.png";
import { Link } from "react-router-dom";

export default function Homepage() {
    const [userDetails, setUserDetails] = useState(null);
    // const [topCommunities, setTopCommunities] = useState(null);

    // Fetch both user info and communities when the component is loaded.
    // useEffect(() => {
    //     grabUser();
    //     grabCommunities();
    // }, []);

    // want to use generic fetch to get username and their communities
    // const grabUser = () => {};

    // want to use generic fetch to get non-joined communities to display
    // const grabCommunities = () => {};

    return (
        <div className="homepage-wrapper">
            {/* user details should be loaded for the welcome message */}
            <div className="homepage-welcome-message">
                <h1>
                    Welcome back! {/* userName should appear here from earlier fetch */}
                    <br />
                    Jump back in to your community!
                </h1>
            </div>
            {/* The following list should be mapped from communities user is part of from earlier fetch.
                and possibly randomly displayed if possible */}
            <ul className="homepage-communities-row">
                <li className="homepage-joined-communities">
                    <Link to="community/25"> {/* the id should be dynamic from the above idea/implementation */}
                        <img src={group} className="homepage-community-image" /> {/* placeholder */}
                    </Link>
                </li>
                <li className="homepage-joined-communities">
                    <Link to="community/25">
                        <img src={group} className="homepage-community-image" /> {/* placeholder */}
                    </Link>
                </li>
                <li className="homepage-joined-communities">
                    <Link to="community/25">
                        <img src={group} className="homepage-community-image" /> {/* placeholder */}
                    </Link>
                </li>
                {/* <span></span>
                        <span></span>
                        <img src={group} className="homepage-community-image" />
                        <img src={group} className="homepage-community-image" />
                        <img src={group} className="homepage-community-image" />
                        <span></span>
                        <span></span> */}
            </ul>
            {/* The following list should be mapped from communities user is not part of from earlier fetch.
                and possibly randomly displayed if possible */}
            <ul className="homepage-communities-row">
                <li className="homepage-top-communities">
                    <Link to="community/25"> {/* the id should be dynamic from the above idea/implementation */}
                        <img src={group} className="homepage-community-image" /> {/* placeholder */}
                    </Link>
                </li>
                <li className="homepage-top-communities">
                    <Link to="community/25">
                        <img src={group} className="homepage-community-image" /> {/* placeholder */}
                    </Link>
                </li>
                <li className="homepage-top-communities">
                    <Link to="community/25">
                        <img src={group} className="homepage-community-image" /> {/* placeholder */}
                    </Link>
                </li>
                {/* <span></span>
                    <span></span>
                    <img src={community} className="homepage-community-image" />
                    <img src={community} className="homepage-community-image" />
                    <img src={community} className="homepage-community-image" />
                    <span></span>
                    <span></span> */}
            </ul>
        </div>
    )
}