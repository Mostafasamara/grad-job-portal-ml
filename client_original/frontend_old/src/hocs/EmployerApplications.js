import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { connect } from "react-redux";

import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { rejectApplication, createInterview } from "../actions/applications";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const EmployerApplications = ({ rejectApplication, createInterview }) => {
  const classes = useStyles();

  const [applications, setApplications] = useState([]);

  const [applicationState, setApplicationState] = useState(false);

  const [open, setOpen] = React.useState(false);

  const [applicationId, setApplicationId] = React.useState(0);

  const [formData, setFormData] = useState({
    address: "",
    time: "",
  });

  const { address, time } = formData;

  const handleClickOpen = (id) => {
    setApplicationId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    createInterview(address, time, applicationId);
    handleClose();
  };

  const loadApplications = async () => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      withCredentials: true 
    };
    const res = await axios.get(
      "http://localhost:8000/jobs/api/employer_applications/",
      config
    );
    if (res.status === 200) {
      const data = res.data;
      setApplications(data);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [applicationState]);

  return (
    <>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Accept Application</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please specify and send the interview details..
            </DialogContentText>

            <TextField
              autoFocus
              label="Address"
              name="address"
              value={address}
              onChange={(e) => {
                onChange(e);
              }}
              margin="dense"
              id="name"
              type="text"
              fullWidth
            />
            <TextField
              id="datetime-local"
              label="Date & Time"
              name="time"
              value={time}
              onChange={(e) => {
                onChange(e);
              }}
              type="datetime-local"
              defaultValue="2022-01-01T10:00"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSubmit();
                setApplicationState(!applicationState);
              }}
              color="primary"
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Applied At</TableCell>
            <TableCell align="left">Cover Letter</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications &&
            applications.map((row) => (
              <TableRow key={row.id}>
                <TableCell
                  to={`/job/${row.job.id}`}
                  component={RouterLink}
                  style={{ textDecoration: "none" }}
                >
                  {row.job.title}
                </TableCell>
                {row.applicant_email ? (
                  <TableCell to="#" align="left">
                    {row.applicant_email}
                  </TableCell>
                ) : (
                  <TableCell align="left">{row.email}</TableCell>
                )}

                <TableCell align="left">{row.created_at}</TableCell>
                <TableCell align="left">{row.cover_letter}</TableCell>
                <TableCell align="left">
                  {row.status === "Pending" ? (
                    <>
                      <Button
                        onClick={() => {
                          handleClickOpen(row.id);
                        }}
                      >
                        <CheckCircleIcon />
                      </Button>
                      <Button
                        onClick={() => {
                          rejectApplication(row.id);
                          setApplicationState(!applicationState);
                        }}
                      >
                        <CancelIcon />
                      </Button>
                    </>
                  ) : (
                    row.status
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default connect(null, { rejectApplication, createInterview })(
  EmployerApplications
);
