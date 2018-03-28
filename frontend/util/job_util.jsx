import * as JobActions from '../actions/job_actions';

export const scrapeJobs = data => {
  return $.ajax({
    method: 'GET',
    url: '/api/scrape/jobs',
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
