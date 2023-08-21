import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import EventContainer from "./Event";
import { Store } from "../Store";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: "1px solid #ccc",
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  paper: {
    height: "100%",
  },
  form: {
    marginBottom: theme.spacing(3),
  },
  waitingForApproval: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Home = () => {
  const classes = useStyles();
  const [events, setEvents] = useState([]);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const [vendorInfo, setVendorInfo] = useState({});

  const fetchData = async () => {
    const vendorId = state.vendorInfo._id;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/events/vendor/${vendorId}`
      );
      setEvents(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getVendor = async () => {
    const vendorId = state.vendorInfo._id;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/vendor/${vendorId}`
      );
      setVendorInfo(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchData();
    getVendor();
  }, []);

  return (
    <>
      {vendorInfo && vendorInfo.status === "accepted" ? (
        <Container maxWidth="md" className={classes.root}>
          <Typography variant="h4" className={classes.title}>
            Welcome to Your Event Management Page
          </Typography>
          <Grid container spacing={3}>
            {events ? (
              events.map((event) => (
                <Grid key={event._id} item xs={12} sm={6} md={4}>
                  <Paper className={classes.paper}>
                    <EventContainer
                      fetchData={fetchData}
                      title={event.title}
                      description={event.description}
                      image={event.image}
                      price={event.price}
                      category={event.category}
                      _id={event._id}
                      event={event}
                    />
                  </Paper>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Typography variant="subtitle1">No events added</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Container>
      ) : (
        <div className={classes.waitingForApproval}>
          {vendorInfo && vendorInfo.status === "pending" ? (
            <h1>Waiting For Approval</h1>
          ) : (
            <h1>Get Verified</h1>
          )}
        </div>
      )}
    </>
  );
};
export default Home;
