import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import style from "../style/Toast.module.css";

export default function Toast(props) {
  const [progress, setProgress] = useState(0);


  /* This hook controls the toast's lifecycle. By default, the toast will automatically disappear after 5 seconds.
  You can pass in duration (in milliseconds) to change the toast's lifecycle, and you can also manually close the 
  toast by clicking on x icon */
  useEffect(() => {
    const timer = setTimeout(() => {
      props.closeToast(props.id);
    }, props.duration ? props.duration : 5000)
    return () => clearTimeout(timer);
  },[])

  return (
    <div className={`${style["toast"]} ${style[props.type]}`} id="myToast">
      {/* Toast Header */}
      <div className={style["toast-header"]}>
        {/* Toast Title */}
        <span className={style["toast-title"]}>{props.type}</span>
        {/* Close Button */}
        <span className={style["close"]} onClick={() => props.closeToast(props.id)}>&times;</span>
      </div>

      {/* Toast Content */}
      <div className={style["toast-content"]} id="modalcontent">
        {props.children}
      </div>
    </div>
  )
}

Toast.propTypes = {
  closeToast: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
}