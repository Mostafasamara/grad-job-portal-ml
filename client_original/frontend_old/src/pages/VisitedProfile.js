import { useEffect, React, useState } from "react";
import axios from "axios";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
// import EmployeeTabs from "../components/EmployeeTabs";
// import EmployerTabs from "../components/EmployerTabs";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import LanguageIcon from "@material-ui/icons/Language";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import GetAppIcon from "@material-ui/icons/GetApp";

const useStyles = makeStyles((theme) => ({
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
    marginBottom: theme.spacing(15),
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
    marginTop: theme.spacing(1),
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

const VisitedProfilePage = () => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const { id } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [Profile, setProfile] = useState({
    user: {
      id: "",
      is_employer: false,
      first_name: "",
      last_name: "",
      username: "",
      email: "",
    },
    profile: {
      title: "",
      phone_number: "",
      website: "",
      bio: "",
      image: "",
      cv: "",
      location: "",
    },
  });

  const LoadProfile = async () => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      withCredentials: true 
    };

    const res = await axios.get(
      `http://localhost:8000/accounts/profile/${id}/`,
      config
    );

    const data = await res.data;
    
    setProfile(data);
    setIsLoaded(true);
    console.log(Profile);
  };

  useEffect(() => {
    LoadProfile();
  }, [isLoaded]);

  return (
    <>
      {isLoaded ? (
        <>
          <CssBaseline />
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
                        src={Profile.profile.image}
                        classes={{
                          root: classes.avatar,
                          circle: classes.circle,
                        }}
                      />
                      <Typography variant={"h5"}>
                        {Profile.user.first_name} {Profile.user.last_name}
                      </Typography>
                      <Typography variant={"h6"}>{Profile.profile.title}</Typography>
                    </Grid>

                    <Grid className={classes.gridStyle}>
                      <Typography variant={"body1"}>
                        <LocationOnIcon className={classes.iconStyle} />{" "}
                        {Profile.profile.location}
                      </Typography>
                      <Typography variant={"body1"}>
                        <PhoneIcon className={classes.iconStyle} />{" "}
                        {Profile.profile.phone_number}
                      </Typography>
                      <Typography variant={"body1"}>
                        <EmailIcon className={classes.iconStyle} />{" "}
                        {Profile.user.email}
                      </Typography>
                      <Typography variant={"body1"}>
                        <LanguageIcon className={classes.iconStyle} />{" "}
                        <a href={Profile.profile.website}>{Profile.profile.website}</a>
                      </Typography>
                      {!Profile.profile.is_employer && (
                        <Typography variant={"body1"}>
                          <GetAppIcon className={classes.iconStyle} />{" "}
                          <a href={Profile.profile.cv}>Download my Resume</a>
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4} lg={3}>
                <Paper className={fixedHeightPaper} elevation={3}>
                  {Profile.user.is_employer ? (
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
                  <Typography variant={"subtitle2"}>{Profile.profile.bio}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </>
      ) : (
        <div>Loading....</div>
      )}
    </>
  );
};

// const mapStateToProps = (state) => {
//   return {
//     userProfile: state.visitedProfile,
//   };
// };

export default VisitedProfilePage;
