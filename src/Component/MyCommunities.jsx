import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import genericFetch from "../helper/genericFetch";
import "../style/Homepage.css"; // can just use the homepage formatting I think
import BackButton from "./BackButton";

export default function OtherCommunitiesPage() {
    const [joinedCommunities, setJoinedCommunities] = useState();
    const [displayPerRow, setDisplayPerRow] = useState(3); // same as homepageA
    const [isLoaded, setIsLoaded] = useState(false);

    // Fetch unjoined communities
    useEffect(() => {
        loadAll();
    }, []);

    /* 
    Unfortunately need to make both calls.
    This is probably pretty inefficient, consider combining with join communities page
     */
    const loadAll = async () => {
        setIsLoaded(false);
        await getJoinedIds();
        setIsLoaded(true);
    };

    // want to use generic fetch to get user communities
    const getJoinedIds = async () => {
        let endpoint = `/group-members/`
        let query = { userID: sessionStorage.getItem('user') };
        const { data, errorMessage } = await genericFetch(endpoint, query)

        if (errorMessage) {
            alert(errorMessage);
        } else {
            // console.log("joined else")
            //just store the community instead of everything from this call
            const joined = data[0].map((member) => member.group);

            setJoinedCommunities(joined); // store the communities that the user is a part of
            // setNumUserCommunities(data[1]); // hold on to the number of communities they are a part of for quick referencing
            // setUserCommunitiesLoaded(true); // mark their communities as loaded so it renders
        }
    };


    if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        /*
        joinedCommunities communities should be an array, and turning it into a matrix should hopefully allow row building
        source for turning to matrix:
        https://stackoverflow.com/questions/62880615/how-do-i-map-for-every-two-elements-for-react
        */
        const rows = joinedCommunities.reduce(function (rows, key, index) {
            return (index % displayPerRow == 0 ? rows.push([key])
                : rows[rows.length - 1].push(key)) && rows;
        }, []);

        return (
            <div className="homepage-wrapper">
                {/* Display communities randomly mapped from communities user is not part of */}
                <div className="communities-top-banner-container">
                    <div style={{ marginLeft: "10px" }}>
                        <BackButton />
                    </div>
                    <div className="homepage-row-intro">

                        <h1>Here are all the communities you are part of:</h1>
                    </div>
                    <div className="communities-alignment-button"><BackButton /></div>

                </div>
                {/* <select>
                    <option value="date created">Date created: oldest</option>
                    <option value="date created">Date created: newest</option>
                    <option value="a-z">Alphabetical: A-Z</option>
                    <option value="z-a">Alphabetical: Z-A</option>
                </select> */}
                {rows.map(row => (
                    <div className="homepage-communities-row">
                        {row.map(community => (
                            <div className="homepage-community-wrapper">
                                <h2>{community.name}</h2>
                                <Link to={`/community/${community.id}`}>
                                    <img
                                        src={community.attributes.design.bannerProfileImage}
                                        className="homepage-community-image"
                                        alt={community.name}
                                        title={community.name}
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                ))}
                <Link className="hyperlink" to="/other-communities">Click here to see all the communities you can join</Link>
            </div>
        )
    }
}