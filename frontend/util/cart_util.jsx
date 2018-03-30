import * as CartActions from '../actions/cart_actions';

export const addToCart = data => {
  return $.ajax({
    method: 'POST',
    url: '/api/carts',
    data,
  });
};

export const removeFromCart = id => {
  return $.ajax({
    method: 'DELETE',
    url: `/api/carts/${id}`,
  });
};

export const fetchCarts = () => {
  return $.ajax({
    method: 'GET',
    url: `/api/carts`,
  });
};
