import * as CartActions from '../actions/cart_actions';

export const applyToJob = data => {
  return $.ajax({
    method: 'POST',
    url: '/api/applications',
    data,
  });
};

export const deleteApplication = data => {
  return $.ajax({
    method: 'DELETE',
    url: `/api/applications/${data}`,
  });
};

export const updateApplication = data => {
  return $.ajax({
    method: 'PATCH',
    url: `/api/applications/${data.id}`,
    data,
  });
};

export const fetchApplications = () => {
  return $.ajax({
    method: 'GET',
    url: `/api/applications`,
  });
};
