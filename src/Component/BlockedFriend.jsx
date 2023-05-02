import React from "react";
import ProfilePageCSS from "../style/ProfilePage.module.css";
import { Link, useParams } from 'react-router-dom';
import Modal from "./Modal";
import ProfilePage from "./ProfilePage";


/* The Friend is going to load all the Friends related to the current user on profile page.*/

export default class BlockedFriend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openProfile: false,
        };
    }

    // unblock_user will update the connection status back to "active"
    // First get the current connection, check the type of the connection
    unblock_user = () => {
        // get the current connection, check the type of the connection
        fetch(process.env.REACT_APP_API_PATH+"/connections/" + this.props.blocked_friend.id, {
            method: "get",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+sessionStorage.getItem("token")
            },
            })
            .then(res => res.json())
            .then(
              result => {
                console.log(result)
                if (result.attributes.type === 'friend'){
                    fetch(process.env.REACT_APP_API_PATH+"/connections/" + this.props.blocked_friend.id, {
                        method: "PATCH",
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': 'Bearer '+sessionStorage.getItem("token")
                        },
                        body: JSON.stringify({
                            attributes: {
                                status: "active",
                                type: "friend"
                            }
                        })
                        })
                        .then(res => res.json())
                        .then(
                          result => {
                            console.log(result)
                            this.props.load_friend(this.props.view_userID);
                            this.props.load_blocked_friend(this.props.view_userID);
                            this.props.openToast({type: "success", message: <span>Unblock User Successfully!</span>})
                          },
                          error => {
                            //alert("error!");
                            this.props.openToast({type: "error", message: <span>ERROR When Unblock User!</span>})
                            console.log("error!")
                          }
                        );
                } else if (result.attributes.type === 'pending'){
                    fetch(process.env.REACT_APP_API_PATH+"/connections/" + this.props.blocked_friend.id, {
                        method: "PATCH",
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': 'Bearer '+sessionStorage.getItem("token")
                        },
                        body: JSON.stringify({
                            attributes: {
                                status: "inactive",
                                type: "pending"
                            }
                        })
                        })
                        .then(res => res.json())
                        .then(
                          result => {
                            console.log(result)
                            this.props.load_friend(this.props.view_userID);
                            this.props.load_blocked_friend(this.props.view_userID);
                            this.props.openToast({type: "success", message: <span>Unblock User Successfully!</span>})
                          },
                          error => {
                            //alert("error!");
                            this.props.openToast({type: "error", message: <span>ERROR When Unblock User!</span>})
                            console.log("error!")
                          }
                        );
                } else if (result.attributes.type === 'not-friend'){
                    console.log(this.props.blocked_friend.id)
                    console.log(this.props.view_userID)
                    // Delete the one way connection between users
                    fetch(process.env.REACT_APP_API_PATH+"/connections/" + this.props.blocked_friend.id, {
                        method: "DELETE",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer '+sessionStorage.getItem("token")
                        },
                        })
                        .then(
                            result => {
                            console.log(result)
                            this.props.load_friend(this.props.view_userID);
                            this.props.load_blocked_friend(this.props.view_userID);
                            this.props.openToast({type: "success", message: <span>Unblock User Successfully!</span>})
                            },
                            error => {
                                //alert("error!");
                                this.props.openToast({type: "error", message: <span>ERROR When Unblock User!</span>})
                                console.log("error!")
                            }
                        );
                }
              },
              error => {
                //alert("error!");
                this.props.openToast({type: "error", message: <span>ERROR When Unblock User!</span>})
                console.log("error!")
              }
            );
    }

    ClickProfile(){
        this.setState({
            openProfile: true,
        });
    }

    toggleProfile = event => {
        this.setState({
            openProfile: !this.state.openProfile,
        });
    }

    render() {
        return(
            <>
                <div className = {ProfilePageCSS.friend_card}>
                    <Link className={ProfilePageCSS['friend_link']} onClick={() => this.ClickProfile()}>
                        <img className = {ProfilePageCSS.friend_avatar} src={this.props.blocked_friend.toUser.attributes.profile.profileImage} alt="show-user-profile"></img>
                    </Link>
                    <Link onClick={() => this.ClickProfile()}>
                        <div className = {ProfilePageCSS.friend_name}>
                            <h4> {this.props.blocked_friend.toUser.attributes.profile.username} </h4>
                        </div>
                    </Link>
                    <button className = {ProfilePageCSS.friend_block} onClick={() => this.unblock_user()}>
                        <h5>Unblock</h5>
                    </button>
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
                        profile_id={this.props.blocked_friend_id}
                        toggleProfile={this.toggleProfile}
                    />
                </Modal>
            </>
        );
    }

}