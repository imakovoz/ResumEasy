import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import JobDisp from './job_disp_apply';

class ApplyJobs extends React.Component {
  handleSendApp(e) {
    if (
      this.props.applications.filter(app => app.status === 'unsent').length > 0
    ) {
      if (
        this.props.currentUser.phone &&
        this.props.currentUser.resumename &&
        this.props.currentUser.resume_file_name !== 'missing.png'
      ) {
        this.props.apply();
      } else {
        alert('Please update your user profile with all key information');
      }
    } else {
      alert('Please select jobs to apply to');
    }
  }

  componentDidMount() {
    this.props
      .fetchJobs({ type: 'apply' })
      .then(() => this.props.fetchUser(this.props.currentUser.id))
      .then(() => this.props.fetchCarts())
      .then(() => this.props.fetchCompanies())
      .then(() => this.props.fetchApplications())
      .then(() => $('#apply-table').DataTable());
  }

  render() {
    let result = null;
    if (this.props.jobs.length > 0) {
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
