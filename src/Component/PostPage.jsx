import React from "react";
import PostPageCSS from "../style/PostPage.module.css";
import back from "../assets/back-button.jpeg";
import upvote from "../assets/upvote.jpeg";
import downvote from "../assets/downvote.jpeg";
import CommentList from "./CommentList";
import Convert_time from "../helper/Convert_time";
import Modal from "./Modal";

// Post Page will render a single post with all the related compontents (user, content, comments)
export default class PostPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            // Render buttons states
            join: "Join",
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
            post_id: "183",
            title: "",
            content: "",
            likes: "",

            // Render Comment states
            comment_input: "",
            comments: [],

            // pop up window state
            openModal: false,
        }
        this.loadPost = this.loadPost.bind(this);
    }

    joined() {
        // console.log(this.state)
        if (this.state.join === 'Join') {
            this.setState({
                join: "Joined",
            })
        } else {
            this.setState({
                join: "Join",
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
        sessionStorage.setItem("token", "underachievers|5phjGPWGGwQyIXHPSj9g7VMIFhLPVhBe2AQWtjOlF3s");
        sessionStorage.setItem("user", "165");

        // if the user is not logged in, we don't want to try loading post, because it will just error out. 
        if (sessionStorage.getItem("token")){

            // get a single post using postID 
            let url = process.env.REACT_APP_API_PATH+"/posts/" + this.state.post_id;
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
                    alert("ERROR loading Posts");
                    console.log("ERROR loading Posts")
                }
            );
        }else{
            //If user is not logged in, show error message
            alert("Not Logged In");
        }

        // Check if the session token exist
        if (sessionStorage.getItem("token")){

            // Get all the comments related to the post
            let url = process.env.REACT_APP_API_PATH+"/posts?parentID=" + this.state.post_id;
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
                    alert("ERROR loading comments");
                    console.log("ERROR loading comments")
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

        // if the user is logged in, post the comment
        if (sessionStorage.getItem("token")){
            //Check the length of the comment
            if (this.state.comment_input.length === 0){
                alert("Comment Can be empty!")
            } else {
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
                            // once a edit is complete, reload the all comments
                            this.loadPost();
                            alert("Post was successful");
                        },
                        error => {
                            alert("ERROR when submit comment");
                        }
                    );
            }
        } else {
            //If user is not logged in, show error message
            alert("Not Logged In");
        }
    }

    DeletePostHandler = event => {
        // if the user is logged in, delete the post
        if (sessionStorage.getItem("token")){
            // delete a single post using postID 
            let url = process.env.REACT_APP_API_PATH+"/posts/" + this.state.post_id;
            fetch(url, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+sessionStorage.getItem("token")
                },
            })
            .then(
                result => {
                    alert("Delete Successfully");
                    console.log("Delete Successfully");
                },
                error => {
                    alert("ERROR when deleting post");
                    console.log(error);
                    console.log("ERROR when deleting post");
                }
            );

        }else{
            //If user is not logged in, show error message
            alert("Not Logged In");
        }
    }

    ClickDeleteButton(){
        this.setState({
            openModal: true,
        });
    }

    toggleModal = event => {
        this.setState({
            openModal: !this.state.openModal,
        });
    }

    render() {
        return (
            <div className = {PostPageCSS['post-page']}>

                <div className = {PostPageCSS['postpage-content']}>
                    <div className = {PostPageCSS['community-background']}></div>
                    <div className = {PostPageCSS['community-bar']}>
                        <div className = {PostPageCSS['image-info']}>
                            <div className = {PostPageCSS['community-image']}>
                            </div>
                            <div className = {PostPageCSS['community-info']}>
                                <div className = {PostPageCSS['community-name']}>
                                    <h1>Class of 2023</h1>
                                </div>
                                <div className = {PostPageCSS['community-created']}>
                                    <h5>Since February 19, 2023</h5>
                                </div>
                            </div>
                        </div>
                        <Notification join={this.state.join} text={this.state.notification_text} color={this.state.notification_color_class} click={() => this.notification_click()}/>
                        <div className={PostPageCSS["member-info-join"]}>
                            <Member_info join={this.state.join} />
                            <Join_button join={this.state.join} click={() => this.joined()} />
                        </div>
                        {/* <button className = {this.state.join_class} onClick={() => this.joined()}>{this.state.join}</button> */}
                    </div>

                    <div className={PostPageCSS['back-button-bar']}>
                        <button className = {PostPageCSS['back-button']}>
                            <img className = {PostPageCSS['back-button-image']} src={back} alt='back'/>
                        </button>
                    </div>

                {/*</div><div className = 'postpage-content'>*/}
                    <div className = {PostPageCSS['main-post']}>
                        <div className = {PostPageCSS['post-header']}>
                            <div className = {PostPageCSS['poster-info']}>
                                <div className = {PostPageCSS['post-avater']}>
                                    <img alt="" className={PostPageCSS['profile_image']} src={this.state.profileimage} />
                                </div>
                                <div className = {PostPageCSS['post-by']}>
                                    <h5> Posted By </h5>
                                    <div className = {PostPageCSS['post-username']}>
                                        <h5> {this.state.username} </h5>
                                    </div>
                                </div>
                                <div className = {PostPageCSS['post-on']}>
                                    <h5> Posted On </h5>
                                    <div className = {PostPageCSS['post-date']}>
                                        <h5> {this.state.post_date} </h5>
                                    </div>
                                </div>
                            </div>
                            <div className = {PostPageCSS['post-views']}>
                                <h5> Views </h5>
                                <div className = {PostPageCSS['post-viewnumber']}>
                                    <h5> 100 </h5>
                                </div>
                            </div>
                        </div>
                        <div className = {PostPageCSS['post-title']}>
                            <h5 className = {PostPageCSS['post-id']}> #{this.state.post_id} </h5>
                            <h1 className = {PostPageCSS['post-title-text']}> How to survive on Campus? </h1>
                        </div>
                        <div className = {PostPageCSS['post-content']}>
                            <div className = {PostPageCSS['post-content-text']}>
                                <h5> {this.state.content} </h5>
                            </div>
                        </div>
                    </div>
                    <Post_bar join={this.state.join} click={() => this.upvote_click()} upvote={this.state.upvote_num} delete_post={this.DeletePostHandler} ClickDelete={() => this.ClickDeleteButton()} openModal={this.state.openModal} toggleModal={this.toggleModal}/>
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
            <button className = {PostPageCSS['notification']} onClick={props.click}>
                <h5 className = {PostPageCSS['notification_text']}>{props.text}</h5>
                <div className = {PostPageCSS[props.color]}></div>
            </button>
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
            <div className={PostPageCSS['member-info']}>
                <div className = {PostPageCSS['member-username']}>
                    <h3> Member </h3>
                </div>
                <div className = {PostPageCSS['member-joindate']}>
                    <h5> Since February 19, 2023 </h5>
                </div>
            </div>
        );
    }
}

const Join_button = (props) => {
    if (props.join === 'Join'){
        return(
            <button className = {PostPageCSS["join-button"]} onClick={props.click}>{props.join}</button>
        );
    }else{
        return(
            <button className = {PostPageCSS["joined-button"]} onClick={props.click}>{props.join}</button>
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
            <div className = {PostPageCSS['post-bar']}>
                <div className = {PostPageCSS['upvote']}>
                    <input className = {PostPageCSS['upvote-button-image']} type='image' src={upvote} alt='upvote' onClick={props.click}/>
                    <h5 className = {PostPageCSS['upvote-number']}>{props.upvote}</h5>
                </div>

                <div className = {PostPageCSS['post-buttons']}>
                    <div className = {PostPageCSS['post-pin']}>
                        <button className = {PostPageCSS['post-pin-button']}></button>
                        <h5 className = {PostPageCSS['post-pin-text']}>Pin</h5>
                    </div> 
                    <div className = {PostPageCSS['post-hide']}>
                        <button className = {PostPageCSS['post-hide-button']}></button>
                        <h5 className = {PostPageCSS['post-hide-text']}>Hide</h5>
                    </div> 
                    <div className = {PostPageCSS['post-report']}>
                        <button className = {PostPageCSS['post-report-button']}></button>
                        <h5 className = {PostPageCSS['post-report-text']}>Report</h5>
                    </div> 
                    <div className = {PostPageCSS['post-delete']}>
                        <button className = {PostPageCSS['post-delete-button']} onClick={props.ClickDelete}></button>
                        <h5 className = {PostPageCSS['post-delete-text']}>Delete</h5>
                        <Modal show={props.openModal} onClose={props.toggleModal}>
                            <div className={PostPageCSS['delete-popup-title']}>Delete Your Post</div>
                            <div className={PostPageCSS['popup-buttons']}>
                                <button className={PostPageCSS['delete-button']} onClick={props.delete_post}>Delete</button>
                                <button className={PostPageCSS['cancel-button']} onClick={props.toggleModal}>Cancel</button>
                            </div>
                        </Modal>
                    </div>
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
            <form className = {PostPageCSS['send-comment']} onSubmit={props.submit}>
                <input className= {PostPageCSS['comment-inputbox']} type='text' id='comment' name='comment' placeholder='Write Comment' onChange={props.comment_input}></input>
                <input className= {PostPageCSS['send-button']} type='submit' value='Send'></input>
            </form>
        );
    }
}