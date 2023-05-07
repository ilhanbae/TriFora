import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import genericFetch from "../helper/genericFetch";
import "../style/Homepage.css"; // can just use the homepage formatting I think
import BackButton from "./BackButton";
import CreateCommunity from "./CreateCommunity";
import Modal from "./Modal";

export default function OtherCommunitiesPage(props) {
    const [joinedIds, setJoinedIds] = useState();
    const [allCommunities, setAllCommunities] = useState();
    const [communitiesNotJoined, setCommunitiesNotJoined] = useState();
    const [displayPerRow, setDisplayPerRow] = useState(3); // same as homepageA
    const [isLoaded, setIsLoaded] = useState(false);
    const [othersLoaded, setOthersLoaded] = useState(false);
    const [sortedCommunities, setSortedCommunities] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        await getAllCommunities();
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
    const getAllCommunities = async () => {
        let endpoint = `/groups/`
        let query = {}
        const { data, errorMessage } = await genericFetch(endpoint, query);

        if (errorMessage) {
            alert(errorMessage);
        } else {
            // console.log("unjoined else")
            const all = data[0]

            // const filtered = all.filter(
            //     (community) => !joinedIds.includes(community.id)
            // );

            setAllCommunities(all); // store all communities
            // setNumCommunities(data[1]); // holding the total number of communities might be helpful for referencing
            // setCommunitiesLoaded(true); // mark all communities as loaded so bottom row can begin it's renders
            // const filtered = createNotJoined(all);
            // setCommunitiesNotJoined(filtered);
        }
    };

    /* This method toggles that modal to create a community */
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    const createNotJoined = () => {
        const notJoined = allCommunities.filter(
            (community) => !joinedIds.includes(community.id)
        );

        setCommunitiesNotJoined(notJoined);
        setSortedCommunities(notJoined);
        setOthersLoaded(true);

        // return notJoined;
    }

    const sortCommunities = (selectedSort) => {
        const options = {
            // "dateCreatedOldest": [...communitiesNotJoined].sort((a, b) => new Date(a.attributes.dateCreated) - new Date(b.attributes.dateCreated)),
            // "dateCreatedNewest": [...communitiesNotJoined].sort((a, b) => new Date(b.attributes.dateCreated) - new Date(a.attributes.dateCreated)),
            // wasted time with sorting by date, when id is always absolute on api
            "dateCreatedOldest": [...communitiesNotJoined].sort((a, b) => (a.id - b.id)),
            "dateCreatedNewest": [...communitiesNotJoined].sort((a, b) => (b.id - a.id)),
            "a-z": [...communitiesNotJoined].sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)),
            "z-a": [...communitiesNotJoined].sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1))
        }
        setSortedCommunities(options[selectedSort.target.value]);
    };

    const changeDisplayPerRow = (selectedNumber) => {
        setDisplayPerRow(parseInt(selectedNumber.target.value));
    }


    if (!isLoaded) {
        return <div>Loading...</div>;
    } else if (!othersLoaded) { // this is a band aid fix
        createNotJoined();
    } else {
        // Filter communites that user's not part of
        // const unjoinedCommunities = allCommunities.filter(
        //     (community) => !joinedIds.includes(community.id)
        // );
        // const unjoinedCommunities = 
        // createNotJoined();
        // const temp = createNotJoined();
        // setCommunitiesNotJoined(unjoinedCommunities);
        // The above is currently sorted by date created

        // map names for create community modal
        const communityNames = allCommunities.map((community) => community.name.toLowerCase());
        // console.log(communityNames);

        /*
        unjoinedCommunities communities should be an array, and turning it into a matrix should hopefully allow row building
        source for turning to matrix:
        https://stackoverflow.com/questions/62880615/how-do-i-map-for-every-two-elements-for-react
        */
        const rows = sortedCommunities.reduce(function (rows, key, index) {
            return (index % displayPerRow === 0 ? rows.push([key])
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
                        <h1>Here are all the communities you can join:</h1>
                    </div>
                    <div className="communities-alignment-button"><BackButton /></div> {/* doing this to enable correct spacing */}
                </div>

                <div className="display-communities-choices">
                    <div className="communities-choices">
                        <h2>Sort communites by:</h2>
                        <select onChange={sortCommunities} className="communities-choice-box">
                            <option value="dateCreatedOldest">Date created: oldest</option>
                            <option value="dateCreatedNewest">Date created: newest</option>
                            <option value="a-z">Alphabetical: A-Z</option>
                            <option value="z-a">Alphabetical: Z-A</option>
                        </select>
                    </div>

                    <div className="communities-choices">
                        <h2>Display per row:</h2>
                        <select onChange={changeDisplayPerRow} className="sort-communities-choices">
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                </div>

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
                                        title={community.name} />
                                </Link>
                            </div>
                        ))}
                    </div>
                ))
                }
                <div className="homepage-row-intro">
                    <h1>Don't see a community you're interest in? Create it here:</h1>
                    <button style={{ marginInline: "5px" }} className="create-community-button" onClick={toggleModal}>Create Community</button>
                </div>
                {/* Create Community as modal */}
                <Modal
                    show={isModalOpen}
                    onClose={toggleModal}
                    modalTitle="Create a community"
                    modalStyle={{
                        width: "50%",
                        height: "50%",
                    }}
                >
                    <CreateCommunity
                        toggleModal={toggleModal}
                        openToast={props.openToast}
                        listOfCommunityNames={communityNames} />
                </Modal>
            </div >
        )
    }
}