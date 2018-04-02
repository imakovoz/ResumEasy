import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class SessionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.demoLogin = this.demoLogin.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
  }

  // TODO add unmount to clear errors
  // componentWillUnmount() {
  //   this.props.resetErrors();
  // }

  demoLogin(e) {
    if (e.currentTarget.baseURI.split('/')[4] === 'signup') {
      const user = {
        username: 'user' + Math.floor(e.timeStamp),
        password: 'starwars',
      };
      this.props.processForm({ user });
    } else {
      const user = { username: 'Test Account', password: 'starwars' };
      this.props.processForm({ user });
    }
  }

  handlePassword(e) {
    this.setState({ password: e.target.value });
  }
  handleUsername(e) {
    this.setState({ username: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = Object.assign({}, this.state);
    this.props.processForm({ user });
  }
  //TODO refactor using formType
  render() {
    let errs = null;
    if (Boolean(this.props.errors[0])) {
      errs = <span id="login-errors">{this.props.errors[0]}</span>;
    }
    if (this.props.formType === 'signup') {
      return (
        <div id="session-form-wrapper">
          <div id="SessionPageForm">
            <form id="SessionForm" onSubmit={this.handleSubmit}>
              <label>Sign up</label>
              {errs}
              <input
                type="email"
                value={this.state.username}
                onChange={this.handleUsername}
                placeholder="Email"
                className="SessionFormInputs"
              />
              <input
                type="password"
                value={this.state.password}
                onChange={this.handlePassword}
                placeholder="Password"
                className="SessionFormInputs"
              />
              <button className="SessionFormInputs" id="sign-up-submit">
                Sign me up!
              </button>
              <div>
                <span>Already have an account? </span>
                <Link to="/login" id="log-in-link">
                  Log in
                </Link>
              </div>
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <div id="session-form-wrapper">
          <div id="SessionPageForm">
            <form id="SessionForm" onSubmit={this.handleSubmit}>
              <label>Log in</label>
              {errs}
              <input
                type="text"
                value={this.state.username}
                onChange={this.handleUsername}
                placeholder="Username"
                className="SessionFormInputs"
              />
              <input
                type="password"
                value={this.state.password}
                onChange={this.handlePassword}
                placeholder="Password"
                className="SessionFormInputs"
              />
              <button className="SessionFormInputs" id="sign-up-submit">
                Log me in!
              </button>
              <div>
                <span>New to ResumEasy? </span>
                <Link to="/signup" id="sign-up-link">
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }
}

export default withRouter(SessionForm);
