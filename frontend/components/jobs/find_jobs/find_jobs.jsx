import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import JobDisp from './job_disp';

class FindJobs extends React.Component {
  constructor(props) {
    super(props);
    this.table = false;
    this.handleApply = this.handleApply.bind(this);
    this.checked = this.checked.bind(this);
  }

  componentDidMount() {
    this.props
      .fetchJobs()
      .then(() => this.props.fetchCarts())
      .then(() => this.props.fetchCompanies())
      .then(() => (this.table = true));
  }

  componentDidUpdate() {
    if (this.table) {
      $('#scrape-table').DataTable();
      this.table = false;
    }
  }

  handleApply(e) {
    if (e.target.checked == true) {
      const obj = {};
      obj['job_id'] = e._targetInst.key;
      obj['user_id'] = this.props.currentUser.id;
      const cart = {};
      cart['cart'] = obj;
      this.props.addToCart(cart);
    } else {
      let id = null;
      this.props.cart.forEach(el => {
        if (el['job_id'] == e._targetInst.key) {
          id = el['id'];
        }
      });
      this.props.removeFromCart(id);
    }
  }

  checked(job) {
    if (job.carts.find(job.id)) {
      return 'checked';
    }
  }

  render() {
    let result = null;
    if (this.props.jobs.length > 0) {
      this.table = true;
      result = (
        <table id="scrape-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Company</th>
              <th>Location</th>
              <th>URL</th>
              <th>Description</th>
              <th>Save?</th>
            </tr>
          </thead>
          <tbody>
            {this.props.jobs.map((job, i) => {
              return (
                <JobDisp
                  job={job}
                  cart={this.props.cart}
                  companies={this.props.companies}
                  addToCart={this.props.addToCart}
                  removeFromCart={this.props.removeFromCart}
                  currentUser={this.props.currentUser}
                  key={i}
                />
              );
            })}
          </tbody>
        </table>
      );
    }
    return <div id="find-wrapper">{result}</div>;
  }
}

export default withRouter(FindJobs);
