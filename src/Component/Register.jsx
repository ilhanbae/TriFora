import React from 'react';
import "../RegisterForm.css";



export default class RegisterForm extends React.Component {
    render() {
        return (
            <div className='wrapper'>
                <div className='inner'>
                    <button className='base base-back'>&#8592;</button>
                    {/*<p>Back to Login</p>*/}
                    <form>
                        <h3 className='h3-inner'>Create an Account</h3>

                        <label className='input' htmlFor="photo-upload">Upload a photo:</label>
                        <input type="file" id="photo-upload" name="photo" className='input-stuff'/>

                        <label className='input'>
                            <input type="text" placeholder="Username" className='input-stuff'/>
                        </label>
                        <label className='input'>
                            <input type="text" placeholder='Password' className='input-stuff'/>
                        </label>
                        <label className='input'>
                            <input type="text" placeholder='Confirm Password' className='input-stuff'/>
                        </label>
                        <label className='input'>
                            <input type="text" placeholder='Phone Number' className='input-stuff'/>
                        </label>
                        <label className='input'>
                            <input type="text" placeholder='Email' className='input-stuff'/>
                        </label>
                    </form>
                    <button className='base base-submit'>Submit</button>
                </div>
            </div>
        )
    }
}