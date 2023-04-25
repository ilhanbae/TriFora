import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import genericFetch from "../helper/genericFetch";

export default function OtherCommunitiesPage() {
    const [joinedIds, setJoinedIds] = useState();
    const [unjoinedCommunities, setUnjoinedCommunities] = useState();
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
        await getUnjoinedCommunities();
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
            //just store the community IDs instead of everything from this call
            const joinedIds = data[0].map((member) => member.group.id);

            setJoinedIds(joinedIds); // store the communities that the user is a part of
            // setNumUserCommunities(data[1]); // hold on to the number of communities they are a part of for quick referencing
            // setUserCommunitiesLoaded(true); // mark their communities as loaded so it renders
        }
    };

    /* want to use generic fetch to get all communities
     * then maybe do some work to display non-joined communities
     */
    const getUnjoinedCommunities = async () => {
        let endpoint = `/groups/`
        let query = {}
        const { data, errorMessage } = await genericFetch(endpoint, query);

        if (errorMessage) {
            alert(errorMessage);
        } else {
            // console.log("unjoined else")

            setUnjoinedCommunities(data[0]); // store all communities
            // setNumCommunities(data[1]); // holding the total number of communities might be helpful for referencing
            // setCommunitiesLoaded(true); // mark all communities as loaded so bottom row can begin it's renders
        }
    };


    if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        // Filter communites that user's not part of
        const otherCommunties = unjoinedCommunities.filter(
            (community) => !joinedIds.includes(community.id)
        );
        /*
        unjoinedCommunities communities should be an array, and turning it into a matrix should hopefully allow row building
        source for turning to matrix:
        https://stackoverflow.com/questions/62880615/how-do-i-map-for-every-two-elements-for-react
        */
        const rows = otherCommunties.reduce(function (rows, key, index) {
            return (index % displayPerRow == 0 ? rows.push([key])
                : rows[rows.length - 1].push(key)) && rows;
        }, []);
        return (
            <div className="homepageA-wrapper">
                {/* Display communities randomly mapped from communities user is not part of */}
                <h3 className="homepageA-row-intro">Communities you are not a part of:</h3>
                <div className="homepageA-communities-row">
                    {rows.map(row => (
                        <div >
                            {row.map(community => (
                                <img height="200px" width={"200px"}
                                    src={community.attributes.design.bannerProfileImage}
                                    // className="homepageA-community-image"
                                    alt={community.name}
                                    title={community.name}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}