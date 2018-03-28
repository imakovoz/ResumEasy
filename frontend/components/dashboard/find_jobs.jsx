import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class FindJobs extends React.Component {
  constructor(props) {
    super(props);
    this.table = false;
  }

  componentDidMount() {
    this.props.fetchJobs().then(() => (this.table = true));
  }

  componentDidUpdate() {
    if (this.table) {
      $('#scrape-table').DataTable();
      this.table = false;
    }
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
    return <div className="search-wrapper">{result}</div>;
  }
}

export default withRouter(FindJobs);
