import React, { useState, useEffect } from "react";
import genericFetch from "../Helper/genericFetch";
import "./CommunityPage.css";

/* This component will render the header contents. This includes, logo, navigation tabs, 
search box, and profile tab */
const Header = () => {
  return <div className="header">Header</div>;
};

/* This component will render the footer contents. */
const Footer = () => {
  return <div className="footer">Footer</div>;
};

/* This component serves as container for banner contents. Inside the banner, 
there's community name, community background, community icon, and a join button*/
const Banner = () => {
  return (
    <div className="banner">
      <div className="banner-background">Banner background</div>
      <div className="banner-content">
        <div className="community-avatar"></div>
        <div className="community-info">
          <h2>Class of 2023</h2>
          <span className="inactive-text">Since February 19th, 2023</span>
        </div>
        <button className="join-button">Join</button>
      </div>
    </div>
  );
};

/* This component serves as a container for community stats like the number of posts 
and number of members. Each stat also serves as a navigation tab between CommunityPostsList 
and CommunityMembersList */
const CommunityStats = (props) => {
  return (
    <div className="community-stats">
      <div
        className="community-stats-tab"
        onClick={() => props.postContentDisplayHandler("posts")}
      >
        <span className="active-text">3</span>
        <span className="inactive-text">Posts</span>
      </div>
      <div
        className="community-stats-tab"
        onClick={() => props.postContentDisplayHandler("members")}
      >
        <span className="active-text">38</span>
        <span className="inactive-text">Members</span>
      </div>
    </div>
  );
};

/* This component serves as a container for two buttons - SortPostsButton and CreatePostButton. */
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

/* This component will render a dropdown menu that lists options like By Posted Date, 
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

/* This component will render a post action sidemenu that lists options like pin to top, 
hide, report, and delete. This component will be triggered when the user clicks on 
'...' icon on each post. */
const PostActionSidemenu = (props) => {
  // Todo
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
  let pinOptionName = isPinned ? "Unpin" : "Pin to top"; // update the option label based on the status

  const hideActionHandler = () => {
    setIsHidden(isHidden ? false : true); // update the option status
    props.postActionOptionsHandler("hide"); // tell CommunityPost component that 'hide' option was chosen
  };
  let hideOptionName = isHidden ? "Show" : "Hide"; // update the option label based on the status

  const reportActionHandler = () => {
    setIsReported(isReported ? false : true); // update the option status
    props.postActionOptionsHandler("report"); // tell CommunityPost component that 'report' option was chosen
  };
  let reportOptionName = isReported ? "Reported" : "Report"; // update the option label as "reported"

  const deleteActionHandler = () => {
    setIsDeleted(isDeleted ? false : true); // update the option status
    props.postActionOptionsHandler("delete"); // tell CommunityPost component that 'report' option was chosen
  };
  let deleteOptionName = isDeleted ? "Deleted" : "Delete"; // update the option label as "deleted"

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

/* This component will render a single community post, with all components like author, summary, reaction, post-action-menu, etc. */
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
  // Pin & Hide are user-specific actions, and they should persist to only user's post list.
  // Report and Delete are global actions, and they should persist to all users' post lists.

  // Note: It should call API to update each post, and refresh the post list.
  // Note: Should Pinning, hiding, or reporting considered as a reaction?
  // Note: It should also display modal or toast to indiate that the post action has been selected
  const postActionOptionsHandler = (option) => {
    switch (option) {
      case "pin":
        // console.log(option);
        setIsPostPinned(isPostPinned ? false : true);
        break;
      case "hide":
        console.log(option);
        setIsPostHidden(isPostHidden ? false : true);
        break;
      case "report":
        console.log(option);
        setIsPostReported(isPostReported ? false : true);
        break;
      case "delete":
        // should just call delete API, and update the post list
        console.log(option);
        deletePost();
        break;
      default:
        console.log(`Invalid Post Action: ${option}`);
    }
  };

  // This method handles delete post action. It sends DELETE request to the server with a post id.
  // Then, it calls refreshPosts method from prop to tell its parent component - CommunityPostList to refresh the post list.
  const deletePost = () => {
    // Should send DELETE request to the database.
    // Should also call refreshPosts method from prop to tell its parent component - CommunityPostList
    // to refresh the post list.
    props.refreshPosts();
  };

  return (
    <div className="community-post" key={props.post.id}>
      <div className="post-thumbnail"></div>

      <div className="post-summary">
        <div className="post-id-title">
          <span className="inactive-text">{props.post.id}</span>
          <h3 className="active-text">{props.post.content}</h3>
        </div>

        <div className="post-author-date">
          <div className="post-author">
            <span className="inactive-text">Posted By</span>
            <span className="active-text">
              {props.post.author.attributes.username}
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
            <span className="active-text">20</span>
            <span className="inactive-text">Likes</span>
          </div>
          <div className="post-stat-label">
            <span className="active-text">100</span>
            <span className="inactive-text">Views</span>
          </div>
          <div className="post-stat-label">
            <span className="active-text">5</span>
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

/* This component will render all the posts within a community. This list will update 
whenever user makes change to the post, this includes pinning the post, hiding the post, 
reporting the post, and removing the post.*/
const CommunityPostList = (props) => {
  const [posts, setPosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch the posts when the component is loaded
  useEffect(() => {
    let query = { sort: "newest", parentID: "" };
    loadPosts(query);
  }, []);

  // This methods loads the posts using genericFetch.
  // The endpoint is set to '/posts' by default, but the query can be passed in.
  const loadPosts = async (query) => {
    setIsLoaded(false);
    let endpoint = "/posts";
    const { data, errorMessage } = await genericFetch(endpoint, query);
    console.log(data);
    setPosts(data);
    setErrorMessage(errorMessage);
    setIsLoaded(true);
  };

  // This method refresh the posts by sending the request to API again using genricFetch.
  // It can be passed on to each CommunityPost component to handle changes,
  // such as pinning, hiding, reporting, or deleting. It can also be passed on to Pagination
  // component with skip and take query.
  // Note: Should conside
  const refreshPosts = (query) => {
    console.log("refreshing posts");
    loadPosts(query); // Fetch the posts again
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
          {posts.map((post) => (
            <CommunityPost
              key={post.id}
              post={post}
              refreshPosts={refreshPosts}
            />
          ))}
        </div>
      );
    }
  }
};

/* This component will render either the community posts list or community members list. 
The type of content to display is chosen by the community stats tab*/
const CommunityContentDisplay = (props) => {
  if (props.contentType === "posts") {
    return <CommunityPostList />;
  } else if (props.contentType === "members") {
    return <div>members</div>;
  }
};

/* This component will render a pagination for communityPostList and CommunityMemberList. 
It contains previous button, next button, and current page indicatior. */
const Pagination = () => {
  return (
    <div className="pagination">
      <button className="prev-button">Previous</button>
      <div className="page-number">1</div>
      <button className="next-button">Next</button>
    </div>
  );
};

/* This component renders a single community page. Inside the community page, 
there are posts tab and members tab. */
export default function CommunityPage() {
  const [contentDisplayType, setContentDisplayType] = useState("posts");

  // This method updates the current content display type as either posts or members.
  // It's passed on to its child component - CommunityStats, where the options are selected.
  // Then the CommunityContentDisplay component renders based on the display type (post list or members list)
  const postContentDisplayHandler = (type) => {
    setContentDisplayType(type);
  };

  return (
    <div className="container">
      {/* Header */}
      <Header />

      {/* Banner */}
      <Banner />

      {/* Main section */}
      <div className="main-section">
        {/* Community Stats */}
        <CommunityStats postContentDisplayHandler={postContentDisplayHandler} />

        {/* Post Control Tool */}
        <PostControlTool />

        {/* Main Content Display */}
        <CommunityContentDisplay contentType={contentDisplayType} />

        {/* Pagination */}
        <Pagination />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
