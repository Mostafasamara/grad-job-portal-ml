import { LOAD_JOBS_SUCCESS, LOAD_JOBS_FAIL } from '../actions/types';

const initialState = {
  jobs:[]
};

const jobs = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_JOBS_SUCCESS:
      return {
        ...state,
        jobs:payload,
};
    case LOAD_JOBS_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
};
export default jobs;
