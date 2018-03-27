import React from "react";
import { Link, withRouter } from "react-router-dom";
import Header from "../header/header_container";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }


  render() {
    this.props.fetchJobs();
    return (
      <div id="dashboard-wrapper">
        <Header />
        <div>123</div>
      </div>
    );
  }
}

export default withRouter(Dashboard);
