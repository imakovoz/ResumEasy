import { login, resetErrors } from '../../actions/session_actions';
import Dashboard from './dashboard';
import { connect } from 'react-redux';
import { fetchJobs } from "../../actions/job_actions";

const mapStateToProps = (state, ownProps) => {
  return ({

  });
};

const mapDispatchToProps = (dispatch) => ({
  fetchJobs: () => dispatch(fetchJobs()),
});


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
