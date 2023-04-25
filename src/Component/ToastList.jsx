import React, { useState, useEffect, useCallback } from "react";
import Toast from "./Toast";
import PropTypes from "prop-types";
import style from "../style/ToastList.module.css";

export default function ToastList(props) {
  return (
    <div className={style["toast-list"]} id="myToastList">
      {props.toastList.map((toast) => (
        <Toast key={toast.id} id={toast.id} type={toast.type} duration={toast.duration} closeToast={props.closeToast}>
          {toast.message}
        </Toast>
      ))}
    </div>
  );
}
