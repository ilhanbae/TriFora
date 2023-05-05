import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Modal from "./Modal";
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
  const [isCommunityDeleteModalOpen, setIsCommunityDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch the community details when the community setting page is loaded
  useEffect(() => {
    loadCommunityDetails();
  }, []);

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
  };

  /* This method uploads the image file to the server */
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
      props.openToast({type: "error", message: <span>Uh oh, sorry you can't update the community image at the moment. Please contact <Link to="about" style={{color: "var(--light-yellow", textDecoration: "underline"}}> our developers.</Link></span>});
    } else {
      // console.log(uploadedServerAvatarFile, uploadFileErrorMessage);
      serverImageUrl = `${process.env.REACT_APP_DOMAIN_PATH}${data.path}`; // Format server link with app domain
    }
    return serverImageUrl;
  };

  /* This method updates community name by sending PATCH request to the API server.
  [TODO] Should check if the name is taken? */
  const updateCommunityName = async (name) => {
    let endpoint = `/groups/${props.communityId}`;
    let body = {
      communityDetails,
      name: name,
    };
    const { data, errorMessage } = await genericPatch(endpoint, body);
    // console.log(data, errorMessage)
    if (errorMessage) {
      props.openToast({type: "error", message: <span>Uh oh, sorry you can't update the community name at the moment. Please contact <Link to="about" style={{color: "var(--light-yellow", textDecoration: "underline"}}> our developers.</Link></span>});
    } else {
      props.openToast({ type: "success", message: `Successfully updated community name to "${name}". Close the modal to see your new community design!` });
      setCommunityDetails(data);
      // refreshCommunityDetails();
      // props.refreshCommunityDetails();
    }
  };

  /* This method updates community banner color by sending PATCH request to the API server. */
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
      props.openToast({type: "error", message: <span>Uh oh, sorry you can't update the community banner color at the moment. Please contact <Link to="about" style={{color: "var(--light-yellow", textDecoration: "underline"}}> our developers.</Link></span>});
    } else {
      props.openToast({ type: "success", message: `Successfully updated community banner color. Close the modal to see your new community design!` });
      setCommunityDetails(data);
      // refreshCommunityDetails();
      // props.refreshCommunityDetails();
    }
  };

  /* This method updates community banner profile image by sending PATCH request to the API server. */
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
      props.openToast({type: "error", message: <span>Uh oh, sorry you can't update the community image at the moment. Please contact <Link to="about" style={{color: "var(--light-yellow", textDecoration: "underline"}}> our developers.</Link></span>});
    } else {
      props.openToast({ type: "success", message: `Successfully updated community image. Close the modal to see your new community design!` });
      setCommunityDetails(data);
      // refreshCommunityDetails();
      // props.refreshCommunityDetails();
    }
  };

  /* This method deletes the community by sending DELETE request to the API server. */
  const deleteCommunity = async () => {
    let endpoint = `/groups/${props.communityId}`;
    const { data, errorMessage } = await genericDelete(endpoint);
    // console.log(data, errorMessage)
    if (errorMessage) {
      props.openToast({type: "error", message: <span>Uh oh, sorry you can't delete the community at the moment. Please contact <Link to="about" style={{color: "var(--light-yellow", textDecoration: "underline"}}> our developers.</Link></span>});
    } else {
      props.openToast({ type: "success", message: `Community deleted successfully!` });
      navigate("/"); // navigate back to landing page
      props.closeCommunityPageSettingModal();
    }
  };

  /* This method handles delete button action. */
  const deleteButtonHandler = async () => {
    openCommunityDeleteModal();
  }

  /* This method opens community delete modal. */
  const openCommunityDeleteModal = () => {
    setIsCommunityDeleteModalOpen(true);
  }

  /* This method closes community delete modal. */
  const closeCommunityDeleteModal = () => {
    setIsCommunityDeleteModalOpen(false);
  }


  // Render Component
  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    // Unpack community details
    const communityName = communityDetails.name;
    const bannerBackgroundColor = communityDetails.attributes.design
      .bannerBackgroundColor
      ? communityDetails.attributes.design.bannerBackgroundColor
      : "#f3c26e";
    const bannerprofileImage = communityDetails.attributes.design
      .bannerProfileImage
      ? communityDetails.attributes.design.bannerProfileImage
      : defaultCommunityImage;

    return (
      <div className={style["container"]}>
        {/* Edit Community Section */}
        <div className={style["edit-community-section"]}>
          <div className={style["edit-community-section-body"]}>
            {/* Community Name */}
            <div className={style["edit-community-subsection"]}>
              <span className={style["section-title"]}>Name:</span>
              <EditableText
                updateTextHandler={updateCommunityName}
                showEditButton={true}
                openToast={props.openToast}
              >
                <span style={{fontWeight: "bold" }}>{communityName}</span>
              </EditableText>
            </div>

            {/* Community Banner Background Color */}
            <div className={style["edit-community-subsection"]}>
              <span className={style["section-title"]}>Background Color:</span>
              <EditableColor
                updateColorHandler={updateCommunityBannerBackgroundColor}
                showEditButton={true}
                openToast={props.openToast}
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
            </div>

            {/* Community Banner Profile Image */}
            <div className={style["edit-community-subsection"]}>
              <span className={style["section-title"]}>Profile Image:</span>
              <EditableImage
                updateImageHandler={updateCommunityBannerProfileImage}
                showEditButton={true}
                openToast={props.openToast}
              >
                <img
                  src={bannerprofileImage}
                  alt="community banner profile"
                  onError={(e) => (e.currentTarget.src = defaultCommunityImage)}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    border: "2px solid var(--bistre)"
                  }}
                ></img>
              </EditableImage>
            </div>
          </div>
        </div>

        {/* Delete Community Button */}
        <div className={style["delete-community-section"]}>
          {/* <span className={style["section-title"]}>Delete Community</span> */}
          <div className={style["delete-commmunity-section-body"]}>
            <button
              className={`${style["button"]} ${style["button__bordered"]} ${style["button__danger"]}`}
              onClick={deleteButtonHandler}
            >
              <span className={style["delete-icon"]}></span>
              Delete Community
            </button>
          </div>
        </div>

      {/* Community Delete Modal */}
      <Modal
        show={isCommunityDeleteModalOpen}
        onClose={closeCommunityDeleteModal}
        modalStyle={{
          width: "30%",
          height: "30%",
        }}
      >
        <div className={style["community-delete-modal"]}>
          <span className={style["community-delete-modal-headline"]}>
            Delete Community?
          </span>
          <div className={style["community-delete-modal-buttons"]}>
            <button
              className={`${style["button"]} ${style["button__bordered"]} ${style["button__danger"]}`}
              onClick={() => deleteCommunity()}
            >
              Yes
            </button>
            <button
              className={`${style["button"]} ${style["button__bordered"]} ${style["button__filled"]}`}
              onClick={() => closeCommunityDeleteModal()}
            >
              No
            </button>
          </div>
        </div>
      </Modal>


      </div>
    );
  }
}
