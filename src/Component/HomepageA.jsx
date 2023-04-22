import React, { useState, useEffect } from "react";
import "../style/HomepageA.css";
import group from "../assets/group.png";
import community from "../assets/defaultPostImage.png";
import { Link } from "react-router-dom";
import genericFetch from "../helper/genericFetch";

export default function HomepageA() {
    const [username, setUsername] = useState();
    const [userCommunities, setUserCommunities] = useState();
    const [numUserCommunities, setNumUserCommunities] = useState();
    // const [userLoaded, setUsernameLoaded] = useState(false);
    // const [userCommunitiesLoaded, setUserCommunitiesLoaded] = useState(false);
    const [allCommunities, setAllCommunities] = useState();
    const [numCommunities, setNumCommunities] = useState();
    // const [communitiesLoaded, setCommunitiesLoaded] = useState(false);
    const [displayPerRow, setDisplayPerRow] = useState(3); // this could be useful to maybe be able to change dynamically
    const [isLoaded, setIsLoaded] = useState(false);

    // Fetch user details, joined communities, and not other communities when the page is loaded.
    useEffect(() => {
        loadAll();
    }, []);

    /* This method loads all the data that is needed for this page from the API */
    const loadAll = async () => {
        setIsLoaded(false);
        await grabUser();
        await grabUserCommunities();
        await grabAllCommunities();
        setIsLoaded(true);
    };

    // want to use generic fetch to get username and their communities
    const grabUser = async () => {
        let endpoint = `/users/${sessionStorage.getItem('user')}`
        let query = {}
        const { data, errorMessage } = await genericFetch(endpoint, query)

        if (errorMessage) {
            alert(errorMessage);
        } else {
            setUsername(data.attributes.profile.username); // store the username from fetch
            // setUsernameLoaded(true); // mark username loaded so it renders
        }
    };

    // want to use generic fetch to get user communities
    const grabUserCommunities = async () => {
        let endpoint = `/group-members/`
        let query = { userID: sessionStorage.getItem('user') };
        const { data, errorMessage } = await genericFetch(endpoint, query)

        if (errorMessage) {
            alert(errorMessage);
        } else {
            //just store the communities instead of everything from this call
            const joinedCommunitiesFromMember = data[0].map((member) => member.group);

            setUserCommunities(joinedCommunitiesFromMember); // store the communities that the user is a part of
            setNumUserCommunities(data[1]); // hold on to the number of communities they are a part of for quick referencing
            // setUserCommunitiesLoaded(true); // mark their communities as loaded so it renders
        }
    };

    /* want to use generic fetch to get all communities
     * then maybe do some work to display non-joined communities
     */
    const grabAllCommunities = async () => {
        // console.log("in grabCommunities")
        let endpoint = `/groups/`
        let query = {}
        const { data, errorMessage } = await genericFetch(endpoint, query);

        if (errorMessage) {
            alert(errorMessage);
        } else {
            setAllCommunities(data[0]); // store all communities
            setNumCommunities(data[1]); // holding the total number of communities might be helpful for referencing
            // setCommunitiesLoaded(true); // mark all communities as loaded so bottom row can begin it's renders
        }
    };

    // the purpose of this is to display a default image for when there isn't enough communities to display
    function DefaultImage(props) {
        return (
            <div className="homepageA-community-wrapper">
                <h4>{props.nameText}</h4>
                <img
                    src={group}
                    className="homepageA-community-image"
                    alt={props.titleAlt}
                    title={props.titleAlt}
                />
            </div>
        )
    }

    // the purpose of this is to display a real community image that links to that community
    function CommunityLink(props) {
        return (
            <div className="homepageA-community-wrapper">
                <h4>{props.nameText}</h4>
                <Link to={`/community/${props.communityId}`}>
                    <img
                        src={props.communityImage}
                        className="homepageA-community-image"
                        alt={props.titleAlt}
                        title={props.titleAlt}
                    />
                </Link>
            </div>
        )
    }

    function displayUserCommunities() {
        // want to be able to display random user communities if they have enough
        let randomUserCommunities = (numUserCommunities > displayPerRow) ?
            [] // if they have enough let this be empty to build
            : userCommunities // otherwise just use what they have

        // should only get in here if they had enough to build random images
        if (numUserCommunities > displayPerRow) {
            // call the function to get array of random indices
            let randomIndices = generateRandomCommunityIndices(displayPerRow, numUserCommunities)
            for (let i = 0; i < displayPerRow; i++) {
                // fill random communites using the random indices
                randomUserCommunities.push(userCommunities[randomIndices[i]])
            }
        }

        // initialize an empty array that will be used to map elements
        let listToDisplay = [];
        for (let i = 0; i < displayPerRow; i++) {
            if (i < numUserCommunities) {
                // display their communites
                listToDisplay[i] = {
                    userJoined: true, // let this be the marker to have a link or not
                    communityId: randomUserCommunities[i].id,
                    titleAlt: randomUserCommunities[i].name,
                    communityImage: randomUserCommunities[i].attributes.design.bannerProfileImage,
                    nameText: randomUserCommunities[i].name
                }
            } else {
                // no more user communities to display so fill the remaining with default images
                listToDisplay[i] = {
                    userJoined: false,
                    titleAlt: "Join communities to see them here",
                    nameText: "See joined communities here!",
                }
            }
        }

        // map the elements according to the built list from above
        const imageList = listToDisplay.map((item) => {
            if (item.userJoined) {
                return <CommunityLink
                    communityId={item.communityId}
                    titleAlt={item.titleAlt}
                    communityImage={item.communityImage}
                    nameText={item.nameText}
                />
            } else {
                return <DefaultImage
                    titleAlt={item.titleAlt}
                    nameText={item.nameText}
                />
            }
        }
        )
        return imageList;
    }

    // this function will be handed the other communities not joined that have been filtered
    function displayOtherCommunities(otherCommunties) {
        let numOtherCommunities = otherCommunties.length // establish a length for loops

        // want to be able to display random communities if there is enough
        let randomOtherCommunities = (otherCommunties.length > displayPerRow) ?
            [] // if there is enough let this be empty to build
            : otherCommunties // otherwise just use what they have

        // should only get in here if enough communities remain to build random images
        if (numOtherCommunities > displayPerRow) {
            // call the function to get array of random indices
            let randomIndices = generateRandomCommunityIndices(displayPerRow, numOtherCommunities)
            for (let i = 0; i < displayPerRow; i++) {
                // fill random communites using the random indices
                randomOtherCommunities.push(otherCommunties[randomIndices[i]])
            }
        }

        // initialize an empty array that will be used to map elements
        let listToDisplay = [];
        for (let i = 0; i < displayPerRow; i++) {
            if (i < numOtherCommunities) {
                // display real communites
                listToDisplay[i] = {
                    availableCommunity: true, // let this be the marker to have a link or not
                    communityId: randomOtherCommunities[i].id,
                    titleAlt: randomOtherCommunities[i].name,
                    communityImage: randomOtherCommunities[i].attributes.design.bannerProfileImage,
                    nameText: randomOtherCommunities[i].name,
                }
            } else {
                // no more communities to display fill the remaining with default images
                listToDisplay[i] = {
                    availableCommunity: false,
                    titleAlt: "More communities coming soon!",
                    nameText: "More communities to come!"
                }
            }
        }

        // map the elements according to the built list from above
        const imageList = listToDisplay.map((item) => {
            if (item.availableCommunity) {
                return <CommunityLink
                    communityId={item.communityId}
                    titleAlt={item.titleAlt}
                    communityImage={item.communityImage}
                    nameText={item.nameText}
                />
            } else {
                return <DefaultImage
                    titleAlt={item.titleAlt}
                    nameText={item.nameText}
                />
            }
        }
        )
        return imageList;
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        // make a list of joined community id's to filter non-joined communities
        const joinedCommunityIds = userCommunities.map(
            (joinedCommunity) => joinedCommunity.id
        );
        // Filter communites that user's not part of
        const otherCommunties = allCommunities.filter(
            (community) => !joinedCommunityIds.includes(community.id)
        );
        return (
            <div className="homepageA-wrapper">
                {/* user details should be loaded for the welcome message */}
                <div className="homepageA-welcome-message">
                    <h1>
                        {/* userName should appear here from earlier fetch */}
                        Welcome{` ${username}!`}
                    </h1>
                    <h2>Jump in to your community!</h2>
                </div>
                <br />
                {/* Display communities randomly mapped from communities user is part of */}
                <h3 className="homepageA-row-intro">Some of your communities:</h3>
                <div className="homepageA-communities-row">
                    {displayUserCommunities()}
                </div>

                {/* Display communities randomly mapped from communities user is not part of */}
                <h3 className="homepageA-row-intro">Some other communities:</h3>
                <div className="homepageA-communities-row">
                    {displayOtherCommunities(otherCommunties)}
                </div>
            </div>
        )
    }
}

/* 
Function to make an array of random numbers to use as indices
count is the number of random numbers desired, this should relate to the number to display in an image row
max is the highest index possible, since it is exclusive it can just be the number of communities returned from
the initial fetch call.
function source:
https://www.youtube.com/watch?v=giHb-w49yGU&ab_channel=JamesQQuick
*/
const generateRandomCommunityIndices = (count, max) => {
    const rands = [];
    while (rands.length < count) {
        const r = Math.floor(Math.random() * (max));
        if (rands.indexOf(r) === -1) {
            rands.push(r);
        }
    }
    return rands;
};