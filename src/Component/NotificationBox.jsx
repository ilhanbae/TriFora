import React from "react";
import NotificationCSS from "../style/Notification.module.css";
import { Link } from 'react-router-dom';
import defaultProfileImage from "../assets/defaultProfileImage.png";
import Modal from "./Modal";
import ProfilePage from "../Component/ProfilePage";

export default class NotificationBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notification_image: this.props.notification.fromUser.attributes.profile.profileImage === "" ? defaultProfileImage : this.props.notification.fromUser.attributes.profile.profileImage,
            openProfile: false,
        };
    }

    componentDidMount(){
        console.log(this.props.notification);
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
                    //alert("Connection Updated")
                    this.props.openToast({type: "success", message: <span>Friend Request Accepted!</span>})
                },
                error => {
                    //alert("ERROR updating Connection");
                    this.props.openToast({type: "error", message: <span>Error When Accepting Friend Request!</span>})
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
                    //alert("Connection Created");
                    this.props.load_friend_notification();
                },
                error => {
                    //alert("ERROR creating new Connection");
                    this.props.openToast({type: "error", message: <span>Error When Accepting Friend Request!</span>})
                    console.log("ERROR creating new Connection")
                }
            );

        }else{
            this.props.openToast({type: "error", message: <span>Please Login First!</span>})
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
                    //alert("Delete Friend Request Successfully");
                    console.log("Delete Connection Successfully");
                    this.props.load_friend_notification();
                    this.props.openToast({type: "success", message: <span>Friend Request Rejected!</span>})
                },
                error => {
                    //alert("ERROR when deleting Connection");
                    console.log(error);
                    console.log("ERROR when deleting Connection");
                    this.props.openToast({type: "error", message: <span>Error When rejecting Friend Request!</span>})
                }
            );

        // Check if user not logged in, Login First
        }else{
            this.props.openToast({type: "error", message: <span>Please Login First!</span>})
            console.log("Please Login First!")
        }
    }

    ClickProfile(){
        this.setState({
            openProfile: true,
        });
    }

    toggleProfile = event => {
        //this.props.closePostPageModal();
        this.setState({
            openProfile: !this.state.openProfile,
        });
    }

    render() {
        return(
            <>
            <div className={NotificationCSS["notification-box"]}>
                <div className={NotificationCSS["notification-user-content"]}>
                    <div className={NotificationCSS["notification-user"]}>
                        <Link onClick={() => this.ClickProfile()}>
                            <img className={NotificationCSS["notification-image"]} src={this.state.notification_image} alt="show-user-profile"></img>
                        </Link>
                    </div>
                    <div className={NotificationCSS["notification-content"]}>
                        <h2>
                            You Received a Friend Request from <h2 className={NotificationCSS["notification-sender"]}>{this.props.notification.fromUser.attributes.profile.username}</h2>
                        </h2>
                    </div>
                </div>
                <div className={NotificationCSS["notification-action"]}>
                    <button className={NotificationCSS["notification-accept"]} onClick={() => this.accept_friend()}>Accept</button>
                    <button className={NotificationCSS["notification-reject"]} onClick={() => this.reject_friend()}>Reject</button>
                </div>
            </div>

            <Modal
                show={this.state.openProfile}
                onClose={this.toggleProfile}
                modalStyle={{
                width: "85%",
                height: "85%",
                }}
            >
                <ProfilePage 
                    profile_id={this.props.notification.fromUser.id}
                    toggleProfile={this.toggleProfile}
                    openToast={this.props.openToast}
                    load_friend_notification={this.props.load_friend_notification}
                />
            </Modal>
            </>
        );
    }

}