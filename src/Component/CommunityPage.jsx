import React, {useEffect, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";
import Modal from "./Modal";
import CommunityPageSetting from "./CommunityPageSetting";
import PostPage from "./PostPage";
import CreatePost from "./CreatePost";
import genericFetch from "../helper/genericFetch";
import genericDelete from "../helper/genericDelete";
import genericPost from "../helper/genericPost";
import genericPatch from "../helper/genericPatch";
import formatDateTime from "../helper/formatDateTime"
import style from "../style/CommunityPage.module.css";
import defaultProfileImage from "../assets/defaultProfileImage.png";
import defaultPostImage from "../assets/defaultPostImage.png";
import defaultCommunityImage from "../assets/defaultCommunityImage.png";
import ProfilePage from "./ProfilePage";

/* This component renders a single community page. Inside the community page, 
there are posts tab and members tab. */
export default function CommunityPage(props) {
  const { communityId } = useParams(); // Retrieve the community id from the URL Param
  const [communityDetails, setCommunityDetails] = useState(null);
  const [userCommunityMemberDetails, setUserCommunityMemberDetails] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch the community and user member details community page is loaded
  useEffect(() => {
    loadCommunityAndUserMemberDetails();
    document.title = "Community Page";
  }, []);

  /* This method loads both the community and user's community member details */
  const loadCommunityAndUserMemberDetails = async () => {
    setIsLoaded(false);
    await loadCommunityDetails();
    await loadUserCommunityMemberDetails();
    setIsLoaded(true);
  };

  /* This methods loads the community details by sending the API request. */
  const loadCommunityDetails = async () => {
    // setIsLoaded(false);
    let endpoint = `/groups/${communityId}`;
    let query = {};
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage)
    if (errorMessage) {
      setErrorMessage(errorMessage);
    } else {
      setCommunityDetails(data);
    }
    // setIsLoaded(true);
  };

  /* This method loads current user as community member by sending the API request. */
  const loadUserCommunityMemberDetails = async () => {
    // setIsLoaded(false);
    let endpoint = `/group-members`;
    let query = {
      userID: sessionStorage.getItem("user"),
      groupID: communityId,
    };
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage);
    if (errorMessage) {
      setErrorMessage(errorMessage);
    } else {
      setUserCommunityMemberDetails(data[0][0]);
    }
    // setIsLoaded(true);
  };

  /* This method refresh the community details by sending the API request again.
  It can be passed on to child components that can change the state of the community page. 
  Note, currently the only attributes the community page maintains is its banner design.
  Perhaps, this can be called when the community admin/mod wishes to change the style of the community. */
  const refreshCommunityDetails = async () => {
    // console.log("refreshing community details");
    setIsLoaded(false);
    await loadCommunityDetails(); // Fetch the community details again
    setIsLoaded(true);
  };

  /* This method refreshes both the community and user's community member details */
  const refreshCommunityAndUserMemberDetails = () => {
    loadCommunityAndUserMemberDetails();
  }

  // Render Component
  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className={style["community-page"]}>
        {/* Banner */}
        <CommunityBanner
          communityDetails={communityDetails}
          userCommunityMemberDetails={userCommunityMemberDetails}
          refreshCommunityAndUserMemberDetails={refreshCommunityAndUserMemberDetails}
          refreshCommunityDetails={refreshCommunityDetails}
          openToast={props.openToast}
        />

        {/* Main section */}
        <div className={style["main-section"]}>
          {/* Main Content Display */}
          <CommunityContentDisplay
            communityDetails={communityDetails}
            communityId={communityId}
            userCommunityMemberDetails={userCommunityMemberDetails}
            refreshCommunityDetails={refreshCommunityDetails}
            openToast={props.openToast}
            inProfile={props.inProfile}
          />
        </div>
      </div>
    );
  }
}

/* This component serves as container for banner contents. Inside the banner, 
there's community name, community background, community icon, and a join button */
const CommunityBanner = (props) => {
  const [isCommunitySettingModalOpen, setIsCommunitySettingModalOpen] = useState(false);
  const [isCommunityLeaveModalOpen, setIsCommunityLeaveModalOpen] = useState(false);

  // Set community banner background color
  let bannerBackgroundColor = props.communityDetails.attributes.design.bannerBackgroundColor
    ? props.communityDetails.attributes.design.bannerBackgroundColor
    : "#f3c26e";

  // Check current user's community role & joined state
  const isUserAdmin = props.userCommunityMemberDetails?.attributes.role === "admin";
  const isUserMod = props.userCommunityMemberDetails?.attributes.role === "mod";

  // This method handles join button action.
  const joinButtonHandler = async () => {
    // Check if user is already a community member
    if (props.userCommunityMemberDetails) {
      if(isUserAdmin) {
        props.openToast({type: "info", message: <span>You can't leave the community as an admin. </span>});
      } else {
        openCommunityLeaveModal();
      }
    }
    else {
      await addUserToCommunity();
    }

  }

  // This method adds user to community by sending POST request to the API server
  const addUserToCommunity = async () => {
    let endpoint = '/group-members';
    let body = {
      userID: parseInt(sessionStorage.getItem('user')),
      groupID: props.communityDetails.id,
      attributes: {
        role: 'member'
      }
    };
    const { data, errorMessage } = await genericPost(endpoint, body);
    // console.log(data, errorMessage)
    if (errorMessage) {
      props.openToast({type: "error", message: <span>Uh oh, sorry you can't join our community at the moment. Please contact <Link to="about" style={{color: "var(--light-yellow", textDecoration: "underline"}}> our developers.</Link></span>});
    } else {
      props.openToast({type: "success", message: "Community joined successfully!"});
      props.refreshCommunityAndUserMemberDetails();
    }
  }

  // This methods removes user from community by sending DELTE request to the API server
  const removeUserFromCommunity = async () => {
    let endpoint = `/group-members/${props.userCommunityMemberDetails.id}`;
    const { data, errorMessage } = await genericDelete(endpoint);
    // console.log(data, errorMessage)
    if (errorMessage) {
      props.openToast({type: "error", message: <span>Uh oh, sorry you can't leave our community at the moment. Please contact <Link to="about" style={{color: "var(--light-yellow", textDecoration: "underline"}}> our developers.</Link></span>});
    } else {
      props.openToast({type: "success", message: "Community left successfully!"});
      props.refreshCommunityAndUserMemberDetails();
    }
  }

  // This method opens commmunity page setting modal
  const openCommunityPageSettingModal = () => {
    setIsCommunitySettingModalOpen(true);
  }

  // This method closes community page setting modal
  const closeCommunityPageSettingModal = () => {
    props.refreshCommunityDetails();
    setIsCommunitySettingModalOpen(false);
  }

  // This method opens commmunity leave modal
  const openCommunityLeaveModal = () => {
    setIsCommunityLeaveModalOpen(true);
  }

  // This method closes community leave modal
  const closeCommunityLeaveModal = () => {
    // props.refreshCommunityDetails();
    setIsCommunityLeaveModalOpen(false);
  }

  // This method formats date time into [Month] [DD], [YYYY] format
  const formatCommunityCreatedDateTime = (dateTime) => {
    const dateTimeObject = new Date(dateTime);
    let dateTimeCalendarFormat = dateTimeObject.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      daySuffix: true
    });
    
    // This method determines the day suffix
    const getDaySuffix = (day) => {
      switch (day) {
        case 1:
        case 21:
        case 31:
          return 'st';
        case 2:
        case 22:
          return 'nd';
        case 3:
        case 23:
          return 'rd';
        default:
          return 'th';
      }
    };

    // Insert day suffix
    const day = dateTimeObject.getDate();
    const daySuffix = getDaySuffix(day);
    const commaIndex = dateTimeCalendarFormat.indexOf(",")
    const suffixedDateTimeCalendarFormat = dateTimeCalendarFormat.substring(0, commaIndex) + daySuffix + dateTimeCalendarFormat.substring(commaIndex)
    return suffixedDateTimeCalendarFormat
  }

  return (
    <div className={style["community-banner"]}>
      {/* Community Banner Background */}
      {/* Background Color Layer */}
      <div
        className={style["community-banner-background"]}
        style={{ backgroundColor: bannerBackgroundColor }}
      >
        {/* Background Image Layer */}
        {/* <div
          className={style["community-banner-background-image"]}
          style={{ backgroundImage: `url(${defaultCommunityImage})` }}
        >
        </div> */}
      </div>

      {/* Commnity Banner Content*/}
      <div className={style["community-banner-content"]}>
        {/* Community Banner Content Left */}
        <div className={style["community-banner-content-left"]}>
          {/* Community Avatar Image */}
          <img
            className={`${style["image"]} ${style["image__sm"]} ${style["image__square"]}`}
            src={props.communityDetails.attributes.design.bannerProfileImage}
            alt="Community avatar"
            onError={(e) => (e.currentTarget.src = defaultCommunityImage)}
          />
          {/* Community Info */}
          <div className={style["community-info"]}>
            {/* Community Name */}
            <span className={style["community-name"]}>{props.communityDetails.name}</span>
            {/* Community Created Date */}
            <span className={style["inactive-text"]}>
              Since {formatCommunityCreatedDateTime(props.communityDetails.attributes.dateCreated)}            
            </span>
          </div>
        </div>

        {/* Community Banner Content Right */}
        <div className={style["community-banner-content-right"]}>
          {/* Setting Button */}
          {(isUserAdmin || isUserMod) && (
            <button
              className={`${style["button"]} ${style["button__bordered"]}`}
              onClick={openCommunityPageSettingModal}
            >
              Setting
            </button>
          )}

          {/* Join Button */}
          <button
            className={`${style["button"]} ${style["button__bordered"]}`}
            onClick={joinButtonHandler}
          >
            {props.userCommunityMemberDetails ? "Joined" : "Join"}
          </button>
        </div>
      </div>

      {/* Community Page Setting Modal*/}
      <Modal
        show={isCommunitySettingModalOpen}
        onClose={closeCommunityPageSettingModal}
        modalTitle="Community Setting"
        modalStyle={{
          width: "fit-content",
          blockSize: "fit-content",
          minWidth: "30%"
        }}
      >
        <CommunityPageSetting
          communityDetails={props.communityDetails}
          communityId={props.communityDetails.id}
          refreshCommunityDetails={props.refreshCommunityDetails}
          closeCommunityPageSettingModal={closeCommunityPageSettingModal}
          openToast={props.openToast}
        />
      </Modal>

      {/* Community Leave Modal */}
      <Modal
        show={isCommunityLeaveModalOpen}
        onClose={closeCommunityLeaveModal}
        modalStyle={{
          width: "30%",
          height: "30%",
        }}
      >
        <div className={style["community-leave-modal"]}>
          <span className={style["community-leave-modal-headline"]}>
            Leave Community?
          </span>
          <div className={style["community-leave-modal-buttons"]}>
            <button
              className={`${style["button"]} ${style["button__bordered"]} ${style["button__danger"]}`}
              onClick={() => removeUserFromCommunity()}
            >
              Yes
            </button>
            <button
              className={`${style["button"]} ${style["button__bordered"]} ${style["button__filled"]}`}
              onClick={() => closeCommunityLeaveModal()}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

/* This component will render either the community posts list or community members list. 
The type of content to display is chosen by the community stats tab*/
const CommunityContentDisplay = (props) => {
  const [contentDisplayType, setContentDisplayType] = useState("posts");
  const [communityPostSortOption, setCommunitySortOption] = useState("newest");
  const [communityPostCustomSortOption, setCommunityCustomSortOption] = useState(null);
  const [communityPostCounts, setCommunityPostCounts] = useState(0);
  const [communityMemberCounts, setCommunityMemberCounts] = useState(0);
  const [communityPostSkipOffset, setCommunityPostSkipOffset] = useState(0);
  const [communityPostTakeCount, setCommunityPostTakeCount] = useState(10);
  const [communityMemberSkipOffset, setCommunityMemberSkipOffset] = useState(0);
  const [communityMembersCount, setCommunityMembersTakeCount] = useState(15);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [isCommunityPostsLoaded, setIsCommunityPostsLoaded] = useState(false);
  const [friends, setFriends] = useState([]);
  const [blockedFriends, setBlockedFriends] = useState([]);
  const [isFriendsLoaded, setIsFriendsLoaded] = useState(false);
  const [filteredCommunityPostCounts, setFilteredCommunityPostCounts] = useState(0);

  /* This hook loads content based on current display type */
  useEffect(() => {
    if (contentDisplayType === "posts") {
      loadCommunityPosts();
    }
  }, [contentDisplayType, props.inProfile])

  /* This hook refresh posts whenever the community post sort option has changed. The offset is changed
  by the PostSortDropdown component */
  useEffect(() => {
    refreshCommunityPosts();
  }, [communityPostSortOption]);

  /* This hook refresh posts whenever the community post custom sort option has changed. The offset is changed by the PostSortDropdown component */
  useEffect(() => {
    refreshCommunityPosts();
  }, [communityPostCustomSortOption]);

  /* This method updates the current content display type as either posts or members.
  It's passed on to its child component - CommunityStats, where the options are selected.
  Then the CommunityContentDisplay component renders based on the display type (post list or members list) */
  const communityContentDisplayHandler = (type) => {
    setCommunityPostSkipOffset(0);
    setCommunityMemberSkipOffset(0);
    setContentDisplayType(type);
  };

  /* This method updates the the community posts sort option (oldest/newest). 
  It will be called by the Post Control Tool component via Sort Posts button */
  const updateCommunityPostSortOption = (option) => {
    setCommunityCustomSortOption(null);
    setCommunityPostSkipOffset(0);
    setCommunitySortOption(option);
  }

  /* This method updates the the community posts custom sort option (friend/other). 
  It will be called by the Post Control Tool component via Sort Posts button */
  const updateCommunityPostCustomSortOption = (option) => {
    setCommunityPostSkipOffset(0);
    setCommunityCustomSortOption(option);
  }

  /* This method loads the community posts using genericFetch & update the community posts count stat */
  const loadCommunityPosts = async () => {
    setIsFriendsLoaded(false);
    setIsCommunityPostsLoaded(false);

    // console.log(`------LOADING COMMUNITY POSTS (${communityPostSortOption} ${communityPostCustomSortOption})-------`)

    /* This method loads all friends using genericFetch */
    const loadFriends = async () => {
      const _friends = [];
      const _blockedFriends = [];
      let endpoint = "/connections";
      let query = {
        fromUserID: sessionStorage.getItem("user"),
      };
      const { data, errorMessage } = await genericFetch(endpoint, query);
      // console.log(data, errorMessage)
      if (data)  {
        for (let i = 0; i < data[0].length; i++) {
          // Check if the friend connection is "active"
          if (data[0][i].attributes.status === "active") {
            _friends.push(data[0][i].toUserID);
          // Check if the friend connection is "blocked"
          } else if (data[0][i].attributes.status === "blocked") {
            _blockedFriends.push(data[0][i].toUserID);
          }
        }
      }
      return {_friends, _blockedFriends}
    }

    /* This method loads all posts using genericFetch */
    const loadPosts = async (_friends, _blockedFriends) => {
      let _posts = []
      let _postsCount = []
      let endpoint = "/posts";
      let query = {
        sort: communityPostSortOption,
        parentID: "",
        recipientGroupID: props.communityId,
      };
      const { data, errorMessage } = await genericFetch(endpoint, query);
      // console.log(data, errorMessage)
      if (errorMessage) {
        // setErrorMessage(errorMessage);
      } else {
        // console.log(data[0])
        _posts = data[0]
        _postsCount = data[1]
        // let _communityPosts = data[0]
        // let _filterdAndSortedCommunityPosts = await filterAndSortPosts(_communityPosts, communityPostCustomSortOption, _friends, _blockedFriends)
       
        // console.log(blockedFriends)
        // console.log(friends)       
        
        // setCommunityPosts(_filterdAndSortedCommunityPosts);
        // setCommunityPostCounts(_filterdAndSortedCommunityPosts.length)
        // updateCommunityPostCounts(_filterdAndSortedCommunityPosts.length);
      }
      // setIsCommunityPostsLoaded(true);
      // setCommunityPosts(data[0]);
      // updateCommunityPostCounts(data[1]);
      return {_posts, _postsCount}
    }
  
    /* This method filters & sort the posts */
    const filterAndSortPosts = async (posts, customSortOption, _friends, _blockedFriends) => {
      // console.log("________sorting & filtering community posts_______");
      const isUserVisiter = props.userCommunityMemberDetails == null;

      /* This method checks whether the post is pinned or not */
      const isPinnedPost = (post) => {
        if (post?.reactions.filter((reaction) => reaction.name === "pin").length) {
          return true;
        }
        return false;
      };

      /* This method checks whether the post is friend post or not */
      const isFriendPost = (post, _friends) => {
        // console.log(friends);
        return _friends.includes(post.authorID);
      };

      /* This method checks whether the post is from blocked friend */
      const isBlockedFriendPost = (post, _blockedFriends) => {
        // console.log(blockedFriends)
        return _blockedFriends.includes(post.authorID);
      };

      // Filter posts by user role & connection
      let filteredPosts = posts;
      // Filter out private posts for visiter
      if (isUserVisiter) {
        filteredPosts = await filteredPosts.filter((post) => post.attributes.public);
      }
      // Filter out blocked friend posts for all 
      filteredPosts = await filteredPosts.filter((post) => !isBlockedFriendPost(post, _blockedFriends))

      // Order posts by custom sort option: Pinned > sort Option
      let sortedPosts = filteredPosts.slice();
      // Pinned > Friend > Other
      if (customSortOption === "friend") {
        sortedPosts = await sortedPosts.sort(
          (postA, postB) =>
          isPinnedPost(postB) - isPinnedPost(postA) ||
          isFriendPost(postB, _friends) - isFriendPost(postA, _friends)
        )
      } 
      // Pinned > Other > Friend
      else if (customSortOption === "other") {
        sortedPosts = await sortedPosts.sort(
          (postA, postB) =>
          isPinnedPost(postB) - isPinnedPost(postA) ||
          isFriendPost(postA, _friends) - isFriendPost(postB, _friends)
        )
      }
      else {
        sortedPosts = await sortedPosts.sort(
          (postA, postB) =>
          isPinnedPost(postB) - isPinnedPost(postA)
        )
      }
      return sortedPosts;
    }

    // Unpack reponses
    const {_friends, _blockedFriends} = await loadFriends();
    const {_posts, _postsCount}  = await loadPosts(_friends, _blockedFriends);
    const filteredAndSortedPosts = await filterAndSortPosts(_posts, communityPostCustomSortOption, _friends, _blockedFriends)

    // Update states
    setFriends(_friends);
    setBlockedFriends(_blockedFriends)
    setCommunityPosts(filteredAndSortedPosts);
    setCommunityPostCounts(_postsCount)
    setFilteredCommunityPostCounts(filteredAndSortedPosts.length)

    setIsCommunityPostsLoaded(true);
    setIsFriendsLoaded(true);
  };

  /* This method refresh the posts */
  const refreshCommunityPosts = () => {
    loadCommunityPosts();
  }

  /* This method updates the community post counts. It will be called whenever there's a 
  change to the Community Posts List */
  const updateCommunityPostCounts = (newCount) => {
    setCommunityPostCounts(newCount);
  };

  /* This method updates the community members counts. It will be called whenever there's a 
  change to the Community Members List */
  const updateCommunityMemberCounts = (newCount) => {
    setCommunityMemberCounts(newCount);
  };

  /* This method updates community member skip offset. It will be called whenever the user 
  interacts with pagination buttons on community members display view */
  const updateCommunityMemberSkipOffset = (offset) => {
    setCommunityMemberSkipOffset(
      communityMemberSkipOffset ? communityMemberSkipOffset + offset : offset
    );
  };

  /* This method updates community post skip offset. It will be called whenever the user 
  interacts with pagination buttons on community members display view */
  const updateCommunityPostSkipOffset = (offset) => {
    setCommunityPostSkipOffset(
      communityPostSkipOffset ? communityPostSkipOffset + offset : offset
    );
  };

  return (
    <div className={style["community-content-display"]}>
      {/* Community Stats */}
      <CommunityStats
        communityContentDisplayHandler={communityContentDisplayHandler}
        communityPostCounts={communityPostCounts}
        communityMemberCounts={communityMemberCounts}
      />

      {contentDisplayType === "posts" && isCommunityPostsLoaded && isFriendsLoaded && (
        <div>
          {/* Post Control Tool */}
          <PostControlTool 
            userCommunityMemberDetails={props.userCommunityMemberDetails}
            refreshCommunityDetails={props.refreshCommunityDetails}
            communityId={props.communityId}
            openToast={props.openToast}
            communityPostSortOption={communityPostSortOption}
            communityPostCustomSortOption={communityPostCustomSortOption}
            updateCommunityPostSortOption={updateCommunityPostSortOption}
            updateCommunityPostCustomSortOption={updateCommunityPostCustomSortOption}
          />
          {/* Commmunity Posts List */}
          <CommunityPostsList
            communityPosts={communityPosts}
            refreshPosts={refreshCommunityPosts}
            communityDetails={props.communityDetails}
            communityId={props.communityId}
            friends={friends}
            blockedFriends={blockedFriends}
            userCommunityMemberDetails={props.userCommunityMemberDetails}
            updateCommunityPostCounts={updateCommunityPostCounts}
            updateCommunityMemberCounts={updateCommunityMemberCounts}
            communityPostSkipOffset={communityPostSkipOffset}
            communityPostTakeCount={communityPostTakeCount}
            openToast={props.openToast}
            communityPostSortOption={communityPostSortOption}
            communityPostCustomSortOption={communityPostCustomSortOption}
            inProfile={props.inProfile}
          />
          {/* Pagination */}
          <Pagination
            contentSkipOffset={communityPostSkipOffset}
            contentsCount={filteredCommunityPostCounts}
            updateContentSkipOffset={updateCommunityPostSkipOffset}
            contentTakeCount={communityPostTakeCount}
          />
        </div>
      )}

      {contentDisplayType === "members" && (
        <div>
          {/* Member Control Tool */}
          <MemberControlTool 
            refreshCommunityDetails={props.refreshCommunityDetails}
            openToast={props.openToast}
          />
          {/* Comunity Members List */}
          <CommunityMembersList
            communityDetails={props.communityDetails}
            friends={friends}
            blockedFriends={blockedFriends}
            userCommunityMemberDetails={props.userCommunityMemberDetails}
            communityId={props.communityId}
            updateCommunityPostCounts={updateCommunityPostCounts}
            updateCommunityMemberCounts={updateCommunityMemberCounts}
            communityMemberSkipOffset={communityMemberSkipOffset}
            communityMemberTakeCount={communityMembersCount}
            openToast={props.openToast}
          />
          {/* Pagination */}
          <Pagination
            contentSkipOffset={communityMemberSkipOffset}
            contentsCount={communityMemberCounts}
            updateContentSkipOffset={updateCommunityMemberSkipOffset}
            contentTakeCount={communityMembersCount}
          />
        </div>
      )}
    </div>
  );
};

/* This component serves as a container for community stats like the number of posts 
and number of members. Each stat also serves as a navigation tab between CommunityPostsList 
and CommunityMembersList */
const CommunityStats = (props) => {
  const [isCommunityPostsTabActive, setIsCommunityPostsTabActive] = useState(true);
  const [isCommunityMembersTabActive, setIsCommunityMembersTabActive] = useState(false);

  /* This method handles posts tab click action */
  const communityPostsTabHandler = () => {
    setIsCommunityMembersTabActive(false);
    setIsCommunityPostsTabActive(true);
    props.communityContentDisplayHandler("posts");
  }
  
  /* This method handles members tab click action */
  const communityMembersTabHandler = () => {
    setIsCommunityPostsTabActive(false);
    setIsCommunityMembersTabActive(true);
    props.communityContentDisplayHandler("members");
  }

  // Change the posts tab style
  const communityPostsTabStyle = isCommunityPostsTabActive
    ? "community-stats-tab__active"
    : "community-stats-tab"; 
  
    // Change the members tab style
  const communityMembersTabStyle = isCommunityMembersTabActive
    ? "community-stats-tab__active"
    : "community-stats-tab"; 

  return (
    <div className={style["community-stats"]}>
      {/* Posts Tab */}
      <div
        className={style[communityPostsTabStyle]}
        onClick={communityPostsTabHandler}
      >
        <span className={style["active-text"]}>
          {props.communityPostCounts}
        </span>
        <span className={style["inactive-text"]}>Posts</span>
      </div>
      {/* Members Tab */}
      <div
        className={style[communityMembersTabStyle]}
        onClick={communityMembersTabHandler}
      >
        <span className={style["active-text"]}>
          {props.communityMemberCounts}
        </span>
        <span className={style["inactive-text"]}>Members</span>
      </div>
    </div>
  );
};

/* This component will render all the posts within a community. This list will update 
whenever user makes change to the post, this includes pinning the post, hiding the post, 
reporting the post, and removing the post. This component also include post control tool 
and pagination */
const CommunityPostsList = (props) => {
  const [posts, setPosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [communityPostAuthorRoles, setCommunityPostAuthorRoles] = useState({});

  // Check current user's community role & post author's role
  const isUserAdmin = props.userCommunityMemberDetails?.attributes.role === "admin";
  const isUserMod = props.userCommunityMemberDetails?.attributes.role === "mod";
  const isUserVisiter = props.userCommunityMemberDetails == null;

  // Fetch both posts and members when the component is loaded.
  useEffect(() => {
    setIsLoaded(false);
    slicePosts();
    loadMembers();
    setIsLoaded(true);
    console.log(props.blockedFriends)
  }, []);

  /* This hook slices posts whenever the community post skip offset has changed. The offset is changed by the Pagination component. */
  useEffect(() => {
    slicePosts();
  }, [props.communityPostSkipOffset]);

  /* This method loads the community members using genericFetch & update the community members count stat */
  const loadMembers = async () => {
    setIsLoaded(false);
    let endpoint = `/group-members`;
    let query = { groupID: props.communityId };
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage)
    if (data) {
      let postAuthorRoles = {};
      data[0].forEach(({ userID, attributes }) => {
        postAuthorRoles[userID] = attributes.role;
      });
      setCommunityPostAuthorRoles(postAuthorRoles);
      props.updateCommunityMemberCounts(data[1]);
    }
    setIsLoaded(true);
  };

  /* This methods updates current post display based on pagination offset */
  const slicePosts = async () => {
    // console.log("________slicing community posts_______");
    setIsLoaded(false);

    // Slice the posts with pagination indices
    const slicedPosts = await props.communityPosts.slice(
      props.communityPostSkipOffset, 
      props.communityPostSkipOffset + props.communityPostTakeCount
    );

    // console.log(slicedPosts)    
    setPosts(slicedPosts) 
    setIsLoaded(true);
  };

  /* This method checks whether the post is pinned or not */
  const isPinnedPost = (post) => {
    if (post?.reactions.filter((reaction) => reaction.name === "pin").length) {
      return true;
    }
    return false;
  };

  /* This method checks whether the post is friend post or not */
  const isFriendPost = (post) => {
    return props.friends.includes(post.authorID);
  };

  /* This method checks whether the post has been reported n times or not */
  const isReportedPost = (post) => {
    const reportThreshold = 3;
    if (
      post?.reactions.filter((reaction) => reaction.name === "report").length >=
      reportThreshold
    ) {
      return true;
    }
    return false;
  };

  /* This method checks whether the post is from blocked friend */
  const isBlockedFriendPost = (post) => {
    return props.blockedFriends.includes(post.authorID);
  };

  // Render
  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else if (!posts.length) {
    return <div>There're no posts.</div>;
  } else {
    return (
      <div>
        {/* Posts */}
        <div className={style["community-post-list"]}>
          {posts.map((post => (
            <CommunityPost
              key={post.id}
              communityId={props.communityId}
              post={post}
              refreshPosts={props.refreshPosts}
              userCommunityMemberDetails={props.userCommunityMemberDetails}
              communityPostAuthorRoles={communityPostAuthorRoles}
              isFriendPost={isFriendPost(post)}
              isPinnedPost={isPinnedPost(post)}
              isReportedPost={isReportedPost(post)}
              openToast={props.openToast}
            />
          )))}
        </div>
      </div>
    );
  }
};

/* This component will render a single post on community post list with all attributes like author, summary, reaction, post-action-menu, etc. */
const CommunityPost = (props) => {
  const [isPostActionActive, setIsPostActionActive] = useState(false);
  const [isCommunityPostModalOpen, setIsCommunityPostModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const postActionSidemenuRef = useRef(null); // Create a ref for post action sidemenu component

  /* This hook check if mousedown DOM event occurs outside a post action sidemenu.  */
  useEffect(() => {
    const outSideClickHandler = (event) => {
      if (
        postActionSidemenuRef.current &&
        !postActionSidemenuRef.current.contains(event.target)
      ) {
        setIsPostActionActive(false);
      }
    };
    document.addEventListener("mousedown", outSideClickHandler);

    return () => {
      document.removeEventListener("mousedown", outSideClickHandler);
    };
  });

  /* This method handles post actions such as pinning, hiding, reporting, or deleting.
  It's passed on to its child component - postActionSidemenu, where the action options are selected. */
  const postActionOptionsHandler = async (option) => {
    switch (option) {
      case "pin":
        await pinPost();
        break;
      case "unpin":
        await unpinPost();
        break;
      case "report":
        await reportPost();
        break;
      case "delete":
        deletePost();
        break;
      default:
        console.log(`Invalid Post Action: ${option}`);
    }
  };

  /* This method handles delete post action by sending DELETE request to API server. */
  const deletePost = async () => {
    // Send DELETE request to the database.
    const { data, errorMessage } = await genericDelete(
      `/posts/${props.post.id}`
    );
    // console.log(data, errorMessage)
    if (errorMessage) {
      props.openToast({type: "error", message: <span>Uh oh, sorry you can't delete the post at the moment. Please contact <Link to="about" style={{color: "var(--light-yellow", textDecoration: "underline"}}> our developers.</Link></span>});
    }
    props.openToast({ type: "success", message: "Post deleted successfully!" });
    props.refreshPosts();
  };

  /* This method handles pin post action by sending POST reaction request to API server. */
  const pinPost = async () => {
    let endpoint = `/post-reactions`;
    let body = {
      postID: props.post.id,
      reactorID: parseInt(sessionStorage.getItem("user")),
      name: "pin",
      value: 2,
      attributes: {},
    };
    const { data, errorMessage } = await genericPost(endpoint, body);
    if (errorMessage) {
      props.openToast({type: "error", message: <span>Uh oh, sorry you can't pin this post at the moment. Please contact <Link to="about" style={{color: "var(--light-yellow", textDecoration: "underline"}}> our developers.</Link></span>});
    } else {
      props.openToast({
        type: "success",
        message: "Post pinned successfully!",
      });
      props.refreshPosts();
    }
  };

  /* This method handles unpin post action by sending DELETE reaction request to API server.*/
  const unpinPost = async () => {
    // Retrieve the pin post reaction
    let endpoint = `/post-reactions`;
    let query = {
      postID: props.post.id,
      reactorID: parseInt(sessionStorage.getItem("user")),
      name: "pin",
    };
    const { data, errorMessage } = await genericFetch(endpoint, query);
    if (errorMessage) {
      props.openToast({type: "error", message: <span>Uh oh, sorry you can't unpin this post at the moment. Please contact <Link to="about" style={{color: "var(--light-yellow", textDecoration: "underline"}}> our developers.</Link></span>});
    } else {
      // Delete the pin post reaction
      let pinPostReactionId = data[0][0].id;
      let endpoint = `/post-reactions/${pinPostReactionId}`;
      const { data: deleteData, errorMessage: deleteErrorMessage } =
        await genericDelete(endpoint);
      if (deleteErrorMessage) {
        props.openToast({type: "error", message: <span>Uh oh, sorry you can't unpin this post at the moment. Please contact <Link to="about" style={{color: "var(--light-yellow", textDecoration: "underline"}}> our developers.</Link></span>});
      } else {
        props.openToast({
          type: "success",
          message: "Post unpinned successfully!",
        });
        props.refreshPosts();
      }
    }
  };

  /* This method handles report post action by sending POST request to API server. */
  const reportPost = async () => {
    let endpoint = `/post-reactions`;
    let body = {
      postID: props.post.id,
      reactorID: parseInt(sessionStorage.getItem("user")),
      name: "report",
      value: 1,
      attributes: {},
    };
    const { data, errorMessage } = await genericPost(endpoint, body);
    // console.log(data, errorMessage);
    if (errorMessage) {
      props.openToast({type: "error", message: <span>Uh oh, sorry you can't report this post at the moment. Please contact <Link to="about" style={{color: "var(--light-yellow", textDecoration: "underline"}}> our developers.</Link></span>});
    } else {
      props.openToast({
        type: "success",
        message: "Post reported successfully! The moderators will take actions soon.",
      });
      props.refreshPosts();
    }
  };

  /* This method toggles between post action active and inactive */
  const postActionButtonHandler = () => {
    setIsPostActionActive(isPostActionActive ? false : true);
  };

  /* This method opens post page modal */
  const openPostPageModal = () => {
    setIsCommunityPostModalOpen(true);
  };

  /* This method closes post page modal */
  const closePostPageModal = () => {
    props.refreshPosts(); // Refresh posts on post page modal close
    setIsCommunityPostModalOpen(true);
  };

  /* This method will open the Profile pop up Window */
  const openProfilePage = (e) => {
    e.stopPropagation();
    setIsProfileModalOpen(true);
  };

  /* This method will close the Profile pop up Window */
  const toggleProfile = (e) => {
    props.refreshPosts(); // Refresh posts on post page modal close
    setIsProfileModalOpen(false);
  };

  // Check if the post has been reported by the user 
  const isPostReportedByUser = Boolean(
    props.post?.reactions.filter(
      (reaction) =>
        reaction.name === "report" &&
        reaction.reactorID === parseInt(sessionStorage.getItem("user"))
    ).length
  );

  // Check if the post has been pinned by the user 
  const isPostPinnedByUser = Boolean(
    props.post?.reactions.filter(
      (reaction) =>
        reaction.name === "pin" &&
        reaction.reactorID === parseInt(sessionStorage.getItem("user"))
    ).length
  );

  // Set the number of likes on a post 
  function likes(props) {
    const reactions = props.post.reactions;
    // console.log(reactions)
    const like_count = new Set(
      reactions
        .map((item) => {
          if (item.name === "like") {
            return item.reactorID;
          }
        })
        .filter((item) => item !== null && item !== undefined)
    ).size;
    return (
      <div>
        <p>{like_count}</p>
      </div>
    );
  }

  // Check current user's community role & post author's role
  const isUserAdmin = props.userCommunityMemberDetails?.attributes.role === "admin";
  const isUserMod = props.userCommunityMemberDetails?.attributes.role === "mod";
  const isUserVisiter = props.userCommunityMemberDetails == null;
  const isAuthorUser = props.post.authorID === props.userCommunityMemberDetails?.user.id;
  const isAuthorAdmin = props.communityPostAuthorRoles[props.post.authorID] === "admin";
  const isAuthorMod = props.communityPostAuthorRoles[props.post.authorID] === "mod";
  const isAuthorMember = props.communityPostAuthorRoles[props.post.authorID] === "member";

  // Set post author role label
  const postAuthorRoleLabel = isAuthorUser
    ? "You"
    : isAuthorAdmin
    ? "Admin"
    : isAuthorMod
    ? "Mod"
    : isAuthorMember
    ? "Member"
    : "Departed";

  // Set post action restrictions
  const canPin = isUserAdmin || isUserMod;
  const canReport = !isUserVisiter && (!isAuthorUser && !isAuthorAdmin && !isAuthorMod) && !isUserAdmin;
  const canDelete = isAuthorUser || (isUserMod && !isAuthorAdmin && !isAuthorMod) || isUserAdmin;
  const canPostAction = canPin || canReport || canDelete;

  // Set post action icon style
  const postActionIconStyle = isPostActionActive 
    ? style["meatballs-icon__active"]
    : canPostAction
    ? style["meatballs-icon"]
    : style["meatballs-icon__inactive"];

  return (
    <div className={style["community-post"]} key={props.post.id}>
      {/* Clickable Area */}
      <div
        className={style["community-post__clickable-area"]}
        onClick={openPostPageModal}
      >
        {/* Post Thumbnail */}
        <img
          className={`${style["image"]} ${style["image__md"]} ${style["image__square"]}`}
          // src={postThumbnailImage}
          src={String(props.post.attributes?.images[0])}
          alt="Post placeholder"
          onError={(e) => (e.currentTarget.src = defaultPostImage)}
        />

        <div className={style["post-summary-stat-labels-container"]}>
          {/* Post Summary */}
          <div className={style["post-summary"]}>
            <div className={style["post-id-title"]}>
              <span className={style["inactive-text"]}>{props.post.id}</span>
              <span className={`${style["active-text"]} ${style["post-title"]}`}>
                {props.post.attributes.title}
              </span>
            </div>

            <div className={style["post-author-date"]}>
              <div className={style["post-author"]}>
                <span className={style["inactive-text"]}>Posted By</span>
                <Link onClick={openProfilePage}>
                  <p
                    className={`${style["active-text"]} ${style["post-author__link"]}`}
                  >
                    {/* Author Username */}
                    <span className={style["bold"]}>
                      {props.post.author?.attributes.profile.username}
                    </span>
                    {/* Author Role */}
                    <span>({postAuthorRoleLabel})</span>
                  </p>
                </Link>
              </div>
              <div className={style["post-date"]}>
                <span className={style["inactive-text"]}>Posted On</span>
                <span className={`${style["active-text"]} ${style["bold"]}`}>
                  {formatDateTime(props.post.created)}
                </span>
              </div>
            </div>
          </div>

          {/* Post Stat Labels */}
          <div className={style["post-stat-labels"]}>
            {/* Likes */}
            <div className={style["post-stat-label"]}>
              <span className={style["active-text"]}>{likes(props)}</span>
              <span className={style["inactive-text"]}>Likes</span>
            </div>
            {/* Comments */}
            <div className={style["post-stat-label"]}>
              <span className={style["active-text"]}>
                {props.post._count.children}
              </span>
              <span className={style["inactive-text"]}>Comments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Post Labels */}
      <div style={{position: "relative", marginLeft: "auto"}}>
        {/* Post Action Labels */}
        <div className={style["post-action-labels"]}>
          {props.isReportedPost && (
            <div
              className={`${style["post-action-label"]} ${style["post-action-label__french-bistre"]}`}
            >
              <span>Under Review</span>
            </div>
          )}
          {props.isFriendPost && (
            <div
              className={`${style["post-action-label"]} ${style["post-action-label__yellow-apricot"]}`}
            >
              <span>Friend</span>
            </div>
          )}
          {props.isPinnedPost && (
            <div
              className={`${style["post-action-label"]} ${style["post-action-label__skobeloff"]}`}
            >
              <span>Pinned</span>
            </div>
          )}
        </div>
      </div>

      {/* Post Action Sidemenu */}
      <div style={{ position: "relative" }} ref={postActionSidemenuRef}>
        <span
          className={postActionIconStyle}
          onClick={postActionButtonHandler}
        ></span>
        <PostActionSidemenu
          isActive={isPostActionActive}
          postActionOptionsHandler={postActionOptionsHandler}
          post={props.post}
          userCommunityMemberDetails={props.userCommunityMemberDetails}
          communityPostAuthorRoles={props.communityPostAuthorRoles}
          isPostPinnedByUser={isPostPinnedByUser}
          isPostReportedByUser={isPostReportedByUser}
          openToast={props.openToast}
        />
      </div>

      {/* Community Post Modal */}
      <Modal
        show={isCommunityPostModalOpen}
        onClose={closePostPageModal}
        modalStyle={{
          width: "90%",
          height: "90%",
        }}
      >
        <PostPage
          community_id={props.communityId}
          post_id={props.post.id}
          refreshPosts={props.refreshPosts}
          closePostPageModal={closePostPageModal}
          openToast={props.openToast}
        />
      </Modal>

      {/* Profile Page Modal */}
      <Modal
        show={isProfileModalOpen}
        onClose={toggleProfile}
        modalStyle={{
        width: "90%",
        height: "90%",
        }}
      >
          <ProfilePage 
            profile_id={props.post.author.id}
            toggleProfile={toggleProfile}
            closePostPageModal={closePostPageModal}
            openToast={props.openToast}
          />
      </Modal>
    </div>
  );
};

/* [TODO] This component serves as a container for two buttons - SortPostsButton and CreatePostButton. */
const PostControlTool = (props) => {
  const [isPostSortActive, setIsPostSortActive] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const postSortDropDownRef = useRef(null); // Create a ref for post sort dropdwon

  /* This hook check if mousedown DOM event occurs outside of assign post sort dropdown.  */
  useEffect(() => {
    const outSideClickHandler = (event) => {
      if(postSortDropDownRef.current && !postSortDropDownRef.current.contains(event.target)) {
        setIsPostSortActive(false);
      }
    }
    document.addEventListener('mousedown', outSideClickHandler);

    return () => {
      document.removeEventListener('mousedown', outSideClickHandler)
    }
  })

  // Toggles between post sort active and inactive
  const sortButtonToggleHandler = () => {
    setIsPostSortActive(isPostSortActive ? false : true);
  };

  /* This method handles create post button */
  const createButtonHandler = () => {
    if (props.userCommunityMemberDetails == null) {
      props.openToast({type: "info", message: "Join the community first to create a post!"});
    } else {
      openCreatePostPageModal();
    }
  }

  /* This method opens create post page modal */
  const openCreatePostPageModal = () => {
    setIsCreatePostModalOpen(true);
  }
  
  /* This method closes create post page modal */
  const closeCreatePostPageModal = () => {
    props.refreshCommunityDetails();
    setIsCreatePostModalOpen(true);
  }

  // Check current user's community role & member's community role
  const isUserVisiter = props.userCommunityMemberDetails == null;

  return (
    <div className={style["content-control-tool"]}>
      {/* Left Control */}
      <div className={style["left-control-box"]} ref={postSortDropDownRef}>
        {/* Sort Posts Button */}
        <button
          className={`${style["button"]} ${style["button__bordered"]} ${style["button__filled"]}`}
          onClick={sortButtonToggleHandler}
        >
          Sort Posts
        </button>
        {/* Sort Dropdown */}
        <PostSortDropdown 
          isActive={isPostSortActive}
          sortButtonToggleHandler={sortButtonToggleHandler} 
          communityPostSortOption={props.communityPostSortOption}
          communityPostCustomSortOption={props.communityPostCustomSortOption}
          updateCommunityPostSortOption={props.updateCommunityPostSortOption}
          updateCommunityPostCustomSortOption={props.updateCommunityPostCustomSortOption}
        />
      </div>
      {/* Right Control */}
      {props.userCommunityMemberDetails &&
        <div className={style["right-control-box"]} onClick={createButtonHandler} >
          {/* Create Post Button */}
          <div className={`${style["right-control-button-label"]} ${style["inactive-text"]}`}>
            Tell us your story!
          </div>
          <button 
            className={`${style["button"]} ${style["button__outlined"]} ${style["button__filled"]}`}
          >  
            Create Post
          </button>
        </div>
      }
      {/* Create Post Modal */}
      <Modal
        show={isCreatePostModalOpen}
        onClose={closeCreatePostPageModal}
        modalStyle={{
          width: "90%",
          height: "90%",
        }}
      >
        <CreatePost
          communityId={props.communityId}
          refreshCommunityDetails={props.refreshCommunityDetails}
          closeCreatePostPageModal={closeCreatePostPageModal}
          openToast={props.openToast}
        />
      </Modal>
    </div>
  );
};

/* [TODO] This component will render a dropdown menu that lists options like By Posted Date, 
By Likes, and By Comments. This will be triggered when the user clicks on SortPosts button. */
const PostSortDropdown = (props) => {
  const [isSortByNewestToOldest, setIsSortByNewestToOldest] = useState(props.communityPostSortOption === "newest");
  const [isSortByOldestToNewest, setIsSortByOldestToNewest] = useState(props.communityPostSortOption === "oldest");
  const [isSortByFriendToOther, setIsSortByFriendToOther] = useState(props.communityPostCustomSortOption === "friend");
  const [isSortByOtherToFriend, setIsSortByOtherToFriend] = useState(props.communityPostCustomSortOption === "other");

  /* This method handles sort by newest to oldest posted date option selection. */
  const sortByNewestToOldest = () => {
    props.updateCommunityPostSortOption("newest");
    props.sortButtonToggleHandler();
  }

  /* This method handles sort by oldest to newest posted date option selection.*/
  const sortByOldestToNewest = () => {
    props.updateCommunityPostSortOption("oldest");
    props.sortButtonToggleHandler();
  }

  /* This method handles sort by friend to other connection option selection.*/
  const sortByFriendToOther = () => {
    props.updateCommunityPostCustomSortOption("friend");
    props.sortButtonToggleHandler();
  }

  /* This method handles sort by other to friend connnection option selection.*/
  const sortByOtherToFriend = () => {
    props.updateCommunityPostCustomSortOption("other");
    props.sortButtonToggleHandler();
  }

  // Set sort option styles
  const sortByNewestToOldestOptionStyle = isSortByNewestToOldest && (!isSortByFriendToOther && !isSortByOtherToFriend)
    ? style["dropdown-option__active"]
    : style["dropdown-option"];
  const sortByOldestToNewestOptionStyle = isSortByOldestToNewest && (!isSortByFriendToOther && !isSortByOtherToFriend)
    ? style["dropdown-option__active"]
    : style["dropdown-option"];
  const sortByFriendToOtherOptionStyle = isSortByFriendToOther 
    ? style["dropdown-option__active"]
    : style["dropdown-option"];
  const sortByOtherToFriendOptionStyle = isSortByOtherToFriend 
    ? style["dropdown-option__active"]
    : style["dropdown-option"];

  // Render
  if (props.isActive) {
    return (
      <div className={style["dropdown"]}>
        <ul className={style["dropdown-option-list"]}>
          {/* By Posted Date: Newest to Oldest */}
          <li className={sortByNewestToOldestOptionStyle} onClick={sortByNewestToOldest}>
            <span className={`${style["square-icon"]} ${style["square-icon__bistre"]}`}></span>
            <div>
              <span className={style["inactive-text"]}>By Posted Date</span>
              <span className={style["active-text"]}>Newest to Oldest</span>
            </div>
          </li>
          {/* By Posted Date: Oldest to Newest */}
          <li className={sortByOldestToNewestOptionStyle} onClick={sortByOldestToNewest}>
            <span className={`${style["square-icon"]} ${style["square-icon__bistre"]}`}></span>
            <div>
              <span className={style["inative-text"]}>By Posted Date</span>
              <span className={style["active-text"]}>Oldest to Newest</span>
            </div>
          </li>
          {/* By Connection: Friend to Other */}
          <li className={sortByFriendToOtherOptionStyle} onClick={sortByFriendToOther}>
            <span className={`${style["square-icon"]} ${style["square-icon__yellow-apricot"]}`}></span>
            <div>
              <span className={style["inactive-text"]}>By Connection</span>
              <span className={style["active-text"]}>Friend to Other</span>
            </div>
          </li>
          {/* By Connection: Other to Friend */}
          <li className={sortByOtherToFriendOptionStyle} onClick={sortByOtherToFriend}>
            <span className={`${style["square-icon"]} ${style["square-icon__yellow-apricot"]}`}></span>
            <div>
              <span className={style["inactive-text"]}>By Connection</span>
              <span className={style["active-text"]}>Other to Friend</span>
            </div>
          </li>
        </ul>
        {/* Show Friend Post on Top? */}
        {/* <div className={style["dropdown-option"]}>
          <span>Friend posts on Top?</span>
        </div> */}
      </div>
    );
  }
};

/* [TODO] This component will render a post action sidemenu that lists options like pin to top, 
hide, report, and delete. This component will be triggered when the user clicks on '...' icon on each post. 
* Pin & Hide are user-specific actions, and they should persist to only user's post list.
* Report & Delete are global actions, and they should persist to all users' post lists. */
const PostActionSidemenu = (props) => {
  // Check current user's community role & post author's role
  const isUserAdmin = props.userCommunityMemberDetails?.attributes.role === "admin";
  const isUserMod = props.userCommunityMemberDetails?.attributes.role === "mod";
  const isUserVisiter = props.userCommunityMemberDetails == null;
  const isAuthorUser = props.post.authorID === props.userCommunityMemberDetails?.user.id;
  const isAuthorAdmin = props.communityPostAuthorRoles[props.post.authorID] === "admin";
  const isAuthorMod = props.communityPostAuthorRoles[props.post.authorID] === "mod";

  // These methods update the option labels and send the chosen action option to its parent component - CommunityPost.
  const pinActionHandler = () => {
    if (props.isPostPinnedByUser) {
      props.postActionOptionsHandler("unpin");
    } else {
      props.postActionOptionsHandler("pin");
    }
  };

  const reportActionHandler = () => {
    if (props.isPostReportedByUser) {
      props.openToast({
        type: "info",
        message: (
          <span>
            You've already reported this post. The moderators will take actions soon.
          </span>
        ),
      });
    } else {
      props.postActionOptionsHandler("report");
    }
  };
  
  const deleteActionHandler = () => {
    props.postActionOptionsHandler("delete");
  };

  // Set option names
  let pinOptionName = props.isPostPinnedByUser ? "Unpin" : "Pin to top";
  let reportOptionName = props.isPostReportedByUser ? "Reported" : "Report";
  let deleteOptionName = "Delete";

  // Set action restrictions
  const canPin = isUserAdmin || isUserMod
  const canReport = !isUserVisiter && (!isAuthorUser && !isAuthorAdmin && !isAuthorMod) && !isUserAdmin
  const canDelete = isAuthorUser || (isUserMod && !isAuthorAdmin && !isAuthorMod) || isUserAdmin

  if (props.isActive) {
    return (
      <div className={style["action-sidemenu"]}>
        <ul className={style["action-sidemenu-option-list"]}>
          {/* Pin */}
          {canPin && (
            <li
              className={style["action-sidemenu-option"]}
              onClick={pinActionHandler}
            >
              <span
                className={`${style["square-icon"]} ${style["square-icon__skobeloff"]}`}
              ></span>
              <span className={style["active-text"]}>{pinOptionName}</span>
            </li>
          )}
          {/* Report */}
          {canReport && (
            <li
              className={style["action-sidemenu-option"]}
              onClick={reportActionHandler}
            >
              <span
                className={`${style["square-icon"]} ${style["square-icon__french-bistre"]}`}
              ></span>
              <span className={style["active-text"]}>{reportOptionName}</span>
            </li>
          )}
          {/* Delete */}
          {canDelete && (
            <li
              className={style["action-sidemenu-option"]}
              onClick={deleteActionHandler}
            >
              <span
                className={`${style["square-icon"]} ${style["square-icon__red-orange"]}`}
              ></span>
              <span className={style["active-text"]}>{deleteOptionName}</span>
            </li>
          )}
        </ul>
      </div>
    );
  }
};

/* This component will render all members within a community. This component also include member control tool and pagination */
const CommunityMembersList = (props) => {
  const [members, setMembers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch both posts and members when the component is loaded.
  useEffect(() => {
    setIsLoaded(false);
    loadMembers();
    loadPosts();
    setIsLoaded(true);
  }, []);

  // Refresh members whenever the community member skip offset has changed. The offset is changed by the Pagination component
  useEffect(() => {
    refreshMembers();
  }, [props.communityMemberSkipOffset]);

  // This methods loads the community posts using genericFetch & update the community posts count stat
  const loadPosts = async () => {
    setIsLoaded(false);
    let endpoint = "/posts";
    let query = {
      sort: "newest",
      parentID: "",
      recipientGroupID: props.communityId,
    };
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage)
    if (data) {
      props.updateCommunityPostCounts(data[1]);
    }
    setIsLoaded(true);
  };

  // This methods loads the community members using genericFetch & update the community members count stat
  const loadMembers = async () => {
    setIsLoaded(false);
    let endpoint = `/group-members`;
    let query = {
      groupID: props.communityId,
      ...(props.communityMemberSkipOffset && {
        skip: props.communityMemberSkipOffset,
      }),
      ...(props.communityMemberTakeCount && {
        take: props.communityMemberTakeCount,
      }),
    };
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage)
    if (errorMessage) {
      setErrorMessage(errorMessage);
    } else {
      setMembers(data[0]);
      props.updateCommunityMemberCounts(data[1]);
    }
    setIsLoaded(true);
  };

  // This method refresh the members by sending the request to API again using genricFetch.
  const refreshMembers = () => {
    // console.log("refreshing members");
    loadMembers(); // Fetch the members again
  };

  /* This method checks whether the member is admin or not */
  const isMemberAdmin = (member) => {
    return member.attributes.role === "admin";
  }

  /* This method checks whether the member is mod or not */
  const isMemberMod = (member) => {
    return member.attributes.role === "mod";
  }

  /* This method checks whether the memebr is user or not */
  const isMemberUser = (member) => {
    return member.userID === parseInt(sessionStorage.getItem("user"));
  }

  /* This method checks whether the member is friend or not */
  const isMemberFriend = (member) => {
    return props.friends.includes(member.userID)
  }

  // Sort members by following order: User > Admin > Mod > Friend > Other
  const sortedMembers = members.sort(
    (memberA, memberB) => 
      isMemberUser(memberB) - isMemberUser(memberA) ||
      isMemberAdmin(memberB) - isMemberAdmin(memberA) ||
      isMemberMod(memberB) - isMemberMod(memberA)
  )

  // Render
  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else if (!members.length) {
    return <div>There're no members.</div>
  } else {
    return (
      <div>
        {/* Member */}
        <div className={style["community-members-list"]}>
          {sortedMembers.map((member) => (
            <CommunityMember
              key={member.id}
              member={member}
              refreshMembers={refreshMembers}
              userCommunityMemberDetails={props.userCommunityMemberDetails}
              openToast={props.openToast}
              isMemberFriend={isMemberFriend(member)}
            />
          ))}
        </div>
      </div>
    );
  }
};

/* [TODO] This component will render a single member on community members list with all attributes like 
username, role, etc. */
const CommunityMember = (props) => {
  const [isMemberActionActive, setIsMemberActionActive] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const memberActionSidemenuRef = useRef(null); // Create a ref for memver action sidemenu component

  /* This hook check if mousedown DOM  event occurs outside a member action sidemenu.  */
  useEffect(() => {
    const outSideClickHandler = (event) => {
      if(memberActionSidemenuRef.current && !memberActionSidemenuRef.current.contains(event.target)) {
        setIsMemberActionActive(false);
      }
    }
    document.addEventListener('mousedown', outSideClickHandler);

    return () => {
      document.removeEventListener('mousedown', outSideClickHandler)
    }
  })

  /* This method toggles between post action active and inactive */
  const memberActionButtonHandler = () => {
    setIsMemberActionActive(isMemberActionActive ? false : true);
  };

  /* This method handles member actions such as view profile, block, report, or kick.
  It's passed on to its child component - memberActionSidemenu, where the action options are selected. */
  const memberActionOptionsHandler = (option) => {
    switch (option) {
      case "kick":
        // console.log(option);
        kickMember();
        break;
      case "assign":
        // console.log(option);
        break;
      default:
        console.log(`Invalid Post Action: ${option}`);
    }
  };

  /* This method handles kick member action. */
  const kickMember = async () => {
    // Send DELETE request to the database.
    const { data, errorMessage } = await genericDelete(
      `/group-members/${props.member.id}`
    );
    // console.log(data, errorMessage)
    if (errorMessage) {
      props.openToast({type: "error", message: <span>Uh oh, sorry you can't remove a member at the moment. Please contact <Link to="about" style={{color: "var(--light-yellow", textDecoration: "underline"}}> our developers.</Link></span>});
    }
    props.openToast({ type: "success", message: "Member removed successfully!" });
    props.refreshMembers();
  };


  /* This method will open the Profile pop up Window */
  const openProfilePage = (e) => {
    setIsProfileModalOpen(true);
  }

  /* This method will close the Profile pop up Window */
  const toggleProfile = (e) => {
    setIsProfileModalOpen(false);
    props.refreshMembers();
  }

  // Check current user's community role & member's community role
  const isUserAdmin = props.userCommunityMemberDetails?.attributes.role === "admin";
  const isUserMod = props.userCommunityMemberDetails?.attributes.role === "mod";
  const isUserVisiter = props.userCommunityMemberDetails == null;
  const isMemberUser = props.member.userID === props.userCommunityMemberDetails?.user.id;
  const isMemberAdmin = props.member.attributes.role === "admin";
  const isMemberMod = props.member.attributes.role === "mod";

  // Set member action restrictions
  const canAssignRole = isUserAdmin && !isMemberUser;
  const canKick = ((isUserAdmin || isUserMod) && (!isMemberUser && !isMemberAdmin && !isMemberMod)) || (isUserAdmin && !isMemberUser);
  const canMemberAction = canAssignRole || canKick;

  // Set member action icon style
  const memberActionIconStyle = isMemberActionActive
    ? style["meatballs-icon__active"]
    : canMemberAction
    ? style["meatballs-icon"]
    : style["meatballs-icon__inactive"];

  // Set community member style
  const commmunityMemberStyle = isMemberUser
    ? `${style["community-member"]} ${style["community-member__filled"]}`
    : `${style["community-member"]}`;

  return (
    <div className={commmunityMemberStyle}>
      <div
        className={style["community-member__clickable-area"]}
        onClick={openProfilePage}
      >
        {/* Community Member Profile Avatar */}
        <img
          className={`${style["image"]} ${style["image__md"]} ${style["image__round"]}`}
          src={props.member.user.attributes.profile.profileImage}
          alt="Community member profile"
          onError={(e) => (e.currentTarget.src = defaultProfileImage)}
        />

        {/* Community Member Info */}
        <div className={style["community-member-info"]}>
          <div>
            {/* Community Member Username */}
            <span className={`${style["active-text"]} ${style["bold"]}`}>
              {props.member.user.attributes.profile.username}
            </span>
            {/* Community Member Role */}
            <span className={style["inactive-text"]}>
              {props.member.attributes.role}
            </span>
          </div>
        </div>
      </div>

      {/* Member Labels */}
      <div style={{position: "relative", marginLeft: "auto"}}>
      {/* Member Action Labels */}
        <div className={style["member-action-labels"]}>
          {props.isMemberFriend && (
            <div
              className={`${style["member-action-label"]} ${style["member-action-label__yellow-apricot"]}`}
            >
              <span>Friend</span>
            </div>
          )}
        </div>
      </div>

      {/* Member Action Side Menu */}
      <div style={{ position: "relative" }} ref={memberActionSidemenuRef}>
        <span
          className={memberActionIconStyle}
          onClick={memberActionButtonHandler}
        ></span>
        <MemberActionSidemenu
          isActive={isMemberActionActive}
          memberActionOptionsHandler={memberActionOptionsHandler}
          member={props.member}
          userCommunityMemberDetails={props.userCommunityMemberDetails}
          refreshMembers={props.refreshMembers}
          openToast={props.openToast}
        />
      </div>

      {/* Profile Page Modal */}
      <Modal
        show={isProfileModalOpen}
        onClose={toggleProfile}
        modalStyle={{
          width: "90%",
          height: "90%",
        }}
      >
        <ProfilePage 
            profile_id={props.member.user.id}
            toggleProfile={toggleProfile}
            openToast={props.openToast}
        />
      </Modal>
    </div>
  );
};

/* [TODO] This component serves as a container for two buttons - SortMembersButton and SearchMemberButton. */
const MemberControlTool = () => {
  const [isPostSortActive, setIsPostSortActive] = useState(false);

  // Toggles between post sort active and inactive
  const sortButtonToggleHandler = () => {
    setIsPostSortActive(isPostSortActive ? false : true);
  };

  return (
    <div className={style["content-control-tool"]}>
      <div className={style["left-control-box"]}>
        <button
          style={{display: "none"}}
          className={`${style["button"]} ${style["button__bordered"]} ${style["button__filled"]}`}
          onClick={sortButtonToggleHandler}
          disabled
        >
          Sort Members
        </button>
        <MemberSortDropdown isActive={isPostSortActive} />
      </div>
      <div 
        style={{display: "none"}}
        className={style["right-control-box"]} 
      >
        <div
          className={`${style["right-control-button-label"]} ${style["inactive-text"]}`}
        >
          Who are you looking for?
        </div>
        <button
          className={`${style["button"]} ${style["button__outlined"]} ${style["button__filled"]}`}
          disabled
        >
          Search Member
        </button>
      </div>
    </div>
  );
};

/* [TODO] This component will render a dropdown menu that lists options like By Joined Date and 
By Role. This will be triggered when the user clicks on SortMembers button. */
const MemberSortDropdown = (props) => {
  if (props.isActive) {
    return (
      <div className={style["dropdown"]}>
        <ul className={style["dropdown-option-list"]}>
          {/* By Joined Date */}
          <li className={style["dropdown-option"]}>
            <span className={style["active-text"]}>By Joined Date</span>
            <span className={style["inactive-text"]}>Newest to Oldest</span>
          </li>
          {/* By Role */}
          <li className={style["dropdown-option"]}>
            <span className={style["active-text"]}>By Role</span>
            <span className={style["inactive-text"]}>Admin to Member</span>
          </li>
        </ul>
      </div>
    );
  }
};

/* [TODO] This component will render a member action sidemenu that lists options like view profile, 
block, report, and kick. This component will be triggered when the user clicks on '...' icon on each member. 
Some of these member action options should be user-specific. For example, "Kick" option should only available 
to admin or mods.

* Block is user-specific action, and they should persist to only user's member list.
* Report & Kick are global actions, and they should persist to all users' member lists. */
const MemberActionSidemenu = (props) => {
  const [isAssignRole, setIsAssignRole] = useState(false);
  const assignRoleSidemenuRef = useRef(null); // Create a ref for assign role sidemenu component

  /* This hook check if mousedown DOM  event occurs outside of assign role sidemenu.  */
  useEffect(() => {
    const outSideClickHandler = (event) => {
      if(assignRoleSidemenuRef.current && !assignRoleSidemenuRef.current.contains(event.target)) {
        setIsAssignRole(false);
      }
    }
    document.addEventListener('mousedown', outSideClickHandler);

    return () => {
      document.removeEventListener('mousedown', outSideClickHandler)
    }
  })

  // These methods update the option labels and send the chosen action option to its parent component - CommunityMember.
  const kickActionHandler = () => {
    props.memberActionOptionsHandler("kick");
  };

  const assignRoleActionHandler = () => {
    setIsAssignRole(isAssignRole ? false : true);
    props.memberActionOptionsHandler("assign");
  }

  // Check current user's community role & member's community role
  const isUserAdmin = props.userCommunityMemberDetails?.attributes.role === "admin";
  const isUserMod = props.userCommunityMemberDetails?.attributes.role === "mod";
  const isUserVisiter = props.userCommunityMemberDetails == null;
  const isMemberUser = props.member.userID === props.userCommunityMemberDetails?.user.id;
  const isMemberAdmin = props.member.attributes.role === "admin";
  const isMemberMod = props.member.attributes.role === "mod";

  // Set option names
  let kickOptionName = "Kick";
  let assignOptionName = "Assign Role";

  // Set member action restrictions
  const canAssignRole = isUserAdmin && !isMemberUser;
  const canKick = ((isUserAdmin || isUserMod) && (!isMemberUser && !isMemberAdmin && !isMemberMod)) || (isUserAdmin && !isMemberUser);

  if (props.isActive) {
    return (
      <div className={style["action-sidemenu"]}>
        <ul className={style["action-sidemenu-option-list"]}>
          {/* Assign Role */}
          {canAssignRole &&
            <div ref={assignRoleSidemenuRef}>
              <li className={style["action-sidemenu-option"]} onClick={assignRoleActionHandler}>
                <span className={`${style["square-icon"]} ${style["square-icon__french-bistre"]}`}></span>
                <span className={style["active-text"]}>{assignOptionName}</span>
              </li>
              <AssignRoleSidemenu 
                isActive={isAssignRole}
                member={props.member}
                refreshMembers={props.refreshMembers}
                openToast={props.openToast}
              />
            </div>
          }
          {/* Kick */}
          {canKick &&
            <li className={style["action-sidemenu-option"]} onClick={kickActionHandler}>
              <span className={`${style["square-icon"]} ${style["square-icon__red-orange"]}`}></span>
              <span className={style["active-text"]}>{kickOptionName}</span>
            </li>
          }
        </ul>
      </div>
    );
  }
};

/* [TODO] This component will render a assign role sidemenu that lists options "mod" and "member". This component
will be triggered when the user clicks on "Assign Role" from member action sidemenu */
const AssignRoleSidemenu = (props) => {
  const currentMemberRole = props.member.attributes.role

  // This method assigns new role to member by sending PATCH request to the API server.
  const assignNewRole = async (newMemberRole) => {
    let endpoint = `/group-members/${props.member.id}`;
    let body = {
      userId: props.member.userID,
      groupID: props.member.groupID,
      attributes: {
        ...props.member.attributes,
        role: newMemberRole
      }
    }
    const { data, errorMessage } = await genericPatch(endpoint, body);
    // console.log(data, errorMessage)
    if (errorMessage) {
      props.openToast({type: "error", message: <span>Uh oh, sorry you can't update member role at the moment. Please contact <Link to="about" style={{color: "var(--light-yellow", textDecoration: "underline"}}> our developers.</Link></span>});
    } else {
      props.openToast({type: "success", message: `Successfully updated ${props.member.user.attributes.profile.username}'s role to ${newMemberRole}`})
      props.refreshMembers();
    }
  };

  
  // This method handles member role option select
  const memberRoleOptionHandler = async (memberRole) => {
    if (memberRole !== currentMemberRole) {
      await assignNewRole(memberRole);
    }
  }

  if (props.isActive) {
    return (
      <div className={style["nested-action-sidemenu"]}>
        <ul className={style["action-sidemenu-option-list"]}>
          {/* Assign Member Role */}
          {currentMemberRole === "mod" && (
            <div>
              <li className={style["action-sidemenu-option"]} onClick={() => memberRoleOptionHandler('member')}>
                <span className={`${style["square-icon"]} ${style["square-icon__french-bistre"]}`}></span>
                <span className={style["active-text"]}>Member</span>
              </li>
            </div>
          )}
          {/* Assign Mod Role */}
          {currentMemberRole === "member" && (
            <div>
              <li className={style["action-sidemenu-option"]} onClick={() => memberRoleOptionHandler('mod')}>
                <span className={`${style["square-icon"]} ${style["square-icon__french-bistre"]}`}></span>
                <span className={style["active-text"]}>Mod</span>
              </li>
            </div>
          )}
        </ul>
      </div>
    );
  }
}

/* This component will render a pagination for communityPostList and CommunityMemberList. 
It contains previous button, next button, and current page indicatior. */
const Pagination = (props) => {
  const [currentPage, setCurrentPage] = useState((props.contentSkipOffset / props.contentTakeCount) + 1);

  useEffect(() => {
    updateCurrentPage();
    // console.log("Pagination Change:", (props.contentSkipOffset / props.contentTakeCount) + 1);
  }, [props.contentSkipOffset])


  /* This method updates pagination's current page based on current content skip offset */
  const updateCurrentPage = () => {
    setCurrentPage((props.contentSkipOffset / props.contentTakeCount) + 1)
  }

  /* This method scrolls the window to top */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0
    });
  }

  // Calculate last Page
  const lastPage = Math.ceil(props.contentsCount / props.contentTakeCount);
  // console.log(currentPage, lastPage)

  const handlePreviousPage = () => {
    // console.log(currentPage)
    // setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage);
    props.updateContentSkipOffset(props.contentTakeCount * -1);
    scrollToTop();
  };

  const handleNextPage = () => {
    // console.log(currentPage);
    // setCurrentPage(currentPage < props.contentsCount ? currentPage + 1 : currentPage);
    props.updateContentSkipOffset(props.contentTakeCount);
    scrollToTop();
  };

  return (
    <div className={style["pagination"]}>
      {/* Prev Button */}
      {currentPage > 1 && (
        <button
          className={`${style["button"]} ${style["button__bordered"]} ${style["button__filled"]}`}
          onClick={handlePreviousPage}
        >
          Previous
        </button>
      )}

      {/* Current Page Number */}
      <span className={style["page-number"]}>
        {props.contentsCount > props.contentTakeCount && currentPage}
      </span>

      {/* Next Button */}
      {currentPage < lastPage && (
        <button
          className={`${style["button"]} ${style["button__bordered"]} ${style["button__filled"]}`}
          onClick={handleNextPage}
        >
          Next
        </button>
      )}
    </div>
  );
}