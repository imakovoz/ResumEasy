import { logout, resetErrors } from '../../actions/session_actions';
import Header from './header';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.session.currentUser || null,
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
