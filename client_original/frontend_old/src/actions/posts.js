import axios from "axios";
import Cookies from "js-cookie";
import {
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAIL,
  LOAD_POST_SUCCESS,
  LOAD_POST_FAIL,
} from "./types";

export const loadPosts = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true
  };

  try {
    const res = await axios.get(
      "http://localhost:8000/blog-api/posts/",
      config
    );
    dispatch({
      type: LOAD_POSTS_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: LOAD_POSTS_FAIL,
    });
  }
};

export const loadPost = (id) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true
  };

  try {
    const postRes = await axios.get(
      `http://localhost:8000/blog-api/posts/${id}/`,
      config
    );
    const commentsRes = await axios.get(
      `http://localhost:8000/blog-api/posts/${id}/comments/`,
      config
    );
    // const likesRes = await axios.get(
    //   `http://localhost:8000/blog-api/posts/${id}/likes/`,
    //   config
    // );
    dispatch({
      type: LOAD_POST_SUCCESS,
      payload: {
        post: postRes.data,
        comments: commentsRes.data,
      },
    });
  } catch (err) {
    dispatch({
      type: LOAD_POST_FAIL,
    });
  }
};
