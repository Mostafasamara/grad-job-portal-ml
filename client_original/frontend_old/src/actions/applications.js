import axios from "axios";
import Cookies from "js-cookie";
import {
  APPLY_JOB_SUCCESS,
  APPLY_JOB_FAIL,
  APPLICATION_REJECT_SUCCESS,
  APPLICATION_REJECT_FAIL,
  SETUP_INTERVIEW_SUCCESS,
  SETUP_INTERVIEW_FAIL,
  LOAD_APPLICATIONS_SUCCESS,
  LOAD_APPLICATIONS_FAIL,
  LOAD_INTERVIEW_SUCCESS,
  LOAD_INTERVIEW_FAIL,
} from "./types";

const loadEmployeeApplications = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      //  "X-CSRFToken": Cookies.get("csrftoken"),
    },
      withCredentials: true
  };

  try {
    const res = await axios.get(
      "http://localhost:8000/jobs/api/employee_applications/",
      config
    );
    dispatch({
      type: APPLY_JOB_SUCCESS,
    });
    return res.data;
  } catch (err) {
    dispatch({
      type: APPLY_JOB_FAIL,
    });
  }
};
export default loadEmployeeApplications;

export const rejectApplication = (id) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };

  const body = JSON.stringify({
    status: "Rejected",
  });

  try {
    const res = await axios.patch(
      `http://localhost:8000/jobs/api/application/${id}/update/`,
      body,
      config
    );
    dispatch({
      type: APPLICATION_REJECT_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: APPLICATION_REJECT_FAIL,
    });
  }
};

export const createInterview = (address, time, id) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true
  };

  const body = JSON.stringify({
    address,
    time,
  });

  try {
    const res = await axios.post(
      `http://localhost:8000/jobs/api/application/${id}/setup_interview/`,
      body,
      config
    );
    dispatch({
      type: SETUP_INTERVIEW_SUCCESS,
    });
    return res;
  } catch (err) {
    dispatch({
      type: SETUP_INTERVIEW_FAIL,
    });
  }
};

export const loadJobApplications = (id) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true
  };

  try {
    const res = await axios.get(
      `http://localhost:8000/jobs/api/jobs/${id}/applications/`,
      config
    );
    if (res.data.error) {
      dispatch({
        type: LOAD_APPLICATIONS_FAIL,
      });
    } else {
      dispatch({
        type: LOAD_APPLICATIONS_SUCCESS,
      });
      return res.data;
    }
  } catch (err) {
    dispatch({
      type: LOAD_APPLICATIONS_FAIL,
    });
  }
};
