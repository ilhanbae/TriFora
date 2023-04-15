import React from "react";
import ProfilePageCSS from "../style/ProfilePage.module.css";
import { Link, useParams } from 'react-router-dom';
import { setEmitFlags } from "typescript";
import Friend from './Friend';
import JoinedCommunity from "./JoinedCommunity";

export default class ProfilePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // Profile User Infos
            user_id: window.location.href.split('/')[4],
            email: "",
            username: "",
            firstName: "",
            lastName: "",
            description: "",
            profileImage: "",

            // Community Infos
            community_list: [],

            // Friend Infos
            friend_list: [],

            // Others
            same_user_profile: false,
            user_connection: false,
            fromUser_toUser_connection_id: "", /* This connection_id contain the id from Session Storage User to current viewing user */
            toUser_fromUser_connection_id: "", /* This connection_id contain the id from current viewing user to Session Storage User */
        };
    }
 
    componentDidMount() {
        this.render_user(this.state.user_id);
        this.load_communties(this.state.user_id);
        this.load_friend(this.state.user_id);
        this.check_user_connection(this.state.user_id);
        console.log("profile ID", window.location.href.split('/')[4])
    }

    // pass a user ID into it, and returns all the infos of the user
    render_user = (user_id) => {
        console.log("In profile");
        console.log(sessionStorage);

        // if the user is not logged in, we don't want to try loading the user.
        if (sessionStorage.getItem("token")){
            // fetch the user data, and extract out the attributes to load and display
            fetch(process.env.REACT_APP_API_PATH + "/users/" + user_id, {
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
                    email: result.attributes.profile.email || "",
                    username: result.attributes.profile.username || "",
                    firstName: result.attributes.profile.firstName || "",
                    lastName: result.attributes.profile.lastName || "",
                    description: result.attributes.profile.description || "",
                    profileImage: result.attributes.profile.profileImage || "",
                    });
                }
                }
                },
                error => {
                //alert("error!");
                console.log("error!")
                }
            );
        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            console.log("Not Logged In");
        }
    }

    // This function will load all the communities that the user joined
    load_communties = (user_id) => {
        // if the user is not logged in, we don't want to try loading communities.
        if (sessionStorage.getItem("token")){
            // Get all the communties
            let url = process.env.REACT_APP_API_PATH+"/group-members?userID=" + user_id;
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
                if (result) {
                    this.setState({
                        community_list: result[0]
                    });
                    console.log("Got communities");
                }
                },
                error => {
                    //alert("ERROR loading communities");
                    console.log("ERROR loading communities")
                }
            );
        
        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            console.log("Not Logged In");
        }
    }

    // pass a user ID into it, and returns a friend list of the user
    load_friend = (user_id) => {
        // if the user is not logged in, we don't want to try loading friends.
        if (sessionStorage.getItem("token")){

            // get all connections using fromUserID
            let url = process.env.REACT_APP_API_PATH+"/connections?fromUserID=" + user_id + "&" + "attributes=%7B%0A%20%20%22path%22%3A%20%22status%22%2C%0A%20%20%22equals%22%3A%20%22active%22%2C%0A%20%20%22stringContains%22%3A%20%22active%22%2C%0A%20%20%22stringStartsWith%22%3A%20%22active%22%2C%0A%20%20%22stringEndsWith%22%3A%20%22active%22%2C%0A%20%20%22arrayContains%22%3A%20%22active%22%0A%7D";
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
                if (result) {
                    this.setState({
                        friend_list: result[0],
                    });
                    console.log(this.state.friend_list);
                    console.log("Got Friends");
                }
                },
                error => {
                    //alert("ERROR loading Friends");
                    console.log("ERROR loading Friends")
                }
            );

        } else {
            //If user is not logged in, show error message
            //alert("Not Logged In");
            console.log("Not Logged In");
        }
    }

    // pass a user_id, check if the user_id have a connection with the user in sessionStorage 
    check_user_connection = (user_id) => {
        // If the two user ID are equal, this means it is the same person, no need to check connection
        if (user_id === sessionStorage.getItem("user")){
            this.setState({
                same_user_profile: true,
            });
        } else {
            // Get the connection from "the user of Session Storage" to "the user_id"
            let url_1 = process.env.REACT_APP_API_PATH+"/connections?fromUserID=" + sessionStorage.getItem("user") + "&" + "toUserID=" + user_id;
            fetch(url_1, {
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
                // Check if the result array length == 0
                // If result array length is 0, this means no connection between users
                // If result array length is not 0, this means there is a connection between users
                if (result[0].length !== 0){
                    if (result[0][0].attributes.status === "active") {
                        this.setState({
                            user_connection: true,
                            fromUser_toUser_connection_id: result[0][0].id.toString(),
                        });
                        // If the connection is "active", get the toUser_fromUser_connection_id
                        let url_2 = process.env.REACT_APP_API_PATH+"/connections?fromUserID=" + user_id + "&" + "toUserID=" + sessionStorage.getItem("user");
                            fetch(url_2, {
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

                    } else if (result[0][0].attributes.status === "inactive") {
                        this.setState({
                            user_connection: "waiting-response",
                            fromUser_toUser_connection_id: result[0][0].id.toString(),
                        });
                    }

                } else{
                    // Get the connection between the user of Session Storage and the user_id
                    let url_3 = process.env.REACT_APP_API_PATH+"/connections?fromUserID=" + user_id + "&" + "toUserID=" + sessionStorage.getItem("user");
                    fetch(url_3, {
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
                        // Check if the result array length == 0
                        // If result array length is 0, this means no connection between users
                        // If result array length is not 0, this means there is a connection between users
                        if (result[0].length !== 0){
                            if (result[0][0].attributes.status === "inactive") {
                                this.setState({
                                    user_connection: "need-response",
                                    fromUser_toUser_connection_id: result[0][0].id.toString(),
                                });
                            }
                        }else{
                            this.setState({
                                user_connection: false,
                                fromUser_toUser_connection_id: "",
                            });
                            this.load_friend(user_id);
                        }
                        },
                        error => {
                            //alert("ERROR loading Friends");
                            console.log("ERROR loading Friends")
                        }
                    );
                }
                },
                error => {
                    //alert("ERROR loading Friends");
                    console.log("ERROR loading Friends")
                }
            );

        }
    }

    // This function will send a friend request to a user
    send_friend_request = (user_id) => {
        // if the user is not logged in, we don't want to send the friend request.
        if (sessionStorage.getItem("token")){
            // Send a Post request to create connection
            let url = process.env.REACT_APP_API_PATH+"/connections";
            fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
            },
            body: JSON.stringify({
                fromUserID: sessionStorage.getItem("user"),
                toUserID: user_id,
                attributes: {
                    status: "inactive",
                    type: "friend"
                },
            })
            })
            .then(res => res.json())
            .then(
                result => {
                console.log(result);
                this.check_user_connection(user_id);
                },
                error => {
                    //alert("ERROR sending Friend Request");
                    console.log("ERROR loading Friend Request")
                }
            );

        } else {
            //If user is not logged in, show error message
            //alert("Not Logged In");
            console.log("Not Logged In");
        }
    }

    // This function will undo friend request to a user
    undo_friend_request = (user_id) => {
        // if the user is logged in, delete the friend request
        if (sessionStorage.getItem("token")){
            // delete a friend request using connection ID
            console.log(this.state.fromUser_toUser_connection_id);
            let delete_url = process.env.REACT_APP_API_PATH+"/connections/" + this.state.fromUser_toUser_connection_id;
            fetch(delete_url, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+sessionStorage.getItem("token")
                },
            })
            .then(
                result => {
                    //alert("Undo Friend Request Successfully");
                    console.log("Undo Friend Request Successfully");
                    this.check_user_connection(user_id);
                },
                error => {
                    //alert("ERROR when deleting Friend Request");
                    console.log(error);
                    console.log("ERROR when deleting Friend Request");
                }
            );

        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            console.log("Not Logged In");
        }
    }


    // This function will delete two way friend connections between two users
    delete_friend_connection = (user_id) => {
        // if the user is logged in, delete the friend request
        if (sessionStorage.getItem("token")){
            // delete two way friend connections using connection ID
            let delete_url_1 = process.env.REACT_APP_API_PATH+"/connections/" + this.state.fromUser_toUser_connection_id;
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
                    console.log("Delete Friend Request Successfully");
                    this.check_user_connection(user_id);
                },
                error => {
                    //alert("ERROR when deleting Friend Request");
                    console.log(error);
                    console.log("ERROR when deleting Friend Request");
                }
            );

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
                    console.log("Delete Friend Request Successfully");
                    this.check_user_connection(user_id);
                },
                error => {
                    //alert("ERROR when deleting Friend Request");
                    console.log(error);
                    console.log("ERROR when deleting Friend Request");
                }
            );

        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            console.log("Not Logged In");
        }
    }

    // This function will accept a friend request, this will also create two way connection between two users
    accept_friend = (user_id) => {
        // If user logged in accept the request
        if (sessionStorage.getItem("user")){
            // Update the status of the connection to "active"
            let patch_url = process.env.REACT_APP_API_PATH+"/connections/" + this.state.fromUser_toUser_connection_id;
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
                },
                error => {
                    //alert("ERROR updating Connection");
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
                fromUserID: sessionStorage.getItem("user"),
                toUserID: user_id,
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
                    this.check_user_connection(user_id);
                    this.load_friend(user_id);
                },
                error => {
                    //alert("ERROR creating new Connection");
                    console.log("ERROR creating new Connection")
                }
            );

        }else{
            console.log("Please Login First!")
        }
    }

    // This function will reject a friend request, this will delete the connection between two users
    reject_friend = (user_id) => {
        // If user logged in reject the request
        if (sessionStorage.getItem("user")){
            // delete the connection between two users
            let delete_url = process.env.REACT_APP_API_PATH+"/connections/" + this.state.fromUser_toUser_connection_id;
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
                    this.check_user_connection(user_id);
                },
                error => {
                    //alert("ERROR when deleting Connection");
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
            <div className = {ProfilePageCSS.profile_page}>
    
                <div className = {ProfilePageCSS.profile_title_bar}> 
                    <div className = {ProfilePageCSS.profile_title}>
                        <h1> {this.state.username}&prime;s Profile Page </h1>
                    </div>
    
                    <div className = {ProfilePageCSS['title-bar-buttons']}>

                        <Render_Buttons 
                        state={this.state}
                        send_friend_request={this.send_friend_request}
                        undo_friend_request={this.undo_friend_request}
                        delete_friend_connection={this.delete_friend_connection}
                        accept_friend={this.accept_friend}
                        reject_friend={this.reject_friend}
                        />
    
                        <Link to={-1} className = {ProfilePageCSS.close_button}>
                            Close
                        </Link>
                    </div>
                </div>
    
                <div className ={ProfilePageCSS.profile_info_bar}>
                    <div>
                        <img className={ProfilePageCSS.profile_image} src={this.state.profileImage} />
                    </div>
                    <div className = {ProfilePageCSS.user_info}>
                        <div className = {ProfilePageCSS.username}>
                            <h1> {this.state.username} </h1>
                        </div>
                        <div className = {ProfilePageCSS.first_name}>
                            <h3> First Name: {this.state.firstName} </h3>
                        </div>
                        <div className = {ProfilePageCSS.last_name}>
                            <h3> Last Name: {this.state.lastName} </h3>
                        </div>
                    </div>
                    <div className = {ProfilePageCSS.description}>
                        <h4> {this.state.description} </h4>
                    </div>
                </div>
    
                <div className = {ProfilePageCSS.favorite_communities_bar}>
                    <div className = {ProfilePageCSS.favorite_communities_title_bar}>
                        <h2 className = {ProfilePageCSS.favorite_communities_title}>Joined Communities</h2>
                        <div className = {ProfilePageCSS.communities_num}>
                            <h3> &#40;{this.state.community_list.length}&#41; </h3>
                        </div>
                    </div>

                    <div className = {ProfilePageCSS.communities_bar}>
                        {this.state.community_list.map(community_list => (
                            <JoinedCommunity 
                            key={community_list.id}
                            community_id={community_list.groupID}
                            community_name={community_list.group.name}
                            community_banner_image={community_list.group.attributes.design.bannerProfileImage}/>
                        ))}
                    </div>

                </div>
    
                <div className = {ProfilePageCSS.my_friend_bar}>
                    <div className = {ProfilePageCSS.friend_title_bar}>
                        <div className = {ProfilePageCSS.friend_title}>
                            <h2> My Friends </h2>
                        </div>
                        <div className = {ProfilePageCSS.friend_num}>
                            <h3> &#40;{this.state.friend_list.length}&#41; </h3>
                        </div>
                    </div>
    
                    <div className = {ProfilePageCSS.friend_card_bar}>
                        {this.state.friend_list.map(friend => (
                            console.log(friend),
                            <Friend 
                            key={friend.id} 
                            friend={friend} 
                            friend_id={friend.toUserID}
                            view_userID={this.state.user_id}
                            check_user_connection={this.check_user_connection}
                            load_friend={this.load_friend}/>
                        ))}
                    </div>
    
                </div> 
    
            </div>
        );
    };
}

const Render_Buttons = (props) => {
    // If it is the same user, render "Edit" button
    if (props.state.same_user_profile === true){
        return (
            <Link to="/edit-profile" className = {ProfilePageCSS.edit_button}>
                Edit
            </Link>
        );

    // If there is connection between two users, render "Remove Friend" button
    } else if (props.state.user_connection === true){
        return (
            <button className={ProfilePageCSS.removefriend_button} onClick={() => props.delete_friend_connection(props.state.user_id)}>Remove Friend</button>
        );

    // If there is a one way connection between two users, render "Request Sent" button
    } else if (props.state.user_connection === "waiting-response"){
        return(
            <button className={ProfilePageCSS.RequestSent_button} onClick={() => props.undo_friend_request(props.state.user_id)}>Request Sent</button>
        );

    // If there is no connection between two users, render "Add Friend" button
    } else if (props.state.user_connection === false){
        return (
            <button className={ProfilePageCSS.addfriend_button} onClick={() => props.send_friend_request(props.state.user_id)}>Add Friend</button>
        );

    } else if (props.state.user_connection === "need-response"){
        return (
            <div>
                <button className={ProfilePageCSS.accept_button} onClick={() => props.accept_friend(props.state.user_id)} >Accept</button>
                <button className={ProfilePageCSS.reject_button} onClick={() => props.reject_friend(props.state.user_id)} >Reject</button>
            </div>
        );
    }
    
}