import React from "react";
import style from "../style/Modal.module.css";
import PropTypes from "prop-types";

/* This component is an example of a modal dialog.  The content can be swapped out for different uses, and should be passed in from the parent class. */
export default function Modal(props) {
  if (!props.show) {
    return null;
  }
  return (
    <div className={style["modal"]} id="myModal">
      <div className={style["modal-box"]} style={props.modalStyle}>
        {/* Modal Header */}
        <div className={style["modal-header"]}>
          {/* Modal Title */}
          <h1>{props.modalTitle}</h1>
          {/* Close Button */}
          <span className={style["close"]} onClick={props.onClose}>
            &times;
          </span>
        </div>

        {/* Modal Content */}
        <div className={style["modal-content"]} id="modalcontent">
          {props.children}
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  modalTitle: PropTypes.string,
  modalStyle: PropTypes.object,
};
