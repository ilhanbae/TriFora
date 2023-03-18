import React from "react";
import "../style/EditProfile.css";
import harold from "../assets/harold.jpg";
import yellowbox from "../assets/yellowbox.jpg";
import blackbox from "../assets/blackbox.png";

class EditProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          edit_username: "",
          edit_firstname: "",
          edit_lastname: "",
          edit_bio: "",
          edit_img: "",
        };
      }

    get_user_data(){
        console.log("In profile");
        console.log(sessionStorage)
        // fetch the user data, and extract out the attributes to load and display
        fetch(process.env.REACT_APP_API_PATH + "/users/" + sessionStorage.getItem('user'), {
          method: "get",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        })
          .then(res => res.json())
          .then(
            result => {
              if (result) {
                console.log(result);
                if (result.attributes){
                this.setState({
                  // IMPORTANT!  You need to guard against any of these values being null.  If they are, it will
                  // try and make the form component uncontrolled, which plays havoc with react
                  edit_username: result.attributes.username || "",
                  edit_firstname: result.attributes.firstName || "",
                  edit_lastname: result.attributes.lastName || "",
                  edit_bio: result.attributes.description || "",
                  edit_img: result.attributes.profileImage || "",
                });
              }
              }
            },
            error => {
              alert("error!");
            }
          );
    }

    componentDidMount() {
        this.get_user_data();
    }

    setimg = event => {
        console.log(event.target.files);
        console.log(event.target.files[0]);
        
        this.setState({
            edit_img: URL.createObjectURL(event.target.files[0])
        }) 
    }

    usernameHandler = event => {
        this.setState({
            edit_username: event.target.value
        });
    }

    firstNameHandler = event => {
        this.setState({
            edit_firstname: event.target.value
        });
    }

    lastNameHandler = event => {
        this.setState({
            edit_lastname: event.target.value
        });
    }

    bioHandler = event => {
        this.setState({
            edit_bio: event.target.value
        });
    }
    
    submitHandler = event => {
        //keep the form from actually submitting
        event.preventDefault();

        //make the api call to the authentication page
        fetch(process.env.REACT_APP_API_PATH+ "users" + sessionStorage.getItem('user'), {
        method: "patch",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.username,
          password: this.state.password
        })
      })
        .then(res => res.json())
        .then(
          result => {
            console.log("Testing");
            if (result.userID) {
  
              // set the auth token and user ID in the session state
              sessionStorage.setItem("token", result.token);
              sessionStorage.setItem("user", result.userID);
  
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
    }

    render(){
        return(
            
            <form>
                <label classname = "textbox">
                   <input type="text" placeholder="Username" className="user" onChange={this.usernameHandler}/>
                </label>

                <label classname = "textbox">
                   <input type="text" placeholder="First" className="first" onChange={this.firstNameHandler}/>
                </label>

                <label classname = "textbox">
                   <input type="text" placeholder="Last" className="last" onChange={this.lastNameHandler}/>
                </label>

                <label classname = "textbox">
                   <input type="text" placeholder="Bio" className="bio" onChange={this.bioHandler}/>
                </label>

                <div>
                <input type='file' id='file-upload' className='upload' onChange={this.setimg} />
                </div> 

                <button className="save" onClick={this.submitHandler}>Save</button>

                <button className="cancel">Cancel</button>

                {/* <button className="remove">Remove Account</button> */}

                <input className = 'pfp' type='image' src={this.state.edit_img} alt='default image'/>

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
                </div>
                */}

            </form>

        )
    }
}

export default EditProfile;
