import { combineReducers } from 'redux';
import jobs from './entities/jobs_reducer';
import carts from './entities/carts_reducer';
import companies from './entities/companies_reducer';
import applications from './entities/applications_reducer';

const entitiesReducer = combineReducers({
  jobs,
  carts,
  companies,
  applications,
});

export default entitiesReducer;
