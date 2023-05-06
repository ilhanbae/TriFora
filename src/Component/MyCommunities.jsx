import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import genericFetch from "../helper/genericFetch";
import "../style/Homepage.css"; // can just use the homepage formatting I think
import BackButton from "./BackButton";

export default function OtherCommunitiesPage() {
    const [joinedCommunities, setJoinedCommunities] = useState();
    const [displayPerRow, setDisplayPerRow] = useState(3); // same as homepageA
    const [isLoaded, setIsLoaded] = useState(false);
    const [sortedCommunities, setSortedCommunities] = useState();
    const [sortCommunitiesDropDown, setSortCommunitiesDropdown] = useState("dateJoinedOldest");

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

            // the default display is sorted by time joined, so need to hold that info without making extra calls
            setSortedCommunities(joined);
        }
    };

    const sortCommunities = (selectedSort) => {
        // console.log(joinedCommunities[0].attributes.dateCreated)
        // console.log(joinedCommunities.attributes.dateCreated)
        if (selectedSort.target.value === "dateJoinedOldest") {
            setSortedCommunities([...joinedCommunities])
        } else if (selectedSort.target.value === "dateJoinedNewest") {
            setSortedCommunities([...joinedCommunities].reverse())
            // }
        } else {
            const options = {
                "dateJoinedOldest": [...joinedCommunities].sort((a, b) => new Date(a.attributes.dateCreated) - new Date(b.attributes.dateCreated)),
                "dateJoinedNewest": [...joinedCommunities].sort((a, b) => new Date(b.attributes.dateCreated) - new Date(a.attributes.dateCreated)),
                "a-z": [...joinedCommunities].sort((a, b) => (a.name < b.name ? -1 : 1)),
                "z-a": [...joinedCommunities].sort((a, b) => (a.name < b.name ? 1 : -1))
            }
            setSortedCommunities(options[selectedSort.target.value]);
        }
    };

    // const CommunitySortingDropDown = () => (
    //     <select onChange={sortCommunities}>
    //         <option value="dateJoinedOldest">Date joined: oldest</option>
    //         <option value="dateJoinedNewest">Date joined: newest</option>
    //         {/* <option value="date created oldest">Date created: oldest</option>
    //                 <option value="date created newest">Date created: newest</option> */}
    //         <option value="a-z">Alphabetical: A-Z</option>
    //         <option value="z-a">Alphabetical: Z-A</option>
    //     </select>
    // );

    if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        /*
        joinedCommunities communities should be an array, and turning it into a matrix should hopefully allow row building
        source for turning to matrix:
        https://stackoverflow.com/questions/62880615/how-do-i-map-for-every-two-elements-for-react
        */
        const rows = sortedCommunities.reduce(function (rows, key, index) {
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
                {/* <CommunitySortingDropDown /> */}
                <select onChange={sortCommunities}>
                    <option value="dateJoinedOldest">Date joined: oldest</option>
                    <option value="dateJoinedNewest">Date joined: newest</option>
                    <option value="date created oldest">Date created: oldest</option>
                    <option value="date created newest">Date created: newest</option>
                    <option value="a-z">Alphabetical: A-Z</option>
                    <option value="z-a">Alphabetical: Z-A</option>
                </select>
                {rows.map(row => (
                    <div className="homepage-communities-row">
                        {row.map(community => (
                            <div className="homepage-community-wrapper">
                                <Link to={`/community/${community.id}`} className="homepage-community-name-link">
                                    <h2>{community.name}</h2>
                                </Link>
                                <Link to={`/community/${community.id}`} className="homepage-community-image-link">
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