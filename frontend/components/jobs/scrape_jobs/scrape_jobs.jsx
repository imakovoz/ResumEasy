import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import LIModal from '../li_auth_modal';

class ScrapeJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: '',
      location: '',
      modal: false,
    };
    this.table = false;
    this.handleInput = this.handleInput.bind(this);
    this.scrape = this.scrape.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    Promise.resolve(this.props.clearJobs()).then(() =>
      this.props.fetchUser(this.props.currentUser.id)
    );
  }

  componentDidUpdate() {
    if (this.table) {
      $('#scrape-table').DataTable();
      this.table = false;
    }
  }

  handleInput(e) {
    const obj = {};
    obj[e.currentTarget.className] = e.target.value;
    this.setState(obj);
  }

  handleSearch() {
    if (this.props.status !== 'true') {
      this.setState({ modal: true });
    } else {
      this.scrape();
    }
  }

  scrape() {
    this.props.scrapeJobs({
      location: this.state.location,
      position: this.state.position,
    });
  }

  closeModal() {
    this.setState({ modal: false });
  }

  render() {
    let result = (
      <section>
        <form id="scrape-form" onSubmit={this.handleSearch}>
          <input
            onChange={this.handleInput}
            className="position"
            placeholder="Job Description"
          />
          <input
            onChange={this.handleInput}
            className="location"
            placeholder="Location"
          />
          <a onClick={this.handleSearch}>Search</a>
        </form>
      </section>
    );

    if (this.props.jobs.length > 0) {
      this.table = true;
      result = (
        <table id="scrape-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Location</th>
              <th>URL</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {this.props.jobs.map((job, i) => {
              return (
                <tr id="result" key={i}>
                  <td>{job.position}</td>
                  <td>{job.location}</td>
                  <td>{job.url}</td>
                  <td>{job.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
    return (
      <div id="search-wrapper">
        <LIModal
          isOpen={this.state.modal}
          onClose={this.closeModal.bind(this)}
          liAuth={this.props.liAuth}
          submit={this.scrape}
          status={this.props.status}
          fetchUser={this.props.fetchUser}
          currentUser={this.props.currentUser}
        />
        {result}
      </div>
    );
  }
}

export default withRouter(ScrapeJobs);
