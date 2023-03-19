import React from 'react';
import "../style/SignIn.css";
import {
    Link, useNavigate
} from 'react-router-dom';

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            sessiontoken: "",
        }
        this.refreshPostsFromLogin = this.refreshPostsFromLogin.bind(this);
    }

    refreshPostsFromLogin() {
        console.log("CALLING LOGIN IN LOGINFORM");
        this.props.login();
    }

    EmailHandler = event => {
        this.setState({
            email: event.target.value
        });
    };

    PasswordHandler = event => {
        this.setState({
            password: event.target.value
        });
    };

    // when the user hits submit, process the login through the API
    submitHandler = event => {
        //keep the form from actually submitting
        event.preventDefault();

        if (this.state.email.length === 0) {
            alert("Username can not be empty");
        } else if (this.state.password.length < 5 || this.state.password.length > 20) {
            alert("Password must be between 5 and 20 characters")
        } else {

            //make the api call to the authentication page
            fetch(process.env.REACT_APP_API_PATH + "/auth/login", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                })
            })
                .then(res => res.json())
                .then(
                    result => {
                        console.log("Testing");
                        console.log(result);

                        if (result.userID) {
                            // if the login works, set the auth token and user ID in the session state
                            sessionStorage.setItem("token", result.token);
                            sessionStorage.setItem("user", result.userID);

                            this.setState({
                                sessiontoken: result.token,
                            });
                            // call refresh on the posting list
                            this.refreshPostsFromLogin();
                            console.log(this.state.sessiontoken)
                            console.log("Login Successful!")

                        } else {
                            // if the login failed, remove any infomation from the session state
                            sessionStorage.removeItem("token");
                            sessionStorage.removeItem("user");
                            this.setState({
                                sessiontoken: "",
                            });
                            console.log("Login Failed!")
                        }
                    },
                    error => {
                        alert("error!");
                    }
                );
        }
    }

    render() {
        return (
            <div className='wrapper1 background'>
                <div className='inner1'>
                    <form className='form-class'>
                        {/* <Link to='/register'>
                            <label>
                                <button className='base base-back'>&#8592;</button>
                            </label>
                        </Link> */}

                        <label className='input1'>
                            <input type="text" placeholder="Email: " className='input1-stuff' onChange={this.EmailHandler} />
                        </label>
                        <label className='input1'>
                            <input type="password" placeholder="Password: " className='input1-stuff' onChange={this.PasswordHandler} />
                        </label>
                        <label className='input1'>
                        </label>

                        <Link to="/profile" onClick={this.submitHandler}>
                            <label className='input1'>
                                <button className='base base-submit1 txt1'>Sign In</button>
                            </label>
                        </Link>

                    </form>
                    <Link to="/forgot-password">
                        <p className='txt1'> Forgot Password? </p>
                    </Link>
                    <Link to='/register'>
                        <p className='txt1'> New User? Sign Up </p>
                    </Link>

                </div>
            </div>
        )
    }
}
