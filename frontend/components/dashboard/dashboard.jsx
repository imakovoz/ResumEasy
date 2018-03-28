import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div id="dashboard-wrapper" />;
  }
}

export default withRouter(Dashboard);
