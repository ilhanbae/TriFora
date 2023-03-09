import React, { Component, useState } from "react";
import "./CommunityPage.css";

// Components placeholder
// They'll be implemented as seperate component
const Header = () => {
  return <div className="header">Header</div>;
};

const Footer = () => {
  return <div className="footer">Footer</div>;
};

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

const CommunityStats = () => {
  return (
    <div className="community-stats">
      <div className="community-stats-tab">
        <span className="active-text">3</span>
        <span className="inactive-text">Posts</span>
      </div>
      <div className="community-stats-tab">
        <span className="active-text">38</span>
        <span className="inactive-text">Members</span>
      </div>
    </div>
  );
};

const CreateSortPostBox = () => {
  const [isPostSortActive, setIsPostSortActive] = useState(false);
  
  // Toggles between post sort active and inactive 
  const sortButtonToggleHandler = () => {
    setIsPostSortActive(isPostSortActive ? false : true);
  }
  
  return (
    <div className="create-sort-post-box">
      <div className="sort-post">
        <button className="sort-post-button" onClick={sortButtonToggleHandler}>Sort Posts</button>
        <PostSortDropdown isActive={isPostSortActive}/>
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


const PostSortDropdown = (props) => {
  if (props.isActive) {
    return (
      <div className="posts-sort-dropdown">
        <ul className="posts-sort-options-list">
          <li className="posts-sort-option">
            <span className="active-text">By Posted Date</span>
            <span className="inactive-text">Oldest to Newest</span>
          </li>
          <li className="posts-sort-option">
            <span className="active-text">By Likes</span>
            <span className="inactive-text">Oldest to Newest</span>
          </li>
          <li className="posts-sort-option">
            <span className="active-text">By Comments</span>
            <span className="inactive-text">Oldest to Newest</span>
          </li>
        </ul>
      </div>
    )
  }
}


const PostActionSidemenu = (props) => {
  // 1. 'Delete' option should be only available for user's post or if the user is the community owner
  // 2. The action sidemenu should close when user clicks anywhere outside
  // - maybe use CSS pseudo focus-within?
  if (props.isActive) {
    return (
      <div className="post-action-sidemenu">
        <ul className="post-action-options-list">
          <li className="post-action-option">
            <span className="active-text">Pin to top</span>
          </li>
          <li className="post-action-option">
            <span className="active-text">Hide</span>
          </li>
          <li className="post-action-option">
            <span className="active-text">Report</span>
          </li>
          <li className="post-action-option">
            <span className="active-text">Delete</span>
          </li>
        </ul>
      </div>
    )
  }
}


const CommunityPost = () => {
  const [isPostActionActive, setIsPostActionActive] = useState(false);

  // Toggles between post action active and inactive 
  const postActionButtonHandler = () => {
    setIsPostActionActive(isPostActionActive ? false : true);
  }

  return (
    <div className="community-post">
      <div className="post-thumbnail"></div>

      <div className="post-summary">
        <div className="post-id-title">
          <span className="inactive-text">#001</span>
          <h3 className="active-text">
            Welcome to Class of 2023, Please read our community guideline
          </h3>
        </div>
      
        <div className="post-author-date">
          <div className="post-author">
            <span className="inactive-text">Posted By</span>
            <span className="active-text">Spiderman</span>
          </div>
          <div className="post-date">
            <span className="inactive-text">Posted On</span>
            <span className="active-text">March 2, 2023</span>
          </div>
        </div>
      </div>
      
      <div className="post-stats">
        <div className="post-reactions">
          <span className="active-text">20</span>
          <span className="inactive-text">Likes</span>
        </div>
        <div className="post-views">
          <span className="active-text">100</span>
          <span className="inactive-text">Views</span>
        </div>
        <div className="post-comments">
          <span className="active-text">5</span>
          <span className="inactive-text">Comments</span>
        </div>
      </div>

      <div className="post-action">
        <span className="post-action-icon" onClick={postActionButtonHandler}>...</span>
        <PostActionSidemenu isActive={isPostActionActive} />
      </div>
    </div>
    
  );
};

const Pagination = () => {
  return (
    <div className="pagination">
      <button className="prev-button">Previous</button>
      <div className="page-number">1</div>
      <button className="next-button">Next</button>
    </div>
  )
}

export default class CommunityPage extends Component {
  render() {
    return (
      <div className="container">
        {/* Header */}
        <Header />

        {/* Banner */}
        <Banner />

        {/* Main section */}
        <div className="main-section">
          {/* Community Stats */}
          <CommunityStats />

          {/* Create-Sort Box */}
          <CreateSortPostBox />

          {/* Main Content */}
          <div className="posts-list">
            <CommunityPost />
            <CommunityPost />
            <CommunityPost />
            <CommunityPost />
            <CommunityPost />
            <CommunityPost />
            <CommunityPost />
            <CommunityPost />
            <CommunityPost />
            <CommunityPost />
          </div>
   
          {/* Pagination */}
          <Pagination />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  }
}
