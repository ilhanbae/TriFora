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
            edit_comment: false,
            edit_comment_input: "",
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
                alert("Comment Can be empty!")
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
                        alert("Comment Updated");
                        this.setState({
                            edit_comment: false,
                        });
                        this.props.loadPost();
                      },
                      error => {
                        alert("error!");
                      }
                    );
            }
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

                <Comment_text edit_comment={this.state.edit_comment} comment_content={this.state.comment_content} edit_comment_handler={e => this.Edit_Comment_Handler(e)} submit={this.Edit_Comment_SubmitHandler}/>
                {/* <div className = 'comment-text'>
                    {this.state.comment_content}
                </div> */}

                <Comment_interaction join={this.props.join} delete={e => this.deleteComment(this.props.post.id)} comment_user={this.state.comment_userid} edit={() => this.edit()}/>
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
                <div className = 'comment-delete'>
                    <button className = 'comment-delete-button' onClick={props.delete}></button>
                    <b className = 'comment-delete-text'>Delete</b>
                </div>
                <div className = 'comment-edit'>
                    <button className = 'comment-edit-button' onClick={props.edit}></button>
                    <b className = 'comment-edit-text'>Edit</b>
                </div>
            </div>
        );
    }
}

const Comment_text = (props) => {
    // If edit_comment is false, show comment content
    if (!props.edit_comment){
        return (
            <div className = 'comment-text'>
                {props.comment_content}
            </div>
        );

    // if edit_comment is true, show edit comment inputbox
    }else{
        return (
            <div className = 'comment-text' onSubmit={props.submit}>
                <form className = "edit-form">
                    <input className='edit-inputbox' type='text' id='comment' name='comment' placeholder='Edit Comment' onChange={props.edit_comment_handler}></input>
                    <input className='edit-button' type='submit' value='Edit'></input>
                </form>
            </div>
        );
    }
}