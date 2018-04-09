import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class JobDisp extends React.Component {
  handleSave(e) {
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
      // remove applications if they are unsent and unsaved from cart
      this.props.applications.forEach(el => {
        if (el['job_id'] == e._targetInst.key && el['status'] === 'unsent') {
          this.props.deleteApplication(el['id']);
        }
      });
    }
  }

  handleCat(e) {
    this.cart.category = e.target.value;
    // this.setState({ cat: e.target.value });
    this.props.updateCart({ cart: this.cart }, this.cart.id);
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
    if (this.props.cart.length > 0) {
      this.application = this.props.applications.filter(
        x => x.job_id == this.props.job.id
      )[0];
      this.cart = this.props.cart.filter(x => x.job_id == this.props.job.id)[0];
      let category = <td>0</td>;
      let d_val = 0;
      if (this.cart) {
        d_val = this.cart.category;
      }
      category = (
        <td>
          <select defaultValue={d_val} onChange={this.handleCat.bind(this)}>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </td>
      );
      return (
        <tr id="result" key={this.props.job.id}>
          <td>{this.props.job.position}</td>
          {company}
          <td>{this.props.job.location}</td>
          <td>{this.props.job.url}</td>
          <td>{this.props.job.description.substring(0, 200) + '...'}</td>
          {category}
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
              disabled={
                this.application && this.application.status !== 'unsent'
              }
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
