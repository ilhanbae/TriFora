import React from "react";
import ProfilePageCSS from "../style/ProfilePage.module.css";
import {
    Link
 } from 'react-router-dom';

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
            phone: "",

            isRemoved_1: false,
            isRemoved_2: false,
            isRemoved_3: false,
            isRemoved_4: false,
            isRemoved_5: false,
            current_friend_num: 5,
        };
    }

    render_user(){
        console.log("In profile");
        console.log(sessionStorage)
        // fetch the user data, and extract out the attributes to load and display
        fetch(process.env.REACT_APP_API_PATH + "/users/" + sessionStorage.getItem('user'), {
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
                  phone: result.attributes.profile.phone || "",
                });
              }
              }
            },
            error => {
              alert("error!");
            }
          );
    }

    componentDidMount() {
        this.render_user();
    }

    render() {
        return(
        <div className = {ProfilePageCSS.profile_page}>

            <div className = {ProfilePageCSS.profile_title_bar}> 
                <div className = {ProfilePageCSS.profile_title}>
                    {this.state.username}&prime;s Profile Page
                </div>

                <div className = {ProfilePageCSS['title-bar-buttons']}>
                    <Link to="/edit-profile" className = {ProfilePageCSS.edit_button}>
                        Edit
                    </Link>

                    {/* <button className= {ProfilePageCSS.addfriend_button}>Add Friend</button> */}

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
                        {this.state.username}
                    </div>
                    <div className = {ProfilePageCSS.first_name}>
                        First Name: {this.state.firstName}
                    </div>
                    <div className = {ProfilePageCSS.last_name}>
                        Last Name: {this.state.lastName}
                    </div>
                </div>
                <div className = {ProfilePageCSS.description}>
                    Hi, I’m Spiderman. I live my life with great responsibilities.
                    {this.state.description}
                </div>
            </div>

            <div className = {ProfilePageCSS.favorite_communities_bar}>
                <div className = {ProfilePageCSS.favorite_communities_title_bar}>
                    <div className = {ProfilePageCSS.favorite_communities_title}>Favorite Communities</div>
                </div>
                <div className = {ProfilePageCSS.communities_bar}>
                    <div className = {ProfilePageCSS.community}>
                        <div className = {ProfilePageCSS.community_image}>
                        </div>
                        <div className = {ProfilePageCSS.community_title}>
                            Class of 2023
                        </div>
                    </div>
                    <div className = {ProfilePageCSS.community}>
                        <div className = {ProfilePageCSS.community_image}>
                        </div>
                        <div className = {ProfilePageCSS.community_title}>
                            Class of 2023
                        </div>
                    </div>
                    <div className = {ProfilePageCSS.community}>
                        <div className = {ProfilePageCSS.community_image}>
                        </div>
                        <div className = {ProfilePageCSS.community_title}>
                            Class of 2023
                        </div>
                    </div>
                </div>
            </div>

            <div className = {ProfilePageCSS.my_friend_bar}>
                <div className = {ProfilePageCSS.friend_title_bar}>
                    <div className = {ProfilePageCSS.friend_title}>
                        My Friends
                    </div>
                    <div className = {ProfilePageCSS.friend_num}>
                        &#40;{this.state.current_friend_num}&#41;
                    </div>
                </div>

                <div className = {ProfilePageCSS.friend_card_bar}>
                    <div className = {ProfilePageCSS.friend_card}>
                        <div className = {ProfilePageCSS.friend_avatar}>
                        </div>
                        <div className = {ProfilePageCSS.friend_name}>
                            Doc Ock
                        </div>
                        <button className = {ProfilePageCSS.friend_remove} onClick={() => this.removeHandler_1()}>
                                Remove
                        </button>
                    </div>

                    <div className = {ProfilePageCSS.friend_card}>
                        <div className = {ProfilePageCSS.friend_avatar}>
                        </div>
                        <div className = {ProfilePageCSS.friend_name}>
                            Doc Ock
                        </div>
                        <button className = {ProfilePageCSS.friend_remove} onClick={() => this.removeHandler_1()}>
                                Remove
                        </button>
                    </div>

                    <div className = {ProfilePageCSS.friend_card}>
                        <div className = {ProfilePageCSS.friend_avatar}>
                        </div>
                        <div className = {ProfilePageCSS.friend_name}>
                            Doc Ock
                        </div>
                        <button className = {ProfilePageCSS.friend_remove} onClick={() => this.removeHandler_1()}>
                                Remove
                        </button>
                    </div>
                </div>

            </div> 

        </div>
        );
    }
}