import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      username: '',
      password: '',
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.scrape = this.scrape.bind(this);
    this.handleEmailVerification = this.handleEmailVerification.bind(this);
  }

  handleSubmit() {}

  handleInput(e) {
    const obj = {};
    obj[e.currentTarget.id] = e.target.value;
    this.setState(obj);
  }

  handleSearch() {
    this.props
      .liAuth({
        username: this.state.username,
        password: this.state.password,
        status: this.props.status,
      })
      .then(result => {
        if (result.data.status === 'false') {
          this.handleSearch();
        } else if (result.data.status === 'true') {
          this.props.onClose();
          this.scrape();
        }
      });
  }

  scrape() {
    this.props.scrapeJobs({
      location: this.props.loc,
      position: this.props.position,
    });
  }

  handleEmailVerification() {
    this.props
      .liAuth({
        code: this.state.code,
        status: this.props.status,
      })
      .then(result => {
        if (result.data.status === 'false') {
          this.handleSearch();
        } else if (result.data.status === 'true') {
          this.scrape();
        }
      });
  }

  render() {
    // Render nothing if the "show" prop is false
    if (!this.props.isOpen) {
      return null;
    }
    if (this.props.status === 'false') {
      return (
        <div className="modal-backdrop">
          <div className="modal">
            <form id="li_auth_modal_form">
              <input
                type="text"
                onChange={this.handleInput}
                id="username"
                placeholder="Username"
              />
              <input
                type="password"
                onChange={this.handleInput}
                id="password"
                placeholder="Password"
              />
              <a onClick={this.handleSearch}>Submit</a>
            </form>
          </div>
        </div>
      );
    } else if (this.props.status === 'email') {
      return (
        <div className="modal-backdrop">
          <div className="modal">
            <form>
              <input
                type="text"
                onChange={this.handleInput}
                id="code"
                placeholder="Verification Code"
              />
              <a onClick={this.handleEmail}>Submit</a>
            </form>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default withRouter(Modal);
