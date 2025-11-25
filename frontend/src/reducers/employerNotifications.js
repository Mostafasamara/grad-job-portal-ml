import {
    NOTIFICATIONS_SUCCESS,
    NOTIFICATIONS_FAIL,
  } from "../actions/types";
  
  const initialState = {
    employer_notifications: [],
    unread:0,
  };
  
  const employerNotifications = (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case NOTIFICATIONS_SUCCESS:
        return {
          ...state,
          
          employer_notifications: payload.notifications,
          unread: payload.unread,

        };
      case NOTIFICATIONS_FAIL:
        return {
          ...state,
          employer_notifications: [],
          unread: 0,
        };
      default:
        return state;
    }
  };
  export default employerNotifications;
  