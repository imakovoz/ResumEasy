import { merge } from 'lodash';
import { RECEIVE_JOBS } from "../../actions/job_actions";


const jobsReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_JOBS:
      return merge({}, state, action.jobs);
    default:
      return state;
  }
};

export default jobsReducer;
