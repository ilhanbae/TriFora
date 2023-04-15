import React, { useState, useEffect } from "react";
import "../style/Homepage.css";
import group from "../assets/group.png";
import community from "../assets/defaultPostImage.png";
import { Link } from "react-router-dom";
import genericFetch from "../helper/genericFetch";

export default function Homepage() {
    const [username, setUsername] = useState();
    const [userCommunities, setUserCommunities] = useState();
    const [numUserCommunities, setNumUserCommunities] = useState();
    const [userLoaded, setUsernameLoaded] = useState(false);
    const [userCommunitiesLoaded, setUserCommunitiesLoaded] = useState(false);
    const [topCommunities, setTopCommunities] = useState();
    const [numCommunities, setNumCommunities] = useState();
    const [communitiesLoaded, setCommunitiesLoaded] = useState(false);
    const [displayPerRow, setDisplayPerRow] = useState(3); // this could be useful to maybe be able to change dynamically

    // Fetch both user info and communities when the component is loaded.
    useEffect(() => {
        grabUser(); // grab user info to display username
        grabUserCommunities(); // grab the communities the user is a part of for top row display
        grabCommunities(); // grab all communities for bottom row display
    }, []);

    // want to use generic fetch to get username and their communities
    const grabUser = async () => {
        let endpoint = `/users/${sessionStorage.getItem('user')}`
        let query = {}
        const { data, errorMessage } = await genericFetch(endpoint, query)

        if (errorMessage) {
            alert(errorMessage);
        } else {
            setUsername(data.attributes.profile.username); // store the username from fetch
            // grabUserCommunities(); // putting this here might not be ok to do
            setUsernameLoaded(true); // mark username loaded so it renders
        }
    };

    // want to use generic fetch to get username and their communities
    const grabUserCommunities = async () => {
        let endpoint = `/users/${sessionStorage.getItem('user')}`
        let query = {}
        const { data, errorMessage } = await genericFetch(endpoint, query)

        if (errorMessage) {
            alert(errorMessage);
        } else {
            setUserCommunities(data[0]); // store the communities that the user is a part of
            setNumUserCommunities(data[1]); // hold on to the number of communities they are a part of for quick referencing
            setUserCommunitiesLoaded(true); // mark their communities as loaded so it renders
        }
    };

    /* want to use generic fetch to get all communities
     * then maybe do some work to display non-joined communities
     */
    const grabCommunities = async () => {
        let endpoint = `/groups/`
        let query = {}
        const { data, errorMessage } = await genericFetch(endpoint, query)

        if (errorMessage) {
            alert(errorMessage);
        } else {
            setTopCommunities(data[0]); // store all communities
            setNumCommunities(data[1]); // holding the total number of communities might be helpful for referencing
            setCommunitiesLoaded(true); // mark all communities as loaded so bottom row can begin it's renders
            console.log(topCommunities)
        }
    };

    function DefaultImage(props) {
        // the purpose of this is to display a default community image
        return (
            <li className="homepage-communities-item">
                <img
                    src={group}
                    className="homepage-community-image"
                    alt={props.titleAlt}
                    title={props.titleAlt}
                /> {/* placeholder */}
            </li>
        )
    }

    function displayUserCommunities() {
        if (numUserCommunities === 0) {
            // user has joined no communities
            let defaultArray = [];
            for (let i = 0; i < displayPerRow; i++) {
                defaultArray[i] = <DefaultImage titleAlt={"No communities joined yet"} />;
            }
            return defaultArray;
        }
    }

    return (
        <div className="homepage-wrapper">
            {/* user details should be loaded for the welcome message */}
            <div className="homepage-welcome-message">
                <h1>
                    {/* userName should appear here from earlier fetch */}
                    Welcome{userLoaded ? ` ${username}!` : '!'}
                    <br />
                    Jump in to your community!
                </h1>
            </div>
            {/* The following list should be mapped from communities user is part of from earlier fetch.
                and possibly randomly displayed.
                Perhaps if not logged in can map all random communities?
                Need to consider if user is part of less than 3 communites. */}
            <ul className="homepage-communities-row">
                {communitiesLoaded ?
                    /* communities are loaded

                       want to do some work here to display communities user is a part of
                       need to consider what happens with the display if they are part of less than 3
                       would like them to be randomly chosen without duplicates if possible

                       userDetails.attributes.communitiesJoined.map
                     */
                    userCommunitiesLoaded ?
                        // user communities fetch call complete
                        // <>
                        //     <DefaultImage titleAlt={"loading user communities"} />
                        //     <DefaultImage />
                        //     <DefaultImage />
                        // </>
                        {displayUserCommunities}
                        :
                        // user communities fetch call incomplete
                        <>
                            <b> No user communities </b>
                            <DefaultImage titleAlt={"no user communities"} />
                            <DefaultImage />
                            <DefaultImage />
                        </>
                    :
                    /* communities is not loaded */
                    <>
                        <b> No communities loaded </b>
                        <DefaultImage />
                        <DefaultImage />
                        <DefaultImage />
                    </>
                }
            </ul>



            {/* The following list should be mapped from communities user is not part of from earlier fetch
                if possible, and possibly randomly displayed. */}
            <ul className="homepage-communities-row">
                {/* {(communitiesLoaded) (
                    want to do some work here to display communities user is not a part of
                    maybe should consider if feasible to exclude communities user is a part of
                    need to consider what happens with the display if less than 3 communities exist
                    would like them to be randomly chosen without duplicates if possible

                    topCommunities.map */}
                {communitiesLoaded ?
                    /* communities are loaded

                       want to do some work here to display communities user is a part of
                       need to consider what happens with the display if they are part of less than 3
                       would like them to be randomly chosen without duplicates if possible

                       userDetails.attributes.communitiesJoined.map
                     */
                    userCommunitiesLoaded ?
                        // user part of some communities
                        <>
                            <DefaultImage titleAlt={"user communities"} />
                            <DefaultImage />
                            <DefaultImage />
                        </>
                        :
                        // user part of no communities
                        <>
                            <b> No communities </b>
                            <DefaultImage titleAlt={"user is part of no communities"} />
                            <DefaultImage />
                            <DefaultImage />
                        </>
                    :
                    /* things are not loaded */
                    <>
                        <b> No communities loaded </b>
                        <DefaultImage titleAlt={"loading communities"} />
                        <DefaultImage />
                        <DefaultImage />
                    </>
                }
            </ul>
        </div>
    )
}