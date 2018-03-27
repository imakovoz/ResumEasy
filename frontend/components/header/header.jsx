import React from "react";
import { Link, withRouter } from "react-router-dom";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }


  render() {
    return (
      <nav id="nav">
        <div id="left-nav">
          <h1>ResumEasy</h1>
          <h5>Your best tool for applying to jobs</h5>
        </div>
        <div id="right-nav">
          <div>Find Jobs</div>
          <div>Categorize Jobs</div>
          <div>Apply to Jobs</div>
        </div>
      </nav>
    );
  }
}

export default Header;
