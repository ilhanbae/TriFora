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
    const [displayPerRow, setDisplayPerRow] = useState(3); // same as homepageA
    const [isLoaded, setIsLoaded] = useState(false);
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

            setAllCommunities(data[0]); // store all communities
            // setNumCommunities(data[1]); // holding the total number of communities might be helpful for referencing
            // setCommunitiesLoaded(true); // mark all communities as loaded so bottom row can begin it's renders
        }
    };

    /* This method toggles that modal to create a community */
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }


    if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        // Filter communites that user's not part of
        const unjoinedCommunities = allCommunities.filter(
            (community) => !joinedIds.includes(community.id)
        );
        // The above is currently sorted by date created

        // map names for create community modal
        const communityNames = allCommunities.map((community) => community.name.toLowerCase());
        // console.log(communityNames);

        /*
        unjoinedCommunities communities should be an array, and turning it into a matrix should hopefully allow row building
        source for turning to matrix:
        https://stackoverflow.com/questions/62880615/how-do-i-map-for-every-two-elements-for-react
        */
        const rows = unjoinedCommunities.reduce(function (rows, key, index) {
            return (index % displayPerRow === 0 ? rows.push([key])
                : rows[rows.length - 1].push(key)) && rows;
        }, []);

        return (
            <div className="homepage-wrapper">
                {/* Display communities randomly mapped from communities user is not part of */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%"
                }}>
                    <div style={{marginLeft: "10px"}}>
                        <BackButton />
                    </div>
                    <div className="homepage-row-intro">

                        <h1>Here are all the communities you can join:</h1>
                    </div>
                    <div style={{ visibility: "hidden" }}><BackButton /></div>

                </div>
                {/* <select>
                        <option value="date created">Date created: oldest</option>
                        <option value="date created">Date created: newest</option>
                        <option value="a-z">Alphabetical: A-Z</option>
                        <option value="z-a">Alphabetical: Z-A</option>
                    </select> */}
                {
                    rows.map(row => (
                        <div className="homepage-communities-row">
                            {row.map(community => (
                                <div className="homepage-community-wrapper">
                                    <h2>{community.name}</h2>
                                    <Link to={`/community/${community.id}`}>
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