import { combineReducers } from 'redux';
import apply from './ui/apply_reducer';
import scrape from './ui/scrape_reducer';
import sort from './ui/sort_reducer';

const uisReducer = combineReducers({
  apply,
  scrape,
  sort,
});

export default uisReducer;
