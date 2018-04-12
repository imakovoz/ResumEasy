import Scrape from './scrape_jobs';
import { connect } from 'react-redux';
import { scrapeJobs, clearJobs, liAuth } from '../../../actions/job_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    jobs: _.values(state.entities.jobs) || [],
    screenshot: state.entities.auth.screenshot || null,
    status: state.entities.auth.status || 'false',
    driver: state.entities.auth.driver || '0',
    currentUser: state.session.currentUser.id,
  };
};

const mapDispatchToProps = dispatch => ({
  scrapeJobs: data => dispatch(scrapeJobs(data)),
  liAuth: data => dispatch(liAuth(data)),
  clearJobs: () => dispatch(clearJobs()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Scrape);
