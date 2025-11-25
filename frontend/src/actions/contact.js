import axios from "axios";
import { SEND_INFO_SUCCESS, SEND_INFO_FAIL } from "./types";
import Cookies from "js-cookie";

export const sendInfo = (phone_number, email, message) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
        withCredentials: true,

  };
  const body = JSON.stringify({
    phone_number,
    email,
    message,
  });

  try {
    const res = await axios.post(
      "http://localhost:8000/contact-us/api/contact/",
      body,
      config
    );
    if (res.status === 201) {
      dispatch({
        type: SEND_INFO_SUCCESS,
      });
      return true;
    }
    // if (res.data.error) {
    //   dispatch({
    //     type: SEND_INFO_FAIL,
    //   });
    // } else {
    //   dispatch({
    //     type: SEND_INFO_SUCCESS,
    //   });
    // }
  } catch (err) {
    dispatch({
      type: SEND_INFO_FAIL,
    });
  }
};
