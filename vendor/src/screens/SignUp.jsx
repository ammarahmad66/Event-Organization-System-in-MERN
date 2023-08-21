import React, { Fragment, useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputMask from "react-input-mask";
import Axios from "axios";
import AlertModel from "../components/AlertModel";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage:
      "url(https://img.freepik.com/premium-vector/event-planner-template-hand-drawn-cartoon-illustration-with-planning-schedule-calendar-concept_2175-7747.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundColor: theme.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(0.5px)",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: "3rem",
    textAlign: "center",
  },
}));

export default function SignUp() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const classes = useStyles();
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cnic: "",
    phone: "",
    address: "",
    businessName: "",
  });
  const [countryCode, setCountryCode] = useState("");
  const [alert, setalert] = useState(false);

  const handlealert = () => {
    setalert(!alert);
  };
  const handleChange = (event) => {
    // use bracket notation to update the nested field value
    //console.log(event.target.value);
    setSignUpForm({ ...signUpForm, [event.target.name]: event.target.value });
  };

  const handleCountryCodeChange = (event) => {
    // use bracket notation to update the nested field value
    //console.log(event.target.value);
    setCountryCode(event.target.value);
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    let data = {
      name: signUpForm.name,
      email: signUpForm.email,
      password: signUpForm.password,
      phone: signUpForm.phone,
      address: signUpForm.address,
      businessName: signUpForm.businessName,
      CNIC: signUpForm.cnic,
    };
    console.log(data);

    try {
      const response = await Axios.post(
        "http://localhost:5000/api/vendor/",
        data
      );
      console.log(response.data);
      // here i want to redirect to Homw page page

      if (response.data.message === "Email already exists") {
        handlealert();
      } else {
        ctxDispatch({ type: "VENDOR_SIGNIN", payload: response.data });
        // localStorage.setItem("vendorInfo", JSON.stringify(response.verified));
        localStorage.setItem("vendorInfo", JSON.stringify(response.data));
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignIn = () => {
    navigate("/");
  };
  return (
    <>
      {alert && (
        <AlertModel
          title="SignUp failed"
          message="Enter correct email and password"
          status={state}
          handlealert={handlealert}
        />
      )}
      <Grid container component="main" className={classes.root}>
        <Grid item xs={false} sm={4} md={7} className={classes.image}>
          <div className={classes.overlay}>
            <Typography variant="h3" className={classes.text}>
              Welcome to Event Organization system
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography component="h1" variant="h5">
              Vendor SignUp
            </Typography>
            <form className={classes.form} onSubmit={handleSubmitForm}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                value={signUpForm.name}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={signUpForm.email}
                onChange={handleChange}
              />

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="cnic"
                label="CNIC"
                name="cnic"
                autoComplete="cnic"
                value={signUpForm.cnic}
                onChange={handleChange}
              />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="country-code"
                    label="Country Code"
                    name="country-code"
                    autoComplete="country-code"
                    value={signUpForm.countryCode}
                    onChange={handleCountryCodeChange}
                    select
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="+92">Pakistan (+92)</MenuItem>
                    <MenuItem value="+1">USA (+1)</MenuItem>
                    <MenuItem value="+971">Dubai (+971)</MenuItem>
                    <MenuItem value="+44">UK (+44)</MenuItem>
                    <MenuItem value="+358">Finland (+358)</MenuItem>
                    <MenuItem value="+353">Ireland (+353)</MenuItem>
                    <MenuItem value="+49">Germany (+49)</MenuItem>
                    <MenuItem value="+86">China (+86)</MenuItem>
                    <MenuItem value="+91">India (+91)</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <InputMask
                    mask="999-999-9999"
                    maskChar=" "
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, "");
                      e.target.value = value;
                      setSignUpForm({ ...signUpForm, phone: value });
                    }}
                  >
                    {() => (
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="phone"
                        label="Phone Number"
                        name="phone"
                        autoComplete="phone"
                      />
                    )}
                  </InputMask>
                </Grid>
              </Grid>

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="business-name"
                label="Business Name"
                name="businessName"
                autoComplete="business-name"
                value={signUpForm.businessName}
                onChange={handleChange}
              />

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="address"
                label="Address"
                id="address"
                autoComplete="address"
                value={signUpForm.address}
                onChange={handleChange}
              />

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={signUpForm.password}
                onChange={handleChange}
              />

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
                value={signUpForm.confirmPassword}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign Up
              </Button>
            </form>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSignIn}
            >
              Go to Sign In
            </Button>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
