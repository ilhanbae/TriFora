import React, { Component } from "react";
import "./Community.css";

// Components placeholder
// They'll be implemented as seperate component
const Header = () => {
  return (
    <div className="header">Header</div>
  );
};

const Footer = () => {
  return (
    <div className="footer">Footer</div>
  )
}

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
        <div className="join-button">Join</div>
      </div>
    </div>
  );
};

const CommunityStats = () => {
  return (
    <div className="community-stats">
      <div className="community-stats-tab">
        <p>3</p>
        <span className="inactive-text">Posts</span>
      </div>
      <div className="community-stats-tab">
        <p>38</p>
        <span className="inactive-text">Members</span>
      </div>
    </div>
  );
};

const CreateSortBox = () => {
  return (
    <div className="create-sort-box">
      <div className="user-avatar"></div>
      <div className="create-box">Create Post</div>
      <div className="sort-button">Sort Posts</div>
    </div>
  );
};

const SortOptionBox = () => {
  return (
    <div className="sort-option-box">
    <div className="sort-option">
      <p>Sort by Date</p>
      <span className="inactive-text">Oldest to Newest</span>
    </div>
    <div className="sort-option">
      <p>Sort by Vote</p>
      <span className="inactive-text">Most to Least</span>
    </div>
    <div className="sort-option">
      <p>Sort by Comment</p>
      <span className="inactive-text">Most to Least</span>
    </div>
  </div>
  )
}

const CommunityPost = () => {
  return(
    <div className="community-post">
      <div className="post-upvote-btn">Upvote</div>
      <div className="post-thumbnail"></div>
      <div className="post-summary">
        <h3>Welcome to Class of 2023, Please read our community guideline</h3>
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
      <div className="post-views-comments">
        <div className="post-views">
          <span className="active-text">100</span>
          <span className="inactive-text">Views</span>
        </div>
        <div className="post-comments">
          <span className="active-text">5</span>
          <span className="inactive-text">Comments</span>
        </div>
      </div>
    </div>
  )
}

export default class Community extends Component {
  render() {
    return (
      <div className="community">
        {/* Header */}
        <Header />

        {/* Banner */}
        <Banner />

        {/* Main Container */}
        <div className="main-container">
          {/* Community Stats */}
          <CommunityStats />

          {/* Create-Sort Box */}
          <CreateSortBox />

          {/* Sort Option Box */}
          <SortOptionBox />

          {/* Main Content */}
          <div className="main-content">
            <CommunityPost />
            <CommunityPost />
            <CommunityPost />
            <CommunityPost />
            </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  }
}
