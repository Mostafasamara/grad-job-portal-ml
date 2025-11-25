import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";




const useStyles = makeStyles((themes) => ({
  title: {
    flexGrow: 1,
  },
  margin: {
    margin: themes.spacing(1),
  },
}));

const Header = ({ isAuthenticated, is_employer, logout }) => {
  const navigate = useNavigate();
  // const applicationjob=useContext(Notifications);

  const classes = useStyles();

  const authLinks = (
    <>
      <Typography variant="h6" color="primary" className={classes.title}>
        <Button
          variant="contained"
          noWrap
          to={"/blog"}
          component={RouterLink}
          color="primary"
          className={classes.margin}
        >
          Discussion Blog
        </Button>
      </Typography>
      <Typography variant="h6" color="primary" className={classes.title}>
        <Button
        onClick={()=>{
          navigate.push("/notifications")
        }}
          variant="contained"
          noWrap
          to={"/notifications"}
          component={RouterLink}
          color="primary"
          className={classes.margin}
        >
          Notifications
        </Button>
      </Typography>

      

      {is_employer && (
        <Typography variant="h6" color="primary" className={classes.title}>
          <Button
            variant="contained"
            noWrap
            to={"/addjob"}
            component={RouterLink}
            color="primary"
            className={classes.margin}
          >
            Add Job
          </Button>
        </Typography>
      )}
      <Typography variant="h6" color="primary" className={classes.title}>
        <Button
          variant="contained"
          noWrap
          to={"/contactus"}
          component={RouterLink}
          color="primary"
          className={classes.margin}
        >
          Contact Us
        </Button>
      </Typography>
      
      
      <Button
        variant="contained"
        noWrap
        to={"/profile"}
        component={RouterLink}
        color="primary"
        className={classes.margin}
      >
        Profile
      </Button>
      <Button
        onClick={logout}
        variant="contained"
        to={""}
        color="primary"
        className={classes.margin}
      >
        Logout
      </Button>
    </>
  );
  const guestLinks = (
    <>
      <Button
        variant="contained"
        noWrap
        to={"/signin"}
        component={RouterLink}
        color="primary"
        className={classes.margin}
      >
        Login
      </Button>
      <Button
        variant="contained"
        noWrap
        to={"/signup"}
        component={RouterLink}
        color="primary"
        className={classes.margin}
      >
        SignUp
      </Button>
    </>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" noWrap className={classes.title}>
            <Button
              variant="contained"
              noWrap
              to={"/"}
              component={RouterLink}
              color="primary"
              className={classes.margin}
            >
              Home
            </Button>
          </Typography>
          <Typography variant="h6" color="primary" className={classes.title}>
            <Button
              variant="contained"
              noWrap
              to={"/blog"}
              component={RouterLink}
              color="primary"
              className={classes.margin}
            >
              Discussion Blog
            </Button>
          </Typography>
          <Typography variant="h6" color="primary" className={classes.title}>
            <Button
              variant="contained"
              noWrap
              to={"/contactus"}
              component={RouterLink}
              color="primary"
              className={classes.margin}
            >
              Contact Us
            </Button>
          </Typography>
          {isAuthenticated ? authLinks : guestLinks}
        </Toolbar>
      </AppBar>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    is_employer: state.profile.is_employer,
  };
};

export default connect(mapStateToProps, { logout })(Header);
