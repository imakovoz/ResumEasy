import { merge } from 'lodash';
import { PROCESS_SORT, CLEAR_SORT } from '../../actions/ui_actions';

const sortReducer = (state = { sort: false }, action) => {
  Object.freeze(state);

  switch (action.type) {
    case PROCESS_SORT:
      return { sort: true };
    case CLEAR_SORT:
      return { sort: false };
    default:
      return state;
  }
};

export default sortReducer;
