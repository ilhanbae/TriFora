import React from "react";
import "../style/CreatePost.css";
import imageUpload from "../assets/image_upload_icon.jpeg";
import { Link } from "react-router-dom";
import uploadFile from "../helper/uploadFile";

export default class CreatePost extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: sessionStorage.getItem("user"),
            postTitle: "",
            postContent: "",
            postImages: [],
            postmessage: "",
            postSuccess: false
        };
    }

    /* Handler for making a post will go here (controller api) */
    submitHandler = event => {

        // keep the form from actually submitting via HTML - we want to handle it in react
        event.preventDefault();

        // make sure a submission isn't empty, currently we only consider title and description necessary
        // these checks might now be redundant since using required attribute
        if (this.state.postTitle.length < 1) {
            alert("Post title cannot be empty")
        } else if (this.state.postContent.length < 1) {
            alert("Post description cannot be empty")
        } else {
            // turn the image list into a url list for api
            let imageUrlArray = [];

            if (this.state.postImages.length > 0) {
                // loop through user images if they exist
                this.state.postImages.forEach(async userImage => {
                    let formDataParams = { // set up form data params for image upload
                        uploaderID: this.state.currentUser,
                        attributes: { type: "post-image" },
                        file: userImage,
                    };
                    const { data: uploadedServerAvatarFile, errorMessage: uploadFileErrorMessage } = await uploadFile(formDataParams);

                    // Check for upload file error
                    if (uploadFileErrorMessage) {
                        alert(uploadFileErrorMessage)
                    } else {
                        // add to the url array if successful helper call
                        let serverAvaterLink = `${process.env.REACT_APP_DOMAIN_PATH}${uploadedServerAvatarFile.path}` // Format server link with app domain
                        imageUrlArray.push(serverAvaterLink)
                    }
                });
            }

            // make the api call to post
            fetch(process.env.REACT_APP_API_PATH + "/posts", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                    authorID: this.state.currentUser,
                    recipientGroupID: 25, // 25 is a placeholder for now until we know how our communities are working
                    content: this.state.postContent, // if post description can be empty this is just going to have to store an empty string and be tested for post page side I think
                    attributes: {
                        title: this.state.postTitle,
                        public: true, // all post are public for now?
                        // need to handle images here
                        images: imageUrlArray
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

                        // clear form, currently needed since not redirecting
                        this.setState({
                            postTitle: ""
                        });
                        this.setState({
                            postContent: ""
                        });
                        this.setState({
                            postImages: []
                        });
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

    imageChangeHandler = event => {
        // only do something if user actually uploaded files
        if (event.target.files.length > 0) {
            // file upload should return a list of files

            // counter for checking all images
            let count = 0;
            // check that each file is an image
            Array.from(event.target.files).forEach(element => {
                if (element.type.includes('image')) {
                    /*
                     * Not sure how reliable the above check is yet, might have to switch back to doing
                     * === "image/png" || element.type === "image/jpg" || element.type === "image/jpeg"
                     * 
                     * easy reference sources on the above style:
                     * https://stackoverflow.com/questions/29805909/jquery-how-to-check-if-uploaded-file-is-an-image-without-checking-extensions
                     * https://stackoverflow.com/questions/32222786/file-upload-check-if-valid-image
                     */

                    // if file is an image increment the count
                    count++;
                }
            });

            // if the count equals the number of uploaded files and there was an actual upload, change the state
            if (count === event.target.files.length && count > 0) {
                alert("file upload success")
                // should only get here if all files are images, in which case can update state
                this.setState({
                    postImages: Array.from(event.target.files)
                });
            } else {
                // if not alert to try again
                alert("All files must be images. Please try again")
            }
        } else {
            // this is the scenario where the user uploads, and hits cancel after having already uploaded
            alert("No files uploaded")
        }
    };

    render() {
        if (!sessionStorage.getItem("token")) {
            console.log("NO TOKEN");
            return ("Please log in to make and view posts");
        }
        return (
            /* wrapper for flexbox column layout */
            <div className="create-post-wrapper">
                {/* back button wrapper to allow offset placement */}
                <div className="return-button-box">
                    {/* Disguising a link as a button to allow navigation, still not sure why we are doing this */}
                    <Link to="/" className="cancel-post-button">Cancel post</Link>
                    {/* spans just being used for button positioning*/}
                    <span></span>
                    <span></span>
                </div>

                {/* form wrapper for flexbox alignment */}
                <div className="form-box-wrapper">
                    <form onSubmit={this.submitHandler}>
                        {/* wrapped in divs to solve a spacing issue */}
                        <div>
                            <label>
                                <h1>Title:</h1>
                                <input
                                    type="text"
                                    className="create-post-title"
                                    onChange={this.myTitleChangeHandler}
                                    autoFocus
                                    required
                                    onInvalid={e => e.target.setCustomValidity("Post requires a title")}
                                    onInput={e => e.target.setCustomValidity("")} // not sure if this is needed
                                />
                            </label>
                        </div>

                        <br />

                        <div>
                            <label>
                                <h1>Description:</h1>
                                <textarea
                                    className="create-post-content"
                                    rows="8"
                                    onChange={this.myContentChangeHandler}
                                    required
                                    onInvalid={e => e.target.setCustomValidity("Post requires a description")}
                                    onInput={e => e.target.setCustomValidity("")} // not sure if this is needed
                                />
                            </label>
                        </div>

                        <br />

                        <div>
                            <label>
                                <h1>Images:</h1>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={this.imageChangeHandler}
                                    hidden//={this.state.postImages.length < 1}
                                    multiple
                                />
                                {this.state.postImages.length < 1 ?
                                // if no pictures use default icon, else preview images
                                    (<img
                                        src={imageUpload}
                                        className="upload-image"
                                        alt="Upload"
                                        title="Upload image(s)" />
                                    ) : (
                                        this.state.postImages.map((image) =>
                                        <img
                                            src={URL.createObjectURL(image)}
                                            className="upload-image"
                                            alt="Upload"
                                            title="Upload image(s)" />
                                        )
                                    )
                                }

                            </label>
                        </div>

                        <br />
                        <input className="post-button" type="submit" value="Post" />
                        <br />

                        {/* not really sure what this is doing yet, but professor had it too to make posts */}
                        {this.state.postmessage}
                    </form>
                </div>
            </div>
        );
    }
}