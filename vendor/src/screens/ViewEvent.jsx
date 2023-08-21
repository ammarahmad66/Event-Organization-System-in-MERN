import React from "react";
import { makeStyles } from "@mui/styles";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import { useState } from "react";
import Reviews from "../components/Reviews";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    margin: "1rem",
  },
  media: {
    height: "60vh",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "1rem",
    width: "100%",
    boxSizing: "border-box",
  },
  section: {
    marginBottom: "1rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
  },
});

const EventDetail = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [eventData, setEventData] = useState(
    JSON.parse(localStorage.getItem("eventToView"))
  );
  const [suspendd, setSuspend] = useState(false);
  // get event data from local storage
  //const eventData = JSON.parse(localStorage.getItem("eventToView"));
  const handleSpecialArrangments = () => {
    navigate(`/specialArrangements/${eventData._id}`);
  };

  const handleSuspendBooking = async () => {
    const res = await axios.put(
      `http://localhost:5000/api/events/changeSuspenedStatus/${eventData._id}`,
      {
        suspended: true,
      }
    );
    console.log(res.data);
    setEventData(res.data.event);
    alert("Bokings Suspended");
  };

  const handleAllowBooking = async () => {
    const res = await axios.put(
      `http://localhost:5000/api/events/changeSuspenedStatus/${eventData._id}`,
      {
        suspended: false,
      }
    );
    console.log(res.data);
    setEventData(res.data.event);
    alert("Bokings Suspended");
  };

  const handleViewSpecialArrangements = () => {
    navigate(`/viewArrangements/${eventData._id}`, { state: eventData });
  };
  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <div>
          <Typography className={classes.title} variant="h2" component="div">
            {eventData.title}
          </Typography>
          <Typography
            className={classes.subtitle}
            variant="subtitle1"
            color="text.secondary"
          >
            Category: {eventData.category}
          </Typography>
          <Typography
            className={classes.subtitle}
            variant="subtitle1"
            color="text.secondary"
          >
            Price: {eventData.price}
          </Typography>
        </div>
        <div>
          <Typography variant="body1" color="text.secondary">
            Description : {eventData.description}
          </Typography>
        </div>
        <div>
          <Typography
            className={classes.subtitle}
            variant="subtitle1"
            color="text.secondary"
          >
            Opening Time: {eventData.opening}
          </Typography>
          <Typography
            className={classes.subtitle}
            variant="subtitle1"
            color="text.secondary"
          >
            Closing Time: {eventData.closing}
          </Typography>

          <Typography
            className={classes.subtitle}
            variant="subtitle1"
            color="text.secondary"
          >
            Reviews: {eventData.reviews.length}
          </Typography>
        </div>
        <div>
          <Typography className={classes.title} variant="h3" component="h1">
            Reviews
          </Typography>
          <Reviews reviews={eventData.reviews} />
        </div>
      </CardContent>
      <div>
        <CardMedia
          className={classes.media}
          component="img"
          image={eventData.image}
          alt={eventData.title}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: "1rem", padding: "0.5rem" }}
          onClick={handleSpecialArrangments}
        >
          Add special Arrangments
        </Button>
        <Button
          variant="contained"
          onClick={handleViewSpecialArrangements}
          style={{ marginTop: "1rem" }}
        >
          View Special Arrangements
        </Button>
        {eventData && eventData.suspended ? (
          <Button
            variant="contained"
            color="success"
            onClick={handleAllowBooking}
            style={{ marginTop: "1rem" }}
          >
            Allow Bookings
          </Button>
        ) : (
          <Button
            variant="contained"
            color="error"
            onClick={handleSuspendBooking}
            style={{ marginTop: "1rem" }}
          >
            Suspend Bookings
          </Button>
        )}
      </div>
    </Card>
  );
};

export default EventDetail;
