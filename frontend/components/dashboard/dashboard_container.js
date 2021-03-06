import { login, resetErrors } from '../../actions/session_actions';
import Dashboard from './dashboard';
import { connect } from 'react-redux';
import { fetchJobs } from '../../actions/job_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    jobs: state.entities.jobs || {},
  };
};

const mapDispatchToProps = dispatch => ({
  fetchJobs: data => dispatch(fetchJobs(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
