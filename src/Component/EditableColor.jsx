import PropTypes from "prop-types";
import React, { useState, useRef, useEffect } from "react";
import style from "../style/EditableColor.module.css";

export default function EditableColor(props) {
  const [originalColorDisplay, setOriginalColorDisplay] = useState(props.children); 
  const originalColor = originalColorDisplay.props.style.backgroundColor;
  const [newColor, setNewColor] = useState(originalColor);
  const [isEditColor, setIsEditColor] = useState(false);
  const colorPickerRef = useRef(null); // Ref for color input

  /* This hook toggles color input click */ 
  useEffect(() => {
    if (colorPickerRef.current) {
      toggleImagePicker();
    }
  }, [isEditColor]);

  /* This method updates new color */
  const colorInputChangeHandler = (event) => {
    setNewColor(event.target.value)
  }

  /* This method toggles color picker */
  const toggleImagePicker = () => {
    colorPickerRef.current.click();
  }

  /* This method updates edit color state. */
  const editButtonHandler = () => {
    setIsEditColor(true);
    // colorPickerRef.current.click();
  }

  /* This method updates edit color state. */
  const cancelButtonHandler = () => {
    setIsEditColor(false);
    setNewColor(originalColor);
  }

  /* This method calls parent's update color handler. */
  const saveButtonHandler = () => {
    // console.log(originalColorDisplay);
    if(newColor !== originalColor) {
      props.updateColorHandler(newColor);
      setOriginalColorDisplay(prevOriginalColorDisplay => ({
        ...prevOriginalColorDisplay,
        props: {
          ...prevOriginalColorDisplay.props,
          style: {
            ...prevOriginalColorDisplay.props.style,
            backgroundColor: newColor
          }
        }
      }))
    }

    setIsEditColor(false);
  }

  return (
    <div className={style["container"]}>
      {/* Original Color Display */}
      {!isEditColor && <div>{originalColorDisplay}</div>}

      {/* Edited Color Display*/}
      {isEditColor && (
        <div className={style["edit-color-display"]}>
          {/* Hidden Color Picker */}
          <input
            type="color"
            value={newColor}
            onChange={colorInputChangeHandler}
            style={{ visibility: "hidden", position: "absolute", top: "0", width: "100%", height: "100%"}}
            ref={colorPickerRef}
          />
          {/* New Color Display */}
          <div
            className={style["edit-color-preview"]}
            onClick={toggleImagePicker}
            style={{ backgroundColor: newColor }}
          ></div>
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
      {props.showEditButton && !isEditColor && (
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

EditableColor.propTypes = {
  updateColorHandler: PropTypes.func.isRequired,
  showEditButton: PropTypes.bool.isRequired
}