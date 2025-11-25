import { JOBS_FILTER_SUCCESS , JOBS_FILTER_FAIL } from '../actions/types';

const initialState = {
  filter: [],
};

const filter = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case JOBS_FILTER_SUCCESS:
      return {
        ...state,
        filter: payload.filter,
        
      };
    case JOBS_FILTER_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
};
export default filter;

