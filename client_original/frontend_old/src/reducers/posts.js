import {
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAIL,
} from '../actions/types';

const initialState = {
  posts: [],
};

const posts = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_POSTS_SUCCESS:
      return {
        ...state,
        posts: payload,
      };
    case LOAD_POSTS_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
};
export default posts;
