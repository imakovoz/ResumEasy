import {
  fetchUser,
  fetchUsers,
  updateUser,
  updateProfile,
} from '../../actions/user_actions';
import Profile from './profile';
import { connect } from 'react-redux';
import { fetchJobs } from '../../actions/job_actions';
import { fetchCompanies } from '../../actions/company_actions';
import {
  fetchApplications,
  updateApplication,
  deleteApplication,
  applyToJob,
} from '../../actions/application_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser:
      state.entities.users[state.session.currentUser.id] ||
      state.session.currentUser,
    pageId: ownProps.match.params.id,
    jobs: _.values(state.entities.jobs) || [],
    companies: state.entities.companies || {},
    applications: _.values(state.entities.applications) || [],
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateUser: (data, id) => dispatch(updateUser(data, id)),
    fetchUser: id => dispatch(fetchUser(id)),
    updateProfile: (data, id) => dispatch(updateProfile(data, id)),
    fetchJobs: data => dispatch(fetchJobs(data)),
    fetchCompanies: () => dispatch(fetchCompanies()),
    fetchApplications: () => dispatch(fetchApplications()),
    updateApplication: id => dispatch(updateApplication(id)),
    deleteApplication: id => dispatch(deleteApplication(id)),
    applyToJob: data => dispatch(applyToJob(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
