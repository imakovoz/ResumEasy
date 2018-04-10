import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class ScrapeJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: '',
      location: '',
      emailv: false,
      code: '',
    };
    this.table = false;
    this.auth = false;
    this.handleInput = this.handleInput.bind(this);
    this.handleEmailVerification = this.handleEmailVerification.bind(this);
    this.scrape = this.scrape.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.props.clearJobs();
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
    this.props
      .liAuth({
        username: 'shoytempus@gmail.com',
        password: 'starwars1',
        status: this.props.status,
      })
      .then(result => {
        if (result.data.status === 'false') {
          this.handleSearch();
        } else if (result.data.status === 'email') {
          this.setState({ emailv: true });
        } else {
          this.scrape();
        }
      });
  }

  scrape() {
    this.props.scrapeJobs({
      location: this.state.location,
      position: this.state.position,
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
        } else if (result.data.status === 'email') {
          this.setState({ emailv: true });
        } else {
          this.setState({ emailv: false });
          this.scrape();
        }
      });
  }

  render() {
    // let screenshot = null;
    // if (this.props.screenshot) {
    //   screenshot = <img src={this.props.screenshot} id="screenshot" />;
    // }

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

    if (this.state.emailv) {
      result = (
        <form id="scrape-form" onSubmit={this.handleEmailVerification}>
          <input
            onChange={this.handleInput}
            className="code"
            placeholder="Verification Code"
          />
          <a onClick={this.handleEmailVerification}>Submit</a>
        </form>
      );
    }

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
    return <div id="search-wrapper">{result}</div>;
  }
}

export default withRouter(ScrapeJobs);
