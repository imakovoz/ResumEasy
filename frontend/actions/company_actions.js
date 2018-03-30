import * as APIUtil from '../util/company_util';
export const RECEIVE_COMPANIES = 'RECEIVE_COMPANIES';

export const receiveCompanies = companies => ({
  type: RECEIVE_COMPANIES,
  companies,
});

export const fetchCompanies = () => dispatch =>
  APIUtil.fetchCompanies().then(companies =>
    dispatch(receiveCompanies(companies))
  );
