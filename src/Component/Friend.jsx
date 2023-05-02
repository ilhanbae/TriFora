import React from "react";
import ProfilePageCSS from "../style/ProfilePage.module.css";
import { Link, useParams } from 'react-router-dom';
import Modal from "./Modal";
import ProfilePage from "./ProfilePage";


/* The Friend is going to load all the Friends related to the current user on profile page.*/

export default class Friend extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            /* we can get "fromUser_toUser_connection_id" from "this.props.friend.id"*/
            toUser_fromUser_connection_id: "",
            click_friend_id: "",

            openProfile: false,
        };
    }

    componentDidMount() {
        this.load_toUser_fromUser_connection_id();
    }


    // This function will get the toUser_fromUser_connection_id
    load_toUser_fromUser_connection_id = () => {
        // At this point, the connection must be "active", get the toUser_fromUser_connection_id
        let url = process.env.REACT_APP_API_PATH+"/connections?fromUserID=" + this.props.friend.toUserID + "&" + "toUserID=" + this.props.friend.fromUserID;
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
            this.setState({
                toUser_fromUser_connection_id: result[0][0].id.toString(),
            });
            },
            error => {
                //alert("ERROR loading Friends");
                console.log("ERROR loading Friends")
            }
        );
    }

    // This function will delete two way friend connections between two users
    // This function is for the "Remove" button on each friend card
    remove_friend_connection = () => {
        // if the user is logged in, delete the friend request
        if (sessionStorage.getItem("token")){
            // delete the first friend connection using connection ID
            let delete_url_1 = process.env.REACT_APP_API_PATH+"/connections/" + this.props.friend.id;
            fetch(delete_url_1, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+sessionStorage.getItem("token")
                },
            })
            .then(
                result => {
                    //alert("Delete Friend Request Successfully");
                    console.log("Delete Friend connection Successfully");
                    this.props.load_friend(this.props.view_userID);
                },
                error => {
                    //alert("ERROR when deleting Frist Friend connection");
                    console.log(error);
                    console.log("ERROR when deleting First Friend 1 connection");
                }
            );

            // delete the second friend connection using connection ID
            let delete_url_2 = process.env.REACT_APP_API_PATH+"/connections/" + this.state.toUser_fromUser_connection_id;
            fetch(delete_url_2, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+sessionStorage.getItem("token")
                },
            })
            .then(
                result => {
                    //alert("Delete Friend Request Successfully");
                    console.log("Delete Friend connection Successfully");
                    this.props.load_friend(this.props.view_userID);
                },
                error => {
                    //alert("ERROR when deleting Second Friend connection");
                    console.log(error);
                    console.log("ERROR when deleting Second Friend connection");
                }
            );

        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            console.log("Not Logged In");
        }
    }

    // This function will block another user by change one way connection status to "blocked"
    // This function is for the "Block" button on each friend card
    block_friend = () => {
        fetch(process.env.REACT_APP_API_PATH+"/connections/" + this.props.friend.id, {
            method: "PATCH",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+sessionStorage.getItem("token")
            },
            body: JSON.stringify({
                attributes: {
                    status: "blocked",
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
              },
              error => {
                //alert("error!");
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
        // If view_userID != to the current logged in user, remove the "Remove" button
        if (this.props.view_userID !== sessionStorage.getItem("user")){
            return (
                <>
                    <div className = {ProfilePageCSS.friend_card}>
                        <Link onClick={() => this.ClickProfile()}>
                            <img className = {ProfilePageCSS.friend_avatar} src={this.props.friend.toUser.attributes.profile.profileImage}></img>
                            <div className = {ProfilePageCSS.friend_name}>
                                <h4> {this.props.friend.toUser.attributes.profile.username} </h4>
                            </div>
                        </Link>
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
                            profile_id={this.props.friend_id}
                            toggleProfile={this.toggleProfile}
                        />
                    </Modal>
                </>
            );
        // If view_userID == to the current logged in user, render the "Remove" button
        }else{
            return(
                <>
                    <div className = {ProfilePageCSS.friend_card}>
                        <Link onClick={() => this.ClickProfile()}>
                            <img className = {ProfilePageCSS.friend_avatar} src={this.props.friend.toUser.attributes.profile.profileImage}></img>
                            <div className = {ProfilePageCSS.friend_name}>
                                <h4> {this.props.friend.toUser.attributes.profile.username} </h4>
                            </div>
                        </Link>
                        <button className = {ProfilePageCSS.friend_remove} onClick={() => this.remove_friend_connection()}>
                            <h5>Remove</h5>
                        </button>
                        <button className = {ProfilePageCSS.friend_block} onClick={() => this.block_friend()}>
                            <h5>Block</h5>
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
                            profile_id={this.props.friend_id}
                            toggleProfile={this.toggleProfile}
                        />
                    </Modal>
                </>
            );
        }
    }

}