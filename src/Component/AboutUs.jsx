import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../style/AboutUs.css";
import BackButton from "./BackButton.jsx";

export default function AboutUs() {
    useEffect(() => {
        document.title = "About Us Page";
      }, []);

    return (
        <div className="about-page-wrapper"> {/* wrapper */}
            <div className="about-back-button">
                <BackButton />
            </div>
            <div className="about-description-box">
                <div className="about-team-title">
                    <h1>
                    Why Trifora?
                    </h1>
                </div>
                <div className="about-team-description">
                Our hope is to have Trifora be a place where users can find, connect, and build a community of their interest. 
                We believe our communities can unite people just like they were part of an open Forum. Trifora's focus is to have our users
                be univeristy audiences, and hope to connect students with other like-minded students to share information and thoughts.
                </div>
            </div>
            <div className="about-links-box">
                <h1>Meet our team</h1>
                {/* a tags and hrefs are the only way to get to the public routes? */}
                <a href="benson.html">Benson</a>
                <a href="jay.html">Jay</a>
                <a href="joe.html">Joe</a>
                <a href="neil.html">Neil</a>
                <a href="xuyang.html">Xuyang</a>
            </div>
        </div>
    )
}