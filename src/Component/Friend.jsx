import React from "react";
import ProfilePageCSS from "../style/ProfilePage.module.css";

/* The FriendList is going to load all the Friends related to the current user on profile page.*/

export default class Friend extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //friend_image: this.props.friend.toUser.attributes.profile.profileImage,
            //friend_username: this.props.friend.toUser.attributes.profile.username,
        };
    }

    render() {
        if (this.props.view_userID !== sessionStorage.getItem("user")){
            return (
                <div className = {ProfilePageCSS.friend_card}>
                    <div className = {ProfilePageCSS.friend_avatar}>
                        {this.props.friend.toUser.attributes.profile.profileImage}
                    </div>
                    <div className = {ProfilePageCSS.friend_name}>
                        <h4> {this.props.friend.toUser.attributes.profile.username} </h4>
                    </div>
                </div>
            );
        }else{
            return(
                <div className = {ProfilePageCSS.friend_card}>
                    <div className = {ProfilePageCSS.friend_avatar}>
                        {this.props.friend.toUser.attributes.profile.profileImage}
                    </div>
                    <div className = {ProfilePageCSS.friend_name}>
                        <h4> {this.props.friend.toUser.attributes.profile.username} </h4>
                    </div>
                    <button className = {ProfilePageCSS.friend_remove}>
                        <h5>Remove</h5>
                    </button>
                </div>
            );
        }
    }

}