import React from "react";
import ProfilePageCSS from "../style/ProfilePage.module.css";
import { Link, useParams } from 'react-router-dom';


/* The JoinedCommunity is going to load all the communities related to the current user on profile page.*/

export default class JoinedCommunity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    switch_community(){
        this.props.closePostPageModal();
        this.props.closeProfilePage();
        this.props.redirect_community();
    }

    render() {
        return(
            <div className = {ProfilePageCSS.community}>
                <Link to={`/community/${this.props.community_id}`} onClick={() => this.switch_community()}>
                    <div className = {ProfilePageCSS.community_title}>
                        <h4> {this.props.community_name} </h4>
                    </div>
                </Link>
                <Link className={ProfilePageCSS.community_link} to={`/community/${this.props.community_id}`} onClick={() => this.switch_community()}>
                    <img className = {ProfilePageCSS.community_image} src={this.props.community_banner_image} alt="redirect-to-community"></img>
                </Link>
            </div>
        );
    }

}