import React from 'react';
import "../style/SignIn.css";

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            sessiontoken: ""
        }
    }

    UsernameHandler = event => {
        this.setState({
          username: event.target.value
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

        //make the api call to the authentication page
        fetch(process.env.REACT_APP_API_PATH+"/auth/login", {
            method: "post",
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            email: this.state.username,
            password: this.state.password
            })
        })
            .then(res => res.json())
            .then(data => {console.log(data);})
            .then(
            result => {
                console.log("Testing");
                console.log(result);

                if (result.userID) {
                // set the auth token and user ID in the session state
                sessionStorage.setItem("token", result.token);
                sessionStorage.setItem("user", result.userID);
    
                this.setState({
                    sessiontoken: result.token,
                });
    
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

    render() {
        return (
            <div className='wrapper'>
                <div className='inner'>

                    <button className='base base-back'>&#8592;</button>

                    <form className='form-class'>
                        <label className='input1'>
                            <input type="text" placeholder="Username: " className='input1-stuff' onChange={this.UsernameHandler}/>
                        </label>
                        <label className='input1'>
                            <input type="text" placeholder="Password: " className='input1-stuff' onChange={this.PasswordHandler}/>
                        </label>
                        <label className='input1'>
                            <p className='txt1'><a href="#"> Forgot Password? </a></p>
                            <p className='txt1'> New User? <a href="#"> Sign Up </a></p>
                        </label>
                        <label className='input1'>
                            <button className='base base-submit1 txt1' onClick={this.submitHandler}>Sign In</button>
                        </label>

                    </form>

                </div>
            </div>
        )
    }
}
