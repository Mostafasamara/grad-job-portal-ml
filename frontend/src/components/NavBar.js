import React, { useState, useEffect } from "react";
import { alpha, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import { connect } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import SideDrawer from "./Drawer";
import Button from "@material-ui/core/Button";
import UpdateRoundedIcon from "@material-ui/icons/UpdateRounded";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import DeleteDialog from "./DeleteDialog";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { SearchJobs } from "../actions/filters";
import { MEDIA_URL } from '../config';

import loadEmployeeNotifications, {
  loadEmployerNotifications,
  updateEmployerNotification,
  updateEmpNotification,
} from "../actions/notifications";

const useStyles = makeStyles((theme) => ({
  inline: {
    display: "inline",
  },
  grow: {
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
    pos: {
      marginBottom: 12,
      marginLeft: 20,
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  unread: {
    backgroundColor: "#7999BB",
    fontWeight: "bold",
  },
  interviewDiv: {
    width: "80%",
  },
  circleProgress: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Navbar = ({
  loadEmployerNotifications,
  updateEmployerNotification,
  updateEmpNotification,
  loadEmployeeNotifications,
  isAuthenticated,
  empNotifications,
  unreadCount,
  employerNotifications,
  unreadEmployerCount,
  is_employer,
  user,
  currentPage,
  SearchJobs,
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [interviewOpen, setInterviewOpen] = React.useState(false);
  const [currentNotification, setCurrentNotification] = React.useState(null);

  const [searchData, setSearchData] = useState({
    title: "",
  });

  const { title } = searchData;

  useEffect(() => {
    const notifUpdater = setInterval(() => {
      if (isAuthenticated) {
        if (is_employer) {
          loadEmployerNotifications();
        } else {
          loadEmployeeNotifications();
        }
      }
    }, 5000);
    // clearing interval
    return () => clearInterval(notifUpdater);
  }, [isAuthenticated, is_employer]);

  const interviewDialogOpen = () => {
    setInterviewOpen(true);
  };

  const interviewDialogClose = () => {
    setInterviewOpen(false);
    setCurrentNotification(null);
  };

  const handleVisitedProfileCLick = (id) => {
    navigate(`/profile/${id}`);
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    SearchJobs(title);
    navigate("/search");
  };

  const onChangeSearch = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const interviewDialog = (notification) => {
    return (
      <Dialog
        open={interviewOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={interviewDialogClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        {is_employer ? (
          <>
            <DialogTitle id="alert-dialog-slide-title">
              {"Application Details"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {notification ? (
                  <>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Paper className={classes.paper}>
                          <Typography
                            color="textPrimary"
                            variant="h5"
                            component="h2"
                          >
                            New Application for{" "}
                            {notification.application.job.title} position{" "}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={classes.paper}>
                          <Typography
                            color="textPrimary"
                            variant="h5"
                            component="h2"
                          >
                            Applicant's Name:
                          </Typography>
                          {notification.application.full_name}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={classes.paper}>
                          <Typography
                            color="textPrimary"
                            variant="h5"
                            component="h2"
                          >
                            Email:
                          </Typography>
                          {notification.application.applicant.email
                            ? notification.application.applicant.email
                            : notification.created_by.user.email}
                        </Paper>
                      </Grid>
                      {notification.application.cover_letter && (
                        <Grid item xs={12}>
                          <Paper className={classes.paper}>
                            <Typography
                              color="textPrimary"
                              variant="h5"
                              component="h2"
                            >
                              Cover Letter:
                            </Typography>
                            {notification.application.cover_letter}
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                  </>
                ) : (
                  <p>Application details will be here</p>
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {notification.created_by ? (
                <Button
                  onClick={() => {
                    handleVisitedProfileCLick(notification.created_by.id);
                    interviewDialogClose();
                  }}
                  color="primary"
                >
                  Go to profile
                </Button>
              ) : (
                <Button
                  // استبدل هذا السطر
                  href={notification.application.cv ? notification.application.cv.replace("http://localhost:3000", MEDIA_URL) : "#"}
                  
                  // بهذا السطر
                  color="primary"
                >
                  download cv
                </Button>
              )}
              <Button onClick={interviewDialogClose} color="primary">
                close
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle id="alert-dialog-slide-title">
              {"Interview Details"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {notification ? (
                  notification.interview.application.status === "Accepted" ? (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Paper className={classes.paper}>
                          <Typography
                            color="textPrimary"
                            variant="h5"
                            component="h2"
                          >
                            Interview Address:
                          </Typography>
                          {notification.interview.address}
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Paper className={classes.paper}>
                          <Typography
                            color="textPrimary"
                            variant="h5"
                            component="h2"
                          >
                            Interview Date&Time:
                          </Typography>
                          {notification.interview.time}
                        </Paper>
                      </Grid>
                    </Grid>
                  ) : (
                    <p>
                      We're sorry to tell you that your application for this
                      position has been rejected by the recruiter
                    </p>
                  )
                ) : (
                  <p>interview details will be here</p>
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={interviewDialogClose} color="primary">
                close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    );
  };

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        to={"/profilepage"}
        component={RouterLink}
        onClick={handleMenuClose}
      >
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>My Profile</p>
      </MenuItem>
      <MenuItem
        to={"/editprofile"}
        component={RouterLink}
        onClick={handleMenuClose}
      >
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <UpdateRoundedIcon />
        </IconButton>
        <p>Update Profile</p>
      </MenuItem>

      <DeleteDialog
        render={(open) => (
          <MenuItem
            onClick={() => {
              open();
              handleMenuClose();
            }}
          >
            <IconButton
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <DeleteForeverIcon />
            </IconButton>
            <p>Delete My Account</p>
          </MenuItem>
        )}
      />
    </Menu>
  );

  const [anchorNotif, setAnchorNotif] = React.useState(null);
  const notifOpen = Boolean(anchorNotif);

  const handleNotifIconClick = (event) => {
    setAnchorNotif(event.currentTarget);
  };

  const handleNotifClose = () => {
    setAnchorNotif(null);
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {isAuthenticated ? (
        <>
          <MenuItem onClick={handleNotifIconClick}>
            <IconButton aria-label="show new notifications" color="inherit">
              <Badge
                badgeContent={is_employer ? unreadEmployerCount : unreadCount}
                color="secondary"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <p>My Profile</p>
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem
            variant="contained"
            noWrap
            to={"/signup"}
            component={RouterLink}
            color="primary"
            className={classes.margin}
          >
            SignUp
          </MenuItem>
          <MenuItem
            variant="contained"
            noWrap
            to={"/signin"}
            component={RouterLink}
            color="primary"
            className={classes.margin}
          >
            Login
          </MenuItem>
        </>
      )}
    </Menu>
  );

  const handleNotificationClick = (notification) => {
    if (is_employer) {
      updateEmployerNotification(notification.id);
    } else {
      updateEmpNotification(notification.id);
    }
    setCurrentNotification(notification);
    handleNotifClose();
    interviewDialogOpen();
  };

  const ITEM_HEIGHT = 48;

  // Notification
  const notificationsMenu = (
    <div>
      <Menu
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        id="notification-menu"
        anchorEl={anchorNotif}
        keepMounted
        open={notifOpen}
        onClose={handleNotifClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
          },
        }}
      >
        {is_employer ? (
          <>
            {employerNotifications.length !== 0 ? (
              employerNotifications.map((notification) => (
                <>
                  <MenuItem
                    className={!notification.is_read && classes.unread}
                    key={notification.id}
                    onClick={() => {
                      handleNotificationClick(notification);
                    }}
                  >
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          alt={
                            notification.created_by &&
                            notification.created_by.username
                          }
                          src={
                            notification.created_by &&
                            notification.created_by.image
                          }
                        />
                      </ListItemAvatar>
                      <ListItemText
                        color="Primary"
                        primary={
                          <>
                            New Application
                            <br />
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textSecondary"
                            >
                              {notification.created_at}
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              {`${notification.application.full_name} applied for ${notification.application.job.title}`}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </MenuItem>
                  <Divider component="li" />
                </>
              ))
            ) : (
              <MenuItem>
                <div> ... </div>
              </MenuItem>
            )}
          </>
        ) : (
          <>
            {empNotifications.length !== 0 ? (
              empNotifications.map((notification) => (
                <>
                  <MenuItem
                    className={!notification.is_read && classes.unread}
                    key={notification.id}
                    onClick={() => {
                      handleNotificationClick(notification);
                    }}
                  >
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          alt={notification.sender.username}
                          src={notification.sender.image}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        color="Primary"
                        primary={
                          <>
                            {`${notification.interview.application.job.title} |
                        ${notification.interview.application.status}`}
                            <br />
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textSecondary"
                            >
                              {notification.created}
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              {`${notification.sender.user.first_name} ${notification.sender.user.last_name} ${notification.interview.application.status} your application`}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </MenuItem>
                  <Divider variant="inset" component="li" />
                </>
              ))
            ) : (
              <MenuItem>
                <div> ... </div>
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </div>
  );

  // Search bar
  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <SideDrawer />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Welcome
            {isAuthenticated && (
              <>
                , {user.first_name} {user.last_name}
              </>
            )}
          </Typography>
          {currentPage && (
            <form
              onSubmit={(e) => {
                onSubmitSearch(e);
              }}
            >
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  name="title"
                  value={title}
                  onChange={(e) => onChangeSearch(e)}
                  placeholder="Search jobs.."
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ "aria-label": "search" }}
                />
                <Button type="submit" color="inherit" size="small" className={classes.margin} disableElevation>
                  Search
                </Button>
              </div>
            </form>
          )}
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {isAuthenticated ? (
              <>
                <IconButton
                  aria-label="notifications"
                  aria-controls="notification-menu"
                  aria-haspopup="true"
                  onClick={handleNotifIconClick}
                  color="inherit"
                >
                  <Badge
                    badgeContent={
                      is_employer ? unreadEmployerCount : unreadCount
                    }
                    color="secondary"
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {notificationsMenu}
      {renderMobileMenu}
      {renderMenu}
      {currentNotification && interviewDialog(currentNotification)}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    empNotifications: state.empNotifications.notifications,
    unreadCount: state.empNotifications.unread,
    employerNotifications: state.employerNotifications.employer_notifications,
    unreadEmployerCount: state.employerNotifications.unread,
    is_employer: state.profile.is_employer,
    user: state.profile,
    currentPage: state.currentPage.currentPage,
  };
};

export default connect(mapStateToProps, {
  loadEmployerNotifications,
  updateEmployerNotification,
  updateEmpNotification,
  loadEmployeeNotifications,
  SearchJobs,
})(Navbar);
