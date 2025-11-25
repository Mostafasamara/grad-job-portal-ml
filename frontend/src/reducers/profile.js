import {
  LOAD_PROFILE_SUCCESS,
  LOAD_PROFILE_FAIL,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
} from "../actions/types";

const initialState = {
  id: "",
  is_employer: false,
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  title: "",
  phone_number: "",
  website: "",
  bio: "",
  image: "",
  cv: "",
  location: "",
  saved_jobs: [],
};

const profile = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_PROFILE_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        id: payload.user.id,
        is_employer: payload.user.is_employer,
        first_name: payload.user.first_name,
        last_name: payload.user.last_name,
        username: payload.user.username,
        email: payload.user.email,
        title: payload.profile.title,
        phone_number: payload.profile.phone_number,
        website: payload.profile.website,
        bio: payload.profile.bio,
        image: payload.profile.image,
        cv: payload.profile.cv,
        location: payload.profile.location,
        saved_jobs: payload.profile.saved_jobs,
      };
    case LOAD_PROFILE_FAIL:
      return {
        ...state,
        id: "",
        is_employer: false,
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        title: "",
        phone_number: "",
        website: "",
        bio: "",
        image: "",
        cv: "",
        location: "",
        saved_jobs: "",
      };
    case UPDATE_PROFILE_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
};
export default profile;
