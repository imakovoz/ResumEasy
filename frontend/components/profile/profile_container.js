import { fetchUser, fetchUsers, updateUser } from '../../actions/user_actions';
import Profile from './profile';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.session.currentUser || null,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateUser: (data, id) => dispatch(updateUser(data, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
