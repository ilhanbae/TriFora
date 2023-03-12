import React from 'react';
import "../style/RegisterForm.css";



export default class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username: "",
          password: "",
          confirm_password: "",
          phone: "",
          email: "",
          sessiontoken: ""
        };
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

    submitHandler = event => {
        //keep the form from actually submitting
        event.preventDefault();
    
        //make the api call to the authentication page
        fetch(process.env.REACT_APP_API_PATH+"/auth/signup", {
          method: "post",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.state.username,
            password: this.state.password,
            confirm_password: this.state.confirm_password,
            phone: this.state.phone,
            email: this.state.email,
          })
        })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            },
        error => {
            alert("error!");
          }
        );
      };

    render() {
        return (
            <div className='wrapper'>
                <div className='inner'>
                    <button className='base base-back'>&#8592;</button>
                    {/*<p>Back to Login</p>*/}
                    <form>
                        <h3 className='h3-inner'>Create an Account</h3>
                        <label className='pfp'>
                            <input type='file' className='display'/>
                        </label>
                        <label className='input'>
                            <input type="text" placeholder="Username" className='input-stuff' onChange={this.usernameHandler}/>
                        </label>
                        <label className='input'>
                            <input type="text" placeholder='Password' className='input-stuff' onChange={this.passwordHandler}/>
                        </label>
                        <label className='input'>
                            <input type="text" placeholder='Confirm Password' className='input-stuff' onChange={this.confirm_passwordHandler}/>
                        </label>
                        <label className='input'>
                            <input type="text" placeholder='Phone Number' className='input-stuff' onChange={this.phoneHandler}/>
                        </label>
                        <label className='input'>
                            <input type="text" placeholder='Email' className='input-stuff' onChange={this.emailHandler}/>
                        </label>
                        <label className='input'>
                            <button className='base base-submit' onClick={this.submitHandler}>Register</button>
                        </label>
                    </form>
                </div>
            </div>
        )
    }
}
