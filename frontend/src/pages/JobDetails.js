import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import EditIcon from "@material-ui/icons/Edit";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import { loadJobApplications } from "../actions/applications";
import { loadJob, DeleteJob, UserApplyJob } from "../actions/jobs";
import setCurrentPage from "./../actions/setCurrentPage";

const useStyles = makeStyles({
  root: {
    maxWidth: "60vw",
    minHeight: "60vh",
    maxHeight: "90vh",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "30px",
  },
  btn: {
    width: 130,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 7,
  },
  Typography1: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: -30,
    marginLeft: 55,
    color: "blue",
  },
  Typography2: {
    marginTop: 10,
    marginLeft: 53,
  },
  Typography3: {
    marginTop: 20,
    marginLeft: 53,
    fontSize: 15,
  },
  chip: {
    marginRight: 10,
  },
  applications: {
    maxWidth: "45%",
    padding: 10,
    marginLeft: 85,
  },
});

const JobDetails = ({
  isAuthenticated,
  loadJob,
  DeleteJob,
  UserApplyJob,
  loadJobApplications,
  job,
  is_employer,
  userId,
  setCurrentPage,
}) => {
  setCurrentPage(false);
  const classes = useStyles();
  const [applicationCount, setApplicationCount] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const [jobDeleted, setJobDeleted] = useState(false);

  const { id } = useParams();

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      loadJob(id);
      const res = await loadJobApplications(id);
      if (res) {
        setApplicationCount({
          pending: res.pending,
          accepted: res.accepted,
          rejected: res.rejected,
        });
      }
    };

    fetchData();
  }, [id, loadJob, loadJobApplications]);

  if (jobDeleted) navigate("/", { replace: true });

  if (!job || !job.owner) {
    return <div>Loading...</div>;
  }

  const onSubmit = (e) => {
    e.preventDefault();

    const delete_Job = async () => {
      await DeleteJob();
      if (DeleteJob() === 204) {
        setJobDeleted(true);
      }
    };
    delete_Job();
  };

  const handleApplyJob = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      UserApplyJob(id);
      navigate("/");
    } else {
      navigate(`/job/${id}/apply`);
    }
    // {
    //   isAuthenticated ? UserApplyJob(id) : navigate(`/job/${id}/apply`);
    // }
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
        onClick={(e) => {
          handleApplyJob(e);
          handleMenuClose();
        }}
      >
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <DoneAllIcon />
        </IconButton>
        <p>Easy Apply</p>
      </MenuItem>
      <MenuItem
        to={`/job/${job.id}/apply`}
        component={RouterLink}
        onClick={handleMenuClose}
      >
        <EditIcon style={{ marginRight: "1rem" }} />
        Manual Apply
      </MenuItem>
    </Menu>
  );

  return (
    <div>
      <Card className={classes.root}>
        <CardHeader
          to={`/profile/${job.owner.id}`}
          component={RouterLink}
          avatar={<Avatar src={job.image} />}
          title={`${job.owner.first_name} ${job.owner.last_name}`}
          subheader={job.published_at}
          style={{ textDecoration: "none" }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" className={classes.Typography1}>
            {job.title}
            {!is_employer && (
              <CardActions>
                <Button
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  size="large"
                  color="primary"
                >
                  Apply
                </Button>
              </CardActions>
            )}
          </Typography>
          <Typography
            gutterBottom
            variant="body1"
            color="textSecondary"
            className={classes.Typography2}
          >
            <Chip
              className={classes.chip}
              label={job.job_type}
              variant="outlined"
            />
            <Chip
              className={classes.chip}
              label={job.category}
              variant="outlined"
            />
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            className={classes.Typography2}
          >
            {job.description}
          </Typography>
          <Typography
            variant="h6"
            color="textPrimary"
            className={classes.Typography2}
          >
            applications: {job.applications}
          </Typography>
          <div className={classes.applications}>
            <Chip
              className={classes.chip}
              avatar={
                <Avatar>{applicationCount && applicationCount.pending}</Avatar>
              }
              label={`Pending`}
            />
            <Chip
              avatar={
                <Avatar>{applicationCount && applicationCount.accepted}</Avatar>
              }
              className={classes.chip}
              label={`Accepted`}
              color="Primary"
            />
            <Chip
              avatar={
                <Avatar>{applicationCount && applicationCount.rejected}</Avatar>
              }
              className={classes.chip}
              label={`Rejected`}
              color="Secondary"
            />
          </div>
        </CardContent>
      </Card>
      {renderMenu}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    job: state.job && state.job.job,
    userId: state.profile && state.profile.id,
    is_employer: state.profile && state.profile.is_employer,
    isAuthenticated: state.auth.isAuthenticated,
  };
};

export default connect(mapStateToProps, {
  loadJob,
  DeleteJob,
  UserApplyJob,
  loadJobApplications,
  setCurrentPage,
})(JobDetails);
