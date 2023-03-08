import React from "react";
import "./ProfilePage.css";

export default class ProfilePage extends React.Component {

    render() {
        return(
        <div className = 'post-page'>

            <div className = 'top-navbar'>
            </div>

            <div className = 'profile-title-bar'> 
                <div className = 'profile-title'>
                    <b>Spiderman&prime;s Profile Page</b>
                </div>
                <button className = 'edit-button'>Edit</button>
                <button className = 'close-button'>Close</button>
            </div>

            <div className = 'profile-info-bar'>
                <div className = 'profile-avatar'>
                </div>
                <div className = 'username'>
                    <b>Spiderman</b>
                </div>
                <div className = 'user-joindata'>
                    <b>Since February 19, 2023</b>
                </div>
                <div className = 'description'>
                    <b>Hi, I’m Spiderman. I live my life with great responsibilities.</b>
                </div>
            </div>

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
                    <b>&#40;5&#41;</b>
                </div>
                <div className = 'friend-title'>
                    <b>My Friends</b>
                </div>
                <div className = 'friend-card-1'>
                    <div className = 'friend-avatar'>
                    </div>
                    <div className = 'friend-name'>
                        <b>Doc Ock</b>
                    </div>
                    <div className = 'friend-remove'>
                        <div className = 'remove-text'>
                            <b>Remove</b>
                        </div>
                        <div className = 'remove-icon'>
                        </div>
                    </div>
                </div>

                <div className = 'friend-card-2'>
                    <div className = 'friend-avatar'>
                    </div>
                    <div className = 'friend-name'>
                        <b>Doc Ock</b>
                    </div>
                    <div className = 'friend-remove'>
                        <div className = 'remove-text'>
                            <b>Remove</b>
                        </div>
                        <div className = 'remove-icon'>
                        </div>
                    </div>
                </div>

                <div className = 'friend-card-3'>
                    <div className = 'friend-avatar'>
                    </div>
                    <div className = 'friend-name'>
                        <b>Doc Ock</b>
                    </div>
                    <div className = 'friend-remove'>
                        <div className = 'remove-text'>
                            <b>Remove</b>
                        </div>
                        <div className = 'remove-icon'>
                        </div>
                    </div>
                </div>

                <div className = 'friend-card-4'>
                    <div className = 'friend-avatar'>
                    </div>
                    <div className = 'friend-name'>
                        <b>Doc Ock</b>
                    </div>
                    <div className = 'friend-remove'>
                        <div className = 'remove-text'>
                            <b>Remove</b>
                        </div>
                        <div className = 'remove-icon'>
                        </div>
                    </div>
                </div>

                <div className = 'friend-card-5'>
                    <div className = 'friend-avatar'>
                    </div>
                    <div className = 'friend-name'>
                        <b>Doc Ock</b>
                    </div>
                    <div className = 'friend-remove'>
                        <div className = 'remove-text'>
                            <b>Remove</b>
                        </div>
                        <div className = 'remove-icon'>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        );
    }
}