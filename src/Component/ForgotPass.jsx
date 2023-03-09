import React from 'react';
import "../style/ForgotPass.css";



export default class ForgotPass extends React.Component {
    render() {
        return (
            <div>
                <p className='forgottxt1 centered centered-down'> Forgot Password? </p>
                <p className='forgottxt2 centered'> No worries, we will send you instructions </p>
                <div className='wrapper'>
                    <div className='inner'>
                        {/*&#8592;*/}
                        <form className='form-class'>
                            <label className='input1'> Email
                                <input type="text" className='input1-stuff'/>
                            </label>
                            <label className='input1'>
                                <button className='base base-reset-button txt1' >Reset</button>
                            </label>
                            <label className='input1'>
                                <button className='no-btn txt1' >&#8592; Back to Login</button>
                            </label>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
