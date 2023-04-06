import React from "react";
import PropTypes from "prop-types";
import ReactDom from "react-dom";
import ModalCSS from "../style/Modal.module.css";

// This component is an example of a modal dialog.  The content can be swapped out for different uses, and
// should be passed in from the parent class.
export default class Modal extends React.Component {
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    console.log("Modal Show is " + this.props.show);
    if (!this.props.show) {
      return null;
    }
    return ReactDom.createPortal(
      <div id="myModal" className= {ModalCSS["modal"]}>
        <div className= {ModalCSS["modal-content"]}>
          <span className= {ModalCSS["close"]} onClick={this.onClose}>
            &times;
          </span>
          <div id="modalcontent">{this.props.children}</div>
        </div>
      </div>,
      document.getElementById('portal')
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};
