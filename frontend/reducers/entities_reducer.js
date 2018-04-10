import { combineReducers } from 'redux';
import users from './entities/users_reducer';
import jobs from './entities/jobs_reducer';
import carts from './entities/carts_reducer';
import companies from './entities/companies_reducer';
import applications from './entities/applications_reducer';
import auth from './entities/auth_reducer';

const entitiesReducer = combineReducers({
  users,
  jobs,
  carts,
  companies,
  applications,
  auth,
});

export default entitiesReducer;
