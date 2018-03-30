import Find from './find_jobs';
import { connect } from 'react-redux';
import { fetchJobs } from '../../../actions/job_actions';
import { fetchCompanies } from '../../../actions/company_actions';
import {
  fetchCarts,
  addToCart,
  removeFromCart,
} from '../../../actions/cart_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.session.currentUser,
    jobs: _.values(state.entities.jobs) || [],
    companies: state.entities.companies || {},
    cart: _.values(state.entities.carts) || [],
  };
};

const mapDispatchToProps = dispatch => ({
  fetchJobs: data => dispatch(fetchJobs(data)),
  fetchCompanies: () => dispatch(fetchCompanies()),
  fetchCarts: data => dispatch(fetchCarts(data)),
  addToCart: data => dispatch(addToCart(data)),
  removeFromCart: id => dispatch(removeFromCart(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Find);
