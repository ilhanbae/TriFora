import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import group from "../assets/group.png";
import uploadFile from "../helper/uploadFile";
import genericPost from "../helper/genericPost";
import genericPatch from "../helper/genericPatch";
import "../style/CreateCommunity.css";

export default function CreateCommunity(props) {
    const [communityName, setCommunityName] = useState();
    const [communityImage, setCommunityImage] = useState();
    const [imageSelected, setImageSelected] = useState(false);
    const navigate = useNavigate();

    // Update community name from input
    const communityNameInput = (e) => {
        setCommunityName(e.target.value);
    };

    // Update community name from input
    const communityImageHandler = (e) => {
        let userUpload = e.target.files[0];
        if (userUpload.type === "image/png" || userUpload.type === "image/jpg" || userUpload.type === "image/jpeg") {
            // only continue if file isn't too big for api
            if (userUpload.size < 10000000) {
                setCommunityImage(e.target.files[0]);
                setImageSelected(true);
            } else {
                // else toast for size
                props.openToast({ type: "error", message: <span>Community image must be smaller than 10MB</span> })
            }
        } else {
            // else toast for wrong image type
            props.openToast({ type: "error", message: <span>Community image must be a jpg, jpeg, or png</span> })
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!imageSelected) {
            // toast for no image since required unable to show toast
            // this should work since text required prevents getting here, so only have to check for image
            props.openToast({ type: "error", message: <span>Community must have an image to be created</span> })
        } else {
            // check community name already exist and do api stuff
            // check community name exists
            if (props.listOfCommunityNames.indexOf(communityName.toLowerCase()) > -1) {
                // community exist if true
                props.openToast({ type: "error", message: <span>A community with that name already exist, please choose another</span> })
            } else {
                // props.openToast({ type: "success", message: <span>Community name is valid!</span> })
                // continue
                // upload image
                let communityImageLink = await uploadCommunityImage();
                // create community
                let newCommunityId = await createCommunity(communityImageLink);
                // set this user as admin
                await joinCreatedCommunity(newCommunityId);
            }
        }
    }

    const uploadCommunityImage = async () => {
        const formDataParams = { // set up form data params for image upload
            uploaderID: sessionStorage.getItem("user"),
            attributes: { type: "post-image" },
            file: communityImage,
        };
        const { data: uploadedPostImageFile, errorMessage: uploadFileErrorMessage } = await uploadFile(formDataParams);

        // Check for upload file error
        if (uploadFileErrorMessage) {
            // this really should have been a modal
            props.openToast({ type: "error", message: <span>There was a server error when uploading your image please contact support so we can work to fix the error</span> })
        } else {
            // add to the url array if successful helper call
            let communityImageLink = `${process.env.REACT_APP_DOMAIN_PATH}${uploadedPostImageFile.path}` // Format server link with app domain
            return communityImageLink;
        }
    }

    const createCommunity = async (communityImageLink) => {
        let currDate = new Date().toISOString();

        let endpoint = '/groups';
        let body = {
            name: communityName,
            attributes: {
                design: {
                    bannerBackgroundColor: "#5da7b6",
                    bannerProfileImage: communityImageLink
                },
                dateCreated: currDate
            }
        };
        const { data, errorMessage } = await genericPost(endpoint, body);

        // Check for upload file error
        if (errorMessage) {
            // this really should have been a modal
            props.openToast({ type: "error", message: <span>There was a server error when creating your community please contact support so we can work to fix the error</span> })
        } else {
            // else return the id so that way can make admin
            let newCommunityId = data.id
            return newCommunityId
        }
    }

    // This method adds user to community by sending POST request to the API server
    const joinCreatedCommunity = async (newCommunityId) => {
        let endpoint = '/group-members';
        let body = {
            userID: sessionStorage.getItem('user'),
            groupID: newCommunityId,
            attributes: {
                role: 'admin'
            }
        };
        const { data, errorMessage } = await genericPost(endpoint, body);
        // console.log(data, errorMessage)
        if (errorMessage) {
            // this really should have been a modal
            props.openToast({ type: "error", message: <span>There was a server error when add you to your community please contact support so we can work to fix the error</span> })
        } else {
            props.openToast({ type: "success", message: "Your community was successfully created!" });
            // close modal
            props.toggleModal();
            // ideally would bring them to the new community from here
            navigate(`/community/${newCommunityId}`);
        }
    }

    return (
        <div className="community-form-wrapper">
            <form onSubmit={submitHandler}>
                <div className="create-community-inputs">
                    <label>
                        <h1>Community name:</h1>
                        <input className="community-name-input"
                            type="text"
                            onChange={communityNameInput}
                            autoFocus
                            required
                            // below is field check error message since required field
                            onInvalid={e => e.target.setCustomValidity("Community requires a name")}
                            onInput={e => e.target.setCustomValidity("")} // not sure if this is needed
                        />
                    </label>
                </div>
                <br />
                <div className="create-community-inputs">
                    <label>
                        <h1>Community image:</h1>
                        <input
                            type="file"
                            accept="image/png, image/jpg, image/jpeg"
                            onChange={communityImageHandler}
                            hidden
                        //required // this is working, but am unsure how to show an error for it like above
                        // will handle in form handler

                        // onInvalid={e => e.target.setCustomValidity("Community requires an image")}
                        // onInput={e => e.target.setCustomValidity("")} // not sure if this is needed
                        // above doesn't work for image select
                        />
                        {imageSelected ?
                            <img
                                src={URL.createObjectURL(communityImage)}
                                className="upload-image"
                                alt="Change community image"
                                title="Change community image"
                            /> :
                            <img
                                src={group}
                                className="upload-image"
                                alt="Upload Community image"
                                title="Upload Community image"
                            />
                        }
                    </label>
                </div>
                <br />
                <div className="create-community-inputs">
                    <label>
                        <input className="create-community-button" type="submit" value="Create community" />
                    </label>
                </div>
                <br />
            </form>
        </div>
    )
}