import { combineReducers } from 'redux';
import jobs from './entities/jobs_reducer';
import carts from './entities/carts_reducer';

const entitiesReducer = combineReducers({ jobs, carts });

export default entitiesReducer;
