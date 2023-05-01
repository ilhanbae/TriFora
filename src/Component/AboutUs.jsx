import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../style/AboutUs.css";

export default function AboutUs() {
    useEffect(() => {
        document.title = "About Us Page";
      }, []);

    return (
        <div className="about-page-wrapper"> {/* wrapper */}
            <div className="about-description-box">
                <div className="about-team-title">
                    <h1>
                        Underachievers
                    </h1>
                </div>
                <div className="about-team-description">
                    description test
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