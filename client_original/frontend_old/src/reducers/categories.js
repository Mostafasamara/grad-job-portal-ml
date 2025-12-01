import {
    LOAD_CATEGORIES_FAIL,
    LOAD_CATEGORIES_SUCCESS,
  } from '../actions/types';
  
  const initialState = {
    categories: [],
  };
  
  const categories = (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case LOAD_CATEGORIES_SUCCESS:
        return {
          ...state,
          categories: payload,
        };
      case LOAD_CATEGORIES_FAIL:
        return {
          ...state,
        };
      default:
        return state;
    }
  };
  export default categories;
  