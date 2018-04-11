export const PROCESS_SCRAPE = 'PROCESS_SCRAPE';
export const CLEAR_SCRAPE = 'CLEAR_SCRAPE';
export const PROCESS_APPLY = 'PROCESS_APPLY';
export const CLEAR_APPLY = 'CLEAR_APPLY';
export const PROCESS_SORT = 'PROCESS_SORT';
export const CLEAR_SORT = 'CLEAR_SORT';

export const processScrape = () => ({
  type: PROCESS_SCRAPE,
});

export const clearScrape = () => ({
  type: CLEAR_SCRAPE,
});

export const processApply = () => ({
  type: PROCESS_APPLY,
});

export const clearApply = () => ({
  type: CLEAR_APPLY,
});

export const processSort = () => ({
  type: PROCESS_SORT,
});

export const clearSort = () => ({
  type: CLEAR_SORT,
});
