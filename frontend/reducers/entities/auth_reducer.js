import { merge } from 'lodash';
import { CHECK_AUTH } from '../../actions/job_actions';

const authReducer = (state = {}, action) => {
  Object.freeze(state);
  switch (action.type) {
    case CHECK_AUTH:
      return merge({}, state, action.data);
    default:
      return state;
  }
};

export default authReducer;
