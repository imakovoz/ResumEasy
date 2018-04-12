import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import JobDisp from './job_disp_apply';
import LIModal from '../li_auth_modal';

class ApplyJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 1,
      modal: false,
      submit: null,
    };
  }

  handleSendApp(e) {
    if (
      this.props.applications.filter(app => app.status === 'unsent').length > 0
    ) {
      if (
        this.props.currentUser.phone &&
        this.props.currentUser.resumename &&
        this.props.currentUser.resume_file_name !== 'missing.png'
      ) {
        if (this.props.status !== 'true') {
          this.setState({ modal: true, submit: 'send' });
        } else {
          this.props.apply();
        }
      } else {
        alert('Please update your user profile with all key information');
      }
    } else {
      alert('Please select jobs to apply to');
    }
  }

  handleSort(e) {
    if (this.props.status !== 'true') {
      this.setState({ modal: true, submit: 'sort' });
    } else {
      const carts = [];

      // this.props.cart.forEach(cart => {
      //   let job = this.props.jobs_obj[cart.job_id];
      //   cart.url = job.url;
      //   carts.push(cart);
      // });

      this.props
        .categorizeCarts({ carts: this.props.cart })
        .then(() => this.setState({ key: (this.state.key += 1) }))
        .then(() => $('#apply-table').DataTable());
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

  handleSubmit() {
    if (this.state.submit === 'send') {
      this.handleSendApp();
      this.setState({ submit: null });
    } else if (this.state.submit === 'sort') {
      this.handleSort();
      this.setState({ submit: null });
    }
  }

  closeModal() {
    this.setState({ modal: false });
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
              <th>Category</th>
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
                  updateCart={this.props.updateCart}
                  categorizeCarts={this.props.categorizeCarts}
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
      <div id="apply-wrapper" key={this.state.key}>
        <LIModal
          isOpen={this.state.modal}
          onClose={this.closeModal.bind(this)}
          liAuth={this.props.liAuth}
          submit={this.handleSubmit.bind(this)}
          status={this.props.status}
          fetchUser={this.props.fetchUser}
          currentUser={this.props.currentUser}
        />
        <div id="apply-btn-container">
          <div id="sort-btn" onClick={this.handleSort.bind(this)}>
            Sort jobs
          </div>
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
