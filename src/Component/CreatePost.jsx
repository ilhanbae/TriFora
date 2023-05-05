import React from "react";
import "../style/CreatePost.css";
import imageUpload from "../assets/image_upload_icon.jpeg";
import { Link, Navigate } from "react-router-dom";
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
            postVisibility: "public",
            postSuccess: false,
        };
    }

    /* Handler for making a post will go here (controller api) */
    submitHandler = async event => {

        // keep the form from actually submitting via HTML - we want to handle it in react
        event.preventDefault();

        // make sure a submission isn't empty, currently we only consider title and description necessary
        // these checks might now be redundant since using required attribute
        if (this.state.postTitle.length < 1) {
            this.props.openToast({type: "error", message: "Post title cannot be empty"});
            // the above needs to be changed somehow to not have alert box if not redundant
        } else if (this.state.postContent.length < 1) {
            this.props.openToast({type: "error", message: "Post description cannot be empty"});
            // the above needs to be changed somehow to not have alert box if not redundant
        } else {
            // turn the image list into a url list for api
            let imageUrlArray = [];

            if (this.state.postImages.length > 0) {
                // loop through user images if they exist
                for (const userImage of this.state.postImages) {
                    const formDataParams = { // set up form data params for image upload
                        uploaderID: this.state.currentUser,
                        attributes: { type: "post-image" },
                        file: userImage,
                    };
                    const { data: uploadedPostImageFile, errorMessage: uploadFileErrorMessage } = await uploadFile(formDataParams);

                    // Check for upload file error
                    if (uploadFileErrorMessage) {
                        this.props.openToast({type: "error", message: <span>Uh oh, sorry you can't upload the file at the moment. Please contact <Link to="about" style={{color: "var(--light-yellow", textDecoration: "underline"}}> our developers.</Link></span>});
                    } else {
                        // add to the url array if successful helper call
                        let postImageLink = `${process.env.REACT_APP_DOMAIN_PATH}${uploadedPostImageFile.path}` // Format server link with app domain
                        imageUrlArray.push(postImageLink)
                    }
                };//);
                // if the above throws an error the fetch below would likely be undefined behavior
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
                    recipientGroupID: this.props.communityId,
                    content: this.state.postContent, // if post description can be empty this is just going to have to store an empty string and be tested for post page side I think
                    attributes: {
                        title: this.state.postTitle,
                        public: this.state.postVisibility === "public" ? true : false,
                        images: imageUrlArray //JSON.stringify( imageUrlArray )
                    }
                })
            })
                .then(res => res.json())
                .then(
                    result => {
                        this.props.openToast({type: "success", message: "Post created successfully!"});
                        this.props.closeCreatePostPageModal();
                    },
                    error => {
                        this.props.openToast({type: "error", message: <span>Uh oh, sorry you create the post at the moment. Please contact <Link to="about" style={{color: "var(--light-yellow", textDecoration: "underline"}}> our developers.</Link></span>});

                    }
                );
        }
    };

    /* method that will keep the current post up to date as you type it,
       so that the submit handler can read the information from the state. */
    myTitleChangeHandler = event => {
        const title = event.target.value;

        if (title.length === 0) {
            event.target.setCustomValidity("Post requires a title")
        }
        else if (title.length > 300) {
            event.target.setCustomValidity("Title must be less than 300 characters.")
        } else {
            event.target.setCustomValidity("")
            this.setState({
                postTitle: title
            });
        }

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
            // check for file size
            let sizeValid = true;
            // check that each file is an image
            Array.from(event.target.files).forEach(userFile => {
                if (userFile.type === "image/png" || userFile.type === "image/jpg" || userFile.type === "image/jpeg") {
                    /*
                     * if (userFile.type.includes('image'))
                     * Not sure how reliable the above check is yet, might have to switch back to doing
                     * === "image/png" || userFile.type === "image/jpg" || userFile.type === "image/jpeg"
                     * 
                     * easy reference sources on the above style:
                     * https://stackoverflow.com/questions/29805909/jquery-how-to-check-if-uploaded-file-is-an-image-without-checking-extensions
                     * https://stackoverflow.com/questions/32222786/file-upload-check-if-valid-image
                     */

                    // if file is an image increment the count
                    count++;
                    // if a file is too big for api flag to not continue
                    if (userFile.size > 10000000) {
                        sizeValid = false;
                    }
                }
            });

            // if the count equals the number of uploaded files and there was an actual upload, change the state
            if (count === event.target.files.length && count > 0 && sizeValid) {
                // alert("file upload success")
                // should only get here if all files are images, in which case can update state
                this.setState({
                    postImages: Array.from(event.target.files)
                });
            } else {
                // if not alert to try again
                this.props.openToast({type: "info", message: "All files must be images. Please try again"});
                // the above needs to be changed somehow to not have alert box
            }
        } else {
            // this is the scenario where the user uploads, and hits cancel after having already uploaded
            // alert("No files uploaded")
            // the above needs to be changed somehow to not have alert box
        }
    };

    visibilityInputChangeHandler = event => {
        this.setState({
            postVisibility: event.target.value
        });
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
                    {/* <Link to=`/groups/${this.props.communityId}` className="cancel-post-button">Cancel post</Link> */}
                    {/* <Link to="/" className="cancel-post-button">Cancel post</Link> */}
                    {/* The above changes to closing modal if modal gets used correctly */}

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
                                    // below is field check error message since required field
                                    // onInvalid={e => e.target.setCustomValidity("Post requires a title")}
                                    // onInput={e => e.target.setCustomValidity("")} // not sure if this is needed
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
                                    // below is field check error message since required field
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
                                    accept="image/png, image/jpg, image/jpeg"
                                    onChange={this.imageChangeHandler}
                                    hidden//={this.state.postImages.length < 1}
                                    multiple
                                />
                                {this.state.postImages.length > 0 &&
                                    this.state.postImages.map((image) =>
                                        <img
                                            src={URL.createObjectURL(image)}
                                            className="upload-image"
                                            alt="Upload"
                                            title="Upload image(s)" />
                                    )
                                }
                                <img
                                    src={imageUpload}
                                    className="upload-image"
                                    alt="Upload"
                                    title="Upload image(s)" />
                            </label>
                        </div>

                        <br />

                        <div>
                            <h1>Visibility:</h1>
                            <div style={{display: "flex", gap: "10px"}}>
                                {/* Public */}
                                <label>
                                    <input 
                                        type="radio"
                                        value="public"
                                        checked={this.state.postVisibility === "public"}
                                        onChange={this.visibilityInputChangeHandler}
                                    />
                                    Public
                                </label>
                                {/* Private */}
                                <label>
                                    <input 
                                        type="radio" 
                                        value="private"
                                        checked={this.state.postVisibility === "private"}
                                        onChange={this.visibilityInputChangeHandler}
                                    />
                                    Private
                                </label>
                            </div>
                        </div>

                        <br />
                        <label>
                            <input className="post-button" type="submit" value="Post" />
                        </label>
                        <br />

                        {/* not really sure what this is doing yet, but professor had it too to make posts */}
                        {this.state.postmessage}
                    </form>
                </div>
            </div>
        );
    }
}