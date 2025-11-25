import { combineReducers } from "redux";
import auth from "./auth";
import profile from "./profile";
import posts from "./posts";
import post from "./post";
import jobs from "./jobs";
import job from "./job";
import categories from "./categories";
import filter from "./filter";
import search from "./search";
import empNotifications from "./empNotifications";
import employerNotifications from "./employerNotifications";
import currentPage from "./currentPage";

const rootReducer = combineReducers({
  auth: auth,
  profile: profile,
  posts: posts,
  post: post,
  jobs: jobs,
  job: job,
  categories: categories,
  filter: filter,
  search: search,
  empNotifications: empNotifications,
  employerNotifications: employerNotifications,
  currentPage: currentPage,
});

export default rootReducer;
