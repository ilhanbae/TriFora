import React from "react";
import "./navAchiever.css";
import { Link } from "react-router-dom";
import groupIcon from "../assets/group.png";

class NavAchiever extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: true,
        }
    }

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
                    {!this.props.loggedIn &&
                        /* if logged out show signup/login */
                        <>
                            <li id="sign up">
                                <Link to="/signup"> Sign up </Link>
                            </li>
                            <li id="login">
                                <Link to="/login"> Login </Link>
                            </li>
                        </>
                    }
                    {this.props.loggedIn &&
                        /* if logged in have a dropdown menu with the profile icon*/
                        // <li id="logged">
                        //     <Link to="/"> Logged in </Link>
                        // </li>

                        <li className="pm admin">
                            <button
                                className="profile-holder"
                                onClick={e => this.props.logout(e)} //needs to be changed, just using for testing
                            >
                                <img
                                    src={groupIcon}
                                    className="profile-icon"
                                    alt="profile"
                                    title="profile"
                                />
                            </button>
                        </li>

                        // <li className="profile holder">
                        //     <Link to="/groups">
                        //         <img
                        //             src={groupIcon}
                        //             className="profile-icon"
                        //             alt="profile"
                        //             title="profile"
                        //         />
                        //     </Link>
                        // </li>
                    }
                </ul>
            </div>
        );
    }
}
export default NavAchiever;