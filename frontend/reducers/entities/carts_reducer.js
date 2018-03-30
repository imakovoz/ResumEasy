import { merge } from 'lodash';
import { RECEIVE_CARTS, RECEIVE_CART } from '../../actions/cart_actions';

const cartsReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_CARTS:
      return action.carts;
    case RECEIVE_CART:
      debugger;
      return merge({}, state, { [action.cart.id]: action.cart });
    default:
      return state;
  }
};

export default cartsReducer;
