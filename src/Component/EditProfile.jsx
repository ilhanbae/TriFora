import React from "react";
import "../style/EditProfile.css";
import harold from "../assets/harold.jpg";
import yellowbox from "../assets/yellowbox.jpg";
import blackbox from "../assets/blackbox.png";

class EditProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          imgdata: true
        };
      }

    setimg = i => {
        console.log(i.target.files);
        console.log(i.target.files[0]);
        
        this.setState({
            imgdata: URL.createObjectURL(i.target.files[0])
        }) 
    }

    render(){

        return(
            
            <form>

                <label classname = "textbox">
                   <input type="text" placeholder="Username" className="user"/>
                </label>

                <label classname = "textbox">
                   <input type="text" placeholder="First" className="first" />
                </label>

                <label classname = "textbox">
                   <input type="text" placeholder="Last" className="last" />
                </label>

                <label classname = "textbox">
                   <input type="text" placeholder="Bio" className="bio" />
                </label>


                <div>
                <input type='file' id='file-upload' className='upload' onChange={this.setimg} />
                </div> 

                <button className="save">Save</button>

                <button className="cancel">Cancel</button>

                {/* <button className="remove">Remove Account</button> */}

                <input className = 'pfp' type='image' src={this.state.imgdata} alt='default image'/>

                {/* <div className="choose">
                <h1>Choose Displayed Communities</h1>
                </div>

                <input className = 'choosebox' type='image' src={yellowbox} alt='filler'/>

                <input className = 'b1' type='image' src={blackbox} alt='filler'/>

                <input className = 'b2' type='image' src={blackbox} alt='filler'/>

                <input className = 'b3' type='image' src={blackbox} alt='filler'/>

                <input className = 'b4' type='image' src={blackbox} alt='filler'/>

                <div className="c1">
                    <h1>Class of 2023</h1>
                </div>

                <div className="c2">
                    <h1>DCEU</h1>
                </div>

                <div className="c3">
                    <h1>Marvel CU</h1>
                </div>

                <div className="c4">
                    <h1>CW</h1>
                </div>

                <div className="checkbox1"> 
                    <input type="checkbox" /> 
                </div>

                <div className="checkbox2"> 
                    <input type="checkbox" /> 
                </div>

                <div className="checkbox3"> 
                    <input type="checkbox" /> 
                </div>

                <div className="checkbox4"> 
                    <input type="checkbox" /> 
                </div> */}

                </form>

        )
    }
}

export default EditProfile;
