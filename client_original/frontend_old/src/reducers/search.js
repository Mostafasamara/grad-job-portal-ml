import { JOBS_SEARCH_SUCCESS, JOBS_SEARCH_FAIL } from "../actions/types";

const initialState = {
  search: [],
};

const search = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case JOBS_SEARCH_SUCCESS:
      return {
        ...state,
        search: payload.search,
      };
    case JOBS_SEARCH_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default search;
