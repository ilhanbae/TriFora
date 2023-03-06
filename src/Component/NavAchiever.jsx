import React from "react";
import "./navAchiever.css";
import { Link } from "react-router-dom";

class NavAchiever extends React.Component {

    render() {
        return (
            <div id="headerNav" className="headerNav">
                <ul id="leftItems">
                    <li className="logo">
                        <Link to="/"> Logo </Link>
                    </li>
                    <li id="about us">
                        <Link to="/about"> About us </Link>
                    </li>
                </ul>
                <ul id="rightItems">
                    <li id="sign up">
                        <Link to="/signup"> Sign up </Link>
                    </li>
                    <li id="login">
                        <Link to="/login"> Login </Link>
                    </li>
                </ul>
            </div>
            );
    }
}
export default NavAchiever;