import React from 'react';
import "../style/RegisterForm.css";
import { Link, useNavigate} from "react-router-dom";
import defaultProfileImage from "../assets/defaultProfileImage.png";

export default class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username: "",
          password: "",
          confirm_password: "",
          phone: "",
          email: "",
          sessiontoken: "",

          defaultProfileImage_path: "", 
        };
        this.refreshPostsFromLogin = this.refreshPostsFromLogin.bind(this);
    }

    componentDidMount(){
      this.get_defaultProfileImage_path()
    }

    get_defaultProfileImage_path(){
      // make an api call to get the default-image path
      fetch(process.env.REACT_APP_API_PATH+"/file-uploads/296", {
        method: "GET",
        headers: {
        },
      })
      .then(res => res.json())
      .then(result => {
        console.log(result)
        console.log(result.path)
        this.setState({
          defaultProfileImage_path: process.env.REACT_APP_DOMAIN_PATH + result.path, 
        })
      },
      error => {
        //alert("error!");
        console.log("error when upload user image!")
      }) 
    }

    // once a user has successfully logged in, we want to refresh the post
    // listing that is displayed.  To do that, we'll call the callback passed in
    // from the parent.
    refreshPostsFromLogin(){
      console.log("CALLING LOGIN IN LOGINFORM");
      this.props.login();
    }

    usernameHandler = event => {
        this.setState({
            username: event.target.value
        })
        // const usernameInput = event.target;
        // const username = usernameInput.value;
        // if (username.length < 3 || username.length > 20){
        //     event.target.setCustomValidity("Usernames can be 3 to 20 characters long")
        // } else {
        //     event.target.setCustomValidity("")
        // }
      };

    passwordHandler = event => {
        this.setState({
            password: event.target.value
        })
        // const passwordInput = event.target;
        // const password = passwordInput.value;
        // if (password.length < 6 || password.length > 20){
        //     event.target.setCustomValidity("Password must be between 6 to 20 characters")
        // } else {
        //     event.target.setCustomValidity("")
        // }
      };

    confirm_passwordHandler = event => {
        this.setState({
          confirm_password: event.target.value
        });
        // const password = document.getElementById("password1").value;
        // if (event.target.value !== password) {
        //     event.target.setCustomValidity("Passwords are not the same");
        // } else {
        //     event.target.setCustomValidity("");
        // }
    };


    phoneHandler = event => {
        this.setState({
          phone: event.target.value
        });
      };

    emailHandler = event => {
        this.setState({
            email: event.target.value
        });
        // const emailInput = event.target;
        // const email = emailInput.value;
        // if (email.length === 0){
        //     emailInput.setCustomValidity("Email Detected");
        //     emailInput.reportValidity();
        // } else if (email.includes("@") === false) {
        //     emailInput.setCustomValidity("Email is in an incorrect format");
        //     emailInput.reportValidity();
        // } else {
        //     emailInput.setCustomValidity("");
        //     emailInput.reportValidity();
        // }
        // this.setState({
        //     email: email
        // });
    };

    upload_img = event => {
      console.log(URL.createObjectURL(event.target.files[0]))
      this.setState({
        image: URL.createObjectURL(event.target.files[0])
      });
    }

    submitHandler = event => {
        if (this.state.email.length === 0) {
            const emailInput = document.getElementById('email')
            emailInput.setCustomValidity("No Input Detected");
            emailInput.reportValidity()
            event.preventDefault();
        } else if (this.state.email.includes("@") === false || this.state.email.includes(".com") === false){
            const emailInputted = document.getElementById('email')
            emailInputted.setCustomValidity("Incorrect format");
            emailInputted.reportValidity()
            event.preventDefault();
        } else if (this.state.password.length < 5 || this.state.password.length > 20){
            const passwordLength = document.getElementById('password1')
            passwordLength.setCustomValidity("Password should be between 6 to 20 characters");
            passwordLength.reportValidity()
            event.preventDefault();
        } else if (this.state.password !== this.state.confirm_password) {
            const passwordInput = document.getElementById('password2')
            passwordInput.setCustomValidity("Your passwords do not match.");
            passwordInput.reportValidity()
            event.preventDefault();
        } else if (this.state.username.length < 3 || this.state.username.length > 20){
            const usernameInput = document.getElementById('username')
            usernameInput.setCustomValidity("Username should be between 3 to 20 characters");
            usernameInput.reportValidity()
            event.preventDefault();

        } else {
          //keep the form from actually submitting
          event.preventDefault();
          //make the api call to signup a user
          fetch(process.env.REACT_APP_API_PATH+"/auth/signup", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: this.state.email,
              password: this.state.password,
              attributes: {
                profile: {
                  username: this.state.username,
                  firstName: "",
                  lastName: "",
                  description: "",
                  profileImage: this.state.defaultProfileImage_path,
                  phone: ""
                },
              },
            })
          })
          .then(res => res.json())
          .then(result => {
            console.log(result);
            console.log("Sign up Successful!")
            if (result.userID) {
              this.setState({
                sessiontoken: result.token,
              });
              window.location.href = "/hci/teams/underachievers/login";
            } else {
              this.setState({
                sessiontoken: "",
              });
            }
          },
          error => {
              //alert("error!");
              console.log("error when sign up!")
            }
          );
        }
      }


    render() {
        return (
            <div className='wrapper'>
                  <Link to='/login'>
                    <button className='base register-base-back'>
                      <b className='login-link'>&#8592; Go to Login</b>
                    </button>
                  </Link>
                    {/*<p>Back to Login</p>*/}
                    <form className='signup-form'>
                        <h3 className='h3-inner'>Create an Account</h3>
                        
                        {/*
                        <label className='pfp'>
                            <input type='file' className='display' onChange={this.upload_img}/>
                            <img alt="" className='profile_image' src={this.state.image} />
                        </label>
                        */}

                        <label className='input'>
                            <input id='email' type="text" placeholder='Email' className='input-stuff'
                                   onChange={this.emailHandler} required/>
                        </label>
                        <label className='input'>
                            <input id='password1' type="password" placeholder='Password' className='input-stuff password'
                                   onChange={this.passwordHandler} required/>
                        </label>
                        <label className='input'>
                            <input id='password2' type="password" placeholder='Confirm Password' className='input-stuff password'
                                   onChange={this.confirm_passwordHandler} required/>
                        </label>
                        <label className='input'>
                            <input id='username' type="text" placeholder="Username" className='input-stuff'
                                   onChange={this.usernameHandler} required/>
                        </label>
                        <label className='input'>
                            <button className='base base-submit' onClick={this.submitHandler}>Register</button>
                        </label>
                    </form>
            </div>
        )
    }
}

