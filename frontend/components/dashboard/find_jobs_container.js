import Find from './find_jobs';
import { connect } from 'react-redux';
import { fetchJobs } from '../../actions/job_actions';
import { fetchCarts } from '../../actions/cart_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.session.currentUser,
    jobs: _.values(state.entities.jobs) || [],
    cart: _.values(state.entities.carts) || [],
  };
};

const mapDispatchToProps = dispatch => ({
  fetchJobs: data => dispatch(fetchJobs(data)),
  fetchCarts: data => dispatch(fetchCarts(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Find);
