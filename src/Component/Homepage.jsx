import React, { useState, useEffect, Suspense } from "react";
import "../style/Homepage.css";
import group from "../assets/group.png";
import community from "../assets/defaultPostImage.png";
import { Link } from "react-router-dom";
import genericFetch from "../helper/genericFetch";

export default function Homepage() {
    const [username, setUsername] = useState();
    const [userCommunities, setUserCommunities] = useState();
    const [numUserCommunities, setNumUserCommunities] = useState();
    const [userLoaded, setUsernameLoaded] = useState(false)
    const [userCommunitiesLoaded, setUserCommunitiesLoaded] = useState(false)
    const [topCommunities, setTopCommunities] = useState();
    const [numCommunities, setNumCommunities] = useState();
    const [communitiesLoaded, setCommunitiesLoaded] = useState(false)

    // Fetch both user info and communities when the component is loaded.
    useEffect(() => {
        grabUser();
        grabUserCommunities();
        grabCommunities();
    }, []);

    // want to use generic fetch to get username and their communities
    const grabUser = async () => {
        let endpoint = `/users/${sessionStorage.getItem('user')}`
        let query = {}
        const { data, errorMessage } = await genericFetch(endpoint, query)

        if (errorMessage) {
            alert(errorMessage);
        } else {
            setUsername(data.attributes.profile.username);
            // grabUserCommunities(); // putting this here might not be ok to do
            setUsernameLoaded(true);
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
            setUserCommunities(data[0]);
            setNumUserCommunities(data[1]);
            setUserCommunitiesLoaded(true);
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
            setTopCommunities(data[0]);
            setNumCommunities(data[1]); // might be useful to get total number of communities
            setCommunitiesLoaded(true);
            console.log(topCommunities)
        }
    };

    function DefaultImages() {
        return (
            <>
                <li className="homepage-joined-communities">
                    <Link to="community/25"> {/* the id should be dynamic from the above idea/implementation */}
                        <img src={group} className="homepage-community-image" /> {/* placeholder */}
                    </Link>
                </li><li className="homepage-joined-communities">
                    <Link to="community/25">
                        <img src={group} className="homepage-community-image" /> {/* placeholder */}
                    </Link>
                </li><li className="homepage-joined-communities">
                    <Link to="community/25">
                        <img src={group} className="homepage-community-image" /> {/* placeholder */}
                    </Link>
                </li>
            </>)
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
                {/* <Suspense fallback={<h1>Welcome back!</h1>}>
                    <h1>
                        {`Welcome back ${userDetails.attributes.profile.username}!`}
                    </h1>
                </Suspense>
                <h1>
                    <br />
                    Jump back in to your community!
                </h1> */}
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
                        // user part of some communities
                        <DefaultImages />
                        :
                        // user part of no communities
                        <>
                            <b> No user communities </b>
                            <DefaultImages />
                        </>
                    :
                    /* things are not loaded */
                    <>
                        <b> No communities loaded </b>
                        <DefaultImages />
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

                    topCommunities.map
                ):(
                    <li className="homepage-joined-communities">
                    <Link to="community/25">
                        <img src={group} className="homepage-community-image" />
                    </Link>
                </li>
                <li className="homepage-joined-communities">
                    <Link to="community/25">
                        <img src={group} className="homepage-community-image" />
                    </Link>
                </li>
                <li className="homepage-joined-communities">
                    <Link to="community/25">
                        <img src={group} className="homepage-community-image" />
                    </Link>
                </li>
                )} */}
                <li className="homepage-top-communities">
                    <Link to="community/25"> {/* the id should be dynamic from the above idea/implementation */}
                        <img src={community} className="homepage-community-image" /> {/* placeholder */}
                    </Link>
                </li>
                <li className="homepage-top-communities">
                    <Link to="community/25">
                        <img src={community} className="homepage-community-image" /> {/* placeholder */}
                    </Link>
                </li>
                <li className="homepage-top-communities">
                    <Link to="community/25">
                        <img src={community} className="homepage-community-image" /> {/* placeholder */}
                    </Link>
                </li>
                {/* <span></span>
                    <span></span>
                    <img src={community} className="homepage-community-image" />
                    <img src={community} className="homepage-community-image" />
                    <img src={community} className="homepage-community-image" />
                    <span></span>
                    <span></span> */}
            </ul>
        </div>
    )
}