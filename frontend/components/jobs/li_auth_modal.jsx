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
      spinner: false,
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleAuth = this.handleAuth.bind(this);
    this.handleEmailVerification = this.handleEmailVerification.bind(this);
  }

  handleInput(e) {
    const obj = {};
    obj[e.currentTarget.id] = e.target.value;
    this.setState(obj);
  }

  handleAuth() {
    this.props
      .liAuth({
        username: this.state.username,
        password: this.state.password,
        status: this.props.status,
      })
      .then(result => {
        if (result.data.status === 'false') {
          this.handleAuth();
        } else if (result.data.status === 'true') {
          this.props.submit().then(() => {
            this.props.onClose();
          });
        }
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
          this.handleAuth();
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
      if (this.state.spinner) {
        return (
          <div className="modal-backdrop">
            <div className="modal">
              <div class="loader">Loading...</div>
            </div>
          </div>
        );
      }
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
              <a onClick={this.handleAuth}>Submit</a>
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