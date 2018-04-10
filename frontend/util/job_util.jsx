import * as JobActions from '../actions/job_actions';

export const scrapeJobs = data => {
  return $.ajax({
    method: 'GET',
    url: '/api/scrape/jobs',
    data,
  });
};

export const liAuth = data => {
  return $.ajax({
    method: 'GET',
    url: '/api/auth/linkedin',
    data,
  });
};

export const fetchJobs = data => {
  return $.ajax({
    method: 'GET',
    url: '/api/jobs',
    data,
  });
};

export const updateJob = (data, id) => {
  return $.ajax({
    method: 'PATCH',
    url: `/api/jobs/${id}`,
    data: data,
  });
};
