import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import swal from "sweetalert";
import { AuthContext } from "../../App";
import "./AcceptedEmployees.css";
import apiUrl from "../../apiUrl";

const toDt = (dt) => {
  if (!dt) return "--";
  let d = new Date(dt);
  return d.toDateString();
};

const getColor = (status) => {
  switch (status) {
    case "Applied":
      return "black";
    case "Shortlisted":
      return "blue";
    case "Rejected":
      return "red";
    case "Accepted":
      return "green";
  }
};

const actionButtons = (row) => {
  if (row.status === "Applied") {
    return (
      <>
        <Button variant="contained" color="primary">
          Shortlist
        </Button>
        <Button variant="contained" color="secondary">
          Reject
        </Button>
      </>
    );
  } else if (row.status === "Shortlisted") {
    return (
      <>
        <Button
          variant="contained"
          style={{ color: "white", backgroundColor: "lightgreen" }}
        >
          Accept
        </Button>
        <Button variant="contained" color="secondary">
          Reject
        </Button>
      </>
    );
  }
  return "--";
};

const application = {
  name: "Guy Name",
  jobType: "Part time",
  joiningDate: Date.now(),
  title: "Job Title",
};

const defaultRows = [application, application, application, application];

const defaultSort = {
  sortField: "name",
  sortOrder: "ascending",
};

function AcceptedEmployees() {
  const [sort, setSort] = useState(defaultSort);
  const [rows, setRows] = useState([]);
  const { auth, setAuth } = React.useContext(AuthContext);

  const getEmployees = async function () {
    try {
      // Get from backend
      let applicants = await axios.get(
        `${apiUrl.backend}/api/applicant/byrecruiter/${auth.user._id}`
      );
      applicants = applicants.data.applicants;

      //Sort
      applicants.sort((a, b) =>
        a[sort.sortField] < b[sort.sortField]
          ? sort.sortOrder === "ascending"
            ? -1
            : 1
          : sort.sortOrder === "ascending"
          ? 1
          : -1
      );
      console.log(applicants);
      setRows(applicants);
    } catch (error) {
      console.log(error);
    }
  };

  
  useEffect(getEmployees, []);
  //useEffect(getEmployees, [sort]);

  const onSortChange = (e) => {
    setSort({
      ...sort,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Navbar />
      <div className="AcceptedEmployees">
        <div className="FilterPanel">
          <h1>Sort By</h1>
          <Select
            name="sortField"
            value={sort.sortField}
            onChange={onSortChange}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="title">Job Title</MenuItem>
            <MenuItem value="joiningDate">Joining Date</MenuItem>
          </Select>
          <RadioGroup
            row
            value={sort.sortOrder}
            name="sortOrder"
            onChange={onSortChange}
          >
            <FormControlLabel
              value="ascending"
              control={<Radio />}
              label="Ascending"
            />
            <FormControlLabel
              value="descending"
              control={<Radio />}
              label="Descending"
            />
          </RadioGroup>
          <br />
          <br />
          <div className="BottomButtons">
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: 10 }}
              onClick={getEmployees}
            >
              Apply
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setSort(defaultSort);
                //getEmployees();
              }}
            >
              Reset
            </Button>
          </div>
        </div>
        <Divider
          orientation="vertical"
          flexItem
          style={{ position: "fixed", height: "100%" }}
        />
        <div className="Employees">
          <Typography variant="h1" gutterBottom>
            Accepted Employees
          </Typography>
          <br />
          <br />
          <TableContainer component={Paper}>
            <Table className="ApplicationTable">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Applicant Name</TableCell>
                  <TableCell align="center">Joining date</TableCell>
                  <TableCell align="center">Job Type</TableCell>
                  <TableCell align="center">Job Title</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{toDt(row.joiningDate)}</TableCell>
                    <TableCell align="center">{row.jobType}</TableCell>
                    <TableCell align="center">{row.title}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
}

export default AcceptedEmployees;
