import React from "react";
import "../style/CreatePost.css";
import imageUpload from "../assets/image_upload_icon.jpeg";
import { Link, Navigate, redirect } from "react-router-dom";

export default class CreatePost extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            postTitle: "",
            postContent: "",
            postmessage: "",
            postSuccess: false
        };
    }

    /* Handler for making a post will go here (controller api) */
    submitHandler = event => {

        //keep the form from actually submitting via HTML - we want to handle it in react
        event.preventDefault();

        // make sure a submission isn't empty, currently we only consider title necessary
        if (this.state.postTitle.length < 1) {
            alert("Post title cannot be empty")
        } else if (this.state.postContent.length < 1) {
            alert("Post description cannot be empty")
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
                    recipientGroupID: 25, // 25 is a placeholder for now until we know how our communities are working
                    content: this.state.postTitle,
                    attributes: {
                        public: true, // all post are public for now?
                        // this is just going to have to store an empty string and be tested for post page side I think
                        postDescription: this.state.postContent,
                        // need to handle images here
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
                        // Navigate({ to: "/", replace: true});
                        // return redirect("/")

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
            <div className="create-post-wrapper"> {/* wrapper for flexbox column layout */}
                <div className="return-button-box"> {/* back button wrapper to allow offset placement */}
                    {/* Disguising a link as a button to allow navigation, still not sure why we are doing this */}
                    <Link to="/" className="cancel-post-button">Cancel post</Link>
                    <span></span> {/* just being used for button positioning*/}
                    <span></span>
                </div>
                <div className="form-box-wrapper"> {/* form wrapper for flexbox alignment */}
                    <form onSubmit={this.submitHandler}>
                        <div> {/* wrapped in divs due to a spacing issue */}
                            <label>
                                <h1>{this.state.postMessage}</h1>
                                <input autoFocus type="text" className="create-post-title" onChange={this.myTitleChangeHandler} />
                            </label>
                        </div>

                        <br />

                        <div>
                            <label>
                                <h1>Description:</h1>
                                <textarea className="create-post-content" rows="8" onChange={this.myContentChangeHandler} />
                            </label>
                        </div>

                        <br />

                        <div>
                            <label>
                                <h1>Images:</h1>
                                <input type="file" accept="image/*" hidden />
                                <img src={imageUpload} className="upload-image" />
                            </label>
                        </div>

                        <br />
                        <input className="post-button" type="submit" value="Post" />
                        <br />

                        {this.state.postmessage}
                    </form>
                </div>
            </div>
        );
    }
}