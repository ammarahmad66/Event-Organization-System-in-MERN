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
    email: "",
    password: "",
  });

  const [alert, setalert] = useState(false);

  const handlealert = () => {
    setalert(!alert);
  };

  const [countryCode, setCountryCode] = useState("");

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
      email: signUpForm.email,
      password: signUpForm.password,
    };
    console.log(data);

    try {
      const response = await Axios.post(
        "http://localhost:5000/api/vendor/signin",
        data
      );
      console.log(response.data);
      // here i want to redirect to Home page page

      if (response.data.message == "Invalid email or password") {
        handlealert(); // alert to show that email or password is invalid
      } else {
        ctxDispatch({ type: "VENDOR_SIGNIN", payload: response.data });
        localStorage.setItem("vendorInfo", JSON.stringify(response.data));
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignUp = () => {
    navigate("/signup");
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
              Vendor SignIn
            </Typography>
            <form className={classes.form} noValidate>
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
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={signUpForm.password}
                onChange={handleChange}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSubmitForm}
              >
                Sign In
              </Button>
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSignUp}
              >
                {" "}
                Go to SignUp
              </Button>
            </form>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
