import React from "react";
import "../style/NavAchiever.css";
import { Link } from "react-router-dom";
import groupIcon from "../assets/group.png";
import downIcon from "../assets/downIcon36.png";
import upIcon from "../assets/upIcon36.png";
// import DropMenu from "./DropMenu";
import defaultProfileImage from "../assets/defaultProfileImage.png";


class NavAchiever extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showDropMenu: false,
            profile_icon: "",  /* ------ Add Component in Nav ------ */
        };
    }

    /* ------ Add Component in Nav ------ */
    componentDidMount() {
        this.render_user();
    }

    // pass a user ID into it, and returns all the infos of the user
    render_user = () => {
        console.log("In profile");
        console.log(sessionStorage);

        // if the user is not logged in, we don't want to try loading the user.
        if (sessionStorage.getItem("token")){
            // fetch the user data, and extract out the attributes to load and display
            fetch(process.env.REACT_APP_API_PATH + "/users/" + sessionStorage.getItem("user"), {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
            })
            .then(res => res.json())
            .then(
                result => {
                if (result) {
                    console.log(result);
                    if (result.attributes){
                        this.setState({
                        // IMPORTANT!  You need to guard against any of these values being null.  If they are, it will
                        // try and make the form component uncontrolled, which plays havoc with react
                        profile_icon: result.attributes.profile.profileImage || "",
                        });
                    // Check if the profileImage is the default value, it is default value set to default image
                    if (result.attributes.profile.profileImage === ""){
                        this.setState({
                            profile_icon: defaultProfileImage
                        })
                    }
                }
                }
                },
                error => {
                //alert("error!");
                }
            );
        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            console.log("Not Logged In");
        }
    }
    /* ------ Add Component in Nav ------ */

    menuSwitch = () => {
        this.setState(menuState => ({ showDropMenu: !menuState.showDropMenu }));
    };

    render() {
        return (
            <div id="headerNav" className="headerNav">
                {/* items that appear to the left side of the navbar */}
                <ul id="leftItems">
                    <li className="logo">
                        {/* <Link to="/"> Logo </Link> */}
                        {/* Temporarily non clickable text since destination unknown */}
                        <div> Trifora </div>
                    </li>

                    {/* commented out as lacking functionality for now */}
                    {/* About/browse link will be changing depending on page, see search bar comment in next div */}
                    {/* this.props.navStyle === 2 ? (about page link will go here):(browse link will go here) */}
                    { /* browse may end up being a logged in only function? this comment was a part of the above browse link */}

                </ul>
                
                {/* commented out as lacking functionality for now */}
                {/* {sessionStorage.getItem("token") && */}
                {/* The middle item search bar only occurs while logged in and only on certain pages. There will exist a state variable
                    in the main app that needs to potentially be updated whenever a page loads */}
                {/* <div>
                        {this.props.navStyle === 3 &&
                            <input type="text" placeholder="search function" />}
                    </div>
                } */}

                {/* Items on the right side of the navbar are handled here, drop down included */}
                <ul id="rightItems">
                    {!sessionStorage.getItem("token") &&
                        /*  Making use of the way the boilerplate code handled login seems to work
                            if logged out show signup/login */
                        <>
                            <li className="nav_text">
                                <Link to="/register"> Sign up </Link>
                            </li>
                            <li className="nav_text">
                                <Link to="/login"> Login </Link>
                            </li>
                        </>}
                    {sessionStorage.getItem("token") &&
                        /* if logged in have a dropdown menu with the profile icon*/
                        // Icon/button needs to be changed, just using as a placeholder for testing
                        <li className="pm admin">
                            {/* This icon is a placeholder until maybe profile icon */}
                            <img
                                src={this.state.profile_icon}  /* ------ Add Component in Nav ------ */
                                className="profile-icon"
                                // onClick={this.menuSwitch}
                                alt="profile icon will go here"
                                title="profile icon will go here" />
                            {/* Icon change based on menu state (starts false as menu is hidden) */}
                            {this.state.showDropMenu ? (
                                <img
                                    src={upIcon}
                                    className="up-icon"
                                    onClick={this.menuSwitch}
                                    alt="hide menu"
                                    title="hide menu"
                                    style={{cursor:"pointer"}} />
                            ) : (
                                <img
                                    src={downIcon}
                                    className="down-icon"
                                    onClick={this.menuSwitch}
                                    alt="show menu"
                                    title="show menu"
                                    style={{cursor:"pointer"}} />
                            )}
                            {/* <DropMenu /> */}
                            {/* DropMenu could now likely be switch to being it's own component, though a way to logout would
                                    have to be passed through */}
                            {/* the following line uses ternary statement to allow for the hiding/showing of the drop down via css */}
                            <ul className={this.state.showDropMenu ? "showDrop" : "hideDrop"}>
                                <li>
                                    <Link to={`/profile/${sessionStorage.getItem("user")}`} onClick={() => {window.location.assign(`/profile/${sessionStorage.getItem("user")}`)}}> My Profile </Link>
                                </li>
                                <li>
                                    <Link to="/notification" onClick={this.menuSwitch}> Notifications </Link>
                                </li>
                                <li>
                                    <Link to="/login" onClick={e => {
                                        {/* this is the only way I could think to do this for logout */}
                                        this.props.logout(e);
                                        this.menuSwitch();
                                    }}>
                                        Logout
                                    </Link>
                                    {/* <div style={{cursor:"pointer"}} onClick={e => { */}
                                        {/* this is the only way I could think to do this for logout */}
                                        {/* this.props.logout(e);
                                        this.menuSwitch();
                                    }}>
                                        Logout
                                    </div> */}
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