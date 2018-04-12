import Scrape from './scrape_jobs';
import { connect } from 'react-redux';
import { scrapeJobs, clearJobs, liAuth } from '../../../actions/job_actions';
import { fetchUser } from '../../../actions/user_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    jobs: _.values(state.entities.jobs) || [],
    screenshot: state.entities.auth.screenshot || null,
    status: state.entities.auth.status || 'false',
    driver: state.entities.auth.driver || '0',
    currentUser:
      state.entities.users[state.session.currentUser.id] ||
      state.session.currentUser,
  };
};

const mapDispatchToProps = dispatch => ({
  scrapeJobs: data => dispatch(scrapeJobs(data)),
  liAuth: data => dispatch(liAuth(data)),
  fetchUser: id => dispatch(fetchUser(id)),
  clearJobs: () => dispatch(clearJobs()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Scrape);
