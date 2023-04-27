import React from 'react';
import { Link } from 'react-router-dom';
import "../style/AboutUs.css";

export default function AboutUs() {
    return (
        <div className="about-page-wrapper"> {/* wrapper */}
            <div>
                testing
            </div>
            <div className="about-links-box">
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