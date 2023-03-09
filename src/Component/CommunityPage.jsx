import React, { Component } from "react";
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
        <div className="join-button">Join</div>
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

const CreateSortBox = () => {
  return (
    <div className="create-sort-post-box">
      <div className="sort-post-button">Sort Posts</div>
      <div className="create-post-box">
        <div className="create-post-placeholder inactive-text">
          Tell us your story!
        </div>
        <div className="create-post-button">Create Post</div>
      </div>
    </div>
  );
};

const CommunityPost = () => {
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
        <span className="menu-icon"></span>
      </div>
    </div>
  );
};

const Pagination = () => {
  return (
    <div className="pagination">
      <div className="prev-button">Previous</div>
      <div className="page-number">1</div>
      <div className="next-button">Next</div>
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
          <CreateSortBox />

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
