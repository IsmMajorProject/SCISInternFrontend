import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import Slider from "@material-ui/core/Slider";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import swal from "sweetalert";
import JobListing from "../JobListing/JobListing";
import "./FindJobs.css";
import { AuthContext } from "../../App";
import apiUrl from "../../apiUrl";

const defaultFilters = {
  searchTerm: "",
  wfh: true,
  partTime: true,
  fullTime: true,
  salaryRange: [0, 100000000],
  maxDuration: 7,
  sortField: "salary",
  sortOrder: "descending",
};

function FindJobs() {
  const [filters, setFilters] = useState(defaultFilters);
  const [listings, setListings] = useState([]);
  const [maxSalary, setMaxSalary] = useState(10000);
  const { auth, setAuth } = React.useContext(AuthContext);

 

  useEffect(() => {
    setFilters({
      ...filters,
      salaryRange: [filters.salaryRange[0], maxSalary + 1000],
    });
  }, [maxSalary]);

  const fetchJobs = async function () {
    try {
      let allListings = await axios.get(`${apiUrl.backend}/api/listing`);
      allListings = allListings.data.listings;

      allListings = allListings.filter((listing) => {
        let d = new Date(listing.deadlineDate);
        return d.getTime() > Date.now() && !listing.deleted;
      });
      setMaxSalary(Math.max(...allListings.map((l) => l.salary), 0));

      let myApplications = await axios.get(
        `${apiUrl.backend}/api/application/byapplicant/${auth.user._id}`
      );
      let listingsAppliedTo = myApplications.data.applications.map(
        (application) => application.listingId
      );

      // Filters
      let filteredListings = allListings.filter((listing) => {
        return (
          listing.title
            .trim()
            .toLowerCase()
            .indexOf(filters.searchTerm.trim().toLowerCase()) !== -1 &&
          listing.salary <= filters.salaryRange[1] &&
          listing.salary >= filters.salaryRange[0] &&
          listing.duration < filters.maxDuration &&
          ((listing.jobType === "Full Time" && filters.fullTime) ||
            (listing.jobType === "Part Time" && filters.partTime) ||
            (listing.jobType === "WFH" && filters.wfh))
        );
      });

      //Applied to listings
      filteredListings = filteredListings.map((listing) => {
        if (listingsAppliedTo.indexOf(listing._id) !== -1)
          listing.applied = true;
        else listing.applied = false;
        return listing;
      });

      

      setListings(filteredListings);
      console.log(filteredListings);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(fetchJobs, []);

  const onFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const onCheckBoxChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.checked,
    });
  };

  const onSalaryRangeChange = (e, newValue) => {
    console.log(newValue);
    setFilters({
      ...filters,
      salaryRange: newValue,
    });
  };

  return (
    <>
      <Navbar />
      <div className="FindJobs">
        <div className="FilterPanel">
          <h1>Search</h1>
          <TextField
            fullWidth
            variant="outlined"
            name="searchTerm"
            placeholder="Search term"
            value={filters.searchTerm}
            onChange={onFilterChange}
          />
          <br />
          <br />
          <br />

          <h1>Filters</h1>
          <FormControl component="fieldset">
            <Typography gutterBottom>Job type</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.fullTime}
                    onChange={onCheckBoxChange}
                    name="fullTime"
                  />
                }
                label="Full Time"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.partTime}
                    onChange={onCheckBoxChange}
                    name="partTime"
                  />
                }
                label="Part Time"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.wfh}
                    onChange={onCheckBoxChange}
                    name="wfh"
                  />
                }
                label="Work From Home"
              />
            </FormGroup>
          </FormControl>
          <br />
          <br />
          <div className="BottomButtons">
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: 10 }}
              onClick={fetchJobs}
            >
              Apply
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setFilters(defaultFilters)}
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
        <div className="Jobs">
          <Typography variant="h1" gutterBottom>
            Jobs...
          </Typography>
          {listings.map((listing) => (
            <JobListing key={listing._id} listing={listing} />
          ))}
        </div>
      </div>
    </>
  );
}

export default FindJobs;
