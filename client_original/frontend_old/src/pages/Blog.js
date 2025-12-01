import React, { useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { loadPosts } from "../actions/posts";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Card, Grid } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import CssBaseline from "@material-ui/core/CssBaseline";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import setCurrentPage from "./../actions/setCurrentPage";
const useStyles = makeStyles((themes) => ({
  table: {
    width: 900,
    marginLeft: "auto",
    marginRight: "auto",
  },
  root: {
    maxWidth: 650,
    height: 120,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "30px",
  },
  Typography1: {
    marginTop: -45,
    marginLeft: 55,
    color: "#black",
  },
  Typography2: {
    marginTop: -2,
    marginLeft: 60,
  },
  title: {
    flexGrow: 1,
  },
  margin: {
    margin: themes.spacing(1),
  },
  fab: {
    margin: themes.spacing(2),
  },
  absolute: {
    position: "fixed",
    bottom: themes.spacing(2),
    right: themes.spacing(2),
  },
}));

const Blog = ({ loadPosts, posts, setCurrentPage }) => {
  const classes = useStyles();
  setCurrentPage(false);
  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div>
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography
          component="div"
          style={{
            width: "650px",
            marginLeft: -70,
            textAlign: "center",
          }}
        >
          <h1 style={{ margin: "10px", padding: "10px" }}>
            What Is On Your Mind?
          </h1>
          <Tooltip title="Add" aria-label="add post">
            <Fab color="primary" className={classes.absolute}>
              <Button to="/posts/add" component={RouterLink}>
                <AddIcon />
              </Button>
            </Fab>
          </Tooltip>
        </Typography>
      </Container>
      {posts &&
        posts.map((post) => {
          return (
            <Card key={post.id} className={classes.root}>
              <CardHeader
                avatar={
                  <Button to={`/posts/${post.id}`} component={RouterLink}>
                    <ArrowForwardIcon />
                  </Button>
                }
                subheader={`${post.first_name} ${post.last_name}`}
              />
              <CardActions>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    className={classes.Typography1}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="p"
                    color="textSecondary"
                    component="p"
                    className={classes.Typography2}
                  >
                    {post.created}
                  </Typography>
                </CardContent>
              </CardActions>
            </Card>
          );
        })}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { posts: state.posts.posts };
};

export default connect(mapStateToProps, { loadPosts, setCurrentPage })(Blog);
