import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import EmployeeTabs from "../components/EmployeeTabs";
import EmployerTabs from "../components/EmployerTabs";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import LanguageIcon from "@material-ui/icons/Language";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import { connect } from "react-redux";
import GetAppIcon from "@material-ui/icons/GetApp";
import setCurrentPage from "./../actions/setCurrentPage";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  //   root: {
  //     display: 'flex',
  //   },
  title: {
    flexGrow: 1,
  },
  avatar: {
    border: `3px solid white`,
    width: theme.spacing(13),
    height: theme.spacing(13),
    boxShadow: theme.shadows[3],
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 280,
  },
  iconStyle: {
    marginTop: theme.spacing(2),
  },
}));

export function SummaryCard({ title, value }) {
  const classes = useStyles();
  return (
    <Paper elevation={3} className={classes.paper}>
      <Typography color={"primary"} variant="h5" gutterBottom>
        {title}
      </Typography>
      <div>{value}</div>
    </Paper>
  );
}

const ProfilePage = ({ user, setCurrentPage }) => {
  setCurrentPage(false);
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div>
      <CssBaseline />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper} elevation={3}>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid xs={4}>
                    <Avatar
                      src={user.image}
                      classes={{ root: classes.avatar, circle: classes.circle }}
                    />
                    <Typography variant={"h5"}>
                      {user.first_name} {user.last_name}
                    </Typography>
                    <Typography variant={"h6"}>{user.title}</Typography>
                  </Grid>

                  <Grid className={classes.gridStyle}>
                    <Typography variant={"body1"}>
                      <LocationOnIcon className={classes.iconStyle} />{" "}
                      {user.location}
                    </Typography>
                    <Typography variant={"body1"}>
                      <PhoneIcon className={classes.iconStyle} />{" "}
                      {user.phone_number}
                    </Typography>
                    <Typography variant={"body1"}>
                      <EmailIcon className={classes.iconStyle} /> {user.email}
                    </Typography>
                    <Typography variant={"body1"}>
                      <LanguageIcon className={classes.iconStyle} />{" "}
                      <a href={user.website}>{user.website}</a>
                    </Typography>
                    {!user.is_employer && (
                      <Typography variant={"body1"}>
                        <GetAppIcon className={classes.iconStyle} />{" "}
                   
                        <a href={user.cv}>Download my Resume</a>
                        
                     
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper} elevation={3}>
                {user.is_employer ? (
                  <>
                    <Typography color="primary" variant={"h6"}>
                      About The Company
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography color="primary" variant={"h6"}>
                      Personal Summary
                    </Typography>
                  </>
                )}
                <Typography variant={"subtitle2"}>{user.bio}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper} elevation={3}>
                {user.is_employer ? <EmployerTabs /> : <EmployeeTabs />}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.profile,
  };
};

export default connect(mapStateToProps, { setCurrentPage })(ProfilePage);
