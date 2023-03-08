import React from "react";
import "./NavAchiever.css";
import { Link } from "react-router-dom";
import groupIcon from "../assets/group.png";
import DropMenu from "./DropMenu";

class NavAchiever extends React.Component {

    render() {
        return (
            <><div id="headerNav" className="headerNav">
                <ul id="leftItems">
                    <li className="logo">
                        <Link to="/"> Logo </Link>
                    </li>
                    <li id="about us">
                        <Link to="/about"> About us </Link>
                    </li>
                </ul>
                <ul id="rightItems">
                    {!sessionStorage.getItem("token") &&
                        /*  Making use of the way the boilerplate code handled login seems to work
                            if logged out show signup/login */
                        <>
                            <li id="sign up">
                                <Link to="/signup"> Sign up </Link>
                            </li>
                            <li id="login">
                                <Link to="/login"> Login </Link>
                            </li>
                        </>}
                    {sessionStorage.getItem("token") &&
                        /* if logged in have a dropdown menu with the profile icon*/
                        //needs to be changed, just using for testing login status
                        <li className="pm admin">
                            <button
                                className="profile-holder"
                                onClick={e => this.props.logout(e)}
                            >
                                <img
                                    src={groupIcon}
                                    className="profile-icon"
                                    alt="profile"
                                    title="profile"
                                />
                            </button>
                            <DropMenu />
                        </li>
                    }
                </ul>
            </div>
            </>
        );
    }
}
export default NavAchiever;