import React, { useState, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import { makeStyles, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { AnonApplyJob } from "../actions/jobs";
import setCurrentPage from './../actions/setCurrentPage';

const useStyle = makeStyles({
  card: {
    boxShadow: 10,
  },
  field: {
    marginTop: 30,
    marginBottom: 30,
    display: "block",
  },
});

const ApplyJob = ({ AnonApplyJob, setCurrentPage }) => {
  setCurrentPage(false);
  const classes = useStyle();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    website: "",
    cv: null,
    cover_letter: "",
  });

  const { full_name, email, website, cv, cover_letter } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const res = await AnonApplyJob(
      id,
      full_name,
      email,
      website,
      cv,
      cover_letter
    );
    if (res.success) navigate("/profilepage");
    else console.log(res.error);
  };

  return (
    <div>
      <Card
        style={{
          width: 900,
          marginRight: "auto",
          marginLeft: "auto",
          marginTop: 100,
          marginBottom: 30,
        }}
        className={classes.card}
      >
        <h1 style={{ color: "#3f51b5", marginLeft: 30, textAlign: "center" }}>
          Apply Job
        </h1>
        <form
          enctype="multipart/form-data"
          onSubmit={(e) => onSubmit(e)}
          noValidate
          autoComplete="off"
          style={{ width: 850, marginRight: "auto", marginLeft: "auto" }}
        >
          <TextField
            className={classes.field}
            label="full name"
            name="full_name"
            value={full_name}
            onChange={(e) => onChange(e)}
            variant="outlined"
            color="primary"
            fullWidth
            required
          />
          <TextField
            className={classes.field}
            label="email"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
            variant="outlined"
            color="primary"
            fullWidth
            required
          />
          <TextField
            className={classes.field}
            label="website"
            name="website"
            value={website}
            onChange={(e) => onChange(e)}
            variant="outlined"
            color="primary"
            fullWidth
            required
          />
          <Button variant="contained" component="label">
            Upload CV:
            <input
              name="cv"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [e.target.name]: e.target.files[0],
                })
              }
              type="file"
            />
          </Button>
          <TextField
            className={classes.field}
            label="cover letter"
            name="cover_letter"
            value={cover_letter}
            onChange={(e) => onChange(e)}
            variant="outlined"
            color="primary"
            fullWidth
            multiline
            rows={4}
            required
          />
          <br></br>
          <br></br>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disableElevation
            style={{
              padding: 15,
              fontWeight: "bold",
              fontSize: 15,
              marginTop: 5,
            }}
            fullWidth
          >
            Apply Now
          </Button>
        </form>
      </Card>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    job: state.job.job,
    isAuthenticated: state.isAuthenticated,
    created_by: state.profile.id,
  };
};

export default connect(mapStateToProps, {
  AnonApplyJob, setCurrentPage
})(ApplyJob);
