import { merge } from 'lodash';
import { RECEIVE_COMPANIES } from '../../actions/company_actions';

const companiesReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_COMPANIES:
      return merge({}, state, action.companies);
    default:
      return state;
  }
};

export default companiesReducer;
