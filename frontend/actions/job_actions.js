import * as APIUtil from '../util/job_util';
export const RECEIVE_JOBS = 'RECEIVE_JOBS';
export const CLEAR_JOBS = 'CLEAR_JOBS';

export const receiveJobs = jobs => {
  return {
    type: RECEIVE_JOBS,
    jobs,
  };
};

export const emptyJobs = () => {
  return {
    type: CLEAR_JOBS,
  };
};

export const fetchJobs = data => dispatch => {
  return APIUtil.fetchJobs(data).then(jobs => dispatch(receiveJobs(jobs)));
};

export const scrapeJobs = data => dispatch => {
  return APIUtil.scrapeJobs(data).then(jobs => dispatch(receiveJobs(jobs)));
};

export const clearJobs = () => dispatch => {
  return dispatch(emptyJobs());
};
