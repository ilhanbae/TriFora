import {useState, useEffect} from "react";
import React, { useRef } from 'react';

import { Link } from "react-router-dom";
// import "../style/ForgotPasswordPage.module.css";
import validateEmail from "../helper/validateEmail";
import style from "../style/ForgotPasswordPage.module.css";

export default function ForgotPasswordPage(props) {
  const [isTokenRequestSuccess, setIsTokenRequestSuccess] = useState(false);
  const [isResetRequestSuccess, setIsResetRequestSuccess] = useState(false);

  useEffect(() => {
    document.title = "Forgot Password Page";
  }, []);

  // Send password reset token request
  const sendResetTokenRequest = async (email) => {
    // Set Base API Variables
    const method = "POST";
    const baseUrl = `${process.env.REACT_APP_API_PATH}`;
    const endpoint = "/auth/request-reset";
    const requestUrl = `${baseUrl}${endpoint}`; // Full request url
    const headers = {
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({ email: email });

    // Perform POST Request
    const response = await fetch(requestUrl, { method, headers, body });

    // On success response, udpate token request state
    if (response.status == "200") {
      setIsTokenRequestSuccess(true);
    }
  };

  // Send password reset reqeuest
  const sendResetPasswordRequest = async (password, token, event) => {
    console.log("inside")

    // Set Base API Variables
    const method = "POST";
    const baseUrl = `${process.env.REACT_APP_API_PATH}`;
    const endpoint = "/auth/reset-password";
    const requestUrl = `${baseUrl}${endpoint}`; // Full request url
    const headers = {
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({ password: password, token: token });

    // Perform POST request
    const response = await fetch(requestUrl, { method, headers, body });

    // On success response, udpate token request state
    if (response.status == "200") {
      setIsResetRequestSuccess(true); // update reset request state
    } else {
      const tokenInput = document.getElementById('token')
      tokenInput.setCustomValidity("token is incorrect")
      tokenInput.reportValidity();
      event.preventDefault();
    }
  }

  return (
    <div>
      {!isTokenRequestSuccess && <TokenRequestView sendResetTokenRequest={sendResetTokenRequest}/> }
      {isTokenRequestSuccess && !isResetRequestSuccess && <ResetPasswordView sendResetPasswordRequest={sendResetPasswordRequest}/> }
      {isResetRequestSuccess && <ResetPasswordSuccessView />}
    </div>
  );
}

/* This component contiains the token reset view */
const TokenRequestView = (props) => {
  return (
    <div className={style['container']}>
      <Headline title="Forgot Password?" subtitle="No worries, we will send you instructions to your email"/>
      <TokenRequestForm sendResetTokenRequest={props.sendResetTokenRequest} />
      <BackToLogin />
    </div>
  );
}

/* This component contains the reset password view */
const ResetPasswordView = (props) => {
  return (
    <div className={style['container']}>
      <Headline title="Create new password" subtitle="Enter your new password and the reset token"/>
      <ResetPasswordForm sendResetPasswordRequest={props.sendResetPasswordRequest} />
      <BackToLogin />
    </div>
  );
}

/* Thie component contains the reset password success view */
const ResetPasswordSuccessView = (props) => {
  return (
    <div className={style['container']}>
      <Headline title="Password reset successfully" subtitle="Log back to your account"/>
      <BackToLogin />
    </div>
  )
}

/* This component is the headline text for each view. It can render the headline using title
and subtitle*/
const Headline = (props) => {
  return (
    <div className={style['headline']}>
      <h1 className={style['active-text']}>{props.title}</h1>
      <h1 className={style['inactive-text']}>{props.subtitle}</h1>
    </div>
  );
};

/* This component allows user to navigate back to login page */
const BackToLogin = () => {
  return (
    <div>
      <Link to="/login">
        <span className={style['back-to-login-button']}>&#8592; Back to Login</span>
      </Link>
    </div>
  )
}

/* This component contains the Reset Token Request Form where user can type in their email address 
and request password request token by clicking on reset button */
const TokenRequestForm = (props) => {
  const [email, setEmail] = useState("");

  // Update email state on input change
  const emailInputHandler = (e) => {
    setEmail(e.target.value);
  };

  // Handles form submission
  const formSubmitHandler = (e) => {
    const [isValid, errorMessage] = validateEmail(email) // check if email is valid
    // Check input errors
    e.preventDefault()

    if (!isValid) {
      const emailInput = document.getElementById('email')
      emailInput.setCustomValidity(errorMessage);
      emailInput.reportValidity();
      e.preventDefault();
    }
    else {
      setEmail(""); // clear the input text
      props.sendResetTokenRequest(email); // call POST API from ForgotPasswordPage
      e.target.submit();
    }

  };

  return (
      <form
          className={style['form']}
          autoComplete="off"
      >
        {/* Email Input Field*/}
        <label>
          <span className={style['active-text']}>Email:</span>
          <input
              className={style['data-input']}
              type="text"
              id="email"
              value={email}
              onChange={emailInputHandler}
          />
        </label>
        {/* Send Instruction button */}
        <button
            className={style['send-instructions-button']}
            onClick={formSubmitHandler}>
          Send Instructions</button>
      </form>
  );
};


/* This component contains the Reset Password Form where user can type in their email address and
the reset token from their email. The user can also navigate back to login page by clicking on Back to Login */
const ResetPasswordForm = (props) => {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  // Update email state on input change
  const passwordInputHandler = (e) => {
    setPassword(e.target.value);
    // console.log(e.target.value)
  };

  // Update token state on input change
  const tokenInputHandler = (e) => {
    setToken(e.target.value);
  }

  // Handles form submission
  const formSubmitHandler = (e) => {
    e.preventDefault(); // prevent default form action
    // setEmail(""); // clear the input text
    const passLength = document.getElementById('password')
    console.log("submitting now")
    console.log(password.length)
    if (password.length < 6 || password.length > 20) {
      const passLength = document.getElementById('password')
      console.log(passLength.value)
      passLength.setCustomValidity("Password must be between 6 to 20 characters");
      passLength.reportValidity();
      e.preventDefault();
    } else {
      console.log("here")
      props.sendResetPasswordRequest(password, token); // call POST API from ForgotPasswordPage
    }
  };

  return (
      <form
          className={style['form']}
          autoComplete="off"
      >
        {/* Password Input Field*/}
        <label>
          <span className={style['active-text']}>New Password:</span>
          <input
              className={style['data-input'] + ' ' + style['password']}
              type="password"
              id='password'
              value={password}
              onChange={passwordInputHandler}
          />
        </label>
        {/* Password Input Field*/}
        <label>
          <span className={style['active-text']}>Reset Token:</span>
          <input
              className={style['data-input']}
              type="text"
              id='token'
              value={token}
              onChange={tokenInputHandler}
          />
        </label>
        {/* Reset Button */}
        <button className={style['reset-password-button']}
          onClick={formSubmitHandler}
        >Reset Password</button>
      </form>
  )
}