import React from "react";
import "./PostPage.css";
import back from "../assets/back-button.jpeg";
import upvote from "../assets/upvote.jpeg";
import downvote from "../assets/downvote.jpeg";
import red_icon from "../assets/red-icon.jpeg";
import black_icon from "../assets/black-icon.jpeg"

export default class PostPage extends React.Component {

    render() {
        return (
            <div className = 'post-page'>

                <div className = 'top-navbar'>
                </div>

                <div className = 'content'>
                
                    <div className = 'community-bar'>

                        <div className = 'community-image'>
                        </div>

                        <div className = 'community-name'>
                            Class of 2023
                        </div>

                        <div className = 'community-created'>
                            Since February 19, 2023
                        </div>

                        <div className = 'notification'>
    
                        </div>

                        <div className = 'member-info'>
                            Member
                        </div>

                        <div className = 'member-joindate'>
                            Since February 19, 2023
                        </div>

                        <div className = 'join-button'>
                            Join
                        </div>

                    </div>

                    <form action="/previous_page">
                        <button className = 'back-button'>
                            <img className = 'back-button-image' src={back} alt='back'/>
                        </button>
                    </form>

                    <div className = 'main-post'>

                        <div className = 'post-header'>
                            <div className = 'post-avater'>
                            </div>
                            <div className = 'post-by'>
                                Posted By
                            </div>
                            <div className = 'post-username'>
                                Spiderman
                            </div>
                            <div className = 'post-on'>
                                Posted On
                            </div>
                            <div className = 'post-date'>
                                February 19, 2023
                            </div>
                            <div className = 'post-viewnumber'>
                                100
                            </div>
                            <div className = 'post-views'>
                                Views
                            </div>
                        </div>
                        <div className = 'post-title'>
                            <h2>How to survive on Campus?</h2>
                        </div>
                        <div className = 'post-content'>
                            <div className = 'post-content-text'>
                                Hello, everyone!<br></br>
                                Surviving on campus can be a challenging but rewarding experience. Here are some tips that may help:<br></br>
                                1. Manage your time effectively: Create a schedule that balances your academic work with social and leisure activities. Use a planner or calendar app to keep track of your commitments and deadlines.<br></br>
                                2. Stay organized: Keep your living space and study area clean and tidy to reduce stress and improve productivity. Use folders and binders to organize your class notes and assignments.<br></br>
                                3. Connect with others: Join clubs or organizations that align with your interests and values. Attend social events and make an effort to meet new people. Building a network of friends and acquaintances can make your time on campus more enjoyable and supportive.<br></br>
                                4. Take care of your physical health: Eat a balanced diet, exercise regularly, and get enough sleep. These habits can help you stay focused and energized throughout the day.<br></br>
                                5. Seek academic support when needed: If you are struggling with a course or assignment, seek help from a tutor or academic advisor. Most campuses have resources available to help students succeed academically.<br></br>
                                6. Manage your finances: Create a budget and stick to it. Look for opportunities to save money on textbooks, food, and other expenses.<br></br>
                                7. Stay safe: Be aware of your surroundings and take precautions to stay safe on campus. Walk with a friend at night, lock your doors and windows, and report any suspicious activity to campus security.<br></br>
                                <br></br>
                                By following these tips, you can thrive and succeed on campus. See you around!<br></br>
                            </div>
                        </div>

                        <div className = 'post-bar'>
                            <input className = 'upvote-button-image' type='image' src={upvote} alt='upvote'/>
                            <b className = 'upvote-number'>0</b>
                            <input className = 'downvote-button-image' type='image' src={downvote} alt='downvote'/>
                            <b className = 'downvote-number'>0</b>

                            <div className = 'post-delete'>
                                <input className = 'post-delete-button' type='image' src={red_icon} alt='red_icon'/>
                                <b className = 'post-delete-text'>Delete</b>
                            </div>
                        </div>

                    </div>

                    <div className = 'comment-section'>

                        <div className = 'send-comment'>
                            <form action="/load_comment">
                                <input className='comment-inputbox' type='text' id='comment' name='comment' placeholder='Write Comment'></input>
                                <input className='send-button' type='submit' value='Send'></input>
                            </form>
                        </div>

                        <div className = 'comment-list'>
                            <div className = 'individual-comment'>
                                <div className = 'comment-user-info'>
                                    <div className = 'comment-user-avater'>
                                    </div>
                                    <div className = 'comment-user-username'>
                                        Spiderman
                                    </div>
                                    <div className = 'comment-user-date'>
                                        February 18, 2023
                                    </div>
                                </div>
                                <div className = 'comment-text'>
                                    Thank you Doc
                                </div>
                                <div className = 'comment-interaction'>
                                    <input className = 'comment-delete-button-image' type='image' src={red_icon} alt='red_icon'/>
                                    <b className = 'comment-delete-text'>Delete</b>
                                    <input className = 'comment-edit-button-image' type='image' src={black_icon} alt='black-icon'/>
                                    <b className = 'comment-edit-text'>Edit</b>
                                </div>
                            </div>
                        </div>

                    </div>


                </div>

            </div>
        );
    }

}