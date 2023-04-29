import React from "react";
import ProfilePageCSS from "../style/ProfilePage.module.css";
import { Link, useParams } from 'react-router-dom';
import { setEmitFlags } from "typescript";
import Friend from './Friend';
import JoinedCommunity from "./JoinedCommunity";
import defaultProfileImage from "../assets/defaultProfileImage.png";
import EditProfile from "./EditProfilePage";
import Modal from "./Modal";
import BlockedFriend from "./BlockedFriend";

export default class ProfilePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // Profile User Infos
            user_id: props.profile_id,
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
            // Blocked Friend List
            blocked_friend_list: [],

            // Used for Friend Connections
            same_user_profile: false,
            user_connection: false,
            fromUser_toUser_connection_id: "", /* This connection_id contain the id from Session Storage User to current viewing user */
            toUser_fromUser_connection_id: "", /* This connection_id contain the id from current viewing user to Session Storage User */

            // Show Edit Profile Page
            openEditProfile: false,

            // Switch for Friend bar
            show_BlockedFriend: false,

            // Used for block connections
            user_block_connection: false,
        };
    }
 
    componentDidMount() {
        this.render_user(this.state.user_id);
        this.load_communties(this.state.user_id);
        this.load_friend(this.state.user_id);
        this.load_blocked_friend(this.state.user_id);
        this.check_user_connection(this.state.user_id);
        this.check_user_block_connection(this.state.user_id);
        console.log("Profile ID: ", this.props.profile_id)
    }

    // pass a user ID into it, and returns all the infos of the user
    render_user = (user_id) => {
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
                    profileImage: result.attributes.profile.profileImage || defaultProfileImage,
                    });
                    // Check if the profileImage is the default value, it is default value set to default image
                    if (result.attributes.profile.profileImage === ""){
                        this.setState({
                            profileImage: defaultProfileImage,
                        })
                    }
                }
                }
                },
                error => {
                //alert("error!");
                this.props.openToast({type: "error", message: <span>Error When Render the User!</span>})
                console.log("error!")
                }
            );
        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            this.props.openToast({type: "error", message: <span>Please Login First!</span>})
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
                    console.log(this.state.community_list)
                    console.log("Got communities");
                }
                },
                error => {
                    //alert("ERROR loading communities");
                    this.props.openToast({type: "error", message: <span>Error When Loading Communities!</span>})
                    console.log("ERROR loading communities")
                }
            );
        
        }else{
            //If user is not logged in, show error message
            this.props.openToast({type: "error", message: <span>Please Login First!</span>})
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
                    this.props.openToast({type: "error", message: <span>Error When Loading Friends!</span>})
                    console.log("ERROR loading Friends")
                }
            );

        } else {
            //If user is not logged in, show error message
            //alert("Not Logged In");
            this.props.openToast({type: "error", message: <span>Please Login First!</span>})
            console.log("Not Logged In");
        }
    }

    // load_blocked_friend will load all the blocked users
    load_blocked_friend = (user_id) => {
        // if the user is not logged in, we don't want to try loading blocked friends.
        if (sessionStorage.getItem("token")){
            // get all connections using fromUserID
            let url = process.env.REACT_APP_API_PATH+"/connections?fromUserID=" + user_id + "&" + "attributes=%7B%0A%20%20%22path%22%3A%20%22status%22%2C%0A%20%20%22equals%22%3A%20%22blocked%22%2C%0A%20%20%22stringContains%22%3A%20%22blocked%22%2C%0A%20%20%22stringStartsWith%22%3A%20%22blocked%22%2C%0A%20%20%22stringEndsWith%22%3A%20%22blocked%22%2C%0A%20%20%22arrayContains%22%3A%20%22blocked%22%0A%7D";
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
                        blocked_friend_list: result[0],
                    });
                    console.log(this.state.blocked_friend_list);
                    console.log("Got Blocked Friends");
                }
                },
                error => {
                    //alert("ERROR loading Friends");
                    this.props.openToast({type: "error", message: <span>Error When Loading Blocked Users!</span>})
                    console.log("ERROR loading Blocked Users")
                }
            );

        } else {
            //If user is not logged in, show error message
            //alert("Not Logged In");
            this.props.openToast({type: "error", message: <span>Please Login First!</span>})
            console.log("Not Logged In");
        }

    }

    // pass a user_id, check if the user_id have a connection with the user in sessionStorage 
    check_user_connection = (user_id) => {
        // If the two user ID are equal, this means it is the same person, no need to check connection
        if (user_id.toString() === sessionStorage.getItem("user")){
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
                                    this.props.openToast({type: "error", message: <span>Error When Loading Friend Connection!</span>})
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
                            this.props.openToast({type: "error", message: <span>Error When Loading Friend Connection!</span>})
                            console.log("ERROR loading Friends")
                        }
                    );
                }
                },
                error => {
                    //alert("ERROR loading Friends");
                    this.props.openToast({type: "error", message: <span>Error When Loading Friend Connection!</span>})
                    console.log("ERROR loading Friends")
                }
            );
        }
    }

    // pass a user_id, check if the user_id have a block connection with the user in sessionStorage 
    check_user_block_connection = (user_id) => {
        // If the two user ID are equal, this means it is the same person, no need to check connection
        if (user_id.toString() === sessionStorage.getItem("user")){
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
                if (result[0].length !== 0){
                    //console.log("Have Connection (Friend or Block)!!!");
                    if (result[0][0].attributes.status === 'active' || result[0][0].attributes.status === 'inactive'){
                        //console.log("Have Friend Connection!!!");
                        this.setState({
                            user_block_connection: false
                        })
                    } else if (result[0][0].attributes.status === 'blocked') {
                        //console.log("Have Block Connection!!!");
                        this.setState({
                            user_block_connection: true
                        })
                    }
                } else {
                    //console.log("No Connection!!!")
                    this.setState({
                        user_block_connection: false
                    })
                }
                },
                error => {
                    //alert("ERROR loading Friends");
                    this.props.openToast({type: "error", message: <span>Error When Loading Blocked User Connection!</span>})
                    console.log("ERROR loading Block user")
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
                    type: "pending"
                },
            })
            })
            .then(res => res.json())
            .then(
                result => {
                console.log(result);
                this.props.openToast({type: "success", message: <span>Friend Request Sent Successfully!</span>})
                this.check_user_connection(user_id);
                },
                error => {
                    //alert("ERROR sending Friend Request");
                    this.props.openToast({type: "error", message: <span>Error When Sending Friend Request!</span>})
                    console.log("ERROR loading Friend Request")
                }
            );

        } else {
            //If user is not logged in, show error message
            //alert("Not Logged In");
            this.props.openToast({type: "error", message: <span>Please Login First!</span>})
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
                    this.props.openToast({type: "success", message: <span>Undo Friend Request Successfully!</span>})
                    this.check_user_connection(user_id);
                },
                error => {
                    //alert("ERROR when deleting Friend Request");
                    this.props.openToast({type: "error", message: <span>Error When undo Friend Request!</span>})
                    console.log(error);
                    console.log("ERROR when deleting Friend Request");
                }
            );

        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            this.props.openToast({type: "error", message: <span>Please Login First!</span>})
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
                    this.props.openToast({type: "success", message: <span>Delete Friend Request Successfully!</span>})
                    this.check_user_connection(user_id);
                },
                error => {
                    //alert("ERROR when deleting Friend Request");
                    this.props.openToast({type: "error", message: <span>Error When deleting Friend Connection!</span>})
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
                    this.props.openToast({type: "error", message: <span>Error When deleting Friend Connection!</span>})
                    console.log(error);
                    console.log("ERROR when deleting Friend Request");
                }
            );

        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            this.props.openToast({type: "error", message: <span>Please Login First!</span>})
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
                    this.props.openToast({type: "success", message: <span>Friend Request Accepted!</span>})
                    this.check_user_connection(user_id);
                    this.load_friend(user_id);
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
                    this.props.openToast({type: "success", message: <span>Friend Request Rejected!</span>})
                    this.check_user_connection(user_id);
                },
                error => {
                    //alert("ERROR when deleting Connection");
                    this.props.openToast({type: "error", message: <span>Error When Rejecting Friend Request!</span>})
                    console.log(error);
                    console.log("ERROR when deleting Connection");
                }
            );

        // Check if user not logged in, Login First
        }else{
            this.props.openToast({type: "error", message: <span>Please Login First!</span>})
            console.log("Please Login First!")
        }
    }

    // This function will block a user or a friend
    // If the user is not a friend, create a new one way connection with "status" set to "blocked"
    // If the user is a friend, update the one way connection with "status" set to "blocked"
    block_user = (user_id) => {
        // If user logged in, block the user
        if (sessionStorage.getItem("user")){
            // Check the connection between two users
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
                if (result[0].length !== 0){
                    //console.log("Have Connection (Friend or Block)!!!");
                    if (result[0][0].attributes.status === 'active'){
                        // Update the one way connection with "status" set to "blocked"
                        //console.log("Have Friend Connection!!!");
                        fetch(process.env.REACT_APP_API_PATH+"/connections/" + result[0][0].id, {
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
                                this.props.openToast({type: "success", message: <span>User Blocked!</span>})
                                this.check_user_connection(user_id);
                                this.check_user_block_connection(user_id);
                              },
                              error => {
                                //alert("error!");
                                this.props.openToast({type: "error", message: <span>Error When Blocking a User!</span>})
                                console.log("error!")
                              }
                            );
                    } else if (result[0][0].attributes.status === 'inactive'){
                        // Update the one way connection with "status" set to "blocked"
                        //console.log("Have Friend Connection!!!");
                        fetch(process.env.REACT_APP_API_PATH+"/connections/" + result[0][0].id, {
                            method: "PATCH",
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': 'Bearer '+sessionStorage.getItem("token")
                            },
                            body: JSON.stringify({
                                attributes: {
                                    status: "blocked",
                                    type: "pending"
                                }
                            })
                            })
                            .then(res => res.json())
                            .then(
                              result => {
                                console.log(result)
                                this.props.openToast({type: "success", message: <span>User Blocked!</span>})
                                this.check_user_connection(user_id);
                                this.check_user_block_connection(user_id);
                              },
                              error => {
                                //alert("error!");
                                this.props.openToast({type: "error", message: <span>Error When Blocking a User!</span>})
                                console.log("error!")
                              }
                            );
                    }
                } else {
                    // Create a new connection between users, set "status" to "blocked"
                    //console.log("No Connection!!!")
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
                            status: "blocked",
                            type: "not-friend",
                        },
                    })
                    })
                    .then(res => res.json())
                    .then(
                        result => {
                        console.log(result);
                        this.props.openToast({type: "success", message: <span>User Blocked!</span>})
                        this.check_user_connection(user_id);
                        this.check_user_block_connection(user_id);
                        },
                        error => {
                            //alert("ERROR sending Friend Request");
                            this.props.openToast({type: "error", message: <span>Error When Blocking a User!</span>})
                            console.log("ERROR loading Friend Request")
                        }
                    );
                }
                },
                error => {
                    //alert("ERROR loading Friends");
                    this.props.openToast({type: "error", message: <span>Error When Blocking a User!</span>})
                    console.log("ERROR loading Block user")
                }
            );

        // Check if user not logged in, Login First
        } else {
            this.props.openToast({type: "error", message: <span>Please Login First!</span>})
            console.log("Please Login First!")
        }
    }

    swtich_friendbar = () =>{
        this.setState({
            show_BlockedFriend: !this.state.show_BlockedFriend,
        })
    }

    ClickEditProfile = () =>{
        this.setState({
            openEditProfile: true,
        });
    }

    toggleEditProfile = event => {
        this.setState({
            openEditProfile: !this.state.openEditProfile,
        });
    }

    render() {
        if (this.state.user_block_connection === false){
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
                            ClickEditProfile={this.ClickEditProfile}
                            />
    
                            <Render_Block_Button 
                            state={this.state}
                            block_user={this.block_user}
                            unblock_user={this.unblock_user}
                            />
    
                            <Modal
                                show={this.state.openEditProfile}
                                onClose={this.toggleEditProfile}
                                modalStyle={{
                                width: "85%",
                                height: "85%",
                                }}
                            >
                                <EditProfile 
                                render_user={this.render_user}
                                toggleProfile={this.props.toggleProfile}
                                />
                            </Modal>
        
                            {/*
                            <Link className = {ProfilePageCSS.close_button}>
                                Close
                            </Link>
                            */}
                        </div>
                    </div>
        
                    <div className ={ProfilePageCSS.profile_info_bar}>
                        <div>
                            <img className={ProfilePageCSS.profile_image} src={this.state.profileImage} alt="profile-img"/>
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
                                community_banner_image={community_list.group.attributes.design.bannerProfileImage}
                                redirect_community={this.props.redirect_community}
                                closeProfilePage={this.props.closeProfilePage}
                                closePostPageModal={this.props.closePostPageModal}
                                />  
                            ))}
                        </div>
    
                    </div>
        
                    <div className = {ProfilePageCSS.my_friend_bar}>
                        <Render_FriendBar 
                        state={this.state}
                        swtich_friendbar={this.swtich_friendbar}
                        check_user_connection={this.check_user_connection}
                        load_friend={this.load_friend}
                        load_blocked_friend={this.load_blocked_friend}
                        openToast={this.props.openToast}
                        />
                    </div> 
        
                </div>
            );
        } else {
            return(
                <div className = {ProfilePageCSS.profile_page}>
                    <h1>User has been blocked!</h1>
                </div>
            );
        }
    };
}

const Render_Buttons = (props) => {
    // If it is the same user, render "Edit" button
    if (props.state.same_user_profile === true){
        return (
            <Link className = {ProfilePageCSS.edit_button} onClick={() => props.ClickEditProfile()}>
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

const Render_Block_Button = (props) => {
    if (props.state.same_user_profile === true){
        return (
            <></>
        );
    } else if (props.state.user_block_connection === false){
        return (
            <button className={ProfilePageCSS.Block_button} onClick={() => props.block_user(props.state.user_id)} >Block</button>
        );

    }
}

const Render_FriendBar = (props) => {
    if (props.state.user_id.toString() !== sessionStorage.getItem("user")){
        return(
            <>
            <div className = {ProfilePageCSS.friend_title_bar}>
                <div className = {ProfilePageCSS.friend_title}>
                    <h2> My Friends </h2>
                </div>
                <div className = {ProfilePageCSS.friend_num}>
                    <h3> &#40;{props.state.friend_list.length}&#41; </h3>
                </div>
            </div>

            <div className = {ProfilePageCSS.friend_card_bar}>
                {props.state.friend_list.map(friend => (
                    console.log(friend),
                    <Friend 
                    key={friend.id} 
                    friend={friend} 
                    friend_id={friend.toUserID}
                    view_userID={props.state.user_id}
                    check_user_connection={props.check_user_connection}
                    load_friend={props.load_friend}
                    openToast={props.openToast}
                    />
                ))}
            </div>
            </>
        );

    } else if (props.state.show_BlockedFriend === false){
        return(
            <>
            <div className = {ProfilePageCSS.friend_title_bar}>
                <div className = {ProfilePageCSS.friend_title}>
                    <h2> My Friends </h2>
                </div>
                <div className = {ProfilePageCSS.friend_num}>
                    <h3> &#40;{props.state.friend_list.length}&#41; </h3>
                </div>
            </div>
            <button className = {ProfilePageCSS['show_BlockedFriend']} onClick={() => props.swtich_friendbar()}>Show Blocked Friends</button>

            <div className = {ProfilePageCSS.friend_card_bar}>
                {props.state.friend_list.map(friend => (
                    console.log(friend),
                    <Friend 
                    key={friend.id} 
                    friend={friend} 
                    friend_id={friend.toUserID}
                    view_userID={props.state.user_id}
                    check_user_connection={props.check_user_connection}
                    load_friend={props.load_friend}
                    load_blocked_friend={props.load_blocked_friend}
                    openToast={props.openToast}
                    />
                ))}
            </div>
            </>
        );

    } else {
        return(
            <>
            <div className = {ProfilePageCSS.friend_title_bar}>
                <div className = {ProfilePageCSS.friend_title}>
                    <h2> My Blocked Friends </h2>
                </div>
                <div className = {ProfilePageCSS.friend_num}>
                    <h3> &#40;{props.state.blocked_friend_list.length}&#41; </h3>
                </div>
            </div>
            <button className = {ProfilePageCSS['show_Friend']} onClick={() => props.swtich_friendbar()}>Show Friends</button>

            <div className = {ProfilePageCSS.friend_card_bar}>
                {props.state.blocked_friend_list.map(blocked_friend => (
                    console.log(blocked_friend),
                    <BlockedFriend 
                    key={blocked_friend.id} 
                    blocked_friend={blocked_friend} 
                    blocked_friend_id={blocked_friend.toUserID}
                    view_userID={props.state.user_id}
                    check_user_connection={props.check_user_connection}
                    load_friend={props.load_friend}
                    load_blocked_friend={props.load_blocked_friend}
                    openToast={props.openToast}
                    />
                ))} 
            </div>
            </>
        );
    }

}