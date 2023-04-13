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

    render() {
        return(
            <div className = {ProfilePageCSS.community}>
                <Link to={`/community/${this.props.community_id}`}>
                    <div className = {ProfilePageCSS.community_image}></div>
                </Link>
                <div className = {ProfilePageCSS.community_title}>
                    <h4> {this.props.community_name} </h4>
                </div>
            </div>
        );
    }

}