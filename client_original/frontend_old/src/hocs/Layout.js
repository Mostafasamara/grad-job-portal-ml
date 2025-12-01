import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { connect } from "react-redux";
import { checkAuth } from "./../actions/auth";
import { loadProfile } from "../actions/profile";
import { loadCategories } from "../actions/jobs";
import loadEmployeeNotifications, {
  loadEmployerNotifications,
} from "../actions/notifications";
import CSRFToken from '../components/CSRFToken';

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    gap: 30,
  },
}));

const Layout = ({
  children,
  checkAuth,
  loadProfile,
  loadCategories,
  isAuthenticated,
}) => {
  const classes = useStyles();
  useEffect(() => {
    checkAuth();
    loadProfile();
    loadCategories();
    loadEmployerNotifications();
    loadEmployeeNotifications();
  }, [isAuthenticated]);
  return (
    <div className={classes.root}>
      <CSRFToken />
      <CssBaseline />
      <NavBar />
      {children}
      <Footer />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { isAuthenticated: state.auth.isAuthenticated };
};

export default connect(mapStateToProps, {
  checkAuth,
  loadProfile,
  loadCategories,
  loadEmployerNotifications,
  loadEmployeeNotifications,
})(Layout);
