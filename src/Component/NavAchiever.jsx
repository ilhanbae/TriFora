import React from "react";
import "./NavAchiever.css";
import { Link } from "react-router-dom";
import groupIcon from "../assets/group.png";
import DropMenu from "./DropMenu";

class NavAchiever extends React.Component {

    constructor() {
        super();
        this.state = {
            showDropMenu: false
        };
    }

    // logoutClicked = () => {
    //     { e => this.props.logout(e) };
    //     this.menuSwitch();
    // };

    menuSwitch = () => {
        this.setState(prevState => ({showDropMenu: !prevState.showDropMenu}));
    };

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
                        //     <li className="pm admin">
                        //     <button
                        //         className="profile-holder"
                        //         onClick={e => this.props.logout(e)}
                        //     >
                        //         <img
                        //             src={groupIcon}
                        //             className="profile-icon"
                        //             alt="profile"
                        //             title="profile"
                        //         />
                        //     </button>
                        //     <DropMenu />
                        // </li>
                        <li className="pm admin">
                            <button
                                className="profile-holder"
                                onClick={this.menuSwitch}
                            >
                                <img
                                    src={groupIcon}
                                    className="profile-icon"
                                    alt="profile"
                                    title="profile"
                                />
                            </button>
                            {/* <DropMenu /> */}
                            {/* {this.showDropMenu && */}
                                <ul className={this.state.showDropMenu ? "showDrop" : "hideDrop"}>
                                    <li>
                                        <Link to="/profile" onClick={this.menuSwitch}> My Profile </Link>
                                    </li>
                                    <li>
                                        <Link to="/notifications" onClick={this.menuSwitch}> Notifications </Link>
                                    </li>
                                    <li>
                                        <p onClick={e => {
                                            /* this is the only way I could think to do this for logout */
                                            this.props.logout(e);
                                            this.menuSwitch();
                                        }}>
                                            Logout
                                        </p>
                                    </li>
                                </ul>
                            
                        </li>
                    }
                </ul>
            </div>
            </>
        );
    }
}
export default NavAchiever;