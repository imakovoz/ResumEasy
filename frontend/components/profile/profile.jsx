import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resumeUrl: '',
      resumeFile: null,
    };
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
    if (file) formData.append('user[resume]', file);
    this.props.updateUser(formData, this.props.currentUser.id);
  }

  render() {
    return (
      <div id="profile-wrapper">
        <form id="profile-form">
          <label>Update Profile</label>
          <input type="text" placeholder="First Name" id="profile-input" />
          <input type="text" placeholder="Last Name" id="profile-input" />
          <input type="text" placeholder="Phone Number" id="profile-input" />
          <input type="text" placeholder="Resume Name" id="profile-input" />
          <input type="file" onChange={this.updateFile.bind(this)} />
          <a onClick={this.handleSubmit.bind(this)}>Save</a>
        </form>
      </div>
    );
  }
}

export default withRouter(Profile);
