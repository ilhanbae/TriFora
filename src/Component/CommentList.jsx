import React from "react";
import "./PostPage.css";
import red_icon from "../assets/red-icon.jpeg";
import black_icon from "../assets/black-icon.jpeg";
import Comment from "./Comment";

/* The CommentList is going to load all the comments related to a single post.*/

export default class CommentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          
        };
      }

    render() {
        return(
            <div className = 'comment-section'>
                {this.props.comment_list.map(post => (
                    <Comment join={this.props.join} key={post.id} post={post} loadPost={this.props.loadPost}/>
                ))}
            </div>
        );
    }
}