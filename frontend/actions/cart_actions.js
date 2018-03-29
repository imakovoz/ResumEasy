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
  APIUtil.createCart(data).then(cart => dispatch(receiveCart(cart)));

export const removeFromCart = id => dispatch =>
  APIUtil.updateCart(id).then(carts => dispatch(receiveCarts(carts)));
