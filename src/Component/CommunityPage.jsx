import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import genericFetch from "../helper/genericFetch";
import genericDelete from "../helper/genericDelete";
import style from "../style/CommunityPage.module.css";
import defaultProfileImage from "../assets/defaultProfileImage.png";
import defaultPostImage from "../assets/defaultPostImage.png";
import defaultCommunityImage from "../assets/defaultCommunityImage.png";

/* This component renders a single community page. Inside the community page, 
there are posts tab and members tab. */
export default function CommunityPage(props) {
  const { communityId } = useParams(); // Retrieve the community id from the URL Param
  const [communityDetails, setCommunityDetails] = useState(null);
  const [userCommunityMemberDetails, setUserCommunityMemberDetails] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch the community details when the community page is loaded
  useEffect(() => {
    loadCommunityAndUser();
  }, []);

  /* This method loads both the community and user community member details */
  const loadCommunityAndUser = async () => {
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

  /* This method refresh the communit details by sending the API request again.
  It can be passed on to child components that can change the state of the community page. 
  Note, currently the only attributes the community page maintains is its banner design.
  Perhaps, this can be called when the community admin/mod wishes to change the style of the community. */
  const refreshCommunityDetails = async () => {
    // console.log("refreshing community details");
    setIsLoaded(false);
    await loadCommunityDetails(); // Fetch the community details again
    setIsLoaded(true);
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
        />

        {/* Main section */}
        <div className={style["main-section"]}>
          {/* Main Content Display */}
          <CommunityContentDisplay
            communityId={communityId}
            userCommunityMemberDetails={userCommunityMemberDetails}
          />
        </div>
      </div>
    );
  }
}

/* [TODO] This component serves as container for banner contents. Inside the banner, 
there's community name, community background, community icon, and a join button*/
const CommunityBanner = (props) => {
  let bannerColor = props.communityDetails.attributes.design.bannerColor
    ? `#${props.communityDetails.attributes.design.bannerColor}`
    : "#f3c26e";

  // Set post thumbnail image
  let bannerBackgroundImage = props.communityDetails.attributes.design
    .bannerBackgroundImage
    ? props.communityDetails.attributes.design.bannerBackgroundImage
    : "";

  // Check current user's community role & joined state
  const isUserAdmin = props.userCommunityMemberDetails?.attributes.role === "admin";
  const isUserMod = props.userCommunityMemberDetails?.attributes.role === "mod";
  const isUserJoined = props.userCommunityMemberDetails != null;

  return (
    <div className={style["community-banner"]}>
      {/* Community Banner Background */}
      <div
        className={style["community-banner-background"]}
        style={{ backgroundImage: `url(${bannerBackgroundImage})` }}
      ></div>

      {/* Commnity Banner Content*/}
      <div
        className={style["community-banner-content"]}
        style={{ backgroundColor: bannerColor }}
      >
        {/* Community Banner Content Left */}
        <div className={style["community-banner-content-left"]}>
          {/* Community Avatar Image */}
          <img
            className={`${style["image"]} ${style["image__sm"]} ${style["image__square"]}`}
            src={props.communityDetails.attributes.design.bannerBackgroundImage}
            onError={(e) => (e.currentTarget.src = defaultCommunityImage)}
            alt="Community background"
          />
          {/* Community Info */}
          <div className={style["community-info"]}>
            <h2>{props.communityDetails.name}</h2>
            <span className={style["inactive-text"]}>
              Since February 19th, 2023
            </span>
          </div>
          {/* Edit Button */}
          {(isUserAdmin || isUserMod) && (
            <button
              className={`${style["button"]} ${style["button__bordered"]}`}
            >
              Edit
            </button>
          )}
        </div>
        {/* Community Banner Content Right */}
        <div className={style["community-banner-content-right"]}>
          {/* Notification Button */}
          {isUserJoined &&
            <button className={`${style["button"]} ${style["button__bordered"]}`}>
              Notfication
            </button>
          }
          {/* Join Button */}
          <button className={`${style["button"]} ${style["button__bordered"]}`}>
            {props.userCommunityMemberDetails ? "Joined" : "Join"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* [TODO] This component will render either the community posts list or community members list. 
The type of content to display is chosen by the community stats tab*/
const CommunityContentDisplay = (props) => {
  const [contentDisplayType, setContentDisplayType] = useState("posts");
  const [communityPostCounts, setCommunityPostCounts] = useState(0);
  const [communityMemberCounts, setCommunityMemberCounts] = useState(0);
  const [communityPostSkipOffset, setCommunityPostSkipOffset] = useState(null);
  const [communityPostTakeCount, setCommunityPostTakeCount] = useState(10);
  const [communityMemberSkipOffset, setCommunityMemberSkipOffset] = useState(null);
  const [communityMembersCount, setCommunityMembersTakeCount] = useState(15);

  // This method updates the current content display type as either posts or members.
  // It's passed on to its child component - CommunityStats, where the options are selected.
  // Then the CommunityContentDisplay component renders based on the display type (post list or members list)
  const postContentDisplayHandler = (type) => {
    setCommunityPostSkipOffset(null);
    setCommunityMemberSkipOffset(null);
    setContentDisplayType(type);
  };

  // This method updates the community post counts
  // It will be called whenever there's a change to the Community Posts List
  const updateCommunityPostCounts = (newCount) => {
    setCommunityPostCounts(newCount);
  };

  // This method updates the community members counts
  // It will be called whenever there's a change to the Community Members List
  const updateCommunityMemberCounts = (newCount) => {
    setCommunityMemberCounts(newCount);
  };


  // This method updates community member skip offset
  // It will be called whenever the user interacts with pagination buttons on community members display view
  const updateCommunityMemberSkipOffset = (offset) => {
    setCommunityMemberSkipOffset(
      communityMemberSkipOffset ? communityMemberSkipOffset + offset : offset
    );
  };

  // This method updates community post skip offset
  // It will be called whenever the user interacts with pagination buttons on community members display view
  const updateCommunityPostSkipOffset = (offset) => {
    setCommunityPostSkipOffset(
      communityPostSkipOffset ? communityPostSkipOffset + offset : offset
    );
  };

  return (
    <div className={style["community-content-display"]}>
      {/* Community Stats */}
      <CommunityStats
        postContentDisplayHandler={postContentDisplayHandler}
        communityPostCounts={communityPostCounts}
        communityMemberCounts={communityMemberCounts}
      />

      {contentDisplayType === "posts" && (
        <div>
          {/* Post Control Tool */}
          <PostControlTool 
            userCommunityMemberDetails={props.userCommunityMemberDetails}
          />
          {/* Commmunity Posts List */}
          <CommunityPostsList
            userCommunityMemberDetails={props.userCommunityMemberDetails}
            communityId={props.communityId}
            updateCommunityPostCounts={updateCommunityPostCounts}
            updateCommunityMemberCounts={updateCommunityMemberCounts}
            communityPostSkipOffset={communityPostSkipOffset}
            communityPostTakeCount={communityPostTakeCount}
          />
          {/* Pagination */}
          <Pagination
            contentsCount={communityPostCounts}
            updateContentSkipOffset={updateCommunityPostSkipOffset}
            contentTakeCount={communityPostTakeCount}
          />
        </div>
      )}

      {contentDisplayType === "members" && (
        <div>
          {/* Member Control Tool */}
          <MemberControlTool />
          {/* Comunity Members List */}
          <CommunityMembersList
            userCommunityMemberDetails={props.userCommunityMemberDetails}
            communityId={props.communityId}
            updateCommunityPostCounts={updateCommunityPostCounts}
            updateCommunityMemberCounts={updateCommunityMemberCounts}
            communityMemberSkipOffset={communityMemberSkipOffset}
            communityMemberTakeCount={communityMembersCount}
          />
          {/* Pagination */}
          <Pagination
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
  return (
    <div className={style["community-stats"]}>
      <div
        className={style["community-stats-tab"]}
        onClick={() => props.postContentDisplayHandler("posts")}
      >
        <span className={style["active-text"]}>
          {props.communityPostCounts}
        </span>
        <span className={style["inactive-text"]}>Posts</span>
      </div>
      <div
        className={style["community-stats-tab"]}
        onClick={() => props.postContentDisplayHandler("members")}
      >
        <span className={style["active-text"]}>
          {props.communityMemberCounts}
        </span>
        <span className={style["inactive-text"]}>Members</span>
      </div>
    </div>
  );
};

/* [TODO] This component will render all the posts within a community. This list will update 
whenever user makes change to the post, this includes pinning the post, hiding the post, 
reporting the post, and removing the post. This component also include post control tool 
and pagination */
const CommunityPostsList = (props) => {
  const [posts, setPosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [communityPostAuthorRoles, setCommunityPostAuthorRoles] = useState({});

  // Fetch both posts and members when the component is loaded.
  useEffect(() => {
    loadPosts();
    loadMembers();
  }, []);

  // Refresh posts whenever the community post skip offset has changed. The offset is changed by the Pagination component.
  useEffect(() => {
    refreshPosts();
  }, [props.communityPostSkipOffset]);

  // This methods loads the community members using genericFetch & update the community members count stat
  const loadMembers = async () => {
    setIsLoaded(false);
    let endpoint = `/group-members`;
    let query = { groupID: props.communityId };
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage)
    if (data) {
      let postAuthorRoles = {};
      data[0].forEach(( {userID, attributes} )=> {
        postAuthorRoles[userID] = attributes.role
      })
      setCommunityPostAuthorRoles(postAuthorRoles);
      props.updateCommunityMemberCounts(data[1]);
    }
  };

  // This methods loads the community posts using genericFetch & update the community posts count stat
  const loadPosts = async () => {
    setIsLoaded(false);
    let endpoint = "/posts";
    let query = {
      sort: "newest",
      parentID: "",
      recipientGroupID: props.communityId,
      ...(props.communityPostSkipOffset && {
        skip: props.communityPostSkipOffset,
      }),
      ...(props.communityPostTakeCount && {
        take: props.communityPostTakeCount,
      }),
    };
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage)
    if (errorMessage) {
      setErrorMessage(errorMessage);
    } else {
      setPosts(data[0]);
      props.updateCommunityPostCounts(data[1]);
    }
    setIsLoaded(true);
  };

  // This method refresh the posts by sending the request to API again using genricFetch.
  // It can be passed on to each CommunityPost component to handle changes,
  // such as pinning, hiding, reporting, or deleting. It can also be passed on to Pagination
  // component with skip and take query.
  const refreshPosts = () => {
    // console.log("refreshing posts");
    loadPosts(); // Fetch the posts again
  };

  // Render Component
  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    if (posts) {
      return (
        <div>
          {/* Posts */}
          <div className={style["community-post-list"]}>
            {posts.map((post) => (
              <CommunityPost
                key={post.id}
                post={post}
                refreshPosts={refreshPosts}
                userCommunityMemberDetails={props.userCommunityMemberDetails}
                communityPostAuthorRoles={communityPostAuthorRoles}
              />
            ))}
          </div>
        </div>
      );
    }
  }
};

/* [TODO] This component will render a single post on community post list with all attributes like author, summary, reaction, post-action-menu, etc. */
const CommunityPost = (props) => {
  const [isPostActionActive, setIsPostActionActive] = useState(false);
  const [isPostPinned, setIsPostPinned] = useState(false);
  const [isPostHidden, setIsPostHidden] = useState(false);
  const [isPostReported, setIsPostReported] = useState(false);

  // This method toggles between post action active and inactive
  const postActionButtonHandler = () => {
    setIsPostActionActive(isPostActionActive ? false : true);
  };

  // Check post author's role
  const isAuthorUser = props.post.authorID === props.userCommunityMemberDetails?.user.id;
  const isAuthorAdmin = props.communityPostAuthorRoles[props.post.authorID] === "admin";
  const isAuthorMod = props.communityPostAuthorRoles[props.post.authorID] === "mod";

  // Set post author role label
  const postAuthorRoleLabel = isAuthorAdmin ? "Admin" :
    isAuthorMod ? "Mod" :
    isAuthorUser ? "You" :
    "Member"

  // This method handles post actions such as pinning, hiding, reporting, or deleting.
  // It's passed on to its child component - postActionSidemenu, where the action options are selected.

  // TODO: It should call API to update each post, and refresh the post list.
  // TODO: Should Pinning, hiding, or reporting considered as a reaction?
  // TODO: It should also display modal or toast to indiate that the post action has been selected
  const postActionOptionsHandler = (option) => {
    switch (option) {
      case "pin":
        // console.log(option);
        setIsPostPinned(isPostPinned ? false : true);
        break;
      case "hide":
        // console.log(option);
        setIsPostHidden(isPostHidden ? false : true);
        break;
      case "report":
        // console.log(option);
        setIsPostReported(isPostReported ? false : true);
        break;
      case "delete":
        // console.log(option);
        deletePost();
        break;
      default:
        console.log(`Invalid Post Action: ${option}`);
    }
  };

  // This method handles delete post action.
  const deletePost = async () => {
    // Send DELETE request to the database.
    const { data, errorMessage } = await genericDelete(
      `/posts/${props.post.id}`
    );
    // console.log(data, errorMessage)
    if (errorMessage) {
      alert(errorMessage);
    }
    // Call refreshPosts method tell its parent component - CommunityPostList to refresh the post list
    props.refreshPosts();
  };

  // Set post thumbnail image
  let postThumbnailImage = props.post.attributes.images[0]
    ? props.post.attributes.images[0]
    : defaultPostImage;

  return (
    <div className={style["community-post"]} key={props.post.id}>
      {/* Post Thumbnail */}
      <img
        className={`${style["image"]} ${style["image__md"]} ${style["image__square"]}`}
        src={postThumbnailImage}
        onError={(e) => (e.currentTarget.src = defaultProfileImage)}
        alt=""
      />

      <div className={style["post-summary"]}>
        <div className={style["post-id-title"]}>
          <span className={style["inactive-text"]}>{props.post.id}</span>
          <h5 className={style["active-text"]}>
            {props.post.attributes.title}
          </h5>
        </div>

        <div className={style["post-author-date"]}>
          <div className={style["post-author"]}>
            <span className={style["inactive-text"]}>Posted By</span>
            <p className={style["active-text"]}>
              <span className={style["bold"]}>
                {props.post.author.attributes.profile.username}
              </span>
               <span>
                ({postAuthorRoleLabel})
              </span>
            </p>
          </div>
          <div className={style["post-date"]}>
            <span className={style["inactive-text"]}>Posted On</span>
            <span className={`${style["active-text"]} ${style["bold"]}`}>{props.post.created}</span>
          </div>
        </div>
      </div>

      <div className={style["post-labels"]}>
        {/* Post Action Labels */}
        <div className={style["post-action-labels"]}>
          {isPostReported && (
            <div className={`${style["post-action-label"]} ${style["post-action-label__bistre"]}`}>
              <span>Reported</span>
            </div>
          )}
          {isPostHidden && (
            <div className={`${style["post-action-label"]} ${style["post-action-label__french-bistre"]}`}>
              <span>Hidden</span>
            </div>
          )}
          {isPostPinned && (
            <div className={`${style["post-action-label"]} ${style["post-action-label__skobeloff"]}`}>
              <span>Pinned</span>
            </div>
          )}
        </div>

        {/* Post Stats Labels */}
        <div className={style["post-stat-labels"]}>
          <div className={style["post-stat-label"]}>
            <span className={style["active-text"]}>
              {props.post.reactions.length}
            </span>
            <span className={style["inactive-text"]}>Likes</span>
          </div>
          <div className={style["post-stat-label"]}>
            <span className={style["active-text"]}>
              {props.post._count.children}
            </span>
            <span className={style["inactive-text"]}>Comments</span>
          </div>
        </div>
      </div>

      {/* Post Action Sidemenu */}
      <div>
        {/* This should be replaced with actual icon */}
        <span
          className={style["meatballs-icon"]}
          onClick={postActionButtonHandler}
        ></span>
        <PostActionSidemenu
          isActive={isPostActionActive}
          postActionOptionsHandler={postActionOptionsHandler}
          post={props.post}
          userCommunityMemberDetails={props.userCommunityMemberDetails}
          communityPostAuthorRoles={props.communityPostAuthorRoles}
        />
      </div>
    </div>
  );
};

/* [TODO] This component serves as a container for two buttons - SortPostsButton and CreatePostButton. */
const PostControlTool = (props) => {
  const [isPostSortActive, setIsPostSortActive] = useState(false);

  // Toggles between post sort active and inactive
  const sortButtonToggleHandler = () => {
    setIsPostSortActive(isPostSortActive ? false : true);
  };

  return (
    <div className={style["content-control-tool"]}>
      {/* Left Control */}
      <div className={style["left-control-box"]}>
        {/* Sort Posts Button */}
        <button
          className={`${style["button"]} ${style["button__bordered"]} ${style["button__filled"]}`}
          onClick={sortButtonToggleHandler}
        >
          Sort Posts
        </button>
        <PostSortDropdown isActive={isPostSortActive} />
      </div>
      {/* Right Control */}
      {props.userCommunityMemberDetails &&
        <div className={style["right-control-box"]}>
          {/* Create Post Button */}
          <div className={`${style["right-control-placeholder"]} ${style["inactive-text"]}`}>
            Tell us your story!
          </div>
          <button className={`${style["button"]} ${style["button__outlined"]} ${style["button__filled"]}`}>
            Create Post
          </button>
        </div>
      }
    </div>
  );
};

/* [TODO] This component will render a dropdown menu that lists options like By Posted Date, 
By Likes, and By Comments. This will be triggered when the user clicks on SortPosts button. */
const PostSortDropdown = (props) => {
  if (props.isActive) {
    return (
      <div className={style["dropdown"]}>
        <ul className={style["dropdown-option-list"]}>
          {/* By Posted Date */}
          <li className={style["dropdown-option"]}>
            <span className={style["active-text"]}>By Posted Date</span>
            <span className={style["inactive-text"]}>Newest to Oldest</span>
          </li>
          {/* By Likes */}
          <li className={style["dropdown-option"]}>
            <span className={style["active-text"]}>By Likes</span>
            <span className={style["inactive-text"]}>Most to Least</span>
          </li>
          {/* By Comments */}
          <li className={style["dropdown-option"]}>
            <span className={style["active-text"]}>By Comments</span>
            <span className={style["inactive-text"]}>Most to Least</span>
          </li>
        </ul>
      </div>
    );
  }
};

/* [TODO] This component will render a post action sidemenu that lists options like pin to top, 
hide, report, and delete. This component will be triggered when the user clicks on '...' icon on each post. 
Some of these post action options should be user-specific. For example, "Delete" option should only available 
to posts that belongs to the user or to all posts if the user's a admin or a mod.

* Pin & Hide are user-specific actions, and they should persist to only user's post list.
* Report & Delete are global actions, and they should persist to all users' post lists.
*/
const PostActionSidemenu = (props) => {
  // TODO: The action sidemenu should close when user clicks anywhere outside
  // -  maybe use CSS pseudo focus-within?
  const [isPinned, setIsPinned] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // Check current user's community role & post author's role
  const isUserAdmin = props.userCommunityMemberDetails?.attributes.role === "admin";
  const isUserMod = props.userCommunityMemberDetails?.attributes.role === "mod";
  const isAuthorUser = props.post.authorID === props.userCommunityMemberDetails?.user.id;
  const isAuthorAdmin = props.communityPostAuthorRoles[props.post.authorID] === "admin";
  const isAuthorMod = props.communityPostAuthorRoles[props.post.authorID] === "mod";

  // console.log(props.post.id, props.post.authorID, isAuthorUser, isAuthorAdmin, isAuthorMod)

  // These methods update the option labels and send the chosen action option to its parent component - CommunityPost.
  const pinActionHandler = () => {
    setIsPinned(isPinned ? false : true); // update the option status
    props.postActionOptionsHandler("pin"); // tell CommunityPost component that 'pin' option was chosen
  };
  let pinOptionName = isPinned ? "Unpin" : "Pin to top"; // update the pin option label based on the state

  const hideActionHandler = () => {
    setIsHidden(isHidden ? false : true); // update the option status
    props.postActionOptionsHandler("hide"); // tell CommunityPost component that 'hide' option was chosen
  };
  let hideOptionName = isHidden ? "Show" : "Hide"; // update the hide option label based on the state

  const reportActionHandler = () => {
    setIsReported(isReported ? false : true); // update the option status
    props.postActionOptionsHandler("report"); // tell CommunityPost component that 'report' option was chosen
  };
  let reportOptionName = isReported ? "Reported" : "Report"; // update the report option label based on the state

  const deleteActionHandler = () => {
    setIsDeleted(isDeleted ? false : true); // update the option status
    props.postActionOptionsHandler("delete"); // tell CommunityPost component that 'report' option was chosen
  };
  let deleteOptionName = isDeleted ? "Delete" : "Delete"; // delete option label should remain the same

  if (props.isActive) {
    return (
      <div className={style["action-sidemenu"]}>
        <ul className={style["action-sidemenu-option-list"]}>
          {/* Pin */}
          <li className={style["action-sidemenu-option"]} onClick={pinActionHandler}>
            <span className={`${style["square-icon"]} ${style["square-icon__skobeloff"]}`}></span>
            <span className={style["active-text"]}>{pinOptionName}</span>
          </li>
          {/* Hide */}
          {!isAuthorUser &&
            <li className={style["action-sidemenu-option"]} onClick={hideActionHandler}>
              <span className={`${style["square-icon"]} ${style["square-icon__french-bistre"]}`}></span>
              <span className={style["active-text"]}>{hideOptionName}</span>
            </li>
          }
          {/* Report */}
          {((!isAuthorUser && !isAuthorAdmin && !isAuthorMod) && (!isUserAdmin)) &&
            <li className={style["action-sidemenu-option"]} onClick={reportActionHandler}>
              <span className={`${style["square-icon"]} ${style["square-icon__bistre"]}`}></span>
              <span className={style["active-text"]}>{reportOptionName}</span>
            </li>
          }
          {/* Delete */}
          {(isAuthorUser || (isUserMod && !isAuthorAdmin && !isAuthorMod) || isUserAdmin) && 
            <li className={style["action-sidemenu-option"]} onClick={deleteActionHandler}>
              <span className={`${style["square-icon"]} ${style["square-icon__red-orange"]}`}></span>
              <span className={style["active-text"]}>{deleteOptionName}</span>
            </li>
          }
        </ul>
      </div>
    );
  }
};

/* [TODO] This component will render all members within a community. This component also include member control tool and pagination */
const CommunityMembersList = (props) => {
  const [members, setMembers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch both posts and members when the component is loaded.
  useEffect(() => {
    loadMembers();
    loadPosts();
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

  // Render Component
  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    if (members) {
      return (
        <div>
          {/* Member */}
          <div className={style["community-members-list"]}>
            {members.map((member) => (
              <CommunityMember
                key={member.id}
                member={member}
                refreshMembers={refreshMembers}
                userCommunityMemberDetails={props.userCommunityMemberDetails}
              />
            ))}
          </div>
        </div>
      );
    }
  }
};

/* [TODO] This component will render a single member on community members list with all attributes like 
username, role, etc. */
const CommunityMember = (props) => {
  const [isMemberActionActive, setIsMemberActionActive] = useState(false);
  const [isMemberReported, setIsMemberReported] = useState(false);

  // This method toggles between post action active and inactive
  const memberActionButtonHandler = () => {
    setIsMemberActionActive(isMemberActionActive ? false : true);
  };

  // This method handles member actions such as view profile, block, report, or kick.
  // It's passed on to its child component - memberActionSidemenu, where the action options are selected.

  // TODO: It should call API to update each community member, and refresh the community member list.
  // TODO: It should also display modal or toast to indiate that the member action has been selected
  const memberActionOptionsHandler = (option) => {
    switch (option) {
      case "view":
        // console.log(option);
        break;
      case "report":
        // console.log(option);
        setIsMemberReported(isMemberReported ? false : true);
        break;
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

  // This method handles kick member action. It should check if current user has the
  const kickMember = async () => {
    // Send DELETE request to the database.
    const { data, errorMessage } = await genericDelete(
      `/group-members/${props.member.id}`
    );
    // console.log(data, errorMessage)
    if (errorMessage) {
      alert(errorMessage);
    }
    // Call refreshMemberes method to tell its parent component - CommunityMemberList to refresh the member list
    props.refreshMembers();
  };

  // Check if member is current user 
  const isMemberUser = props.member?.userID === props.userCommunityMemberDetails?.userID;
  const commmunityMemberStyle = isMemberUser
    ? `${style["community-member"]} ${style["community-member__filled"]}`
    : `${style["community-member"]}`;

  return (
    <div className={commmunityMemberStyle}>
      {/* Community Member Profile Avatar */}
      <img
        className={`${style["image"]} ${style["image__md"]} ${style["image__round"]}`}
        src={props.member.user.attributes.profile.profileImage}
        onError={(e) => (e.currentTarget.src = defaultProfileImage)}
        alt=""
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

        {/* Member Action Label */}
        {isMemberReported &&
          <div className={`${style["member-action-label"]} ${style["post-action-label__bistre"]}`}>
            <span>Reported</span>
          </div>
        }
      </div>

      {/* Member Action Side Menu */}
      <div>
        {/* This should be replaced with actual icon */}
        <span
          className={style["meatballs-icon"]}
          onClick={memberActionButtonHandler}
        ></span>
        <MemberActionSidemenu
          isActive={isMemberActionActive}
          memberActionOptionsHandler={memberActionOptionsHandler}
          member = {props.member}
          userCommunityMemberDetails={props.userCommunityMemberDetails}
        />
      </div>
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
          className={`${style["button"]} ${style["button__bordered"]} ${style["button__filled"]}`}
          onClick={sortButtonToggleHandler}
        >
          Sort Members
        </button>
        <MemberSortDropdown isActive={isPostSortActive} />
      </div>
      <div className={style["right-control-box"]}>
        <div
          className={`${style["right-control-placeholder"]} ${style["inactive-text"]}`}
        >
          Who are you looking for?
        </div>
        <button
          className={`${style["button"]} ${style["button__outlined"]} ${style["button__filled"]}`}
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
* Report & Kick are global actions, and they should persist to all users' member lists.
*/
const MemberActionSidemenu = (props) => {
  const [isViewProfile, setIsViewProfile] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [isKicked, setIsKicked] = useState(false);
  const [isAssignRole, setIsAssignRole] = useState(false);

  // Check current user's community role & member's community role
  const isUserAdmin = props.userCommunityMemberDetails?.attributes.role === "admin";
  const isUserMod = props.userCommunityMemberDetails?.attributes.role === "mod";
  const isMemberUser = props.member.userID === props.userCommunityMemberDetails?.user.id;
  const isMemberAdmin = props.member.attributes.role === "admin";
  const isMemberMod = props.member.attributes.role === "mod";

  // console.log(props.member.user.attributes.profile.username, isMemberUser)

  // These methods update the option labels and send the chosen action option to its parent component - CommunityMember.
  const viewProfileActionHandler = () => {
    setIsViewProfile(isViewProfile ? false : true); // update the options status
    props.memberActionOptionsHandler("view"); // tell CommunityMember component that 'view' option was chosen
  };
  let viewProfileOptionName = isViewProfile ? "View Profile" : "View Profile"; // update the view profile option lable based on the state

  const reportActionHandler = () => {
    setIsReported(isReported ? false : true); // update the option status
    props.memberActionOptionsHandler("report"); // tell CommunityMember component that 'report' option was chosen
  };
  let reportOptionName = isReported ? "Reported" : "Report"; // update the report option label based on the state

  const kickActionHandler = () => {
    setIsKicked(isKicked ? false : true); // update the option status
    props.memberActionOptionsHandler("kick"); // tell CommunityMember component that 'kick' option was chosen
  };
  let kickOptionName = isKicked ? "Kicked" : "Kick"; // update the kick option label based on the state

  const assignRoleActionHandler = () => {
    setIsAssignRole(isAssignRole ? false : true); // update the option status
    props.memberActionOptionsHandler("assign"); // tell commmunityMember component that 'assign' option was chosen
  }
  let assignOptionName = isAssignRole ? "Assign Role" : "Assign Role";

  if (props.isActive) {
    return (
      <div className={style["action-sidemenu"]}>
        <ul className={style["action-sidemenu-option-list"]}>
          {/* View Profile */}
          <li className={style["action-sidemenu-option"]} onClick={viewProfileActionHandler}>
            <span className={`${style["square-icon"]} ${style["square-icon__skobeloff"]}`}></span>
            <span className={style["active-text"]}>{viewProfileOptionName}</span>
          </li>
          {/* Report */}
          {(!isMemberUser && !isMemberAdmin && !isMemberMod) && (!isUserAdmin) &&
            <li className={style["action-sidemenu-option"]} onClick={reportActionHandler}>
              <span className={`${style["square-icon"]} ${style["square-icon__bistre"]}`}></span>
              <span className={style["active-text"]}>{reportOptionName}</span>
            </li>
          }
          {/* Assign Role */}
          {(isUserAdmin && !isMemberUser) &&
            <li className={style["action-sidemenu-option"]} onClick={assignRoleActionHandler}>
              <span className={`${style["square-icon"]} ${style["square-icon__bistre"]}`}></span>
              <span className={style["active-text"]}>{assignOptionName}</span>
            </li>
          }
          {/* Kick */}
          {(((isUserAdmin || isUserMod) && (!isMemberUser && !isMemberAdmin && !isMemberMod)) || (isUserAdmin && !isMemberUser)) &&
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

/* This component will render a pagination for communityPostList and CommunityMemberList. 
It contains previous button, next button, and current page indicatior. */
const Pagination = (props) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate last Page
  const lastPage = Math.ceil(props.contentsCount / props.contentTakeCount);

  const handlePreviousPage = () => {
    // console.log(currentPage)
    setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage);
    props.updateContentSkipOffset(props.contentTakeCount * -1);
  };

  const handleNextPage = () => {
    // console.log(currentPage);
    setCurrentPage(
      currentPage < props.contentsCount ? currentPage + 1 : currentPage
    );
    props.updateContentSkipOffset(props.contentTakeCount);
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
      <span className={style["page-number"]}>{currentPage}</span>

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
};
