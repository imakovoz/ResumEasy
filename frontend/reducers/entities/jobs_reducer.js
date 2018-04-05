import { merge } from 'lodash';
import {
  RECEIVE_JOBS,
  RECEIVE_JOB,
  CLEAR_JOBS,
} from '../../actions/job_actions';

const jobsReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_JOBS:
      return action.jobs;
    case RECEIVE_JOB:
      return merge({}, state, { [action.job.id]: action.job });
    case CLEAR_JOBS:
      return {};
    default:
      return state;
  }
};

export default jobsReducer;
