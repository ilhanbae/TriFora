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
          image: "",
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

    upload_img = event => {
      this.setState({
        image: URL.createObjectURL(event.target.files[0])
      });
    }

    submitHandler = event => {
        // Check if the password match with the confirm_password
        if (this.state.password !== this.state.confirm_password){
          alert("Password does not mathch with Confirm_password!");
        
        // Check if the password length is correct
        } else if (this.state.password.length < 6 || this.state.password.length > 20){
          alert("Password must between 6 to 20 characters");

        // Check if the username length is correct
        } else if (this.state.username.length < 3 || this.state.username.length > 20){
          alert("Username must between 3 to 20 characters");

        // Check if the email length is correct
        } else if (this.state.email.length == 0){
          alert("email can't be empty")

        } else if (this.state.phone.length == 0){
          alert("phone can't be empty")

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
                username: this.state.username,
                phone: this.state.phone,
              }
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

      }


    render() {
        return (
            <div className='wrapper'>
                <div className='inner'>
                    <button className='base base-back'>&#8592;</button>
                    {/*<p>Back to Login</p>*/}
                    <form>
                        <h3 className='h3-inner'>Create an Account</h3>
                        <label className='pfp'>
                            <img src={this.state.image} />
                            <input type='file' className='display' onChange={this.upload_img}/>
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