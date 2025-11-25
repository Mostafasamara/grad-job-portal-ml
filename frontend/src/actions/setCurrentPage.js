import { SWITCH_SUCCESS } from "./types";

const setCurrentPage = (page) => (dispatch) => {
  dispatch({
    type: SWITCH_SUCCESS,
    payload: page,
  });
};

export default setCurrentPage;
