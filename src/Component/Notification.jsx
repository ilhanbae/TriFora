import React from "react";
import NotificationCSS from "../style/Notification.module.css";
import { Link } from 'react-router-dom';
import NotificationBox from "./NotificationBox";

export default class Notification extends React.Component {

    constructor() {
        super();
        this.state = {
            notification_number: 0,
            friend_notification_list: [],
        };
    }

    componentDidMount() {
        this.load_friend_notification();
    }

    // This function will load all the friend request notifications that related to the user into a list
    load_friend_notification = () => {
        // Check if user logged in or not, if user logged in load their notifications
        if (sessionStorage.getItem("user")){
            // get all friend requests sent to the user
            let url = process.env.REACT_APP_API_PATH+"/connections?toUserID=" + sessionStorage.getItem("user") + "&" + "attributes=%7B%0A%20%20%22path%22%3A%20%22status%22%2C%0A%20%20%22equals%22%3A%20%22inactive%22%2C%0A%20%20%22stringContains%22%3A%20%22inactive%22%2C%0A%20%20%22stringStartsWith%22%3A%20%22inactive%22%2C%0A%20%20%22stringEndsWith%22%3A%20%22inactive%22%2C%0A%20%20%22arrayContains%22%3A%20%22inactive%22%0A%7D";
            fetch(url, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
            },
            })
            .then(res => res.json())
            .then(
                result => {
                console.log(result);
                if (result[0].length !== 0) {
                    this.setState({
                        friend_notification_list: result[0],
                    });
                    console.log(this.state.friend_notification_list);
                    console.log("Got Notifications");
                }else{
                    this.setState({
                        friend_notification_list: result[0],
                    });
                    //alert("No Notification");
                    console.log("No Notification");
                }
                },
                error => {
                    //alert("ERROR loading Notifications");
                    console.log("ERROR loading Notifications")
                }
            );

        }else{
            console.log("Please Login First!")
        }
    }

    render() {
        return(
            <div className={NotificationCSS["notification-page"]}>
                <div className={NotificationCSS["notification-header"]}>
                    <div className={NotificationCSS["notification-message"]}>
                        <h2>You Have &#91; {this.state.friend_notification_list.length} &#93; Notifications</h2>
                    </div>
                    <Link to={-1} className={NotificationCSS["close-button"]}>
                        Close
                    </Link>
                </div>

                <div className={NotificationCSS["notification-body"]}>
                    {this.state.friend_notification_list.map(notification => (
                        <NotificationBox key={notification.id} notification={notification} load_friend_notification={this.load_friend_notification}/>
                    ))}
                </div>
            </div>
        );
    }


}