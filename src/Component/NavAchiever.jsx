import React from "react";
import "./NavAchiever.css";
import { Link } from "react-router-dom";
import groupIcon from "../assets/group.png";
import DropMenu from "./DropMenu";

class NavAchiever extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showDropMenu: false
        };
    }


    menuSwitch = () => {
        this.setState(prevState => ({ showDropMenu: !prevState.showDropMenu }));
    };

    render() {
        return (
            <div id="headerNav" className="headerNav">
                {/* items that appear to the left side of the navbar */}
                <ul id="leftItems">
                    <li className="logo">
                        <Link to="/"> Logo </Link>
                    </li>
                    {/* About/browse link will be changing depending on page, see search bar comment in next div */}
                    {this.props.navStyle === 2 ? (
                        <li id="about us">
                            <Link to="/about"> About us </Link>
                        </li>
                    ) : (
                        /* browse may end up being a logged in only function? */
                        <li id="browse">
                            <Link to="/"> Browse </Link>
                        </li>
                    )}

                </ul>
                {sessionStorage.getItem("token") &&
                    /* The middle item search bar only occurs while logged in and only on certain pages. There will exist a state variable
                    in the main app that needs to potentially be updated whenever a page loads */
                    <div>
                        {this.props.navStyle === 3 &&
                            <input type="text" placeholder="search function" />}
                    </div>
                }
                {/* Items on the right side of the navbar are handled here, drop down included */}
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
                        // Icon/button needs to be changed, just using as a placeholder for testing
                        <li className="pm admin">
                            <button
                                className="profile-holder"
                                onClick={this.menuSwitch}
                            >
                                <img
                                    src={groupIcon}
                                    className="profile-icon"
                                    alt="profile"
                                    title="profile" />
                            </button>
                            {/* <DropMenu /> */}
                            {/* DropMenu could now likely be switch to being it's own component, though a way to logout would
                                    have to be passed through */}
                            {/* the following line uses terinary statement to allow for the hiding/showing of the drop down via css */}
                            <ul className={this.state.showDropMenu ? "showDrop" : "hideDrop"}>
                                <li>
                                    <Link to="/profile" onClick={this.menuSwitch}> My Profile </Link>
                                </li>
                                <li>
                                    <Link to="/notifications" onClick={this.menuSwitch}> Notifications </Link>
                                </li>
                                <li>
                                    <Link to="/" onClick={e => {
                                        /* this is the only way I could think to do this for logout */
                                        this.props.logout(e);
                                        this.menuSwitch();
                                    }}>
                                        Logout
                                    </Link>
                                </li>
                            </ul>

                        </li>
                    }
                </ul>
            </div>
        );
    }
}
export default NavAchiever;