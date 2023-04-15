import React from "react";
import PostPageCSS from "../style/PostPage.module.css";
import back from "../assets/back-button.jpeg";
import CommentList from "./CommentList";
import formatDateTime from "../helper/formatDateTime";
import Modal from "./Modal";
import { Link } from "react-router-dom";

// Post Page will render a single post with all the related compontents (user, content, comments)
export default class PostPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            // Render buttons states
            notification_text: "Notification ON",
            notification_switch: "ON", 
            notification_color_class: "green-button",

            // Current Community ID
            //community_id: window.location.href.split("/")[4],
            community_id: props.community_id,

            // Render Post Info states
            authorID: "",
            user_image: "",
            username: "",
            post_date: "",
            views: "",
            //post_id: window.location.href.split("/")[6],
            post_id: props.post_id,
            title: "",
            content: "",
            post_images: [],
            likes: "",
            upvote_set: false,
            show_delete: false,

            // Render Comment states
            comment_input: "",
            comments: [],

            // pop up window state
            openModal: false,
        }
        this.loadPost = this.loadPost.bind(this);
    }

    // the first thing we do when the component is ready is load the posts.  This updates the props, which will render the posts  
    componentDidMount() {
        this.check_admin_mod_role();
        this.loadPost();
        this.loadPost_reaction();
        console.log("community_id", window.location.href.split("/")[4])
        console.log("post_id", window.location.href.split("/")[6])
    }

    check_admin_mod_role(){
        // if the user is not logged in, error out. 
        if (sessionStorage.getItem("token")){

            // Check if the current user is a admin or mod for the current community
            let url = process.env.REACT_APP_API_PATH+"/group-members?userID=" + sessionStorage.getItem("user") + "&" + "groupID=" + this.state.community_id;
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
                if (result[0][0].attributes.role === "mod" || result[0][0].attributes.role === "admin") {
                    this.setState({
                        show_delete: true
                    });
                    console.log("Got Role");
                }
                },
                error => {
                    //alert("ERROR loading Role");
                    console.log("ERROR loading Role")
                }
            );
        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            console.log("Not Logged In");
        }
    }

    loadPost() {
        // set the auth token and user ID in the session state
        // sessionStorage.setItem("token", "underachievers|Rec0pI_XOkyJDUt5eDqUlqvT-XKWoqF6LyW7XUS88wQ");
        // sessionStorage.setItem("user", "165");

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
                        authorID: result.authorID,
                        user_image: result.author.attributes.profile.profileImage || "",
                        username: result.author.attributes.profile.username || "",
                        post_date: formatDateTime(result.created) || "",
                        views: "",
                        post_id: result.id || "",
                        title: result.attributes.title || "",
                        content: result.content || "",
                        post_images: result.attributes.images || [],
                    });
                    if (this.state.authorID.toString() === sessionStorage.getItem("user")){
                        this.setState({
                            show_delete: true,
                        })
                    }
                    console.log("Got Post");
                }
                },
                error => {
                    //alert("ERROR loading Posts");
                    console.log("ERROR loading Posts")
                }
            );
        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            console.log("Not Logged In");
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
                        comments: result[0] || [],
                    });
                    console.log(this.state.comments)
                    console.log("Got Comments");
                }
                },
                error => {
                    //alert("ERROR loading comments");
                    console.log("ERROR loading comments")
                }
            );

            
        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            console.log("Not Logged In");
        }
    }

    loadPost_reaction() {
         // if the user is not logged in, we don't want to try get all the reactions
         if (sessionStorage.getItem("token")){
            // get all the "like" reactions for the current post
            let get_all_like_url = process.env.REACT_APP_API_PATH+"/post-reactions?postID=" + this.state.post_id + "&" + "name=" + "like";
            fetch(get_all_like_url, {
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
                        likes: result[0].length,
                    });
                    console.log("Got Reactions");
                }
                },
                error => {
                    //alert("ERROR loading Reactions");
                    console.log("ERROR loading Reactions")
                }
            );

            // Check if the current user already like the post or not
            let get_user_like_url = process.env.REACT_APP_API_PATH+"/post-reactions?postID=" + this.state.post_id + "&" + "reactorID=" + sessionStorage.getItem("user") + "&" + "name=" + "like";
            fetch(get_user_like_url, {
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
                if (result[0].length !== 0) {
                    this.setState({
                        upvote_set: true,
                    });
                    console.log("Like Reaction already exist");
                }
                },
                error => {
                    //alert("ERROR loading Reactions");
                    console.log("ERROR loading Reactions")
                }
            );

        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            console.log("Not Logged In");
        }
    }

    click_like = () => {
        if (sessionStorage.getItem("token")){
            //make the api call to send a reaction
            fetch(process.env.REACT_APP_API_PATH+"/post-reactions", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                    postID: this.state.post_id,
                    reactorID: sessionStorage.getItem("user"),
                    name: "like",
                    value: 0,
                })
                })
                .then(res => res.json())
                .then(
                    result => {
                        console.log(result);
                        //alert("Post Reaction was successful");
                        // once Post reaction is complete, reload the all reaction
                        this.loadPost_reaction();
                    },
                    error => {
                        //alert("ERROR when submit Reaction");
                        console.log("ERROR when submit Reaction");
                    }
                );
        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            console.log("Not Logged In");
        }
    }

    click_undo_like = () => {
        if (sessionStorage.getItem("token")){
            // get the reaction ID
            let get_user_like_url = process.env.REACT_APP_API_PATH+"/post-reactions?postID=" + this.state.post_id + "&" + "reactorID=" + sessionStorage.getItem("user") + "&" + "name=" + "like";
            fetch(get_user_like_url, {
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
                // delete a Like reaction using post-reaction ID
                let delete_url = process.env.REACT_APP_API_PATH+"/post-reactions/" + result[0][0].id;
                fetch(delete_url, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+sessionStorage.getItem("token")
                    },
                })
                .then(
                    result => {
                        //alert("Delete Like Successfully");
                        console.log("Delete Like Successfully");
                        this.setState({
                            upvote_set: false,
                        });
                        this.loadPost_reaction();
                    },
                    error => {
                        //alert("ERROR when deleting Like");
                        console.log(error);
                        console.log("ERROR when deleting Like");
                    }
                );
                },
                error => {
                    //alert("ERROR loading Reactions");
                    console.log("ERROR loading Reactions")
                }
            );
        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            console.log("Not Logged In");
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
                //alert("Comment Can be empty!")
                console.log("Comment Can be empty!");
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
                            //alert("Post was successful");
                            console.log("Post was successful");
                        },
                        error => {
                            //alert("ERROR when submit comment");
                            console.log("ERROR when submit comment");
                        }
                    );
            }
        } else {
            //If user is not logged in, show error message
            //alert("Not Logged In");
            console.log("Not Logged In");
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
                    //alert("Delete Successfully");
                    console.log("Delete Successfully");
                    this.props.closePostPageModal(); // close the post page modal
                },
                error => {
                    //alert("ERROR when deleting post");
                    console.log(error);
                    console.log("ERROR when deleting post");
                }
            );

        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            console.log("Not Logged In");
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
                    <div className = {PostPageCSS['main-post']}>
                        <div className = {PostPageCSS['post-header']}>
                            <div className = {PostPageCSS['poster-info']}>
                                <Link to={`/profile/${this.state.authorID}`}>
                                    <img alt="post-avater" className={PostPageCSS['post-avater']} src={this.state.user_image} />
                                </Link>
                                <div className = {PostPageCSS['post-by']}>
                                    <h5> Posted By </h5>
                                    <Link to={`/profile/${this.state.authorID}`}>
                                        <div className = {PostPageCSS['post-username']}>
                                            <h5> {this.state.username} </h5>
                                        </div>
                                    </Link>
                                </div>
                                <div className = {PostPageCSS['post-on']}>
                                    <h5> Posted On </h5>
                                    <div className = {PostPageCSS['post-date']}>
                                        <h5> {this.state.post_date} </h5>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className = {PostPageCSS['post-title']}>
                            <h5 className = {PostPageCSS['post-id']}> #{this.state.post_id} </h5>
                            <h1 className = {PostPageCSS['post-title-text']}> {this.state.title} </h1>
                        </div>
                        <div className = {PostPageCSS['post-content']}>
                            <div className = {PostPageCSS['post-content-text']}>
                                <h5> {this.state.content} </h5>
                            </div>
                        </div>
                        <Post_Image post_image_list={this.state.post_images} state={this.state}/>
                    </div>
                    <div className = {PostPageCSS['post-bar']}>
                        <Like_button state={this.state} click_like={this.click_like} click_undo_like={this.click_undo_like}/>
                        <Post_Buttons state={this.state} delete_post={this.DeletePostHandler} ClickDelete={() => this.ClickDeleteButton()} toggleModal={this.toggleModal}/>
                    </div>
                    <Comment_input comment_input={this.CommentHandler} submit={this.CommentSumbitHandler}/>
                    <CommentList comment_list={this.state.comments} loadPost={this.loadPost}/>
                </div>

            </div>
        );
    }
}

const Post_Image = (props) => {
    if (props.post_image_list.length === 3){
        return (
            <div className = {PostPageCSS['post-images']}>
                <img className = {PostPageCSS['post-image-1']} src={props.state.post_images[0]} alt="Post-Image-1"/>
                <img className = {PostPageCSS['post-image-2']} src={props.state.post_images[1]} alt="Post-Image-2"/>
                <img className = {PostPageCSS['post-image-3']} src={props.state.post_images[2]} alt="Post-Image-3"/>
            </div>
        );

    } else if (props.post_image_list.length === 2){
        return (
            <div className = {PostPageCSS['post-images']}>
                <img className = {PostPageCSS['post-image-1']} src={props.state.post_images[0]} alt="Post-Image-1"/>
                <img className = {PostPageCSS['post-image-2']} src={props.state.post_images[1]} alt="Post-Image-2"/>
            </div>
        );

    } else if (props.post_image_list.length === 1){
        return (
            <div className = {PostPageCSS['post-images']}>
                <img className = {PostPageCSS['post-image-1']} src={props.state.post_images[0]} alt="Post-Image-1"/>
            </div>
        );
    } else{
        return (
            <div>
            </div>
        );
    }

}

const Like_button = (props) => {
    if (props.state.upvote_set === false) {
        return (
            <div className = {PostPageCSS['upvote']}>
                <input className = {PostPageCSS['upvote-button-before']} type='image' onClick={() => props.click_like()}/>
                <h5 className = {PostPageCSS['upvote-number-before']}>{props.state.likes}</h5>
            </div>
        );
    } else if (props.state.upvote_set === true) {
        return (
            <div className = {PostPageCSS['upvote']}>
                <input className = {PostPageCSS['upvote-button-after']} type='image' onClick={() => props.click_undo_like()}/>
                <h5 className = {PostPageCSS['upvote-number-after']}>{props.state.likes}</h5>
            </div>
        );
    }   
}

const Post_Buttons = (props) => {
    if (props.state.show_delete === true){
        return(
            <div className = {PostPageCSS['post-buttons']}>

                {/*
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
                */}

                <div className = {PostPageCSS['post-delete']}>
                    <button className = {PostPageCSS['post-delete-button']} onClick={props.ClickDelete}></button>
                    <h5 className = {PostPageCSS['post-delete-text']}>Delete</h5>
                    <Modal show={props.state.openModal} onClose={props.toggleModal}>
                        <div>
                            <div className={PostPageCSS['delete-popup-title']}>Delete Your Post</div>
                            <div className={PostPageCSS['popup-buttons']}>
                                <button className={PostPageCSS['delete-button']} onClick={props.delete_post}>Delete</button>
                                <button className={PostPageCSS['cancel-button']} onClick={props.toggleModal}>Cancel</button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        );

    }else{
        return(
            <></>
        );
    }
}

const Comment_input = (props) => {
    return(
        <form className = {PostPageCSS['send-comment']} onSubmit={props.submit}>
            <input className= {PostPageCSS['comment-inputbox']} type='text' id='comment' name='comment' placeholder='Write Comment' onChange={props.comment_input}></input>
            <input className= {PostPageCSS['send-button']} type='submit' value='Send'></input>
        </form>
    );
}