import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class JobDisp extends React.Component {
  handleApply(e) {
    if (e.target.checked == true) {
      const obj = {};
      obj['job_id'] = e._targetInst.key;
      obj['user_id'] = this.props.currentUser.id;
      obj['category'] = '0';
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
    let company = <td />;
    if (this.props.companies[this.props.job.company_id]) {
      company = <td>{this.props.companies[this.props.job.company_id].name}</td>;
    }
    if (this.props.job) {
      return (
        <tr id="result" key={this.props.job.id}>
          <td>{this.props.job.position}</td>
          {company}
          <td>{this.props.job.location}</td>
          <td>{this.props.job.url}</td>
          <td>{this.props.job.description}</td>
          <td className="checkbox-input">
            <input
              type="checkbox"
              onClick={this.handleApply.bind(this)}
              key={this.props.job.id}
              checked={this.props.cart.some(
                el => el.job_id == this.props.job.id
              )}
            />
          </td>
        </tr>
      );
    }
  }
}

export default withRouter(JobDisp);
