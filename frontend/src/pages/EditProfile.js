import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { updateProfile } from "../actions/profile";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import setCurrentPage from './../actions/setCurrentPage';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: 45,
    marginBottom: 45,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px",
    marginLeft: "150px",
    marginRight: "150px",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 1, 2),
  },
  fileInput: {
    display: "none",
  },
}));
const EditProfile = ({
  updateProfile,
  first_name_global,
  last_name_global,
  phone_number_global,
  image_global,
  cv_global,
  user_global,
  email_global,
  title_global,
  website_global,
  bio_global,
  location_global,
  emp_global,
  saved_jobs_global,
  setCurrentPage
}) => {
  setCurrentPage(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const classes = useStyles();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/profilepage", { replace: true });
  };

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    image: "",
    cv: "",
    email: "",
    title: "",
    website: "",
    location: "",
    bio: "",
  });

  const {
    first_name,
    last_name,
    phone_number,
    image,
    cv,
    email,
    title,
    website,
    location,
    bio,
  } = formData;

  useEffect(() => {
    setFormData({
      first_name: first_name_global,
      last_name: last_name_global,
      phone_number: phone_number_global,
      title: title_global,
      email: email_global,
      bio: bio_global,
      website: website_global,
      location: location_global,
    });
  }, [first_name_global]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const update = async () => {
    await updateProfile(
      first_name,
      last_name,
      email,
      title,
      phone_number,
      website,
      bio,
      image,
      cv,
      location,
      user_global,
      saved_jobs_global
    );
    setProfileUpdated(!profileUpdated);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    update();
    navigate("/profilepage", { replace: true });
  };

  return (
    <>
      <Paper className={classes.paper} elevation={3}>
      <Typography
        variant="h4"
        align="center"
        color="primary"
        gutterBottom
      >
        Update Your Profile
      </Typography>
        <form
          onSubmit={(e) => onSubmit(e)}
          className={classes.form}
          encType="multipart/form-data"
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="first_name"
                placeholder={`${first_name_global}`}
                value={first_name}
                onChange={(e) => onChange(e)}
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                placeholder={`${last_name_global}`}
                name="last_name"
                value={last_name}
                onChange={(e) => onChange(e)}
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="phonenumber"
                label="phone number"
                placeholder={`${phone_number_global}`}
                name="phone_number"
                value={phone_number}
                onChange={(e) => onChange(e)}
                autoComplete="phone"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="email"
                placeholder={`${email_global}`}
                name="email"
                value={email}
                onChange={(e) => onChange(e)}
                autoComplete="email"
              />
            </Grid>
            {!emp_global && (
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="title"
                  label="title"
                  placeholder={`${title_global}`}
                  name="title"
                  value={title}
                  onChange={(e) => onChange(e)}
                  autoComplete="title"
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="website"
                label="website"
                placeholder={`${website_global}`}
                name="website"
                value={website}
                onChange={(e) => onChange(e)}
                autoComplete="website"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="bio"
                label="bio"
                placeholder={`${bio_global}`}
                name="bio"
                value={bio}
                onChange={(e) => onChange(e)}
                autoComplete="bio"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="location"
                label="location"
                placeholder={`${location_global}`}
                name="location"
                value={location}
                onChange={(e) => onChange(e)}
                autoComplete="location"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <input
                type="file"
                className={classes.fileInput}
                accept={image_global}
                id="upload-image"
                name="image"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.files[0],
                  })
                }
              />
              <label htmlFor="upload-image">
                <Button variant="contained" color="inherit" component="span">
                  update profile picture
                </Button>
              </label>
            </Grid>
            <Grid item xs={12} sm={6}>
              {!emp_global && (
                <>
                  <input
                    type="file"
                    className={classes.fileInput}
                    accept={cv_global}
                    id="upload-cv"
                    name="cv"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [e.target.name]: e.target.files[0],
                      })
                    }
                  ></input>
                  <label htmlFor="upload-cv">
                    <Button
                      variant="contained"
                      color="inherit"
                      component="span"
                    >
                      update your CV
                    </Button>
                  </label>
                </>
              )}
            </Grid>
          </Grid>

          <Grid container justifyContent="center" alignItems="center">
            <Button
              onClick={handleClose}
              variant="contained"
              color="secondary"
              className={classes.submit}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Save
            </Button>
          </Grid>
        </form>
      </Paper>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    first_name_global: state.profile.first_name,
    last_name_global: state.profile.last_name,
    phone_number_global: state.profile.phone_number,
    image_global: state.profile.image,
    cv_global: state.profile.cv,
    user_global: state.profile.id,
    emp_global: state.profile.is_employer,
    email_global: state.profile.email,
    title_global: state.profile.title,
    location_global: state.profile.location,
    bio_global: state.profile.bio,
    website_global: state.profile.website,
    saved_jobs_global: state.profile.saved_jobs,
  };
};

export default connect(mapStateToProps, { updateProfile, setCurrentPage })(EditProfile);
