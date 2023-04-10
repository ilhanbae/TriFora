import React from "react";
import NotificationCSS from "../style/Notification.module.css";
import { Link } from 'react-router-dom';

export default class NotificationBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    // This function will accept a friend request, this will also create two way connection between two users
    accept_friend = () => {
        // If user logged in accept the request
        if (sessionStorage.getItem("user")){
            // Update the status of the connection to "active"
            let patch_url = process.env.REACT_APP_API_PATH+"/connections/" + this.props.notification.id;
            fetch(patch_url, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
            },
            body: JSON.stringify({
                attributes: {
                    status: "active",
                    type: "friend"
                },
            })
            })
            .then(res => res.json())
            .then(
                result => {
                    console.log(result);
                    console.log("Connection Updated");
                    alert("Connection Updated")
                },
                error => {
                    alert("ERROR updating Connection");
                    console.log("ERROR updating Connection")
                }
            );

            // Create a another connection from toUserID to FromUserID
            let post_url = process.env.REACT_APP_API_PATH+"/connections";
            fetch(post_url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
            },
            body: JSON.stringify({
                fromUserID: this.props.notification.toUserID,
                toUserID: this.props.notification.fromUserID,
                attributes: {
                    status: "active",
                    type: "friend"
                },
            })
            })
            .then(res => res.json())
            .then(
                result => {
                    console.log(result);
                    console.log("Connection Created");
                    alert("Connection Created");
                    this.props.load_friend_notification();
                },
                error => {
                    alert("ERROR creating new Connection");
                    console.log("ERROR creating new Connection")
                }
            );

        }else{
            console.log("Please Login First!")
        }
    }

    // This function will reject a friend request, this will delete the connection between two users
    reject_friend = () => {
        // If user logged in reject the request
        if (sessionStorage.getItem("user")){
            // delete the connection between two users
            let delete_url = process.env.REACT_APP_API_PATH+"/connections/" + this.props.notification.id;
            fetch(delete_url, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+sessionStorage.getItem("token")
                },
            })
            .then(
                result => {
                    alert("Delete Friend Request Successfully");
                    console.log("Delete Connection Successfully");
                    this.props.load_friend_notification();
                },
                error => {
                    alert("ERROR when deleting Connection");
                    console.log(error);
                    console.log("ERROR when deleting Connection");
                }
            );

        // Check if user not logged in, Login First
        }else{
            console.log("Please Login First!")
        }
    }

    render() {
        return(
            <div className={NotificationCSS["notification-box"]}>
                <div className={NotificationCSS["notification-user-content"]}>
                    <div className={NotificationCSS["notification-user"]}>
                        <img className={NotificationCSS["notification-image"]} src={this.props.notification.fromUser.attributes.profile.profileImage}></img>
                    </div>
                    <div className={NotificationCSS["notification-content"]}>
                        <h4>
                            You Received a Friend Request from {this.props.notification.fromUser.attributes.profile.username}
                        </h4>
                    </div>
                </div>
                <div className={NotificationCSS["notification-action"]}>
                    <button className={NotificationCSS["notification-accept"]} onClick={() => this.accept_friend()}>Accept</button>
                    <button className={NotificationCSS["notification-reject"]} onClick={() => this.reject_friend()}>Reject</button>
                </div>
            </div>
        );
    }

}