import React from "react";
import PostPageCSS from "../style/PostPage.module.css";
import red_icon from "../assets/red-icon.jpeg";
import black_icon from "../assets/black-icon.jpeg";
import formatDateTime from "../helper/formatDateTime";
import Modal from "./Modal";
import { Link } from 'react-router-dom';
import PostPage from "./PostPage";
import defaultProfileImage from "../assets/defaultProfileImage.png";
import ProfilePage from "./ProfilePage";

/* The Comment is going to render a single comment related to that post.*/

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment_userimage: this.props.post.author.attributes.profile.profileImage === "" ? defaultProfileImage : this.props.post.author.attributes.profile.profileImage,
            comment_username: this.props.post.author.attributes.profile.username,
            comment_userid: this.props.post.author.id,
            comment_date: formatDateTime(this.props.post.created),
            comment_content: this.props.post.content,
            edit_comment: false,
            edit_comment_input: "",

            openModal: false,
            openProfile: false,
        };
    }
    
    deleteComment(comment_id) {
        if (sessionStorage.getItem("token")){
            //make the api call to post
            fetch(process.env.REACT_APP_API_PATH+"/posts/" + comment_id, {
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
                    this.props.loadPost();
                    this.props.openToast({type: "success", message: <span>Delete Comment Successful!</span>})
                },
                error => {
                    //alert("error!"+error);
                    console.log("error!"+error)
                    this.props.openToast({type: "error", message: <span>Error When Deleting the Comment!</span>})
                }
                );
        }
    }

    edit(){
        this.setState({
            edit_comment: !this.state.edit_comment,
        })
    }

    Edit_Comment_Handler = event => {
        this.setState({
            edit_comment_input: event.target.value,
        });
        console.log(this.state.edit_comment_input);
    }

    Edit_Comment_SubmitHandler = event => {
        //keep the form from actually submitting via HTML - we want to handle it in react
        event.preventDefault();

        if (sessionStorage.getItem("token")){
            //Check the length of the edit_comment_input
            if (this.state.edit_comment_input.length === 0){
                //alert("Comment Can be empty!")
                console.log("Comment Can be empty!");
            } else {
                fetch(process.env.REACT_APP_API_PATH+"/posts/"+this.props.post.id, {
                    method: "PATCH",
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer '+sessionStorage.getItem("token")
                    },
                    body: JSON.stringify({
                      content: this.state.edit_comment_input,
                    })
                    })
                    .then(res => res.json())
                    .then(
                      result => {
                        console.log(result);
                        //alert("Comment Updated");
                        console.log("Comment Updated");
                        this.setState({
                            edit_comment: false,
                        });
                        this.props.loadPost();
                        this.props.openToast({type: "success", message: <span>Edit Comment Successful!</span>})
                      },
                      error => {
                        //alert("error!");
                        console.log("error!")
                        this.props.openToast({type: "error", message: <span>Error When Editing the Comment!</span>})
                      }
                    );
            }
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
        this.setState({
            openProfile: !this.state.openProfile,
        });
    }

    render() {
        //console.log("Each comment in Comment");
        //console.log(this.props.post.content);
        return (
            <div className = {PostPageCSS['individual-comment']}>
                <div className = {PostPageCSS['comment-user-info']}>
                    <div className = {PostPageCSS['comment-user-username']} onClick={() => this.ClickProfile()}>
                        <span> {this.state.comment_username} </span>
                    </div>
                    <img className = {PostPageCSS['comment-user-avater']} src={this.state.comment_userimage} alt="show-user-profile" onClick={() => this.ClickProfile()}></img>
                    <Modal
                        show={this.state.openProfile}
                        onClose={this.toggleProfile}
                        modalStyle={{
                        width: "85%",
                        height: "85%",
                        }}
                    >
                        <ProfilePage 
                            profile_id={this.props.post.author.id}
                            toggleProfile={this.toggleProfile}
                            openToast={this.props.openToast}
                        />
                    </Modal>
                    <div className = {PostPageCSS['comment-user-date']}>
                        <span> {this.state.comment_date} </span>
                    </div>
                </div>

                <Comment_text edit_comment={this.state.edit_comment} comment_content={this.props.post.content} edit_comment_handler={e => this.Edit_Comment_Handler(e)} submit={this.Edit_Comment_SubmitHandler}/>

                <Comment_interaction join={this.props.join} ClickDelete={() => this.ClickDeleteButton()} comment_user={this.state.comment_userid} edit={() => this.edit()} openModal={this.state.openModal} toggleModal={this.toggleModal} delete={e => this.deleteComment(this.props.post.id)}/>
                {/* <Comment_interaction join={this.props.join} delete={e => this.deleteComment(this.props.post.id)} comment_user={this.state.comment_userid} edit={() => this.edit()} openModal={this.state.openModal} toggleModal={this.toggleModal}/> */}
            </div>
        );
    }
}

const Comment_interaction = (props) => {
    if (props.comment_user.toString() !== sessionStorage.getItem("user").toString()){
        return (
            <></>
        );
    } else {
        return(
            <>
            <div className = {PostPageCSS['comment-interaction']}>
                <div className = {PostPageCSS['comment-delete']} onClick={props.ClickDelete}>
                    <span className = {PostPageCSS['comment-delete-button']}></span>
                    <span className = {PostPageCSS['comment-delete-text']}>Delete</span>
                </div>
                <div className = {PostPageCSS['comment-edit']} onClick={props.edit}>
                    <span className = {PostPageCSS['comment-edit-button']}></span>
                    <span className = {PostPageCSS['comment-edit-text']}>Edit</span>
                </div>
            </div>

            <Modal show={props.openModal} onClose={props.toggleModal}>
                <div>
                    <div className={PostPageCSS['delete-popup-title']}>Delete Your Comment</div>
                    <div className={PostPageCSS['popup-buttons']}>
                        <button className={PostPageCSS['delete-button']} onClick={props.delete}>Delete</button>
                        <button className={PostPageCSS['cancel-button']} onClick={props.toggleModal}>Cancel</button>
                    </div>
                </div>
            </Modal>
            </>
        );
    }
}

const Comment_text = (props) => {
    // If edit_comment is false, hide edit comment inputbox
    if (!props.edit_comment){
        return (
            <div className = {PostPageCSS['comment-text']}>
                <span> {props.comment_content} </span>
            </div>
        );

    // if edit_comment is true, show edit comment inputbox
    }else{
        return (
            <div className = {PostPageCSS['comment-text']} onSubmit={props.submit}>
                <form className = {PostPageCSS["edit-form"]}>
                    <label className= {PostPageCSS['edit-inputbox-label']}>
                        <input className= {PostPageCSS['edit-inputbox']} type='text' id='comment' name='comment' placeholder='Edit Comment' onChange={props.edit_comment_handler}></input>
                    </label>
                    <label className= {PostPageCSS['edit-button-label']}>
                        <input className= {PostPageCSS['edit-button']} type='submit' value='Edit'></input>
                    </label>
                </form>
            </div>
        );
    }
}