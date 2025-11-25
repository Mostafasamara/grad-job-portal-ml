import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const EmployerJobsTable = () => {
  const [jobs, setJobs] = useState([]);

  const loadJobs = async () => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      withCredentials: true 
    };
    const res = await axios.get(
      "http://localhost:8000/jobs/api/jobs/employer_jobs/",
      config
    );
    if (res.status === 200) {
      const data = res.data;
      setJobs(data);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const classes = useStyles();

  return (
    <Table className={classes.table} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell align="right">Job Type</TableCell>
          <TableCell align="right">Salary</TableCell>
          <TableCell align="right">Experince</TableCell>
          <TableCell align="right">Category</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {jobs &&
          jobs.map((row) => (
            <TableRow
              to={`/job/${row.id}`}
              component={RouterLink}
              style={{ textDecoration: "none" }}
              key={row.id}
            >
              <TableCell scope="row">{row.title}</TableCell>
              <TableCell align="right">{row.job_type}</TableCell>
              <TableCell align="right">{row.salary}</TableCell>
              <TableCell align="right">{row.experience}</TableCell>
              <TableCell align="right">{row.category}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default EmployerJobsTable;
