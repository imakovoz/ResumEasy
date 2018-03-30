import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let profile = null;
    if (this.props.currentUser) {
      profile = (
        <div className="dropdown">
          <div id="header-profile">
            <img src={`${window.profPic}`} height="24" width="24" />
          </div>
          <div className="dropdown-content">
            <Link
              to={`/users/${this.props.currentUser.id}`}
              className="profile-dropdown-content"
            >
              My Profile
            </Link>
            <a onClick={this.props.logout} className="profile-dropdown-content">
              Logout
            </a>
          </div>
        </div>
      );
    } else {
      profile = <Link to="/signup">Sign Up</Link>;
    }

    return (
      <nav id="nav">
        <div id="left-nav">
          <h1>ResumEasy</h1>
          <h5>Your best tool for applying to jobs</h5>
        </div>
        <div id="right-nav">
          <Link to="/scrape-jobs">Scrape Jobs</Link>
          <Link to="/find-jobs">Find Jobs</Link>
          <Link to="/apply-jobs">Apply to Jobs</Link>
          {profile}
        </div>
      </nav>
    );
  }
}

export default Header;
