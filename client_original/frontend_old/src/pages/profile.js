import React, { useEffect } from "react";
import Content from "../hocs/Content";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import DriveIcon from "@material-ui/icons/DriveEta";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import EditProfile from "./EditProfile";
import Grid from "@material-ui/core/Grid";
import { loadProfile } from "../actions/profile";
import { connect } from "react-redux";
import { deleteAccount } from "../actions/auth";
import CSRFToken from "../components/CSRFToken";


const useStyles = makeStyles((theme) => ({
  headerContainer: {
    position: "relative",
    height: "100px",
  },
  header: {
    display: "flex",
    position: "absolute",
    width: "calc(100%)",
    top: "-45px",
    alignItems: "flex-end",
    "& > *": {
      margin: `${theme.spacing(3)}px ${theme.spacing(5)}px`,
    },
  },
  spacer: {
    flexGrow: "0.7",
  },
  avatar: {
    border: `3px solid white`,
    width: theme.spacing(13),
    height: theme.spacing(13),
    boxShadow: theme.shadows[3],
  },
  actionGroup: {
    display: "flex",
    width: "300px",
    justifyContent: "space-between",
    marginRight: 0,
  },
  summaryCards: {
    // width: '100%',
    // maxWidth: 500,
    overflow: "hidden",
    padding: theme.spacing(0, 3),
    display: "flex",
    flexWrap: "wrap",
  },
  summaryCard: {
    maxWidth: 1300,
    margin: theme.spacing(1),
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export function SummaryCard({ title, value, component, deleteAccount }) {
  const classes = useStyles();
  return (
    <Paper elevation={3} className={classes.summaryCard}>
      <Typography color={"primary"} display="block" variant="h5" gutterBottom>
        {title}
      </Typography>

      <Grid container wrap="nowrap" spacing={2}>
        <Grid item xs>
          {component || <Typography noWrap>{value}</Typography>}
        </Grid>
      </Grid>
    </Paper>
  );
}

const User = ({ loadProfile, user, updateProfile, deleteAccount }) => {
  //   const { driverId } = useParams();
  //   id = id ? id : driverId;
  //   const rows = useSelector(selectPeople);
  //   let driver = rows.find((row) => row.id === +id);
  //   if (!driver) {
  //     driver = { name: "hello", id: 3, img: "foo" };
  //   }
  const classes = useStyles();
  const loading = false;

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <Content>
        <CircularProgress />
      </Content>
    );
  }
  const onSubmit = (e) => {
    e.preventDefault();
    deleteAccount();
  };

  return (
    <Content>
      <div className={classes.headerContainer}>
        <div className={classes.header}>
          <Avatar
            // alt={driver.name}
            src={user.image}
            classes={{ root: classes.avatar, circle: classes.circle }}
          />
          <Typography variant={"h5"}>{user.first_name}</Typography>
          <Chip variant={"outlined"} icon={<DriveIcon />} label={user.title} />
          <div className={classes.spacer} />
          <div className={classes.actionGroup}>
            <EditProfile
              //   data={driver}
              render={(open) => (
                <Button
                  color="primary"
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={open}
                >
                  Edit
                </Button>
              )}
            />
            <form onSubmit={(e) => onSubmit(e)}>
              <CSRFToken />
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className={classes.summaryCards}>
        <SummaryCard title={"Bio"} value={user.bio} />
      </div>
      <div className={classes.summaryCards}>
        <SummaryCard title={"Email"} value={user.email} />
        <SummaryCard title={"Phone Number"} value={user.phone_number} />
        <SummaryCard title={"WebSite"} value={user.website} />
        {/* <SummaryCard title={"CV"} > */}
        <div>
          <img src={user.cv} />
        </div>

        {/* <link to={user.cv}></link> */}
        {/* </SummaryCard> */}
      </div>
    </Content>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.profile,
  };
};

export default connect(mapStateToProps, { loadProfile, deleteAccount })(User);
