import * as APIUtil from '../util/application_util';
export const RECEIVE_APPLICATIONS = 'RECEIVE_APPLICATIONS';
export const RECEIVE_APPLICATION = 'RECEIVE_APPLICATION';

export const receiveApplications = applications => ({
  type: RECEIVE_APPLICATIONS,
  applications,
});

export const receiveApplication = application => ({
  type: RECEIVE_APPLICATION,
  application,
});

export const fetchApplications = () => dispatch =>
  APIUtil.fetchApplications().then(applications =>
    dispatch(receiveApplications(applications))
  );

export const apply = () => dispatch =>
  APIUtil.apply().then(applications =>
    dispatch(receiveApplications(applications))
  );

export const applyToJob = data => dispatch =>
  APIUtil.applyToJob(data).then(application =>
    dispatch(receiveApplication(application))
  );

export const updateApplication = data => dispatch =>
  APIUtil.updateApplication(data).then(application =>
    dispatch(receiveApplication(application))
  );

export const deleteApplication = data => dispatch =>
  APIUtil.deleteApplication(data).then(applications =>
    dispatch(receiveApplications(applications))
  );
