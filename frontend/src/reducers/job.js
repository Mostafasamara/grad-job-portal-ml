import { LOAD_JOB_SUCCESS, LOAD_JOB_FAIL } from '../actions/types';

const initialState = {
  job: null,
};

const job = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_JOB_SUCCESS:
      return {
        ...state,
        job: payload.job,
        
      };
    case LOAD_JOB_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
};
export default job;
