import * as CompanyActions from '../actions/job_actions';

export const fetchCompanies = () => {
  return $.ajax({
    method: 'GET',
    url: '/api/companies',
  });
};
