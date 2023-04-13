import PropTypes from "prop-types";
import React, { useState, useRef } from "react";
import style from "../style/EditableColor.module.css";

export default function EditableColor(props) {
  const [originalColorDisplay, setOriginalColorDisplay] = useState(props.children); 
  const originalColor = originalColorDisplay.props.style.backgroundColor;
  const [newColor, setNewColor] = useState(originalColor);
  const [isEditColor, setIsEditColor] = useState(false);
  
  const colorPickerRef = useRef(null); // Ref for color input

  /* This method updates new color */
  const colorInputChangeHandler = (event) => {
    setNewColor(event.target.value)
  }

  /* This method toggles color picker */
  const toggleImagePicker = () => {
    colorPickerRef.current.click();
  }

  /* This method updates edit text state. */
  const editButtonHandler = () => {
    setIsEditColor(true);
    // colorPickerRef.current.click();
  }

  /* This method updates edit text state. */
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
      {/* Hidden Color Picker */}
      <input 
          type="color"
          value={newColor}
          onChange={colorInputChangeHandler}
          ref={colorPickerRef}
          style={{ visibility: "hidden"}}
      />

      {/* Original Color Display */}
      {!isEditColor && <div>{originalColorDisplay}</div>}

      {/* Edited Color Display*/}
      {isEditColor && (
        <div className={style["edit-color-display"]}>
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
  )
}

EditableColor.propTypes = {
  updateColorHandler: PropTypes.func.isRequired,
  showEditButton: PropTypes.bool.isRequired
}