import React from "react";
import "../style/Homepage.css";
import group from "../assets/group.png";

export default function Homepage() {
    return (
        <>
            <div className="homepage-welcome-message">
                Welcome back!
                <br />
                Jump back in to your community!
            </div>
            <div>
                <img src={group} className="homepage-community-image" /> {/* placeholder */}
                <img src={group} className="homepage-community-image" /> {/* placeholder */}
            </div>
            <div>
                <img src={group} className="homepage-community-image" /> {/* placeholder */}
                <img src={group} className="homepage-community-image" /> {/* placeholder */}
                <img src={group} className="homepage-community-image" /> {/* placeholder */}
            </div>
        </>
    )
}