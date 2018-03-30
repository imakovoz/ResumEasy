import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class JobDisp extends React.Component {
  handleApply(e) {
    debugger;
    if (e.target.checked == true) {
      debugger;
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

  render() {
    if (this.props.cart.some(el => el.job_id == this.props.job.id)) {
      return (
        <tr id="result" key={this.props.job.id}>
          <td>{this.props.job.position}</td>
          <td>{this.props.job.location}</td>
          <td>{this.props.job.url}</td>
          <td>{this.props.job.description}</td>
          <td>
            <input
              type="checkbox"
              onClick={this.handleApply.bind(this)}
              key={this.props.job.id}
              checked
            />
          </td>
        </tr>
      );
    } else if (this.props.job) {
      return (
        <tr id="result" key={this.props.job.id}>
          <td>{this.props.job.position}</td>
          <td>{this.props.job.location}</td>
          <td>{this.props.job.url}</td>
          <td>{this.props.job.description}</td>
          <td>
            <input
              type="checkbox"
              onClick={this.handleApply.bind(this)}
              key={this.props.job.id}
            />
          </td>
        </tr>
      );
    }
  }
}

export default withRouter(JobDisp);
