import React from 'react';
import { Link } from 'react-router-dom';
import "../style/Footer.css";

export default function Footer() {
    return (
        <div className="footer">
            <Link to="about" className="footer-links">About us</Link>
            <a href={process.env.PUBLIC_URL + "/style-guide.html"} className="footer-links">Style guide</a>
            {/* <Link to="%PUBLIC_URL%/style-guide.html" className="footer-links">Style guide</Link> */}
        </div>
    )
}