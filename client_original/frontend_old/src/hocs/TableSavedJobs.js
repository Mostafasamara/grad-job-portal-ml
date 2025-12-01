import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const TableSavedJobs = ({ saved_jobs }) => {
  const classes = useStyles();

  return (
    <Table className={classes.table} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell align="left">Job Type</TableCell>
          <TableCell align="left">Salary</TableCell>
          <TableCell align="left">Experince</TableCell>
          <TableCell align="left">Category</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {saved_jobs &&
          saved_jobs.map((row) => (
            <TableRow
              key={row.id}
              to={`/job/${row.id}`}
              component={RouterLink}
              style={{ textDecoration: "none" }}
            >
              <TableCell component="th" scope="row">
                {row.title}
              </TableCell>
              <TableCell align="left">{row.job_type}</TableCell>
              <TableCell align="left">{row.salary}</TableCell>
              <TableCell align="left">{row.experience}</TableCell>
              <TableCell align="left">{row.category}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
const mapStateToProps = (state) => {
  return {
    saved_jobs: state.profile.saved_jobs,
  };
};

export default connect(mapStateToProps)(TableSavedJobs);
