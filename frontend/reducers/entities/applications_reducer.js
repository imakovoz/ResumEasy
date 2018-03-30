import { merge } from 'lodash';
import {
  RECEIVE_APPLICATIONS,
  RECEIVE_APPLICATION,
} from '../../actions/application_actions';

const applicationsReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_APPLICATIONS:
      return action.applications;
    case RECEIVE_APPLICATION:
      return merge({}, state, { [action.application.id]: action.application });
    default:
      return state;
  }
};

export default applicationsReducer;
