import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../style/EditProfile.css";
import genericFetch from "../helper/genericFetch";
import uploadFile from "../helper/uploadFile";
import genericPatch from "../helper/genericPatch";
import validateUserProfileFields from "../helper/validateUserProfileFields";

export default function EditProfile() {
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
        <div className="container">
          {/* <ProfileHeader username={user.username} /> */}
          <ProfileMain user={user} />
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
  };

  return (
    <div className="profile-header">
      <div className="user-profile-headline">
        <h1 className="active-text">{prop.username}'s Profile Page</h1>
      </div>
      <div className="page-nav-buttons">
        <button className="button" onClick={saveActionHandler}>
          Save
        </button>
        <Link to="/profile-page">
          <button className="button">Close</button>
        </Link>
      </div>
    </div>
  );
};

/* Profile Main */
const ProfileMain = (prop) => {
  return (
    <div className="profile-main">
      <UserProfileForm user={prop.user} />
    </div>
  );
};

/* User Profile */
const UserProfileForm = (prop) => {
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarLink, setAvatarLink] = useState(prop.user.attributes.profile.profileImage);
  const [username, setUsername] = useState(prop.user.attributes.profile.username);
  const [firstname, setFirstname] = useState(prop.user.attributes.profile.firstName);
  const [lastname, setLastname] = useState(prop.user.attributes.profile.lastName);
  const [description, setDescription] = useState(prop.user.attributes.profile.description);

  // Perform user profile form submission.
  const userProfileFormSubmitHandler = async () => {
    let serverAvaterLink = "";

    // 1. Upload image to the server first, to get a static link for avatar
    // console.log(serverAvaterLink)
    serverAvaterLink = await uploadUserAvatar(serverAvaterLink)
    
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
      />

      {/* Main Form */}
      <form
        className="user-profile-form"
        onSubmit={userProfileFormSubmitHandler}
        autoComplete="off"
      >
        {/* User profile avatar field */}
        <div className="user-profile-avatar">
          <img className="profile-avatar" src={avatarLink} alt="" />
          <input
            id="profile-avatar-upload-input"
            type="file"
            onChange={avatarSelectHandler}
          />
          <label htmlFor="profile-avatar-upload-input" className="button bold">
            Upload
          </label>
        </div>

        {/* User basic info field */}
        <div className="user-profile-basic-info">
          {/* Username Input Field*/}
          <label>
            <span className="active-text bold">Username:</span>
            <input
              className="text-input"
              type="text"
              value={username}
              // onChange={usernameInputHandler}
              disabled
            />
          </label>
          {/* Firstname Input Field*/}
          <label>
            <span className="active-text bold">First Name:</span>
            <input
              className="text-input"
              type="text"
              value={firstname}
              onChange={firstnameInputHandler}
            />
          </label>
          {/* Lastname Input Field*/}
          <label>
            <span className="active-text bold">Last Name:</span>
            <input
              className="text-input"
              type="text"
              value={lastname}
              onChange={lastnameInputHandler}
            />
          </label>
        </div>

        {/* User detail info field*/}
        <div className="user-profile-detail-info">
          <label>
            <span className="active-text bold">Description:</span>
            <textarea
              className="textarea-input"
              type="text"
              value={description}
              onChange={descriptionInputHandler}
            />
          </label>
        </div>

        {/* User Profile Avatar */}
        <div className="user-profile-avatar"></div>
        {/* User Profile Identity  */}
        <div className="usr-profile-identity">{prop.username}</div>
      </form>
    </div>
  );
};