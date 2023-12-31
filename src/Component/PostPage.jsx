import React, {useState} from "react";
import PostPageCSS from "../style/PostPage.module.css";
import back from "../assets/back-button.jpeg";
import CommentList from "./CommentList";
import formatDateTime from "../helper/formatDateTime";
import Modal from "./Modal";
import { Link } from "react-router-dom";
import defaultProfileImage from "../assets/defaultProfileImage.png";
import ProfilePage from "../Component/ProfilePage";
import style from "../style/EditProfilePage.module.css";


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
            openModal: false, /* This will control the pop up for Delete Buttons */
            openProfile: false, /* This will control the pop up for User Profile */
        }
        this.loadPost = this.loadPost.bind(this);
        this.ClickProfile = this.ClickProfile.bind(this);
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
                        user_image: result.author.attributes.profile.profileImage || defaultProfileImage,
                        username: result.author.attributes.profile.username || "",
                        post_date: formatDateTime(result.created) || "",
                        views: "",
                        post_id: result.id || "",
                        title: result.attributes.title || "",
                        content: result.content || "",
                        post_images: result.attributes.images || [],
                    });
                    // Check if the profileImage is the default value, it is default value set to default image
                    if (result.author.attributes.profile.profileImage === ""){
                        this.setState({
                            user_image: defaultProfileImage
                        })
                    }
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
                        //this.props.openToast({type: "success", message: <span>Like Successful!</span>})
                    },
                    error => {
                        //alert("ERROR when submit Reaction");
                        console.log("ERROR when submit Reaction");
                        this.props.openToast({type: "error", message: <span>Error When Like the Post!</span>})
                    }
                );
        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            this.props.openToast({type: "error", message: <span>Please Login First!</span>})
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
                        //this.props.openToast({type: "success", message: <span>Undo Like Successful!</span>})
                    },
                    error => {
                        //alert("ERROR when deleting Like");
                        console.log(error);
                        console.log("ERROR when deleting Like");
                        this.props.openToast({type: "error", message: <span>Error When Undo Like!</span>})
                    }
                );
                },
                error => {
                    //alert("ERROR loading Reactions");
                    console.log("ERROR loading Reactions")
                    this.props.openToast({type: "error", message: <span>Error When Loading Post Reactions!</span>})

                }
            );
        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            this.props.openToast({type: "error", message: <span>Please Login First!</span>})
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
                console.log("Comment Can't be empty!");
                this.props.openToast({type: "error", message: <span>Comment can't be empty!</span>})
            } else if (this.state.comment_input.length > 255){
                event.target.reset();
                console.log("Comment Length need to be in 255 characters!");
                this.props.openToast({type: "error", message: <span>Comment Length need to be in 255 characters!</span>})
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
                            console.log("Post was successful");
                            this.props.openToast({type: "success", message: <span>Comment Submit Successful!</span>})
                            event.target.reset();
                            this.setState({
                                comment_input: '',
                            })
                            this.loadPost();
                        },
                        error => {
                            //alert("ERROR when submit comment");
                            console.log("ERROR when submit comment");
                            this.props.openToast({type: "error", message: <span>Error when submit comment!</span>})
                        }
                    );
            }
        } else {
            //If user is not logged in, show error message
            //alert("Not Logged In");
            this.props.openToast({type: "error", message: <span>Please Login First!</span>})
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
                    this.props.openToast({type: "success", message: <span>Post Delete Successful!</span>})
                },
                error => {
                    //alert("ERROR when deleting post");
                    console.log(error);
                    console.log("ERROR when deleting post");
                    this.props.openToast({type: "error", message: <span>Error when Deleting the Post!</span>})
                }
            );

        }else{
            //If user is not logged in, show error message
            //alert("Not Logged In");
            this.props.openToast({type: "error", message: <span>Please Login First!</span>})
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

    ClickProfile(){
        this.setState({
            openProfile: true,
        });
    }

    toggleProfile = event => {
        //this.props.closePostPageModal();
        this.setState({
            openProfile: !this.state.openProfile,
        });
    }

    render() {
        return (
            <div className = {PostPageCSS['post-page']}>

                <div className = {PostPageCSS['postpage-content']}>
                    <div className = {PostPageCSS['main-post']}>
                        <div className = {PostPageCSS['post-header']}>
                            <div className = {PostPageCSS['poster-info']}>
                                <img alt="post-avater" className={PostPageCSS['post-avater']} src={this.state.user_image} onClick={() => this.ClickProfile()}/> 
                                <Modal
                                    show={this.state.openProfile}
                                    onClose={this.toggleProfile}
                                    modalStyle={{
                                    width: "85%",
                                    height: "85%",
                                    }}
                                >
                                    <ProfilePage 
                                        profile_id={this.state.authorID}
                                        toggleProfile={this.toggleProfile}
                                        openToast={this.props.openToast}
                                    />
                                </Modal>
                                <div className = {PostPageCSS['post-by']}>
                                    <span> Posted By </span>
                                    <div className = {PostPageCSS['post-username']} onClick={() => this.ClickProfile()}>
                                        <span> {this.state.username} </span>
                                    </div>
                                </div>
                                <div className = {PostPageCSS['post-on']}>
                                    <span> Posted On </span>
                                    <div className = {PostPageCSS['post-date']}>
                                        <span> {this.state.post_date} </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className = {PostPageCSS['post-title']}>
                            <span className = {PostPageCSS['post-id']}> #{this.state.post_id} </span>
                            <h1 className = {PostPageCSS['post-title-text']}> {this.state.title} </h1>
                        </div>
                        <div className = {PostPageCSS['post-content']}>
                            <span className = {PostPageCSS['post-content-text']}>
                                {this.state.content}
                            </span>
                        </div>

                        {this.state.post_images.length === 0
                        ?
                        <></>
                        :
                        <div className = {PostPageCSS['post-images']}>
                            {this.state.post_images.map(image => (
                                <Post_Images key={image} image={image} state={this.state}/>
                            ))}
                        </div>
                        }

                    </div>
                    <div className = {PostPageCSS['post-bar']}>
                        <Like_button state={this.state} click_like={this.click_like} click_undo_like={this.click_undo_like}/>
                        <Post_Buttons state={this.state} delete_post={this.DeletePostHandler} ClickDelete={() => this.ClickDeleteButton()} toggleModal={this.toggleModal}/>
                    </div>
                    <Comment_input comment_input={this.state.comment_input} commentHandler={this.CommentHandler} submit={this.CommentSumbitHandler}/>
                    <CommentList comment_list={this.state.comments} loadPost={this.loadPost} openToast={this.props.openToast}/>
                </div>

            </div>
        );
    }
}

const Post_Images = (props) => {
    return (
        <img className = {PostPageCSS['post-image-1']} src={props.image} alt="Post-Image"/>
    )
}

const Like_button = (props) => {
    if (props.state.upvote_set === false) {
        return (
            <div className = {PostPageCSS['upvote']}>
                <span className = {PostPageCSS['upvote-button-before']} onClick={() => props.click_like()}></span>
                <span className = {PostPageCSS['upvote-number-before']}>{props.state.likes}</span>
            </div>
        );
    } else if (props.state.upvote_set === true) {
        return (
            <div className = {PostPageCSS['upvote']}>
                <span className = {PostPageCSS['upvote-button-after']} onClick={() => props.click_undo_like()}></span>
                <span className = {PostPageCSS['upvote-number-after']}>{props.state.likes}</span>
            </div>
        );
    }   
}

const Post_Buttons = (props) => {
    if (props.state.show_delete === true){
        return(
            <div className = {PostPageCSS['post-buttons']}>
                <div className = {PostPageCSS['post-delete']} onClick={props.ClickDelete}>
                        <span className = {PostPageCSS['post-delete-button']}></span>
                        <span className = {PostPageCSS['post-delete-text']}>Delete</span>
                </div>

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
            <label className= {PostPageCSS['comment-label']}>
                <input className= {PostPageCSS['comment-inputbox']} type='text' id='comment' name='comment' placeholder='Write Comment' onChange={props.commentHandler}></input>
                <span className={style["active-text"] + " " + style["bold"]}>{props.comment_input.length}/255</span>
            </label>

            <label className= {PostPageCSS['send-button-label']}>
                <input className= {PostPageCSS['send-button']} type='submit' value='Send'></input>
            </label>
        </form>
    );
}