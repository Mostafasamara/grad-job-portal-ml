import axios from "axios";
import {
  JOBS_FILTER_SUCCESS,
  JOBS_FILTER_FAIL,
  JOBS_SEARCH_SUCCESS,
  JOBS_SEARCH_FAIL,
} from "./types";



export const FilterJobs = (job_type, experience, category) => async (dispatch) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      withCredentials:true
    };
  
    try {
      const res = await axios.get(
        `http://localhost:8000/jobs/api/jobs/filter/?job_type=${job_type&&job_type}&experience=${experience&&experience}&category=${category&&category}`,
        config
      );
        dispatch({
          type: JOBS_FILTER_SUCCESS,
          payload: {
            filter: res.data,
          },
        });
      }
    catch (err) {
      dispatch({
        type: JOBS_FILTER_FAIL,
      });
    }
  };


export const SearchJobs = (title) => async (dispatch) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      withCredentials: true
    };
  
    try {
      const res = await axios.get(
        `http://localhost:8000/jobs/api/jobs/search/?title=${title&&title}`,
        config
      );
        dispatch({
          type: JOBS_SEARCH_SUCCESS,
          payload: {
            search: res.data,
          },
        });
      }
    catch (err) {
      dispatch({
        type: JOBS_SEARCH_FAIL,
      });
    }
  };