import React from "react";
import ProfilePageCSS from "../style/ProfilePage.module.css";
import { Link, useParams } from 'react-router-dom';
import { setEmitFlags } from "typescript";
import Friend from './Friend';

export default class ProfilePage extends React.Component {

    constructor() {
        super();
        this.state = {
            email: "",
            username: "",
            firstName: "",
            lastName: "",
            description: "",
            profileImage: "",
            friend_list: [],
            same_user_profile: false,
            user_connection: false,
            connection_id: "",

            user_id: "165",
        };
    }
 
    componentDidMount() {
        // set the auth token and user ID in the session state
        //sessionStorage.setItem("token", "underachievers|KOBXIgdj9cxepnzHLCYi1K7IbIdFQgzQfQ5BJ4D13HA");
        //sessionStorage.setItem("user", "165");
        this.render_user(this.state.user_id);
        this.load_friend(this.state.user_id);
        this.check_user_connection(this.state.user_id);
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
                alert("error!");
                }
            );
        }else{
            //If user is not logged in, show error message
            alert("Not Logged In");
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
                    alert("ERROR loading Friends");
                    console.log("ERROR loading Friends")
                }
            );

        } else {
            //If user is not logged in, show error message
            alert("Not Logged In");
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
            // Get the connection between the user of Session Storage and the user_id
            let url = process.env.REACT_APP_API_PATH+"/connections?fromUserID=" + sessionStorage.getItem("user") + "&" + "toUserID=" + user_id;
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
                // Check if the result array length == 0
                // If result array length is 0, this means no connection between users
                // If result array length is not 0, this means there is a connection between users
                if (result[0].length !== 0){
                    if (result[0][0].attributes.status === "active") {
                        this.setState({
                            user_connection: true,
                            connection_id: result[0][0].id.toString(),
                        });
                    } else if (result[0][0].attributes.status === "inactive") {
                        this.setState({
                            user_connection: "waiting",
                            connection_id: result[0][0].id.toString(),
                        });
                    }
                } else{
                    this.setState({
                        user_connection: false,
                        connection_id: "",
                    });
                    this.load_friend(user_id);
                }
                },
                error => {
                    alert("ERROR loading Friends");
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
                    alert("ERROR sending Friend Request");
                    console.log("ERROR loading Friend Request")
                }
            );

        } else {
            //If user is not logged in, show error message
            alert("Not Logged In");
        }
    }

    // This function will undo friend request to a user
    undo_friend_request = (user_id) => {
        // if the user is logged in, delete the friend request
        if (sessionStorage.getItem("token")){
            // delete a friend request using connection ID
            console.log(this.state.connection_id);
            let delete_url = process.env.REACT_APP_API_PATH+"/connections/" + this.state.connection_id;
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
                    alert("ERROR when deleting Friend Request");
                    console.log(error);
                    console.log("ERROR when deleting Friend Request");
                }
            );

        }else{
            //If user is not logged in, show error message
            alert("Not Logged In");
        }
    }


    // This function will delete a one way friend connection between two users
    delete_friend_connection = (user_id) => {
        // if the user is logged in, delete the friend request
        if (sessionStorage.getItem("token")){
            // delete a friend request using connection ID
            let delete_url = process.env.REACT_APP_API_PATH+"/connections/" + this.state.connection_id;
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
                    console.log("Delete Friend Request Successfully");
                    this.check_user_connection(user_id);
                },
                error => {
                    alert("ERROR when deleting Friend Request");
                    console.log(error);
                    console.log("ERROR when deleting Friend Request");
                }
            );

        }else{
            //If user is not logged in, show error message
            alert("Not Logged In");
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
                        />
    
                        <Link to='/' className = {ProfilePageCSS.close_button}>
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
                        <h4> Hi, I’m Spiderman. I live my life with great responsibilities. </h4>
                        {/* <h4> {this.state.description} </h4> */}
                    </div>
                </div>
    
                <div className = {ProfilePageCSS.favorite_communities_bar}>
                    <div className = {ProfilePageCSS.favorite_communities_title_bar}>
                        <h2 className = {ProfilePageCSS.favorite_communities_title}>Favorite Communities</h2>
                    </div>
                    <div className = {ProfilePageCSS.communities_bar}>
                        <div className = {ProfilePageCSS.community}>
                            <div className = {ProfilePageCSS.community_image}>
                            </div>
                            <div className = {ProfilePageCSS.community_title}>
                                <h4> Class of 2023 </h4>
                            </div>
                        </div>
                        <div className = {ProfilePageCSS.community}>
                            <div className = {ProfilePageCSS.community_image}>
                            </div>
                            <div className = {ProfilePageCSS.community_title}>
                                <h4> Class of 2023 </h4>
                            </div>
                        </div>
                        <div className = {ProfilePageCSS.community}>
                            <div className = {ProfilePageCSS.community_image}>
                            </div>
                            <div className = {ProfilePageCSS.community_title}>
                                <h4> Class of 2023 </h4>
                            </div>
                        </div>
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
                            <Friend key={friend.id} friend={friend} />
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
    } else if (props.state.user_connection === "waiting"){
        return(
            <button className={ProfilePageCSS.RequestSent_button} onClick={() => props.undo_friend_request(props.state.user_id)}>Request Sent</button>
        );

    // If there is no connection between two users, render "Add Friend" button
    } else if (props.state.user_connection === false){
        return (
            <button className={ProfilePageCSS.addfriend_button} onClick={() => props.send_friend_request(props.state.user_id)}>Add Friend</button>
        );
    }
    
}


const Render_User = (props) => {
    const { userId } = useParams();
    console.log(userId);
    // If it is the current user profile page
    if ( userId === sessionStorage.getItem("user")){
        props.render_user(userId);
        props.load_friend(userId);
        return(
            <div className = {ProfilePageCSS.profile_page}>
    
                <div className = {ProfilePageCSS.profile_title_bar}> 
                    <div className = {ProfilePageCSS.profile_title}>
                        <h1> {props.state.username}&prime;s Profile Page </h1>
                    </div>
    
                    <div className = {ProfilePageCSS['title-bar-buttons']}>
                        <Link to="/edit-profile" className = {ProfilePageCSS.edit_button}>
                            Edit
                        </Link>
    
                        <Link to='/' className = {ProfilePageCSS.close_button}>
                            Close
                        </Link>
                    </div>
                </div>
    
                <div className ={ProfilePageCSS.profile_info_bar}>
                    <div>
                        <img className={ProfilePageCSS.profile_image} src={props.state.profileImage} />
                    </div>
                    <div className = {ProfilePageCSS.user_info}>
                        <div className = {ProfilePageCSS.username}>
                            <h1> {props.state.username} </h1>
                        </div>
                        <div className = {ProfilePageCSS.first_name}>
                            <h3> First Name: {props.state.firstName} </h3>
                        </div>
                        <div className = {ProfilePageCSS.last_name}>
                            <h3> Last Name: {props.state.lastName} </h3>
                        </div>
                    </div>
                    <div className = {ProfilePageCSS.description}>
                        <h4> Hi, I’m Spiderman. I live my life with great responsibilities. </h4>
                        {/* <h4> {props.state.description} </h4> */}
                    </div>
                </div>
    
                <div className = {ProfilePageCSS.favorite_communities_bar}>
                    <div className = {ProfilePageCSS.favorite_communities_title_bar}>
                        <h2 className = {ProfilePageCSS.favorite_communities_title}>Favorite Communities</h2>
                    </div>
                    <div className = {ProfilePageCSS.communities_bar}>
                        <div className = {ProfilePageCSS.community}>
                            <div className = {ProfilePageCSS.community_image}>
                            </div>
                            <div className = {ProfilePageCSS.community_title}>
                                <h4> Class of 2023 </h4>
                            </div>
                        </div>
                        <div className = {ProfilePageCSS.community}>
                            <div className = {ProfilePageCSS.community_image}>
                            </div>
                            <div className = {ProfilePageCSS.community_title}>
                                <h4> Class of 2023 </h4>
                            </div>
                        </div>
                        <div className = {ProfilePageCSS.community}>
                            <div className = {ProfilePageCSS.community_image}>
                            </div>
                            <div className = {ProfilePageCSS.community_title}>
                                <h4> Class of 2023 </h4>
                            </div>
                        </div>
                    </div>
                </div>
    
                <div className = {ProfilePageCSS.my_friend_bar}>
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
                            <Friend key={friend.id} friend={friend}/>
                        ))}
                    </div>
                </div> 
    
            </div>
        );

    }else{
        return(
            <div className = {ProfilePageCSS.profile_page}>
    
                <div className = {ProfilePageCSS.profile_title_bar}> 
                    <div className = {ProfilePageCSS.profile_title}>
                        <h1> {this.state.username}&prime;s Profile Page </h1>
                    </div>
    
                    <div className = {ProfilePageCSS['title-bar-buttons']}>

                        {/*
                        <Link to="/edit-profile" className = {ProfilePageCSS.edit_button}>
                            Edit
                        </Link>
                        */}
    
                        <button className= {ProfilePageCSS.addfriend_button}>Add Friend</button>
    
                        {/* <button className= {ProfilePageCSS.removefriend_button}>Remove Friend</button> */}
    
                        <Link to='/' className = {ProfilePageCSS.close_button}>
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
                        <h4> Hi, I’m Spiderman. I live my life with great responsibilities. </h4>
                        {/* <h4> {this.state.description} </h4> */}
                    </div>
                </div>
    
                <div className = {ProfilePageCSS.favorite_communities_bar}>
                    <div className = {ProfilePageCSS.favorite_communities_title_bar}>
                        <h2 className = {ProfilePageCSS.favorite_communities_title}>Favorite Communities</h2>
                    </div>
                    <div className = {ProfilePageCSS.communities_bar}>
                        <div className = {ProfilePageCSS.community}>
                            <div className = {ProfilePageCSS.community_image}>
                            </div>
                            <div className = {ProfilePageCSS.community_title}>
                                <h4> Class of 2023 </h4>
                            </div>
                        </div>
                        <div className = {ProfilePageCSS.community}>
                            <div className = {ProfilePageCSS.community_image}>
                            </div>
                            <div className = {ProfilePageCSS.community_title}>
                                <h4> Class of 2023 </h4>
                            </div>
                        </div>
                        <div className = {ProfilePageCSS.community}>
                            <div className = {ProfilePageCSS.community_image}>
                            </div>
                            <div className = {ProfilePageCSS.community_title}>
                                <h4> Class of 2023 </h4>
                            </div>
                        </div>
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
                            console.log(friend.toUser),
                            <Friend key={friend.id} friend={friend} view_userID={this.state.user_id}/>
                        ))}
                    </div>
    
                </div> 
    
            </div>
        );
    }
}