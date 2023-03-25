import React from "react";
import "./PostPage.css";
import back from "../assets/back-button.jpeg";
import upvote from "../assets/upvote.jpeg";
import downvote from "../assets/downvote.jpeg";
import red_icon from "../assets/red-icon.jpeg";
import black_icon from "../assets/black-icon.jpeg"
import CommentList from "./CommentList";
import Convert_time from "../Helper/Convert_time";

// Post Page will render a single post with all the related compontents (user, content, comments)
export default class PostPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            // Render buttons states
            join: "Join",
            join_class: "join-button",
            notification_text: "Notification ON",
            notification_switch: "ON", 
            notification_color_class: "green-button",
            upvote_num: 0,
            upvote_set: false,
            downvote_num: 0,
            downvote_set: false,

            // Render Post states
            user_image: "",
            username: "",
            post_date: "",
            views: "",
            post_id: "",
            title: "",
            content: "",
            likes: "",

            // Render Comment states
            comment_input: "",
            comments: [],
        }
        this.loadPost = this.loadPost.bind(this);
    }

    joined() {
        // console.log(this.state)
        if (this.state.join === 'Join') {
            this.setState({
                join: "Joined",
                join_class: "joined-button"
            })
        } else {
            this.setState({
                join: "Join",
                join_class: "join-button"
            })
        }
    }

    notification_click(){
        if (this.state.notification_switch === 'ON'){
            this.setState({
                notification_text: 'Notification OFF',
                notification_switch: "OFF",
                notification_color_class: "red-button"
            })
        } else {
            this.setState({
                notification_text: 'Notification ON',
                notification_switch: 'ON',
                notification_color_class: "green-button"
            })
        }
    }

    upvote_click() {
        //console.log(this.state)
        //console.log("we're in upvotef")
        //console.log(this.state.upvote_set)
        if (this.state.upvote_set === false) {
            this.setState({
                upvote_num: this.state.upvote_num + 1,
                upvote_set: true
            })
            //console.log(this.state.upvote_set)
        } else {
            this.setState({
                upvote_num: this.state.upvote_num - 1,
                upvote_set: false
            })
        }
    }

    downvote_click() {
        if (this.state.downvote_set === false){
            this.setState({
                downvote_num: this.state.downvote_num - 1,
                downvote_set: true
            })
        } else {
            this.setState({
                downvote_num: this.state.downvote_num + 1,
                downvote_set: false
            })
        }
    }

    // the first thing we do when the component is ready is load the posts.  This updates the props, which will render the posts  
    componentDidMount() {
        this.loadPost();
    }

    loadPost() {
        // set the auth token and user ID in the session state
        sessionStorage.setItem("token", "underachievers|s8YFPQ9DIodgJ0DFj9gqDlzHXpqgb_4rIEeuFwkv8Ow");
        sessionStorage.setItem("user", "165");
        // if the user is not logged in, we don't want to try loading post, because it will just error out. 
        // get a single post using postID 
        if (sessionStorage.getItem("token")){
            let url = process.env.REACT_APP_API_PATH+"/posts/106";
            
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
                        user_image: result.author.attributes.profile.profileImage,
                        username: result.author.attributes.profile.username,
                        post_date: Convert_time(result.created),
                        views: "",
                        post_id: result.id,
                        title: "",
                        content: result.content,
                        likes: "",
                    });
                    console.log("Got Post");
                }
                },
                error => {
                    alert("error");
                    console.log("ERROR loading Posts")
                }
            );
        }else{
            //If user is not logged in, show error message
            alert("Not Logged In");
        }

        // Get all the comments related to the post
        if (sessionStorage.getItem("token")){
            let url = process.env.REACT_APP_API_PATH+"/posts?parentID=106";
            
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
                        comments: result[0],
                    });
                    console.log(this.state.comments)
                    console.log("Got Comments");
                }
                },
                error => {
                    alert("error");
                    console.log("ERROR loading Posts")
                }
            );
        }else{
            //If user is not logged in, show error message
            alert("Not Logged In");
        }
    }

    CommentHandler = event => {
        this.setState({
            comment_input: event.target.value
        });
    }

    CommentSumbitHandler = event => {
        //keep the form from actually submitting via HTML - we want to handle it in react
        event.preventDefault();

        console.log(this.state.post_id);
        console.log(this.state.comment_input);

        //make the api call to post
        fetch(process.env.REACT_APP_API_PATH+"/posts", {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("token")
        },
        body: JSON.stringify({
            authorID: sessionStorage.getItem("user"),
            parentID: this.state.post_id,
            content: this.state.comment_input,
        })
        })
        .then(res => res.json())
        .then(
            result => {
            console.log(result);
            alert("Post was successful");
            // once a post is complete, reload the feed
            this.loadPost();
            },
            error => {
            alert("error when lodding the post");
            }
        );
    }

    render() {
        return (
            <div className = 'post-page'>

                <div className = 'community-bar'>
                    <div className = 'community-image'>
                    </div>
                    <div className = 'community-name'>
                        Class of 2023
                    </div>
                    <div className = 'community-created'>
                        Since February 19, 2023
                    </div>
                    <Notification join={this.state.join} text={this.state.notification_text} color={this.state.notification_color_class} click={() => this.notification_click()}/>
                    <Member_info join={this.state.join} />
                    <button className = {this.state.join_class} onClick={() => this.joined()}>{this.state.join}</button>
                </div>

                <form action="/previous_page">
                    <button className = 'back-button'>
                        <img className = 'back-button-image' src={back} alt='back'/>
                    </button>
                </form>

                <div className = 'postpage-content'>
                    <div className = 'main-post'>
                        <div className = 'post-header'>
                            <div className = 'post-avater'>
                                <img alt="" className='profile_image' src={this.state.profileimage} />
                            </div>
                            <div className = 'post-by'>
                                Posted By
                                <div className = 'post-username'>
                                    {this.state.username}
                                </div>
                            </div>
                            <div className = 'post-on'>
                                Posted On
                                <div className = 'post-date'>
                                    {this.state.post_date}
                                </div>
                            </div>
                            <div className = 'post-views'>
                                Views
                                <div className = 'post-viewnumber'>
                                    100
                                </div>
                            </div>
                        </div>
                        <div className = 'post-title'>
                            <b className = 'post-id'> #{this.state.post_id} </b>
                            <b className = 'post-title-text'>How to survive on Campus?</b>
                        </div>
                        <div className = 'post-content'>
                            <div className = 'post-content-text'>
                                {this.state.content}
                            </div>
                        </div>
                    </div>
                    <Post_bar join={this.state.join} click={() => this.upvote_click()} upvote={this.state.upvote_num} />
                    <Comment_input join={this.state.join} comment_input={this.CommentHandler} submit={this.CommentSumbitHandler}/>
                    <CommentList join={this.state.join} comment_list={this.state.comments} loadPost={this.loadPost}/>
                </div>

            </div>
        );
    }
}

const Notification = (props) => {
    if (props.join === 'Join'){
        return(
            <></>
        );
    } else {
        return (
            <div>
                <button className = 'notification' onClick={props.click}>
                    <b className = 'notification_text'>{props.text}</b>
                    <div className = {props.color}></div>
                </button>
            </div>
        );
    }
}

const Member_info = (props) => {
    if (props.join === 'Join'){
        return(
            <></>
        );
    } else {
        return (
            <div>
                <div className = 'member-info'>
                    Member
                </div>
                <div className = 'member-joindate'>
                    Since February 19, 2023
                </div>
            </div>
        );
    }
}

const Post_bar = (props) => {
    if (props.join === 'Join'){
        return(
            <></>
        );
    } else {
        return(
            <div className = 'post-bar'>
                <input className = 'upvote-button-image' type='image' src={upvote} alt='upvote' onClick={props.click}/>
                <b className = 'upvote-number'>{props.upvote}</b>
                {/*
                <input className = 'downvote-button-image' type='image' src={downvote} alt='downvote' onClick={() => this.downvote_click()}/>
                <b className = 'downvote-number'>{this.state.downvote_num}</b>
                */}
                <div className = 'post-delete'>
                    <input className = 'post-delete-button' type='image' src={red_icon} alt='red_icon'/>
                    <b className = 'post-delete-text'>Delete</b>
                </div>
            </div>
        );
    }
}

const Comment_input = (props) => {
    if (props.join === 'Join'){
        return (
            <></>
        );
    } else {
        return(
            <div className = 'send-comment'>
                <form onSubmit={props.submit}>
                    <input className='comment-inputbox' type='text' id='comment' name='comment' placeholder='Write Comment' onChange={props.comment_input}></input>
                    <input className='send-button' type='submit' value='Send'></input>
                </form>
            </div>
        );
    }
}