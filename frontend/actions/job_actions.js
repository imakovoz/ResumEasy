import * as APIUtil from '../util/job_util';
export const RECEIVE_JOBS = 'RECEIVE_JOBS';

export const receiveJobs = jobs => {
  return {
    type: RECEIVE_JOBS,
    jobs,
  };
};

export const fetchJobs = data => dispatch => {
  return APIUtil.fetchJobs(data).then(jobs => dispatch(receiveJobs(jobs)));
};

export const scrapeJobs = data => dispatch => {
  return APIUtil.fetchJobs(data).then(jobs => dispatch(receiveJobs(jobs)));
};
