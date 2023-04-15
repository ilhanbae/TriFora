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
          redirect: false,
        };
        this.refreshPostsFromLogin = this.refreshPostsFromLogin.bind(this);
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
        });
      };

    passwordHandler = event => {
        this.setState({
          password: event.target.value
        });
      };

    confirm_passwordHandler = event => {
        this.setState({
          confirm_password: event.target.value
        });
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
      };

    upload_img = event => {
      console.log(URL.createObjectURL(event.target.files[0]))
      this.setState({
        image: URL.createObjectURL(event.target.files[0])
      });
    }

    submitHandler = event => {
        // Check if the password match with the confirm_password
        if (this.state.password !== this.state.confirm_password){
          alert("Password does not match with Confirm_password!");

        // Check if the username length is correct
        } else if (this.state.username.length < 3 || this.state.username.length > 20){
          alert("Username must between 3 to 20 characters!");
        
        // Check if the password length is correct
        } else if (this.state.password.length < 6 || this.state.password.length > 20){
          alert("Password must between 6 to 20 characters!");

        // Check if the phone number length is correct
        //} else if (this.state.phone.length === 0){
        //  alert("Phone number can't be empty!");

        // Check if the phone number contains any letters
        //} else if (/[a-zA-Z]/g.test(this.state.phone) === true){
        //  alert("Phone number can only contains digits!")

        // Check if the email length is correct
        } else if (this.state.email.length === 0){
          alert("Email can't be empty!");
        
        // Check if the email contains @
        } else if (this.state.email.includes("@") === false){
          alert("Email must be incorrect format!");

        } else {
          //keep the form from actually submitting
          event.preventDefault();
          //make the api call to the authentication page
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
                  profileImage: "",
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
                // set the auth token and user ID in the session state
                sessionStorage.setItem("token", result.token);
                sessionStorage.setItem("user", result.userID);
                console.log(sessionStorage);
                
                this.setState({
                  sessiontoken: result.token,
                  alanmessage: result.token
                });

                // call refresh on the posting list
                this.refreshPostsFromLogin();
    
              } else {
                // if the login failed, remove any infomation from the session state
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
                this.setState({
                  sessiontoken: "",
                  alanmessage: result.message
                });
              }
            },
          error => {
              alert("error!");
            }
          );
        };

      }


    render() {
        return (
            <div className='wrapper'>
                <div className='inner'>
                  <Link to='/login'>
                    <button className='base base-back'>
                      <b className='login-link'>&#8592; Go to Login</b>
                    </button>
                  </Link>
                    {/*<p>Back to Login</p>*/}
                    <form>
                        <h3 className='h3-inner'>Create an Account</h3>
                        
                        {/*
                        <label className='pfp'>
                            <input type='file' className='display' onChange={this.upload_img}/>
                            <img alt="" className='profile_image' src={this.state.image} />
                        </label>
                        */}

                        <label className='input'>
                            <input type="text" placeholder='Email' className='input-stuff' onChange={this.emailHandler}/>
                        </label>
                        <label className='input'>
                            <input type="text" placeholder='Password' className='input-stuff password' onChange={this.passwordHandler}/>
                        </label>
                        <label className='input'>
                            <input type="text" placeholder='Confirm Password' className='input-stuff password' onChange={this.confirm_passwordHandler}/>
                        </label>
                        <label className='input'>
                            <input type="text" placeholder="Username" className='input-stuff' onChange={this.usernameHandler}/>
                        </label>
                        {/* <label className='input'>
                            <input type="text" placeholder='Phone Number' className='input-stuff' onChange={this.phoneHandler}/>
                        </label> */}
                        <label className='input'>
                            <button className='base base-submit' onClick={this.submitHandler}>Register</button>
                        </label>

                    </form>
                </div>
            </div>
        )
    }
}
