import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Navbar from "../Navbar/Navbar";
import "./MyApplications.css";
import axios from "axios";
import { AuthContext } from "../../App";
import swal from "sweetalert";
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



const defaultRows = [
  {
    title: "Big Job",
    recruiterName: "XYZ recruiter",
    status: "Applied",
    salary: 2000,
    closureDate: null,
  },
  {
    title: "Amazing Job",
    recruiterName: "XYZ recruiter",
    status: "Shortlisted",
    salary: 2000,
    closureDate: null,
  },
  {
    title: "YOu Want This Job",
    recruiterName: "XYZ recruiter",
    status: "Rejected",
    salary: 2000,
    closureDate: 1611149627670,
  },
  {
    title: "JobbbNiggabbb",
    recruiterName: "XYZ recruiter",
    status: "Accepted",
    salary: 2000,
    closureDate: 1611149627670,
  },
];

function MyApplications() {
  const [rows, setRows] = useState([]);
  const { auth, setAuth } = React.useContext(AuthContext);

  

  useEffect(async function () {
    try {
      let applications = await axios.get(
        `${apiUrl.backend}/api/application/byapplicant/${auth.user._id}`
      );
      applications = applications.data.applications;
      console.log(applications);
      let appliedListingIds = applications.map(
        (application) => application.listingId
      );

      let listings = await axios.get(`${apiUrl.backend}/api/listing`);
      listings = listings.data.listings.filter(
        (listing) => appliedListingIds.indexOf(listing._id) !== -1
      );

      
      

      let rows = applications.map((application) => {
        let listing = listings.find((l) => l._id === application.listingId);
        let row = {
          id: application._id,
          title: listing.title,
          recruiterName: listing.recruiter.name,
          status: application.status,
          salary: listing.salary,
          closeDate: application.closeDate,
          listingId: listing._id,
        };
        return row;
      });
      setRows(rows);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="MyApplications">
        <Typography variant="h1" gutterBottom>
          My Applications
        </Typography>
        <br />
        <br />
        <TableContainer component={Paper}>
          <Table className="ApplicationTable">
            <TableHead>
              <TableRow>
                <TableCell align="center">Job Title</TableCell>
                <TableCell align="center">Recruiter Name</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Salary per month</TableCell>
                <TableCell align="center">Date of Joining</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row" align="center">
                    {row.title}
                  </TableCell>
                  <TableCell align="center">{row.recruiterName}</TableCell>
                  <TableCell
                    align="center"
                    style={{ color: getColor(row.status) }}
                  >
                    {row.status}
                  </TableCell>
                  <TableCell align="center">₹{row.salary}</TableCell>
                  <TableCell align="center">
                    {row.status === "Accepted" ? toDt(row.closeDate) : "--"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default MyApplications;
