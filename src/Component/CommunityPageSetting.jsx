import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditableText from "./EditableText";
import EditableColor from "./EditableColor";
import EditableImage from "./EditableImage";
import genericFetch from "../helper/genericFetch";
import genericPatch from "../helper/genericPatch";
import genericDelete from "../helper/genericDelete";
import uploadFile from "../helper/uploadFile";
import style from "../style/CommunityPageSetting.module.css";
import defaultCommunityImage from "../assets/defaultCommunityImage.png";

/* This component renders edit community form */
export default function CommunityPageSetting(props) {
  const [communityDetails, setCommunityDetails] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  // Fetch the community details when the community setting page is loaded
  useEffect(() => {
    loadCommunityDetails();
  }, [])

  /* This methods loads the community details by sending the API request. */
  const loadCommunityDetails = async () => {
    setIsLoaded(false);
    let endpoint = `/groups/${props.communityId}`;
    let query = {};
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage)
    if (errorMessage) {
      setErrorMessage(errorMessage);
    } else {
      setCommunityDetails(data);
    }
    setIsLoaded(true);
  };

  /* This method refresh the community details by sending the API request again. */
  const refreshCommunityDetails = async () => {
    await loadCommunityDetails();
  }

  // This method updates community name by sending PATCH request to the API server.
  // [TODO] Should check if the name is taken.
  const updateCommunityName = async (name) => {
    let endpoint = `/groups/${props.communityId}`;
    let body = {
      communityDetails,
      name: name,
    };
    const { data, errorMessage } = await genericPatch(endpoint, body);
    // console.log(data, errorMessage)
    if (errorMessage) {
      alert(errorMessage);
    } else {
      alert(`Successfully Updated Community Name to "${name}"`);
      refreshCommunityDetails();
      props.refreshCommunityDetails();
      // props.closeCommunityPageSettingModal();
    }
  };

  // This method updates community banner color by sending PATCH request to the API server.
  const updateCommunityBannerBackgroundColor = async (color) => {
    let endpoint = `/groups/${props.communityId}`;
    let body = {
      ...communityDetails,
      attributes: {
        ...communityDetails.attributes,
        design: {
          ...communityDetails.attributes.design,
          bannerBackgroundColor: color,
        },
      },
    };
    const { data, errorMessage } = await genericPatch(endpoint, body);
    // console.log(data, errorMessage)
    if (errorMessage) {
      alert(errorMessage);
    } else {
      alert(
        `Successfully Updated Community Banner Background Color to "${color}"`
      );
      refreshCommunityDetails();
      props.refreshCommunityDetails();
    }
  };

  // This method uploads the image file to the server
  const uploadImageFile = async (imageFile) => {
    let serverImageUrl = "";
    const formDataParams = {
      // set up form data params for image upload
      uploaderID: sessionStorage.getItem("user"),
      attributes: { type: "community-profile" },
      file: imageFile,
    };
    const { data, errorMessage } = await uploadFile(formDataParams);
    // console.log(data, errorMessage)
    if (errorMessage) {
      alert(errorMessage);
    } else {
      // console.log(uploadedServerAvatarFile, uploadFileErrorMessage);
      serverImageUrl = `${process.env.REACT_APP_DOMAIN_PATH}${data.path}`; // Format server link with app domain
    }
    return serverImageUrl;
  };

  // This method updates community banner profile image by sending PATCH request to the API server.
  const updateCommunityBannerProfileImage = async (imageFile) => {
    let serverImageUrl = await uploadImageFile(imageFile);
    // console.log(serverImageUrl)
    let endpoint = `/groups/${props.communityId}`;
    let body = {
      ...communityDetails,
      attributes: {
        ...communityDetails.attributes,
        design: {
          ...communityDetails.attributes.design,
          bannerProfileImage: serverImageUrl,
        },
      },
    };
    const { data, errorMessage } = await genericPatch(endpoint, body);
    // console.log(data, errorMessage)
    if (errorMessage) {
      alert(errorMessage);
    } else {
      alert(`Successfully Updated Community Banner to "${serverImageUrl}"`);
      refreshCommunityDetails();
      props.refreshCommunityDetails();
      // props.closeCommunityPageSettingModal();
    }
  };

  // This method deletes the community by sending DELETE request to the API server.
  const deleteCommunity = async () => {
    let endpoint = `/groups/${props.communityId}`;
    const { data, errorMessage } = await genericDelete(endpoint);
    // console.log(data, errorMessage)
    if (errorMessage) {
      alert(errorMessage);
    } else {
      alert(`Succesfully removed community: ${props.communityId}`);
      navigate("/"); // navigate back to landing page
      props.closeCommunityPageSettingModal();
    }
  };

  // Render Component
  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    // Unpack community details
    const communityName = communityDetails.name;
    const bannerBackgroundColor = communityDetails.attributes.design.bannerBackgroundColor
        ? communityDetails.attributes.design.bannerBackgroundColor
        : "#f3c26e";
    const bannerprofileImage = communityDetails.attributes.design.bannerProfileImage
        ? communityDetails.attributes.design.bannerProfileImage
        : defaultCommunityImage;

    return (
      <div className={style["container"]}>
        {/* Edit Community Section */}
        <div className={style["edit-community-section"]}>
          <span className={style["section-title"]}>Edit Community</span>
          <div className={style["edit-community-section-body"]}>
            {/* Community Name */}
            <EditableText
              updateTextHandler={updateCommunityName}
              showEditButton={true}
            >
              {/* <h2 style={{ whiteSpace: "nowrap"}}>{communityName}</h2> */}
              <h2>{communityName}</h2>
            </EditableText>

            {/* Community Banner Background Color */}
            <EditableColor
              updateColorHandler={updateCommunityBannerBackgroundColor}
              showEditButton={true}
            >
              <div
                style={{
                  backgroundColor: bannerBackgroundColor,
                  width: "100px",
                  height: "50px",
                  borderRadius: "5px",
                }}
              ></div>
            </EditableColor>

            {/* Community Banner Profile Image */}
            <EditableImage
              updateImageHandler={updateCommunityBannerProfileImage}
              showEditButton={true}
            >
              <img
                src={bannerprofileImage}
                alt="community banner profile"
                onError={(e) => (e.currentTarget.src = defaultCommunityImage)}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "10px"
                }}
              ></img>
            </EditableImage>
          </div>
        </div>

        {/* Delete Community Button */}
        <div className={style["delete-community-section"]}>
          <span className={style["section-title"]}>Delete Community</span>
          <div className={style["delete-commmunity-section-body"]}>
            <button
              className={`${style["button"]} ${style["button__bordered"]} ${style["button__danger"]}`}
              onClick={deleteCommunity}
            >
              <span className={style["delete-icon"]}></span>
              Delete Community
            </button>
          </div>
        </div>
      </div>
    );
  }
}
