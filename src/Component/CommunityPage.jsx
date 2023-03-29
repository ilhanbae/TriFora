import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import genericFetch from "../helper/genericFetch";
import genericDelete from "../helper/genericDelete";
import "../style/CommunityPage.css";

/* This component renders a single community page. Inside the community page, 
there are posts tab and members tab. */
export default function CommunityPage(props) {
  const { communityId } = useParams(); // Retrieve the community id from the URL Param
  const [communityDetails, setCommunityDetails] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch the community details when the community page is loaded
  useEffect(() => {
    loadCommunityDetails();
  }, []);

  /* This methods loads the community details by sending the API request. */
  const loadCommunityDetails = async () => {
    setIsLoaded(false);
    let endpoint = `/groups/${communityId}`;
    let query = {};
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage)
    if (errorMessage) {
      setErrorMessage(errorMessage);
    } else {
      setCommunityDetails(data);
    }
    setIsLoaded(true);
  };

  /* This method refresh the communit details by sending the API request again.
  It can be passed on to child components that can change the state of the community page. 
  Note, currently the only attributes the community page maintains is its banner design.
  Perhaps, this can be called when the community admin/mod wishes to change the style of the community. */
  const refreshCommunityDetails = () => {
    // console.log("refreshing community details");
    loadCommunityDetails(); // Fetch the community details again
  };

  // Render Component
  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="community-page">
        {/* Banner */}
        <CommunityBanner communityDetails={communityDetails}/>

        {/* Main section */}
        <div className="main-section">
          {/* Main Content Display */}
          <CommunityContentDisplay communityId={communityId} />
        </div>
      </div>
    );
  }
}

/* [TODO] This component serves as container for banner contents. Inside the banner, 
there's community name, community background, community icon, and a join button*/
const CommunityBanner = (props) => {
  return (
    <div className="community-banner">
      <div className="community-banner-background">Banner background</div>
      <div className="community-banner-content">
        <div className="community-avatar"></div>
        <div className="community-info">
          <h2>{props.communityDetails.name}</h2>
          <span className="inactive-text">Since February 19th, 2023</span>
        </div>
        <button className="join-button">Join</button>
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

  // This method updates the current content display type as either posts or members.
  // It's passed on to its child component - CommunityStats, where the options are selected.
  // Then the CommunityContentDisplay component renders based on the display type (post list or members list)
  const postContentDisplayHandler = (type) => {
    setContentDisplayType(type);
  };

  // This method updates the community post counts
  // It will be called whenever there's a change to the Community Posts List
  const updateCommunityPostCounts = (newCount) => {
    setCommunityPostCounts(newCount)
  }

  // This method updates the community members counts
  // It will be called whenever there's a change to the Community Members List
  const updateCommunityMemberCounts = (newCount) => {
    setCommunityMemberCounts(newCount)
  }

  return (
    <div className="community-content-display">
      {/* Community Stats */}
      <CommunityStats
        postContentDisplayHandler={postContentDisplayHandler}
        communityPostCounts={communityPostCounts}
        communityMemberCounts={communityMemberCounts}
      />

      {/* Commmunity Posts List */}
      {contentDisplayType === "posts" && <CommunityPostsList communityId={props.communityId} updateCommunityPostCounts={updateCommunityPostCounts} updateCommunityMemberCounts={updateCommunityMemberCounts} />}

      {/* Comunity Members List */}
      {contentDisplayType === "members" && <CommunityMembersList communityId={props.communityId}  updateCommunityPostCounts={updateCommunityPostCounts} updateCommunityMemberCounts={updateCommunityMemberCounts} />}
    </div>
  )
};

/* [TODO] This component serves as a container for community stats like the number of posts 
and number of members. Each stat also serves as a navigation tab between CommunityPostsList 
and CommunityMembersList */
const CommunityStats = (props) => {
  return (
    <div className="community-stats">
      <div
        className="community-stats-tab"
        onClick={() => props.postContentDisplayHandler("posts")}
      >
        <span className="active-text">{props.communityPostCounts}</span>
        <span className="inactive-text">Posts</span>
      </div>
      <div
        className="community-stats-tab"
        onClick={() => props.postContentDisplayHandler("members")}
      >
        <span className="active-text">{props.communityMemberCounts}</span>
        <span className="inactive-text">Members</span>
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

  // Fetch both posts and members when the component is loaded.
  useEffect(() => {
    loadPosts();
    loadMembers();
  }, []);

  // This methods loads the community members using genericFetch & update the community members count stat
  const loadMembers = async () => {
    setIsLoaded(false);
    let endpoint = `/group-members`;
    let query = {groupID: props.communityId};
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage)
    if (data) {
      props.updateCommunityMemberCounts(data[1])
    }
  };

  // This methods loads the community posts using genericFetch & update the community posts count stat
  const loadPosts = async () => {
    setIsLoaded(false);
    let endpoint = "/posts";
    let query = { sort: "newest", parentID: "", recipientGroupID: props.communityId };
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage)
    if (errorMessage) {
      setErrorMessage(errorMessage);
    } else {
      setPosts(data[0]);
      props.updateCommunityPostCounts(data[1])
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
          {/* Post Control Tool */}
          <PostControlTool />
          {/* Posts */}
          <div className="community-post-list">
            {posts.map((post) => (
              <CommunityPost
                key={post.id}
                post={post}
                refreshPosts={refreshPosts}
              />
            ))}
          </div>
          {/* Pagination */}
          <Pagination />
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

  // This method handles delete post action. It should check if current user has the 
  const deletePost = async () => {
    // Send DELETE request to the database.
    const {data, errorMessage} = await genericDelete(`/posts/${props.post.id}`);
    // console.log(data, errorMessage)
    if (errorMessage) {
      alert(errorMessage)
    }
    // Call refreshPosts method tell its parent component - CommunityPostList to refresh the post list
    props.refreshPosts();
  };

  return (
    <div className="community-post" key={props.post.id}>
      <div className="post-thumbnail"></div>

      <div className="post-summary">
        <div className="post-id-title">
          <span className="inactive-text">{props.post.id}</span>
          <h4 className="active-text">{props.post.attributes.title}</h4>
        </div>

        <div className="post-author-date">
          <div className="post-author">
            <span className="inactive-text">Posted By</span>
            <span className="active-text">
              {props.post.author.attributes.profile.username}
            </span>
          </div>
          <div className="post-date">
            <span className="inactive-text">Posted On</span>
            <span className="active-text">{props.post.created}</span>
          </div>
        </div>
      </div>

      <div className="post-labels">
        {/* Post Action Labels */}
        <div className="post-action-labels">
          {isPostReported && (
            <div className="post-action-report-label">
              <span>Reported</span>
            </div>
          )}
          {isPostHidden && (
            <div className="post-action-hide-label">
              <span>Hidden</span>
            </div>
          )}
          {isPostPinned && (
            <div className="post-action-pin-label">
              <span>Pinned</span>
            </div>
          )}
        </div>

        {/* Post Stats Labels */}
        <div className="post-stat-labels">
          <div className="post-stat-label">
            <span className="active-text">{props.post.reactions.length}</span>
            <span className="inactive-text">Likes</span>
          </div>
          <div className="post-stat-label">
            <span className="active-text">{props.post._count.children}</span>
            <span className="inactive-text">Comments</span>
          </div>
        </div>
      </div>

      <div className="post-action">
        <span className="post-action-icon" onClick={postActionButtonHandler}>
          {/* This should be replaced with actual icon */}
          ...
        </span>
        <PostActionSidemenu
          isActive={isPostActionActive}
          postActionOptionsHandler={postActionOptionsHandler}
        />
      </div>
    </div>
  );
};

/* [TODO] This component serves as a container for two buttons - SortPostsButton and CreatePostButton. */
const PostControlTool = () => {
  const [isPostSortActive, setIsPostSortActive] = useState(false);

  // Toggles between post sort active and inactive
  const sortButtonToggleHandler = () => {
    setIsPostSortActive(isPostSortActive ? false : true);
  };

  return (
    <div className="post-control-tool">
      <div className="sort-post-box">
        <button className="sort-post-button" onClick={sortButtonToggleHandler}>
          Sort Posts
        </button>
        <PostSortDropdown isActive={isPostSortActive} />
      </div>
      <div className="create-post-box">
        <div className="create-post-placeholder inactive-text">
          Tell us your story!
        </div>
        <button className="create-post-button">Create Post</button>
      </div>
    </div>
  );
};

/* [TODO] This component will render a dropdown menu that lists options like By Posted Date, 
By Likes, and By Comments. This will be triggered when the user clicks on SortPosts button. */
const PostSortDropdown = (props) => {
  if (props.isActive) {
    return (
      <div className="posts-sort-dropdown">
        <ul className="posts-sort-options-list">
          <li className="posts-sort-option">
            <span className="active-text">By Posted Date</span>
            <span className="inactive-text">Newest to Oldest</span>
          </li>
          <li className="posts-sort-option">
            <span className="active-text">By Likes</span>
            <span className="inactive-text">Most to Least</span>
          </li>
          <li className="posts-sort-option">
            <span className="active-text">By Comments</span>
            <span className="inactive-text">Most to Least</span>
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
  // TODOs
  // 1. Should know what kind of relationsip does user have with the post
  // - 'Delete' option should be only available for user's post or if the user is the community owner/admin
  // 2. The action sidemenu should close when user clicks anywhere outside
  // -  maybe use CSS pseudo focus-within?
  const [isPinned, setIsPinned] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

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
      <div className="post-action-sidemenu">
        <ul className="post-action-options-list">
          <li className="post-action-option" onClick={pinActionHandler}>
            <span className="post-action-pin-icon"></span>
            <span className="active-text">{pinOptionName}</span>
          </li>
          <li className="post-action-option" onClick={hideActionHandler}>
            <span className="post-action-hide-icon"></span>
            <span className="active-text">{hideOptionName}</span>
          </li>
          <li className="post-action-option" onClick={reportActionHandler}>
            <span className="post-action-report-icon"></span>
            <span className="active-text">{reportOptionName}</span>
          </li>
          <li className="post-action-option" onClick={deleteActionHandler}>
            <span className="post-action-delete-icon"></span>
            <span className="active-text">{deleteOptionName}</span>
          </li>
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

  // This methods loads the community posts using genericFetch & update the community posts count stat
  const loadPosts = async () => {
    setIsLoaded(false);
    let endpoint = "/posts";
    let query = { sort: "newest", parentID: "", recipientGroupID: props.communityId };
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage)
    if (data) {
      props.updateCommunityPostCounts(data[1])
    }
  };

  // This methods loads the community members using genericFetch & update the community members count stat
  const loadMembers = async () => {
    setIsLoaded(false);
    let endpoint = `/group-members`;
    let query = {groupID: props.communityId};
    const { data, errorMessage } = await genericFetch(endpoint, query);
    // console.log(data, errorMessage)
    if (errorMessage) {
      setErrorMessage(errorMessage);
    } else {
      setMembers(data[0]);
      props.updateCommunityMemberCounts(data[1])
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
          {/* Member Control Tool */}
          {/* <PostControlTool /> */}
          {/* Member */}
          {members.map((member) => (
            <CommunityMember
              key={member.id}
              member={member}
              refreshMembers={refreshMembers}
            />
          ))}
          {/* Pagination */}
          <Pagination />
        </div>
      );
    }
  }
}

/* [TODO] This component will render a single member on community members list with all attributes like 
username, role, etc. */
const CommunityMember = (props) => {
  return (
    <div className="community-member">
      <span className="inactive-text">Community Member Id</span>
      <span className="active-text">{props.member.id}</span>

      <span className="inactive-text">Name</span>
      <span className="active-text">{props.member.user.attributes.profile.username}</span>

      <span className="inactive-text">Role</span>
      <span className="active-text">{props.member.attributes.role}</span>
    </div>
  )
}

/* [TODO] This component will render a pagination for communityPostList and CommunityMemberList. 
It contains previous button, next button, and current page indicatior. */
const Pagination = (props) => {
  return (
    <div className="pagination">
      <button className="prev-button">Previous</button>
      <div className="page-number">1</div>
      <button className="next-button">Next</button>
    </div>
  );
};
