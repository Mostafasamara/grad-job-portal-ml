import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Blog from "./pages/Blog";
import JobsList from "./pages/JobsList";
import AddJob from "./pages/AddJob";
import ApplyJob from "./pages/ApplyJob";
import AddPost from "./pages/AddPost";
import JobDetails from "./pages/JobDetails";
import PostDetails from "./pages/PostDetails";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ContactUs from "./pages/ContactUs";
import Layout from "./hocs/Layout";
import PrivateRoute from "./components/PrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile";
import FilteredJobsList from "./components/FilteredJobs";
import SearchedJobsList from "./components/SearchedJobs";
import VisitedProfilePage from "./pages/VisitedProfile";



function App() {
  return (
    <div className="app" style={{ backgroundColor: "#DAE9E1" }}>
      <Router>
        <Layout>
          <Routes>
            <Route
              path="addjob/"
              element={
                <PrivateRoute>
                  <AddJob />
                </PrivateRoute>
              }
            />
            <Route
              path="posts/:id/"
              element={
                // <PrivateRoute>
                <PostDetails />
                // </PrivateRoute>
              }
            />
            <Route
              path="posts/add/"
              element={
                <PrivateRoute>
                  <AddPost />
                </PrivateRoute>
              }
            />
            <Route
              path="profilepage/"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="editprofile/"
              element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              }
            />
            <Route path="profile/:id/" element={<VisitedProfilePage />} />
            <Route path="/" element={<JobsList />} />
            <Route path="filter/" element={<FilteredJobsList />} />
            <Route path="search/" element={<SearchedJobsList />} />
            <Route path="blog/" element={<Blog />} />
            <Route path="job/:id/" element={<JobDetails />} />
            <Route path="job/:id/apply/" element={<ApplyJob />} />
            <Route path="signup/" element={<SignUp />} />
            <Route path="signin/" element={<SignIn />} />
            <Route path="contactus/" element={<ContactUs />} />
        
          </Routes>
        </Layout>
      </Router>
    
    </div>
  );
}

export default App;
