import PropTypes from "prop-types";
import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import style from "../style/EditableImage.module.css";

export default function EditableImage(props) {
  const [originalImageDisplay, setOriginalImageDisplay] = useState(props.children); 
  const originalImage = originalImageDisplay.props.src;
  const originalImageOnError = originalImageDisplay.props.onError;
  const [newImage, setNewImage] = useState(originalImage);
  const [newImageFile, setNewImageFile] = useState(null);
  const [isEditImage, setIsEditImage] = useState(false);
  const imagePickerRef = useRef(null); // Ref for file input

  /* This method updates new image. */
  const fileInputChangeHandler = (event) => {
    // console.log(event);
    try {
      const selectedFile = event.target.files[0];
      const imageBlob = URL.createObjectURL(selectedFile);

      // check if file is supported image file format
      if (selectedFile.type === "image/png" || selectedFile.type === "image/jpg" || selectedFile.type === "image/jpeg") {
        setNewImage(imageBlob);
        setNewImageFile(selectedFile);
      } else {
        props.openToast({type: "error", message: `"${selectedFile.name}" is not an image file.`})
      }
    } catch(error) {
      props.openToast({type: "error", message: <span>Uh oh, sorry you can't edit the community image at the moment. Please contact <Link to="about" style={{color: "var(--light-yellow", textDecoration: "underline"}}> our developers.</Link></span>});
    }
  }

  /* This method updates edit image state. */
  const editButtonHandler = () => {
    setIsEditImage(true);
    toggleImagePicker();
  }

  /* This method toggles image picker */
  const toggleImagePicker = () => {
    imagePickerRef.current.click();
  }

  /* This method updates edit image state. */
  const cancelButtonHandler = () => {
    setIsEditImage(false);
    setNewImage(originalImage);
  }

  /* This method calls parent's update image handler. */
  const saveButtonHandler = () => {
    // console.log(originalImageDisplay);
    if(newImage !== originalImage) {
      props.updateImageHandler(newImageFile);
      setOriginalImageDisplay(prevOriginalImageDisplay => ({
        ...prevOriginalImageDisplay,
        props: {
          ...prevOriginalImageDisplay.props,
          src: newImage
        }
      }))
    }
    setIsEditImage(false);
  }

  return (
    <div className={style["container"]}>
      {/* Hidden Image Picker */}
      <input
        type="file"
        onChange={fileInputChangeHandler}
        style={{ display: "none"}}
        ref={imagePickerRef}
      />
      
      {/* Original Image Display */}
      {!isEditImage && <div>{originalImageDisplay}</div>}

      {/* Edited Image Display*/}
      {isEditImage && (
        <div className={style["edit-image-display"]}>
          {/* New Image Display */}
          <img
            className={style["edit-image-preview"]}
            src={newImage}
            alt="community banner profile"
            onError={originalImageOnError}
            onClick={toggleImagePicker}
          ></img>
          {/* Save Button */}
          <button
            className={`${style["button"]} ${style["button__bordered"]} ${style["button__filled"]}`}
            onClick={saveButtonHandler}
          >
            <span className={style["save-icon"]}></span>
            Save
          </button>
          {/* Cancel Button */}
          <button
            className={`${style["button"]} ${style["button__bordered"]} ${style["button__filled"]}`}
            onClick={cancelButtonHandler}
          >
            <span className={style["cancel-icon"]}></span>
            Cancel
          </button>
        </div>
      )}

      {/* Edit Button */}
      {props.showEditButton && !isEditImage && (
        <button
          className={`${style["button"]} ${style["button__bordered"]} ${style["button__filled"]}`}
          onClick={editButtonHandler}
        >
          <span className={style["edit-icon"]}></span>
          Edit
        </button>
      )}
    </div>
  );
}

EditableImage.propTypes = {
  updateImageHandler: PropTypes.func.isRequired,
  showEditButton: PropTypes.bool.isRequired
}