import {
  EMP_NOTIFICATIONS_SUCCESS,
  EMP_NOTIFICATIONS_FAIL,
} from "../actions/types";

const initialState = {
  notifications: [],
  unread: 0,
};

const empNotifications = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case EMP_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        notifications: payload.notifications,
        unread: payload.unread,
      };
    case EMP_NOTIFICATIONS_FAIL:
      return {
        notifications: [],
        unread: 0,
      };
    default:
      return state;
  }
};
export default empNotifications;
