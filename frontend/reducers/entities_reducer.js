import { combineReducers } from "redux";
import jobs from './entities/jobs_reducer';

const entitiesReducer = combineReducers({ jobs });

export default entitiesReducer;
