import React, { useEffect, useState } from "react";
import { useParams, Navigate, Link as RouterLink } from "react-router-dom";
import { connect } from "react-redux";
import { loadPost } from "../actions/posts";
import axios from "axios";
import Cookies from "js-cookie";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";

import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import CardHeader from "@material-ui/core/CardHeader";
import CommentIcon from "@material-ui/icons/Comment";
import DeleteIcon from "@material-ui/icons/Delete";
import TitleIcon from "@material-ui/icons/Title";
import ScheduleIcon from "@material-ui/icons/Schedule";
import setCurrentPage from "./../actions/setCurrentPage";
const useStyles = makeStyles({
  root: {
    width: "60%",
    marginLeft: "auto",
    marginRight: "auto",
    top: 0,
  },
  cardcomment: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "20px",
  },
  comment: {
    width: "60%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "1px",
    textAlign: "center",
  },
  btn: {
    width: 130,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 45,
  },
  comm: {
    marginLeft: 75,
    marginTop: 5,
    color: "#34495E",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
  },
  Typography1: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: -30,
    marginLeft: 55,
    color: "#34495E",
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
  lastcom: {
    marginTop: 20,
    marginLeft: 60,
  },
  field: {
    height: "150px",
  },
});

const PostDetails = ({ loadPost, post, comments, user, setCurrentPage }) => {
  setCurrentPage(false);
  const classes = useStyles();
  const [postDeleted, setPostDeleted] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [show, setshow] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    loadPost(id);
  }, []);

  const AddNewComment = async () => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };
    const body = JSON.stringify({
      user: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      post: post.id,
      body: commentBody,
    });

    try {
      const res = await axios.post(
        `http://localhost:8000/blog-api/posts/${post.id}/comments/`,
        body,
        config
      );
      if (res.status === 201) {
        loadPost(id);
        setCommentBody("");
        setshow(!show);
      }
    } catch (err) {}
  };

  const DeleteComment = async (comment_id) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    try {
      const res = await axios.delete(
        `http://localhost:8000/blog-api/posts/${id}/comments/${comment_id}/`,
        config
      );
      if (res.status === 204) {
        loadPost(id);
      }
    } catch (err) {}
  };

  const DeletePost = async () => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    try {
      const res = await axios.delete(
        `http://localhost:8000/blog-api/posts/${id}/`,
        config
      );
      if (res.status === 204) {
        setPostDeleted(true);
      }
    } catch (err) {}
  };

  if (postDeleted) return <Navigate replace to="/" />;

  const onSubmitDeletePost = (e) => {
    e.preventDefault();
    DeletePost();
  };

  const onSubmitDeleteComment = (e, comment_id) => {
    e.preventDefault();
    DeleteComment(comment_id);
  };

  return (
    <>
      <Card className={classes.root}>
        <div className={classes.cardHeader}>
          <CardHeader
            avatar={<Avatar aria-label="recipe" />}
            title={`${post.first_name} ${post.last_name} `}
            subheader={post.created}
            to={`/profile/${post.user}`}
            component={RouterLink}
            style={{ textDecoration: "none" }}
          />
          {user.id === post.user && (
            <Button size="large" color="primary" onClick={(e) => DeletePost()}>
              <DeleteIcon />
            </Button>
          )}
        </div>
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
            variant="body1"
            color="textPrimary"
            component="p"
            className={classes.Typography2}
          >
            {post.body}
            <CardActions>
              <Button
                size="large"
                style={{
                  position: "absolute",
                  left: "77%",
                  transform: "translate(-50%, -50%)",
                }}
                color="primary"
                onClick={(e) => setshow(!show)}
              >
                <CommentIcon />
              </Button>
            </CardActions>
          </Typography>
          {post ? (
            <>
              {comments.map((comment) => {
                return (
                  <Card
                    key={comment.id}
                    className={classes.cardcomment}
                    style={{
                      backgroundColor: "#cfe8fc",
                      left: "50%",
                    }}
                  >
                    <div className={classes.cardHeader}>
                      <CardHeader
                        avatar={<Avatar aria-label="recipe" />}
                        title={`${comment.first_name} ${comment.last_name} `}
                        subheader={comment.created}
                        to={`/profile/${comment.user}`}
                        component={RouterLink}
                        style={{ textDecoration: "none" }}
                      />
                      {(user.id === comment.user || user.id === post.user) && (
                        <Button
                          size="large"
                          color="primary"
                          onClick={() => DeleteComment(comment.id)}
                        >
                          <DeleteIcon />
                        </Button>
                      )}
                    </div>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                      className={classes.comm}
                    >
                      {comment.body}
                    </Typography>
                  </Card>
                );
              })}
            </>
          ) : (
            <h5>Post Not Found</h5>
          )}
        </CardContent>
      </Card>

      <div className="comments">
        {show ? (
          <Container className={classes.comment}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                AddNewComment();
              }}
            >
              <TextField
                className={classes.field}
                label="Comment"
                variant="outlined"
                color="primary"
                name="commentBody"
                value={commentBody}
                onChange={(e) => {
                  setCommentBody(e.target.value);
                }}
                fullWidth
                multiline
                rows={8}
              />
              <Button
                className={classes.btn}
                type="submit"
                variant="contained"
                disableElevation
                style={{
                  background: "#4caf50",
                  color: "white",
                  padding: 10,
                  fontWeight: "bold",
                  fontSize: 13,
                }}
              >
                Add Comment
              </Button>
            </form>
          </Container>
        ) : null}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    post: state.post.post,
    comments: state.post.comments,
    user: state.profile,
  };
};

export default connect(mapStateToProps, { loadPost, setCurrentPage })(
  PostDetails
);
