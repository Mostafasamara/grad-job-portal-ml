import axios from "axios";
import {
  LOAD_JOBS_SUCCESS,
  LOAD_JOBS_FAIL,
  LOAD_JOB_SUCCESS,
  LOAD_JOB_FAIL,
  ADD_JOB_SUCCESS,
  ADD_JOB_FAIL,
  JOB_APPLICATION_SUCCESS,
  JOB_APPLICATION_FAIL,
  LOAD_CATEGORIES_SUCCESS,
  LOAD_CATEGORIES_FAIL,
  SAVE_JOB_SUCCESS,
  SAVE_JOB_FAIL,
  REMOVE_JOB_SUCCESS,
  REMOVE_JOB_FAIL,
} from "./types";
import Cookies from "js-cookie";

export const AddNewJob =
  (title, job_type, description, vacancy, salary, experience, category) =>
  async (dispatch) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };

    const body = JSON.stringify({
      title,
      job_type,
      description,
      vacancy,
      salary,
      experience,
      category,
    });

    try {
      const res = await axios.post(
        "http://localhost:8000/jobs/api/jobs/add/",
        body,
        config
      );
      dispatch({
        type: ADD_JOB_SUCCESS,
      });
    } catch (err) {
      dispatch({
        type: ADD_JOB_FAIL,
      });
    }
  };

export const UserApplyJob = (id) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
      Authorization: `JWT ${localStorage.getItem("access")}`,
    },
    withCredentials: true,
  };

  const body = JSON.stringify({});

  try {
    const res = await axios.post(
      `http://localhost:8000/jobs/api/jobs/${id}/apply/`,
      body,
      config
    );
    if (res.data.error) {
      dispatch({
        type: JOB_APPLICATION_FAIL,
      });
    } else {
      dispatch({
        type: JOB_APPLICATION_SUCCESS,
      });
      return res.status;
    }
  } catch (err) {
    dispatch({
      type: JOB_APPLICATION_FAIL,
    });
  }
};

export const AnonApplyJob =
  (id, full_name, email, website, cv, cover_letter) => async (dispatch) => {
    const formData = new FormData();
    formData.append("full_name", full_name);
    formData.append("email", email);
    formData.append("website", website);
    formData.append("cv", cv);
    formData.append("cover_letter", cover_letter);

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
          withCredentials: true

    };

    try {
      const res = await axios.post(
        `http://localhost:8000/jobs/api/jobs/${id}/apply/anonymous/`,
        formData,
        config
      );
      if (res.data.error) {
        dispatch({
          type: JOB_APPLICATION_FAIL,
        });
        return res.data;
      } else {
        dispatch({
          type: JOB_APPLICATION_SUCCESS,
        });
        return res.data;
      }
    } catch (err) {
      dispatch({
        type: JOB_APPLICATION_FAIL,
      });
    }
  };

  export const loadJobs = (includeAll = false) => async (dispatch) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // If using JWT authentication, include the token
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
      // If using session auth, include cookies
      withCredentials: true,
    };

    const url = includeAll
      ? "http://localhost:8000/jobs/api/jobs/?include_all=true"
      : "http://localhost:8000/jobs/api/jobs/";

    try {
      const res = await axios.get(url, config);
      dispatch({
        type: LOAD_JOBS_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: LOAD_JOBS_FAIL,
      });
    }
  };


export const loadJob = (id) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  try {
    const jobRes = await axios.get(
      `http://localhost:8000/jobs/api/jobs/${id}/`,
      config
    );
    dispatch({
      type: LOAD_JOB_SUCCESS,
      payload: {
        job: jobRes.data,
      },
    });
  } catch (err) {
    dispatch({
      type: LOAD_JOB_FAIL,
    });
  }
};

export const DeleteJob = (id) => async () => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
        withCredentials: true

  };

  try {
    const res = await axios.delete(
      `http://localhost:8000/jobs/api/${id}`,
      config
    );
    return res.status;
  } catch (err) {}
};

export const loadCategories = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.get(
      "http://localhost:8000/jobs/api/category/",
      config
    );
    if (res.data.error) {
      dispatch({
        type: LOAD_CATEGORIES_FAIL,
      });
    } else {
      dispatch({
        type: LOAD_CATEGORIES_SUCCESS,
        payload: res.data,
      });
    }
  } catch (err) {
    dispatch({
      type: LOAD_CATEGORIES_FAIL,
    });
  }
};

export const saveJob = (id) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
        withCredentials: true

  };

  try {
    const res = await axios.put(
      `http://localhost:8000/jobs/api/jobs/${id}/save/`,
      null,
      config
    );
    if (res.data.error) {
      dispatch({
        type: SAVE_JOB_FAIL,
      });
    } else {
      dispatch({
        type: SAVE_JOB_SUCCESS,
      });
    }
  } catch (err) {
    dispatch({
      type: SAVE_JOB_FAIL,
    });
  }
};

export const removeJob = (id) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };

  try {
    const res = await axios.put(
      `http://localhost:8000/jobs/api/jobs/${id}/remove/`,
      null,
      config
    );
    if (res.data.error) {
      dispatch({
        type: REMOVE_JOB_FAIL,
      });
    } else {
      dispatch({
        type: REMOVE_JOB_SUCCESS,
      });
    }
  } catch (err) {
    dispatch({
      type: REMOVE_JOB_FAIL,
    });
  }
};
