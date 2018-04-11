import { merge } from 'lodash';
import { PROCESS_SCRAPE, CLEAR_SCRAPE } from '../../actions/ui_actions';

const scrapeReducer = (state = { scrape: false }, action) => {
  Object.freeze(state);

  switch (action.type) {
    case PROCESS_SCRAPE:
      return { scrape: true };
    case CLEAR_SCRAPE:
      return { scrape: false };
    default:
      return state;
  }
};

export default scrapeReducer;
