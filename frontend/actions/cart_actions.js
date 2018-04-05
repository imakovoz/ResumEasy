import * as APIUtil from '../util/cart_util';
export const RECEIVE_CARTS = 'RECEIVE_CARTS';
export const RECEIVE_CART = 'RECEIVE_CART';

export const receiveCarts = carts => ({
  type: RECEIVE_CARTS,
  carts,
});

export const receiveCart = cart => ({
  type: RECEIVE_CART,
  cart,
});

export const fetchCarts = () => dispatch =>
  APIUtil.fetchCarts().then(carts => dispatch(receiveCarts(carts)));

export const addToCart = data => dispatch =>
  APIUtil.addToCart(data).then(cart => dispatch(receiveCart(cart)));

export const categorizeCarts = data => dispatch =>
  APIUtil.categorizeCarts(data).then(carts => dispatch(receiveCarts(carts)));

export const removeFromCart = id => dispatch =>
  APIUtil.removeFromCart(id).then(carts => dispatch(receiveCarts(carts)));

export const updateCart = (data, id) => dispatch =>
  APIUtil.updateCart(data, id).then(cart => dispatch(receiveCart(cart)));
