import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class JobDisp extends React.Component {
  handleSave(e) {
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

  handleApply(e) {
    if (e.target.checked == true) {
      const obj = {};
      obj['job_id'] = e._targetInst.key;
      obj['user_id'] = this.props.currentUser.id;
      obj['status'] = 'unsent';
      const cart = {};
      cart['application'] = obj;
      this.props.applyToJob(cart);
    } else {
      let id = null;
      this.props.applications.forEach(el => {
        if (el['job_id'] == e._targetInst.key) {
          id = el['id'];
        }
      });
      this.props.deleteApplication(id);
    }
  }

  render() {
    // TODO add ability to sort by if saved?, apply? or company
    let company = <td />;
    if (this.props.companies[this.props.job.company_id]) {
      company = <td>{this.props.companies[this.props.job.company_id].name}</td>;
    }
    if (this.props.applications.length > 0) {
      const application = this.props.applications.filter(
        x => x.job_id == this.props.job.id
      )[0];
      return (
        <tr id="result" key={this.props.job.id}>
          <td>{this.props.job.position}</td>
          {company}
          <td>{this.props.job.location}</td>
          <td>{this.props.job.url}</td>
          <td>{this.props.job.description}</td>
          <td>
            <input
              type="checkbox"
              onClick={this.handleSave.bind(this)}
              key={this.props.job.id}
              checked={this.props.cart.some(
                el => el.job_id == this.props.job.id
              )}
            />
          </td>
          <td>
            <input
              type="checkbox"
              onClick={this.handleApply.bind(this)}
              key={this.props.job.id}
              checked={this.props.applications.some(
                el => el.job_id == this.props.job.id
              )}
              disabled={application && application.status !== 'unsent'}
              value={this.props.job.id}
            />
          </td>
        </tr>
      );
    } else {
      return <div />;
    }
  }
}

export default withRouter(JobDisp);
