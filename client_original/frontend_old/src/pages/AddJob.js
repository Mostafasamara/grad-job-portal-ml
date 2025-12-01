import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@material-ui/core/Card";
import { makeStyles, TextField } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { AddNewJob } from "../actions/jobs";
import CSRFToken from "../components/CSRFToken";
import setCurrentPage from "./../actions/setCurrentPage";

const useStyle = makeStyles({
  card: {
    boxShadow: 10,
  },
  field: {
    marginTop: 12,
    marginBottom: 12,
    display: "block",
  },
});

const AddJob = ({
  is_employer,
  user,
  AddNewJob,
  categories,
  setCurrentPage,
}) => {
  setCurrentPage(false);
  const classes = useStyle();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    job_type: "",
    description: "",
    vacancy: "",
    salary: "",
    experience: "",
    category: ""
  });

  let { title, job_type, description, vacancy, salary, experience, category } =
    formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    AddNewJob(
      title,
      job_type,
      description,
      Number(vacancy),
      Number(salary),
      Number(experience),
      category
    );
    navigate("/", { replace: true });
  };

  if (!is_employer) return navigate("/", { replace: true });

  return (
    <div>
      <Card
        style={{
          width: 800,
          marginRight: "auto",
          marginLeft: "auto",
          marginTop: 40,
          marginBottom: 40,
          padding: 10,
        }}
      >
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Add Job
        </Typography>
        <form
          onSubmit={(e) => {
            onSubmit(e);
          }}
        >
          <CSRFToken />
          <TextField
            className={classes.field}
            label="title"
            name="title"
            value={title}
            onChange={(e) => {
              onChange(e);
            }}
            variant="outlined"
            color="primary"
            fullWidth
            required
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="uncontrolled-native"> job type</InputLabel>
            <Select
              name="job_type"
              value={job_type}
              onChange={(e) => onChange(e)}
              inputProps={{
                id: "uncontrolled-native",
              }}
            >
              <MenuItem value="Full time">Full time</MenuItem>
              <MenuItem value="Part time">Part time</MenuItem>
            </Select>
          </FormControl>

          <TextField
            className={classes.field}
            label="description"
            name="description"
            value={description}
            onChange={(e) => {
              onChange(e);
            }}
            variant="outlined"
            color="primary"
            multiline
            rows={8}
            fullWidth
            required
          />
          <TextField
            className={classes.field}
            type="number"
            label="vacancy"
            name="vacancy"
            value={vacancy}
            onChange={(e) => {
              onChange(e);
            }}
            variant="outlined"
            fullWidth
            required
          />

          <TextField
            className={classes.field}
            type="number"
            label="salary"
            name="salary"
            value={salary}
            onChange={(e) => {
              onChange(e);
            }}
            variant="outlined"
            fullWidth
            required
          />

          <TextField
            className={classes.field}
            type="number"
            label="experience"
            name="experience"
            value={experience}
            onChange={(e) => {
              onChange(e);
            }}
            variant="outlined"
            fullWidth
            required
          />

          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="uncontrolled-native">category</InputLabel>
            <Select
              name="category"
              value={category}
              onChange={(e) => onChange(e)}
              inputProps={{
                id: "uncontrolled-native",
              }}
            >
              {categories.map((category) => {
                return (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            color="primary"
            fullWidth
            className={classes.field}
          >
            Add Job
          </Button>
        </form>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    is_employer: state.profile.is_employer,
    categories: state.categories.categories,
    user: state.profile,
  };
};

export default connect(mapStateToProps, { AddNewJob, setCurrentPage })(AddJob);
