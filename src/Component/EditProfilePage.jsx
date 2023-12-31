import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../style/EditProfilePage.module.css";
import genericFetch from "../helper/genericFetch";
import uploadFile from "../helper/uploadFile";
import genericPatch from "../helper/genericPatch";
import validateUserProfileFields from "../helper/validateUserProfileFields";
import style from "../style/EditProfilePage.module.css"
import { isNonNullChain } from "typescript";
import Modal from "./Modal";

export default function EditProfile(prop) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoaded, setIsLoaded] = useState("false");
  const [user, setUser] = useState(null);

  // Load the current user instance when the component is loaded
  useEffect(() => {
    loadUser();
  }, []);

  // This methods loads the user data using genericFetch.
  const loadUser = async () => {
    setIsLoaded(false);
    const query = {};
    const endpoint = `/users/${sessionStorage.getItem("user")}`;
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage);

    setUser(data);
    setErrorMessage(errorMessage);
    setIsLoaded(true);
  };

  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  } else if (!isLoaded) {
    return <div>Loading</div>;
  } else {
    if (user) {
      return (
        <div className={style["container"]}>
          <ProfileMain 
          user={user} 
          render_user={prop.render_user} 
          toggleProfile={prop.toggleProfile}
          openToast = {prop.openToast}
          />
        </div>
      );
    }
  }
}

// Delete an Account
const DeleteAccount = (prop) => {
  const handleDeleteAccount = async () => {
    const userID = (sessionStorage.getItem("user"))
    console.log(sessionStorage)

    const baseUrl = `${process.env.REACT_APP_API_PATH}`;

    const endpoint = "/users/" + parseInt(userID, 10) + `?relatedObjectsAction=delete`;
    const url = `${baseUrl}${endpoint}`;
    const authToken = sessionStorage.getItem("token"); // Replace with your actual authentication token


    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    };

    // const response = await fetch(url, requestOptions);
    fetch(url, requestOptions)
        .then(response => {
          if (response.status === 204) {
            sessionStorage.clear();
            prop.openToast({ type: "success", message: "Account Deleted Successfully!" });
          } else {
            prop.openToast({ type: "error", message: "Please Try Again!" });          
          }
        })
        .catch(error => console.log(error));

  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const captchaWord = 'delete';

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setInputValue('');
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputValue === captchaWord) {
      handleDeleteAccount();
      // alert("You've successfully deleted your account");
    } else {
      //alert("Error! You typed the captcha word incorrectly.");
      prop.openToast({ type: "error", message: "Error! You typed the captcha word incorrectly." });  
      handleModalClose();
      setInputValue('');
    }
  };

  const modalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
      backgroundColor: '#f3c26e',
      borderRadius: '10px',
      padding: '10px'
    }
  };

  return (
      <>
        <button className={style["delete_account_button"]} onClick={handleButtonClick}>
          <span className={style["delete_account_icon"]}></span>
          Delete Account
        </button>
        <Modal
            show={isModalOpen}
            onClose={handleModalClose}
            modalStyle={{
              width: "50%",
              height: "50%",
            }}
        >
          <form onSubmit={handleSubmit}>
            <h1 className={style["delete_account_title"]}>Please type in the word</h1>
            <h2 className={style["delete_account_keyword"]}>"{captchaWord}"</h2>
            <label>
              <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  className={style["delete_account_inputbox"]}
              />
            </label>
            <label>
              <input
                  type="submit"
                  value="Confirm"
                  className={style["delete_account_confirm_button"]}
                  onChange={handleInputChange}
                  placeholder="Confirm"
              />
            </label>
          </form>
        </Modal>
      </>
    )
}

/* Profile Header. */
const ProfileHeader = (prop) => {
  // Save button nav action
  const saveActionHandler = () => {
    prop.userProfileFormSubmitHandler();
    prop.render_user(prop.user_id);
  };

  return (
    <div className={style["profile-header"]}>
      <div className={style["user-profile-headline"]}>
        <h1 className={style["active-text"]}>{prop.username}'s Profile Page</h1>
      </div>
      <div className={style["page-nav-buttons"]}>
        <button className={style["button"]} onClick={saveActionHandler}>
          <span className={style["save_button_icon"]}></span>
          Save
        </button>
        <DeleteAccount
        openToast={prop.openToast}
        />
        {/*
        <Link to={`/profile/${sessionStorage.getItem("user")}`}>
          <button className={style["button"]}>Close</button>
        </Link>
        */}
      </div>
    </div>
  );
};

/* Profile Main */
const ProfileMain = (prop) => {
  return (
      <UserProfileForm 
      user={prop.user} 
      render_user={prop.render_user} 
      toggleProfile={prop.toggleProfile}
      openToast = {prop.openToast}
      />
  );
};

/* User Profile */
const UserProfileForm = (prop) => {
  const [avatarFile, setAvatarFile] = useState(prop.user.attributes.profile.profileImage);
  const [avatarLink, setAvatarLink] = useState(prop.user.attributes.profile.profileImage);
  const [username, setUsername] = useState(prop.user.attributes.profile.username);
  const [description, setDescription] = useState(prop.user.attributes.profile.description);

  // Perform user profile form submission.
  const userProfileFormSubmitHandler = async () => {
    let serverAvaterLink = avatarLink;

    // If the 'avatarFile' is not the same as 'avatarLink', this means user does not upload a new image, keep the old image
    if (avatarFile !== avatarLink){
      // 1. Upload image to the server first, to get a static link for avatar
      // console.log(serverAvaterLink)
      serverAvaterLink = await uploadUserAvatar(serverAvaterLink)
    }
    
    // 2. Update user profile using the based on the form data fields, including
    // serverAvatarLink
    // console.log(serverAvaterLink)
    await updateUserProfile(serverAvaterLink)
  };

  // Upload user avatar to API server to retrieve a server link
  const uploadUserAvatar = async (serverAvaterLink) => {
    const formDataParams = { // set up form data params for image upload
      uploaderID: prop.user.id,
      attributes: { type: "user-avatar" },
      file: avatarFile,
    };
    const { data: uploadedServerAvatarFile, errorMessage: uploadFileErrorMessage } = await uploadFile(formDataParams);
    
    // Check for upload file error
    if(uploadFileErrorMessage) {
      prop.openToast({type: "error", message: <span>File upload error</span>})
      return serverAvaterLink
    } else {
      // console.log(uploadedServerAvatarFile, uploadFileErrorMessage);
      serverAvaterLink = `${process.env.REACT_APP_DOMAIN_PATH}${uploadedServerAvatarFile.path}` // Format server link with app domain 
      return serverAvaterLink
    }
  }

  // Update user profile based on the form data fields
  const updateUserProfile = async (serverAvatarLink) => {
    // console.log(serverAvatarLink);
    const endpoint = `/users/${sessionStorage.getItem("user")}`;
    const body = { // set up request body 
      email: prop.user.email,
      attributes: {
        profile: {
          username: username,
          description: description,
          profileImage: serverAvatarLink,
        },
      },
    };
    
    // Check for profile fields error
    const [isUserProfileFieldsValid, userProfileFieldsErrorMessage] = validateUserProfileFields(body);
    // console.log(isUserProfileFieldsValid, userProfileFieldsErrorMessage)
    
    if(!isUserProfileFieldsValid) {
      console.log(userProfileFieldsErrorMessage)
      
      if(userProfileFieldsErrorMessage=="Username can't be empty") {
        prop.openToast({type: "error", message: <span>Username can't be empty</span>})
      }
      else if(userProfileFieldsErrorMessage=="Description can't be empty") {
        prop.openToast({type: "error", message: <span>Description can't be empty</span>})
      }
      else if(userProfileFieldsErrorMessage=="Username should only contain alphanumeric characters") {
        prop.openToast({type: "error", message: <span>Username should only contain alphanumeric characters</span>})
      }
      
    } else {
      const { data: updatedUser, errorMessage: updateUserErrorMessage} = await genericPatch(endpoint, body);
      
      // console.log(updatedUser, updateUserErrorMessage);
      if (updateUserErrorMessage) {
        prop.openToast({type: "error", message: <span>Could not update user</span>})
      } else {
        prop.openToast({type: "success", message: <span>Profile Edit Successful!</span>})
        prop.toggleProfile();
      }
    }
  }


  // Update profile avatar display on upload. The path for image is a blob url that 
  // is maintained internally by the browser.
  // Note:
  // - Should check if file is supported image file format
  // - Should also check if the file does not exceed certain size 
  const avatarSelectHandler = (e) => {
    try {
      const selectedFile = e.target.files[0];
      const imageBlob = URL.createObjectURL(selectedFile);

      // check if file is supported image file  format
      if (selectedFile.type === "image/png" || selectedFile.type === "image/jpg" || selectedFile.type === "image/jpeg") {
        setAvatarFile(selectedFile);
        setAvatarLink(imageBlob);
      } else {
        prop.openToast({type: "error", message: <span>Please upload a file that is an image</span>})
        // setAvatarLink("");
      }
    } catch(error) {
      console.log(error);
    }
  };

  // Update user name on input change
  const usernameInputHandler = (e) => {
    setUsername(e.target.value);
  };

  // Update description on input change
  const descriptionInputHandler = (e) => {
    setDescription(e.target.value);
  };

  return (
    <>
      {/* Profile Header */}
      <ProfileHeader
        username={prop.user.attributes.profile.username}
        userProfileFormSubmitHandler={userProfileFormSubmitHandler}
        render_user={prop.render_user}
        user_id={prop.user.id}
        toggleProfile={prop.toggleProfile}
        openToast={prop.openToast}
      />

      {/* Main Form */}
      <form
        className={style["user-profile-form"]}
        onSubmit={userProfileFormSubmitHandler}
        autoComplete="off"
      >
        {/* User profile avatar field */}
        <div className={style["user-profile-avatar"]}>
          <img className={style["profile-avatar-preview"]} src={avatarLink} alt="profile-avatar-preview" />
          <input
            id={style["profile-avatar-upload-input"]}
            type="file"
            onChange={avatarSelectHandler}
          />
          <label htmlFor={style["profile-avatar-upload-input"]} className={style["button"] + " " + style["bold"]}>
            <span className={style["profile-avatar-upload-icon"]}></span>
            Upload
          </label>
        </div>

        {/* User basic info field */}
        <div className={style["user-profile-basic-info"]}>

          {/* Username Input Field*/}
          <div className={style["user-profile-username"]}>
            <label>
              <span className={style["active-text"] + " " + style["bold"]}>Username:</span>
              <input
                className={style["text-input"]}
                type="text"
                value={username}
                onChange={usernameInputHandler}
              />
            </label>
          </div>

          {/* User detail info field*/}
          <div className={style["user-profile-bio"]}>
            <label>
              <span className={style["active-text"] + " " + style["bold"]}>Description:</span>
              <textarea
                className={style["textarea-input"]}
                type="text"
                value={description}
                onChange={descriptionInputHandler}
                maxLength="255"
              />
              <span className={style["active-text"] + " " + style["bold"]}>{description.length}/255</span>
            </label>
          </div>
          
        </div>

        
        {/* User Profile Avatar */}
        {/* <div className={style["user-profile-avatar"]}></div> */}
        {/* User Profile Identity  */}
        {/* <div className={style["usr-profile-identity"]}>{prop.username}</div> */}
      </form>
    </>
  );
};
