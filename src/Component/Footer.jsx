import React from 'react';
import { Link } from 'react-router-dom';
import "../style/Footer.css";

export default function Footer() {
    return (
        <div className="footer">
            <Link to="about" className="footer-links">About us</Link>
            <a href="../style-guide.html" className="footer-links">Style guide</a>
        </div>
    )
}