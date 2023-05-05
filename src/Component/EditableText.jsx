import PropTypes from "prop-types";
import React, { useState, useRef, useEffect } from "react";
import style from "../style/EditableText.module.css";

/* This component renderes an editable text field */
export default function EditableText(props) {
  const [originalTextDisplay, setOriginalTextDisplay] = useState(props.children)
  const originalText = originalTextDisplay.props.children;
  const [newText, setNewText] = useState(originalText);
  const [isEditText, setIsEditText] = useState(false);
  const isTextTypeTextArea = props.children.type === "textarea";
  const textAreaRef = useRef(null); // Ref for textarea input

  /* This hook toggles text area input focus */ 
  useEffect(() => {
    if (textAreaRef.current) {
      toggleTextArea();
    }
  }, [isEditText]);

  /* This method updates new text input. */
  const newTextInputHandler = (event) => {
    setNewText(event.target.value);
  }

  /* This method updates edit text state. */
  const editButtonHandler = () => {
    setIsEditText(true);
  }

  /* This method toggles text area input */
  const toggleTextArea = () => {
    textAreaRef.current.focus();
  }

  /* This method updates edit text state. */
  const cancelButtonHandler = () => {
    setIsEditText(false);
    setNewText(originalText);
  }

  /* This method calls parent's update text handler. */
  const saveButtonHandler = () => {
    // console.log(newText, originalText);
    if(newText !== originalText) {
      props.updateTextHandler(newText);
      setOriginalTextDisplay(prevOriginalTextDisplay => ({
        ...prevOriginalTextDisplay,
        props: {
          ...prevOriginalTextDisplay.props,
          children: newText
        }
      }))
    } 
    setIsEditText(false);
  }

  return (
    <div className={style["container"]}>
      {/* Original Text Display */}
      {!isEditText && <div>{originalTextDisplay}</div>}

      {/* Edited Text Display */}
      {isEditText && (
        <div className={style["edit-text-display"]}>
          {/* New Text Display (Textarea Type) */}
          {isTextTypeTextArea && (
            <textarea
              className={style["editable-textarea-text"]}
              value={newText}
              onChange={newTextInputHandler}
              ref={textAreaRef}
            ></textarea>
          )}
          {/* New Text Display (Input Type) */}
          {!isTextTypeTextArea && (
            <input
              className={style["editable-input-text"]}
              value={newText}
              onChange={newTextInputHandler}
              ref={textAreaRef}
            ></input>
          )}
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
      {props.showEditButton && !isEditText && (
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

EditableText.propTypes = {
  updateTextHandler: PropTypes.func.isRequired,
  showEditButton: PropTypes.bool.isRequired
}