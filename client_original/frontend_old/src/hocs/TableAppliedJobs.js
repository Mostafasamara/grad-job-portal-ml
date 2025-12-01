import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const TableAppliedJobs = () => {
  const classes = useStyles();

  const [applications, setApplications] = useState([]);
  const loadApplications = async () => {
     const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true
  };
    const res = await axios.get(
      "http://localhost:8000/jobs/api/employee_applications/",config
    );
    if (res.status === 200) {
      const data = res.data;
      setApplications(data);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <Table className={classes.table} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell align="left">Job Type</TableCell>
          <TableCell align="left">Category</TableCell>
          <TableCell align="left">Cover Letter</TableCell>
          <TableCell align="left">Applied at</TableCell>
          <TableCell align="left">Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {applications &&
          applications.map((row) => (
            <TableRow
              key={row.id}
              to={`/job/${row.job.id}`}
              component={RouterLink}
              style={{ textDecoration: "none" }}
            >
              <TableCell component="th" scope="row">
                {row.job.title}
              </TableCell>
              <TableCell align="left">{row.job.job_type}</TableCell>
              <TableCell align="left">{row.job.category}</TableCell>
              <TableCell align="left">
                {row.cover_letter
                  ? row.cover_letter
                  : "No Cover Letter for this Job"}
              </TableCell>
              <TableCell align="left">{row.created_at}</TableCell>
              <TableCell align="left">{row.status}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
export default TableAppliedJobs;
