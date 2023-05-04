import React from 'react';
import { Link } from 'react-router-dom';
import "../style/AboutUs.css";
import BackButton from "./BackButton.jsx";

// making this js instead of jsx for public html use, not sure if any problems will arise
export default function AboutUs() {
    return (
        <div className="about-page-wrapper"> {/* wrapper */}
            <div className="about-back-button">
                <BackButton />
            </div>
            <div className="about-description-box">
                <div className="about-team-title">
                    <h1>
                    Trifora
                    </h1>
                </div>
                <div className="about-team-description">
                Our goal is to have Trifora be a place where users can find, connect, and build a community of their interest. Why Trifora? because we believe our communities can unite people given a place like a open Forum.
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