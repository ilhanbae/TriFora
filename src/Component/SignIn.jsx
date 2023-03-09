import React from 'react';
import "../style/SignIn.css";



export default class LoginForm extends React.Component {
    render() {
        return (
            <div className='wrapper'>
                <div className='inner'>

                    <button className='base base-back'>&#8592;</button>

                    <form className='form-class'>
                        <label className='input1'>
                            <input type="text" placeholder="Username: " className='input1-stuff'/>
                        </label>
                        <label className='input1'>
                            <input type="text" placeholder="Password: " className='input1-stuff'/>
                        </label>
                        <label className='input1'>
                            <p className='txt1'><a href="#"> Forgot Password? </a></p>
                            <p className='txt1'> New User? <a href="#"> Sign Up </a></p>
                        </label>
                        <label className='input1'>
                            <button className='base base-submit1 txt1' >Sign In</button>
                        </label>

                    </form>

                </div>
            </div>
        )
    }
}
