import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Popover,
  Box,
  makeStyles,
} from "@material-ui/core";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
  },
  formControl: {
    minWidth: 120,
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

function VendorVerification() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const classes = useStyles();
  const [businessName, setBusinessName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [file, setFile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    console.log("Submit verification details");
    // Replace this with a function to make a POST request to the backend with the provided information.
    const vendorInfo = JSON.parse(localStorage.getItem("vendorInfo")); // Parse the stored string to JSON
    const formData = new FormData();
    formData.append("vendorId", vendorInfo._id);
    formData.append("businessName", businessName);
    formData.append("bankName", bankName);
    formData.append("accountNumber", accountNumber);
    formData.append("routingNumber", routingNumber);
    formData.append("document", file);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    // console.log(file);
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/vendor/verify/t",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log(data.vendor);
      localStorage.setItem("vendorInfo", JSON.stringify(data.vendor));
      alert(data.message);
      navigate("/home");
      // Redirect to another page or show a success message
    } catch (error) {
      alert("Error submitting vendor verification details.");
      console.error(error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Container className={classes.container}>
      <Typography variant="h4" align="center" gutterBottom>
        Vendor Verification
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Routing Number"
            value={routingNumber}
            onChange={(e) => setRoutingNumber(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button variant="contained" color="primary" onClick={handleClick}>
            Submit Business Documents
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Box p={2} textAlign="center">
              <input
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                id="raised-button-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  align="center"
                >
                  Choose File
                </Button>
              </label>
            </Box>
          </Popover>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            className={classes.submitButton}
            variant="contained"
            color="secondary"
            disabled={
              !businessName ||
              !bankName ||
              !accountNumber ||
              !routingNumber ||
              !file
            }
            onClick={handleSubmit}
          >
            Get Verified
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default VendorVerification;
