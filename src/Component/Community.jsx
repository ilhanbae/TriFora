import React, { Component } from "react";
import "./Community.css";

export default class Community extends Component {
  render() {
    return <div className="community">
      {/* Header */}
      <div className="header">
        Header
      </div>

      {/* Banner */}
      <div className="banner">
        <div className="banner-background">
          Banner background
        </div>
        <div className="banner-content">
          <div className="community-avatar">
          </div>
          <div className="community-info">
            <h2>Class of 2023</h2>
            <span className="inactive-text">Since February 19th, 2023</span>
          </div>
          <div className="join-button">
            Join
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="main-container">
        {/* Community Stats */}
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

        {/* Search-Sort Box */}
        <div className="search-sort-box">
          <div className="user-profile"></div>
          <div className="search-box">
            Create Post
          </div>
          <div className="sort-button">
            Sort Posts
          </div>
        </div>

        {/* Sort Options Box */}
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

        {/* Main Content */}
        <div className="main-content">
          Main-content
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        Footer
      </div>

    </div>;
  }
}
