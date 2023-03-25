import React from "react";
import "./PostPage.css";
import red_icon from "../assets/red-icon.jpeg";
import black_icon from "../assets/black-icon.jpeg";
import Convert_time from "../Helper/Convert_time";

/* The Comment is going to render a single comment related to that post.*/

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment_userimage: this.props.post.author.attributes.profile.profileImage,
            comment_username: this.props.post.author.attributes.profile.username,
            comment_userid: this.props.post.author.id,
            comment_date: Convert_time(this.props.post.created),
            comment_content: this.props.post.content,
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
                    alert("Delete Successfully");
                    this.props.loadPost();
                },
                error => {
                    alert("error!"+error);
                }
                );
        }
    }

    render() {
        return (
            <div className = 'individual-comment'>
                <div className = 'comment-user-info'>
                    <div className = 'comment-user-avater'>
                    </div>
                    <div className = 'comment-user-username'>
                        {this.state.comment_username}
                    </div>
                    <div className = 'comment-user-date'>
                        {this.state.comment_date}
                    </div>
                </div>
                <div className = 'comment-text'>
                    {this.state.comment_content}
                </div>
                <Comment_interaction join={this.props.join} delete={e => this.deleteComment(this.props.post.id)} comment_user={this.state.comment_userid}/>
            </div>
        );
    }
}

const Comment_interaction = (props) => {
    if (props.join === 'Join'){
        return (
            <></>
        );
    }else if (props.comment_user.toString() !== sessionStorage.getItem("user").toString()){
        return (
            <></>
        );
    } else {
        return(
            <div className = 'comment-interaction'>
                <input className = 'comment-delete-button-image' type='image' src={red_icon} alt='red_icon' onClick={props.delete}/>
                <b className = 'comment-delete-text'>Delete</b>
                <input className = 'comment-edit-button-image' type='image' src={black_icon} alt='black-icon'/>
                <b className = 'comment-edit-text'>Edit</b>
            </div>
        );
    }
}