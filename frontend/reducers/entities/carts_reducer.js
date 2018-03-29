import { merge } from 'lodash';
import { RECEIVE_CARTS, RECEIVE_CART } from '../../actions/job_actions';

const cartsReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_CARTS:
      return merge({}, state, action.carts);
    case RECEIVE_CART:
      return merge({}, state, { [action.cart.id]: action.cart });
    default:
      return state;
  }
};

export default cartsReducer;
