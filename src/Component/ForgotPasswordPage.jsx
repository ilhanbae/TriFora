import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/ForgotPasswordPage.css";
import checkValidEmail from "../helper/checkValidEmail";

export default function ForgotPasswordPage(props) {
  const [isTokenRequestSuccess, setIsTokenRequestSuccess] = useState(false);
  const [isResetRequestSuccess, setIsResetRequestSuccess] = useState(false);

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

    console.log(response);
    // On success response, udpate token request state
    if (response.status == "200") {
      setIsTokenRequestSuccess(true);
    }
    else {
      alert('Try again');
    }
  };

  // Send password reset reqeuest
  const sendResetPasswordRequest = async (password, token) => {
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

    console.log(response.status);
    // On success response, udpate token request state
    if (response.status == "200") {
      setIsResetRequestSuccess(true); // update reset request state
    }
    else {
      alert('Try again');
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
    <div className="container">
      <Headline title="Forgot Password?" subtitle="No worries, we will send you instructions to your email"/>
      <TokenRequestForm sendResetTokenRequest={props.sendResetTokenRequest} />
      <BackToLogin />
    </div>
  );
}

/* This component contains the reset password view */
const ResetPasswordView = (props) => {
  return (
    <div className="container">
      <Headline title="Create new password" subtitle="Enter your new password and the reset token"/>
      <ResetPasswordForm sendResetPasswordRequest={props.sendResetPasswordRequest} />
      <BackToLogin />
    </div>
  );
}

/* Thie component contains the reset password success view */
const ResetPasswordSuccessView = (props) => {
  return (
    <div className="container">
      <Headline title="Password reset succssfully" subtitle="Log back to your account"/>
      <BackToLogin />
    </div>
  )
}

/* This component is the headline text for each view. It can render the headline using title
and subtitle*/
const Headline = (props) => {
  return (
    <div className="headline">
      <h1 className="active-text">{props.title}</h1>
      <h1 className="inactive-text">{props.subtitle}</h1>
    </div>
  );
};

/* This component allows user to navigate back to login page */
const BackToLogin = () => {
  return (
    <div>
      <Link to="/login">
        <span className="back-to-login-button">&#8592; Back to Login</span>
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
    e.preventDefault(); // prevent default form action
    const [isValid, errorMessage] = checkValidEmail(email) // check if email is valid
    // Check input errors
    if (!isValid) {
      alert(errorMessage)
    }
    else {
      // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // console.log(validator.isValidEmail(email));
      console.log(isValid);
      setEmail(""); // clear the input text
      props.sendResetTokenRequest(email); // call POST API from ForgotPasswordPage
    }

  };

  return (
    <form
      className="form"
      onSubmit={formSubmitHandler}
      autoComplete="off"
    >
      {/* Email Input Field*/}
      <label>
        <span className="active-text">Email:</span>
        <input
          className="data-input"
          type="text"
          value={email}
          onChange={emailInputHandler}
        />
      </label>
      {/* Send Instruction button */}
      <button className="send-instructions-button">Send Instructions</button>
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
  };

  // Update token state on input change
  const tokenInputHandler = (e) => {
    setToken(e.target.value);
  }

  // Handles form submission
  const formSubmitHandler = (e) => {
    e.preventDefault(); // prevent default form action
    // setEmail(""); // clear the input text
    props.sendResetPasswordRequest(password, token); // call POST API from ForgotPasswordPage
  };

  return (
    <form
      className="form"
      onSubmit={formSubmitHandler}
      autoComplete="off"
    >
      {/* Password Input Field*/}
      <label>
        <span className="active-text">New Password:</span>
        <input
          className="data-input"
          type="text"
          value={password}
          onChange={passwordInputHandler}
        />
      </label>
      {/* Password Input Field*/}
      <label>
        <span className="active-text">Reset Token:</span>
        <input
          className="data-input"
          type="text"
          value={token}
          onChange={tokenInputHandler}
        />
      </label>
      {/* Reset Button */}
      <button className="reset-password-button">Reset Password</button>
    </form>
  )
}