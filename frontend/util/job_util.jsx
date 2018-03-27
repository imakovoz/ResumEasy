import * as JobActions from '../actions/job_actions';

export const fetchJobs = (data) => {
  return $.ajax({
    method: 'GET',
    url: '/api/jobs',
    data,
  });
};
