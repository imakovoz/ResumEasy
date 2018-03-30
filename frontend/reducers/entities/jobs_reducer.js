import { merge } from 'lodash';
import { RECEIVE_JOBS, CLEAR_JOBS } from '../../actions/job_actions';

const jobsReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_JOBS:
      return action.jobs;
    case CLEAR_JOBS:
      return {};
    default:
      return state;
  }
};

export default jobsReducer;
