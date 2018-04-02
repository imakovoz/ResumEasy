import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import JobDisp from './job_disp_apply';

class ApplyJobs extends React.Component {
  constructor(props) {
    super(props);
    this.table = false;
  }

  handleSendApp(e) {
    this.props.apply();
  }

  componentDidMount() {
    this.props
      .fetchJobs({ type: 'apply' })
      .then(() => this.props.fetchCarts())
      .then(() => this.props.fetchCompanies())
      .then(() => this.props.fetchApplications())
      .then(() => (this.table = true));
  }

  componentDidUpdate() {
    if (this.table && this.props.applications.length > 0) {
      $('#apply-table').DataTable();
      this.table = false;
    }
  }

  render() {
    let result = null;
    if (this.props.jobs.length > 0) {
      this.table = true;
      result = (
        <table id="apply-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Company</th>
              <th>Location</th>
              <th>URL</th>
              <th>Description</th>
              <th>Save?</th>
              <th>Apply?</th>
            </tr>
          </thead>
          <tbody>
            {this.props.jobs.map((job, i) => {
              return (
                <JobDisp
                  job={job}
                  cart={this.props.cart}
                  companies={this.props.companies}
                  applications={this.props.applications}
                  addToCart={this.props.addToCart}
                  removeFromCart={this.props.removeFromCart}
                  applyToJob={this.props.applyToJob}
                  deleteApplication={this.props.deleteApplication}
                  currentUser={this.props.currentUser}
                  key={i}
                />
              );
            })}
          </tbody>
        </table>
      );
    }
    return (
      <div id="apply-wrapper">
        <div id="apply-btn-container">
          <div id="apply-btn" onClick={this.handleSendApp.bind(this)}>
            Apply now!
          </div>
        </div>
        {result}
      </div>
    );
  }
}

export default withRouter(ApplyJobs);
