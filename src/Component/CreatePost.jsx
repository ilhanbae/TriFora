import React from "react";
import "../style/CreatePost.css";
import imageUpload from "../assets/image_upload_icon.jpeg";

export default class CreatePost extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            postTitle: "",
            postContent: "",
            postmessage: ""
        };
    }

    /* Handler for making a post will go here (controller api) */
    submitHandler = event => {

        //keep the form from actually submitting via HTML - we want to handle it in react
        event.preventDefault();

        // make sure a submission isn't empty, currently we only consider title necessary
        if (this.state.postTitle.length < 1) {
            alert("Post title cannot be empty")
        } else {
            //make the api call to post
            fetch(process.env.REACT_APP_API_PATH + "/posts", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                    authorID: sessionStorage.getItem("user"),
                    content: this.state.postTitle,
                    attributes: {
                        // if (this.state.postContent.length > 0) {
                        //     postDescription: this.state.postContent
                        // }
                        postDescription: this.state.postContent
                    }
                })
            })
                .then(res => res.json())
                .then(
                    result => {
                        this.setState({
                            postmessage: result.Status
                        });
                        alert("Post was successful");
                        // once a post is complete, reload the feed
                        // this.postListing.current.loadPosts();
                    },
                    error => {
                        alert("error!");
                    }
                );
        }
    };

    /* method that will keep the current post up to date as you type it,
       so that the submit handler can read the information from the state. */
    myTitleChangeHandler = event => {
        this.setState({
            postTitle: event.target.value
        });
    };

    myContentChangeHandler = event => {
        this.setState({
            postContent: event.target.value
        });
    };

    render() {
        if (!sessionStorage.getItem("token")) {
            console.log("NO TOKEN");
            return ("Please log in to make and view posts");
        }
        return (
            <div>
                <div className="return-button">
                    <p>return to community will go here</p>
                </div>
                <form onSubmit={this.submitHandler}>
                    <label>
                        Post Title:
                        <br />
                        <input type="text" size="78" onChange={this.myTitleChangeHandler} />
                    </label>
                    <br />

                    <label>
                        Description:
                        <br />
                        <textarea rows="10" cols="70" onChange={this.myContentChangeHandler} />
                    </label>
                    <br />

                    <div>
                        <label>
                            Images:
                            <br />
                            <input type="file"/>
                            <img src={imageUpload}/>
                        </label>
                        <label>
                            Tags:
                            <br />
                            <textarea rows="5" cols="30" />
                        </label>
                    </div>

                    <input type="submit" value="Post" />
                    <br />
                    {this.state.postmessage}
                </form>
            </div>
        );
    }
}