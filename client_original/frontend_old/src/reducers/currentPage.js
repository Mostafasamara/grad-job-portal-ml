import { SWITCH_SUCCESS } from "../actions/types";

const initialState = {
  currentPage: false,
};

const currentPage = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SWITCH_SUCCESS:
      return {
        ...state,
        currentPage: payload,
      };
    default:
      return state;
  }
};

export default currentPage;
