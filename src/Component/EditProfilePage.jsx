import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../style/EditProfilePage.module.css";
import genericFetch from "../helper/genericFetch";
import uploadFile from "../helper/uploadFile";
import genericPatch from "../helper/genericPatch";
import validateUserProfileFields from "../helper/validateUserProfileFields";
import style from "../style/EditProfilePage.module.css"
import { isNonNullChain } from "typescript";

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
          {/* <ProfileHeader username={user.username} /> */}
          <ProfileMain 
          user={user} 
          render_user={prop.render_user} 
          toggleProfile={prop.toggleProfile}
          />
        </div>
      );
    }
  }
}

/* Profile Header. */
const ProfileHeader = (prop) => {
  // Save button nav action
  const saveActionHandler = () => {
    prop.userProfileFormSubmitHandler();
    prop.render_user(prop.user_id);
    prop.toggleProfile();
  };

  return (
    <div className={style["profile-header"]}>
      <div className={style["user-profile-headline"]}>
        <h1 className={style["active-text"]}>{prop.username}'s Profile Page</h1>
      </div>
      <div className={style["page-nav-buttons"]}>
        <button className={style["button"]} onClick={saveActionHandler}>
          Save
        </button>
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
    <div className={style["profile-main"]}>
      <UserProfileForm 
      user={prop.user} 
      render_user={prop.render_user} 
      toggleProfile={prop.toggleProfile}
      />
    </div>
  );
};

/* User Profile */
const UserProfileForm = (prop) => {
  const [avatarFile, setAvatarFile] = useState(prop.user.attributes.profile.profileImage);
  const [avatarLink, setAvatarLink] = useState(prop.user.attributes.profile.profileImage);
  const [username, setUsername] = useState(prop.user.attributes.profile.username);
  const [firstname, setFirstname] = useState(prop.user.attributes.profile.firstName);
  const [lastname, setLastname] = useState(prop.user.attributes.profile.lastName);
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
      alert(uploadFileErrorMessage)
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
          firstName: firstname,
          lastName: lastname,
          description: description,
          profileImage: serverAvatarLink,
        },
      },
    };
    
    // Check for profile fields error
    const [isUserProfileFieldsValid, userProfileFieldsErrorMessage] = validateUserProfileFields(body);
    // console.log(isUserProfileFieldsValid, userProfileFieldsErrorMessage)
    
    if(!isUserProfileFieldsValid) {
      alert(userProfileFieldsErrorMessage)
    } else {
      const { data: updatedUser, errorMessage: updateUserErrorMessage} = await genericPatch(endpoint, body);
      
      // console.log(updatedUser, updateUserErrorMessage);
      if (updateUserErrorMessage) {
        alert(updateUserErrorMessage)
      } else {
        alert("Profile edit successfully")
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
        alert(`${selectedFile.name} is not an image file. Please try again.`)
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

  // Update first name on input change
  const firstnameInputHandler = (e) => {
    setFirstname(e.target.value);
  };

  // Update last name on input change
  const lastnameInputHandler = (e) => {
    setLastname(e.target.value);
  };

  // Update description on input change
  const descriptionInputHandler = (e) => {
    setDescription(e.target.value);
  };

  return (
    <div>
      {/* Profile Header */}
      <ProfileHeader
        username={prop.user.attributes.profile.username}
        userProfileFormSubmitHandler={userProfileFormSubmitHandler}
        render_user={prop.render_user}
        user_id={prop.user.id}
        toggleProfile={prop.toggleProfile}
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
            Upload
          </label>
        </div>

        {/* User basic info field */}
        <div className={style["user-profile-basic-info"]}>
          {/* Username Input Field*/}
          <label>
            <span className={style["active-text"] + " " + style["bold"]}>Username:</span>
            <input
              className={style["text-input"]}
              type="text"
              value={username}
              onChange={usernameInputHandler}
            />
          </label>
          {/* Firstname Input Field*/}
          <label>
            <span className={style["active-text"] + " " + style["bold"]}>First Name:</span>
            <input
              className={style["text-input"]}
              type="text"
              value={firstname}
              onChange={firstnameInputHandler}
              /* disabled */
            />
          </label>
          {/* Lastname Input Field*/}
          <label>
            <span className={style["active-text"] + " " + style["bold"]}>Last Name:</span>
            <input
              className={style["text-input"]}
              type="text"
              value={lastname}
              onChange={lastnameInputHandler}
              /* disabled */
            />
          </label>
        </div>

        {/* User detail info field*/}
        <div className={style["user-profile-detail-info"]}>
          <label>
            <span className={style["active-text"] + " " + style["bold"]}>Description:</span>
            <textarea
              className={style["textarea-input"]}
              type="text"
              value={description}
              onChange={descriptionInputHandler}
            />
          </label>
        </div>

        {/* User Profile Avatar */}
        <div className={style["user-profile-avatar"]}></div>
        {/* User Profile Identity  */}
        <div className={style["usr-profile-identity"]}>{prop.username}</div>
      </form>
    </div>
  );
};
