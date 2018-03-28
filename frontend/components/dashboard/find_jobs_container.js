import Find from './find_jobs';
import { connect } from 'react-redux';
import { fetchJobs } from '../../actions/job_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    jobs: _.values(state.entities.jobs) || [],
  };
};

const mapDispatchToProps = dispatch => ({
  fetchJobs: data => dispatch(fetchJobs(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Find);
