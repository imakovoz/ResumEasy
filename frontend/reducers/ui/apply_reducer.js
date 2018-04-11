import { merge } from 'lodash';
import { PROCESS_APPLY, CLEAR_APPLY } from '../../actions/ui_actions';

const applyReducer = (state = { apply: false }, action) => {
  Object.freeze(state);

  switch (action.type) {
    case PROCESS_APPLY:
      return { apply: true };
    case CLEAR_APPLY:
      return { apply: false };
    default:
      return state;
  }
};

export default applyReducer;
