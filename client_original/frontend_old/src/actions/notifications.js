import axios from "axios";
import Cookies from "js-cookie";
import {
  EMP_NOTIFICATIONS_SUCCESS,
  EMP_NOTIFICATIONS_FAIL,
  NOTIFICATIONS_SUCCESS,
  NOTIFICATIONS_FAIL,
  UPDATE_EMP_NOTIF_SUCCESS,
  UPDATE_EMP_NOTIF_FAIL,
  UPDATE_NOTIFICATION_SUCCESS,
  UPDATE_NOTIFICATION_FAIL,
} from "./types";

export const loadEmployerNotifications = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true
  };

  try {
    const res = await axios.get(
      "http://localhost:8000/notifications/api/",
      config
    );
    dispatch({
      type: NOTIFICATIONS_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATIONS_FAIL,
    });
  }
};

export const updateEmployerNotification = (id) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true
  };

  const body = JSON.stringify({
    is_read: true,
  });

  try {
    const res = await axios.patch(
      `http://localhost:8000/notifications/api/${id}/update/`,
      body,
      config
    );
    if (res.status === 200) {
      dispatch({
        type: UPDATE_NOTIFICATION_SUCCESS,
      });
    } else {
      dispatch({
        type: UPDATE_NOTIFICATION_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: UPDATE_NOTIFICATION_FAIL,
    });
  }
};

export const updateEmpNotification = (id) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials:true
  };

  const body = JSON.stringify({
    is_read: true,
  });

  try {
    const res = await axios.patch(
      `http://localhost:8000/notifications/api/employee/notifications/${id}/update/`,
      body,
      config
    );
    if (res.status === 200) {
      dispatch({
        type: UPDATE_EMP_NOTIF_SUCCESS,
      });
    } else {
      dispatch({
        type: UPDATE_EMP_NOTIF_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: UPDATE_EMP_NOTIF_FAIL,
    });
  }
};

const loadEmployeeNotifications = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };

  try {
    const res = await axios.get(
      "http://localhost:8000/notifications/api/employee/notifications/",
      config
    );
    dispatch({
      type: EMP_NOTIFICATIONS_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: EMP_NOTIFICATIONS_FAIL,
    });
  }
};

export default loadEmployeeNotifications;
