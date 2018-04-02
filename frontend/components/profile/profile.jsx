import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resumeUrl: '',
      resumeFile: null,
      firstname: this.props.currentUser.firstname || '',
      lastname: this.props.currentUser.lastname || '',
      phone: this.props.currentUser.phone || '',
      resumename: this.props.currentUser.resumename || '',
    };
    this.handleInput = this.handleInput.bind(this);
  }

  componentDidMount() {
    this.props
      .fetchJobs({ type: 'sent' })
      .then(() => this.props.fetchUser(this.props.currentUser.id))
      .then(() => this.props.fetchCompanies())
      .then(() => this.props.fetchApplications());
  }

  handleInput(e) {
    const obj = {};
    obj[e.currentTarget.className] = e.target.value;
    this.setState(obj);
  }

  updateFile(e) {
    const reader = new FileReader();
    const file = e.currentTarget.files[0];
    reader.onloadend = () =>
      this.setState({ resumeUrl: reader.result, resumeFile: file });

    if (file) {
      reader.readAsDataURL(file);
    } else {
      console.log('error');
      this.setState({ resumeUrl: '', resumeFile: null });
    }
  }

  handleSubmit() {
    const file = this.state.resumeFile;
    const formData = new FormData();
    if (file) {
      formData.append('user[resume]', file);
      this.props.updateUser(formData, this.props.currentUser.id);
    }
    const user_prof = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      phone: this.state.phone,
      resumename: this.state.resumename,
    };
    this.props.updateProfile({ user: user_prof }, this.props.currentUser.id);
  }

  render() {
    if (this.props.currentUser.id == this.props.pageId) {
      return (
        <div id="profile-wrapper">
          <form id="profile-form">
            <label>Update Profile</label>
            <input
              type="text"
              placeholder="First Name"
              id="profile-input"
              onChange={this.handleInput}
              className="firstname"
              value={this.state.firstname}
            />
            <input
              type="text"
              placeholder="Last Name"
              id="profile-input"
              onChange={this.handleInput}
              className="lastname"
              value={this.state.lastname}
            />
            <input
              type="text"
              placeholder="Phone Number"
              id="profile-input"
              onChange={this.handleInput}
              className="phone"
              value={this.state.phone}
            />
            <input
              type="text"
              placeholder="Resume Name"
              id="profile-input"
              onChange={this.handleInput}
              className="resumename"
              value={this.state.resumename}
            />
            <input type="file" onChange={this.updateFile.bind(this)} />
            <a onClick={this.handleSubmit.bind(this)}>Save</a>
          </form>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default withRouter(Profile);
