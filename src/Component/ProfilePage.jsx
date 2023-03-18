import React from "react";
import "./ProfilePage.css";
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

    removeHandler_1() {
        this.setState({
            isRemoved_1: true,
            current_friend_num: this.state.current_friend_num - 1
        });
    } 

    removeHandler_2() {
        this.setState({
            isRemoved_2: true,
            current_friend_num: this.state.current_friend_num - 1
        });
    } 

    removeHandler_3() {
        this.setState({
            isRemoved_3: true,
            current_friend_num: this.state.current_friend_num - 1
        });
    } 

    removeHandler_4() {
        this.setState({
            isRemoved_4: true,
            current_friend_num: this.state.current_friend_num - 1
        });
    } 

    removeHandler_5() {
        this.setState({
            isRemoved_5: true,
            current_friend_num: this.state.current_friend_num - 1
        });
    } 

    render() {
        let friend1;
        if (this.state.isRemoved_1 === true){
            friend1= <div></div>;
        } else {
            friend1 = <div className = 'friend-card-1'>
                        <div className = 'friend-avatar'>
                        </div>
                        <div className = 'friend-name'>
                            <b>Doc Ock</b>
                        </div>
                        <button className = 'friend-remove' onClick={() => this.removeHandler_1()}>
                            <div className = 'remove-text'>
                                <b>Remove</b>
                            </div>
                            <div className = 'remove-icon'>
                            </div>
                        </button>
                      </div>;
        }

        let friend2;
        if (this.state.isRemoved_2 === true){
            friend2= <div></div>;
        } else {
            friend2 = <div className = 'friend-card-2'>
                        <div className = 'friend-avatar'>
                        </div>
                        <div className = 'friend-name'>
                            <b>Doc Ock</b>
                        </div>
                        <button className = 'friend-remove' onClick={() => this.removeHandler_2()}>
                            <div className = 'remove-text'>
                                <b>Remove</b>
                            </div>
                            <div className = 'remove-icon'>
                            </div>
                        </button>
                      </div>;
        }

        let friend3;
        if (this.state.isRemoved_3 === true){
            friend3= <div></div>;
        } else {
            friend3 = <div className = 'friend-card-3'>
                        <div className = 'friend-avatar'>
                        </div>
                        <div className = 'friend-name'>
                            <b>Doc Ock</b>
                        </div>
                        <button className = 'friend-remove' onClick={() => this.removeHandler_3()}>
                            <div className = 'remove-text'>
                                <b>Remove</b>
                            </div>
                            <div className = 'remove-icon'>
                            </div>
                        </button>
                      </div>;
        }

        let friend4;
        if (this.state.isRemoved_4 === true){
            friend4= <div></div>;
        } else {
            friend4 = <div className = 'friend-card-4'>
                        <div className = 'friend-avatar'>
                        </div>
                        <div className = 'friend-name'>
                            <b>Doc Ock</b>
                        </div>
                        <button className = 'friend-remove' onClick={() => this.removeHandler_4()}>
                            <div className = 'remove-text'>
                                <b>Remove</b>
                            </div>
                            <div className = 'remove-icon'>
                            </div>
                        </button>
                      </div>;
        }

        let friend5;
        if (this.state.isRemoved_5 === true){
            friend5= <div></div>;
        } else {
            friend5 = <div className = 'friend-card-5'>
                        <div className = 'friend-avatar'>
                        </div>
                        <div className = 'friend-name'>
                            <b>Doc Ock</b>
                        </div>
                        <button className = 'friend-remove' onClick={() => this.removeHandler_5()}>
                            <div className = 'remove-text'>
                                <b>Remove</b>
                            </div>
                            <div className = 'remove-icon'>
                            </div>
                        </button>
                      </div>;
        }


        return(
        <div className = 'profile-page'>

            <div className = 'top-navbar'>
            </div>

            <div className = 'profile-title-bar'> 
                <div className = 'profile-title'>
                    <b>{this.state.username}&prime;s Profile Page</b>
                </div>
                <Link to="/edit-profile">
                    <button className = 'edit-button'>
                        <b className = 'edit-button-text'>Edit</b>
                    </button>
                </Link>
                {/* <button className = 'close-button'>Close</button> */}
            </div>

            <div className = 'profile-info-bar'>
                <div className = 'profile-avatar'>
                    <img alt="" className='profile_image' src={this.state.profileImage} />
                </div>
                <div className = 'username'>
                    {/* <b>Spiderman</b> */}
                    <b>{this.state.username}</b>
                </div>
                <div className = 'first-name'>
                    <b>First Name: {this.state.firstName}</b>
                </div>
                <div className = 'last-name'>
                    <b>Last Name: {this.state.lastName}</b>
                </div>
                <div className = 'description'>
                    {/* <b>Hi, I’m Spiderman. I live my life with great responsibilities.</b> */}
                    <b>{this.state.description}</b>
                </div>
            </div>

            {/*
            <div className = 'favorite-communities-bar'>
                <div className = 'favorite-communities-title'>
                    <b>Favorite Communities</b>
                </div>
                <div className = 'community-image-1'>
                </div>
                <div className = 'community-title-1'>
                    <b>Marvel CU</b>
                </div>
                <div className = 'community-image-2'>
                </div>
                <div className = 'community-title-2'>
                    <b>Class of 2023</b>
                </div>
                <div className = 'community-image-3'>
                </div>
                <div className = 'community-title-3'>
                    <b>DCEU</b>
                </div>
            </div>

            <div className = 'my-friend-bar'>
                <div className = 'friend-num'>
                    <b>&#40;{this.state.current_friend_num}&#41;</b>
                </div>
                <div className = 'friend-title'>
                    <b>My Friends</b>
                </div>

                {friend1}
                
                {friend2}

                {friend3}

                {friend4}

                {friend5}

            </div> 
            */}

        </div>
        );
    }
}