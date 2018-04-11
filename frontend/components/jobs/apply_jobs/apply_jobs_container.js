import Apply from './apply_jobs';
import { connect } from 'react-redux';
import { fetchJobs, liAuth } from '../../../actions/job_actions';
import { fetchCompanies } from '../../../actions/company_actions';
import { fetchUser } from '../../../actions/user_actions';
import {
  fetchApplications,
  applyToJob,
  updateApplication,
  deleteApplication,
  apply,
} from '../../../actions/application_actions';
import {
  fetchCarts,
  addToCart,
  removeFromCart,
  updateCart,
  categorizeCarts,
} from '../../../actions/cart_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser:
      state.entities.users[state.session.currentUser.id] ||
      state.session.currentUser,
    jobs: _.values(state.entities.jobs) || [],
    jobs_obj: state.entities.jobs || {},
    companies: state.entities.companies || {},
    cart: _.values(state.entities.carts) || [],
    status: state.entities.auth.status || 'false',
    applications: _.values(state.entities.applications) || [],
  };
};

const mapDispatchToProps = dispatch => ({
  fetchUser: id => dispatch(fetchUser(id)),
  fetchJobs: data => dispatch(fetchJobs(data)),
  fetchCompanies: () => dispatch(fetchCompanies()),
  fetchCarts: data => dispatch(fetchCarts(data)),
  addToCart: data => dispatch(addToCart(data)),
  updateCart: (data, id) => dispatch(updateCart(data, id)),
  categorizeCarts: data => dispatch(categorizeCarts(data)),
  removeFromCart: id => dispatch(removeFromCart(id)),
  fetchApplications: () => dispatch(fetchApplications()),
  applyToJob: data => dispatch(applyToJob(data)),
  apply: () => dispatch(apply()),
  updateApplication: id => dispatch(updateApplication(id)),
  deleteApplication: id => dispatch(deleteApplication(id)),
  liAuth: data => dispatch(liAuth(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Apply);
