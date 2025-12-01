import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import { makeStyles, Paper, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import setCurrentPage from "./../actions/setCurrentPage";

const useStyle = makeStyles({
  card: {
    boxShadow: 10,
  },
  field: {
    marginTop: 15,
    marginBottom: 15,
    display: "block",
  },
});

const AddPost = ({ user, setCurrentPage }) => {
  setCurrentPage(false);
  const classes = useStyle();

  // const [postBody, setPostBody] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const { postTitle, postBody } = formData;

  const [postCreated, setPostCreated] = useState(false);

  const AddNewPost = async () => {
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
      title: postTitle,
      body: postBody,
    });

    try {
      const res = await axios.post(
        "http://localhost:8000/blog-api/posts/",
        body,
        config
      );
      if (res.status === 201) {
        setPostCreated(true);
      }
    } catch (err) {}
  };

  if (postCreated) return <Navigate replace to="/blog" />;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    AddNewPost();
  };

  return (
    <div>
      <Card
        style={{
          width: 800,
          marginRight: "auto",
          marginLeft: "auto",
          marginTop: 60,
          marginBottom: 60,
          padding: 10,
        }}
        className={classes.card}
      >
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Add Post
        </Typography>
        <form onSubmit={(e) => onSubmit(e)}>
          <TextField
            className={classes.field}
            label="title"
            name="postTitle"
            variant="outlined"
            color="primary"
            fullWidth
            required
            onChange={(e) => onChange(e)}
          />
          <TextField
            className={classes.field}
            label="Body"
            name="postBody"
            variant="outlined"
            color="primary"
            multiline
            rows={8}
            fullWidth
            required
            onChange={(e) => onChange(e)}
          />
          <Button
            type="submit"
            variant="contained"
            disableElevation
            color="primary"
            fullWidth
            className={classes.field}
          >
            Add Now
          </Button>
        </form>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { user: state.profile };
};

export default connect(mapStateToProps, { setCurrentPage })(AddPost);
