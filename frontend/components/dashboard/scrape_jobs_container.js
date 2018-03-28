import Scrape from './scrape_jobs';
import { connect } from 'react-redux';
import { scrapeJobs } from '../../actions/job_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    jobs: _.values(state.entities.jobs) || [],
  };
};

const mapDispatchToProps = dispatch => ({
  scrapeJobs: data => dispatch(scrapeJobs(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Scrape);
