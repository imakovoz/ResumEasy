import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class ScrapeJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: '',
      location: '',
    };
    this.table = false;
    this.handleInput = this.handleInput.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
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
    this.props.fetchJobs(this.state);
  }

  render() {
    let result = null;
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
      <div className="search-wrapper">
        <form>
          <input
            onChange={this.handleInput}
            className="position"
            placeholder="Search Jobs"
          />
          <input
            onChange={this.handleInput}
            className="location"
            placeholder="Search Jobs"
          />
          <input onClick={this.handleSearch} type="button" value="Search" />
        </form>
        {result}
      </div>
    );
  }
}

export default withRouter(ScrapeJobs);
