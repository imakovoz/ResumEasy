import * as APIUtil from '../util/job_util';
export const RECEIVE_JOBS = 'RECEIVE_JOBS';
export const RECEIVE_JOB = 'RECEIVE_JOB';
export const CLEAR_JOBS = 'CLEAR_JOBS';
export const CHECK_AUTH = 'CHECK_AUTH';

export const receiveJobs = jobs => {
  return {
    type: RECEIVE_JOBS,
    jobs,
  };
};

export const receiveJob = job => {
  return {
    type: RECEIVE_JOB,
    job,
  };
};

export const emptyJobs = () => {
  return {
    type: CLEAR_JOBS,
  };
};

export const checkAuth = data => {
  return {
    type: CHECK_AUTH,
    data,
  };
};

export const updateJob = (data, id) => dispatch => {
  return APIUtil.updateJob(data, id).then(job => dispatch(receiveJob(job)));
};

export const fetchJobs = data => dispatch => {
  return APIUtil.fetchJobs(data).then(jobs => dispatch(receiveJobs(jobs)));
};

export const liAuth = data => dispatch => {
  return APIUtil.liAuth(data).then(info => dispatch(checkAuth(info)));
};

export const scrapeJobs = data => dispatch => {
  return APIUtil.scrapeJobs(data).then(jobs => dispatch(receiveJobs(jobs)));
};

export const clearJobs = () => dispatch => {
  return dispatch(emptyJobs());
};
