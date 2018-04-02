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
      <div>
        <form id="profile-form">
          <input type="text" value="Phone Number" />
          <input type="text" value="Resume Name" />
          <input type="file" onChange={this.updateFile.bind(this)} />
          <div>
            <button onClick={this.handleSubmit.bind(this)}>Save</button>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(Profile);
