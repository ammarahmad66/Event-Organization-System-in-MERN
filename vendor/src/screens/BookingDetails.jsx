import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { useEffect } from "react";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
  },
}));

export default function BookingDetail() {
  const classes = useStyles();
  const [data, setData] = useState();
  useEffect(() => {
    const booking = JSON.parse(localStorage.getItem("bookingDetail"));
    console.log(booking, booking.bookingDate);
    setData(booking);
  }, []);

  return (
    <div className={classes.root} style={{ justifyContent: "center" }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Booking Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper} elevation={3}>
            {data && (
              <>
                <Typography variant="h4" gutterBottom>
                  Event Information:
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Booking Date: {data.bookingDate}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Booking Time: {data.bookingTime}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Payment Method: {data.paymentMethod}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Total Price: {data.totalPrice}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Is Paid: {data.isPaid ? "Yes" : "No"}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Is Delivered: {data.isDelivered ? "Yes" : "No"}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper} elevation={3}>
            {data && (
              <>
                <Typography variant="h4" gutterBottom>
                  Client Information:
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Name: {data.shippingAddress.fullName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Phone Number: {data.shippingAddress.postalCode}
                </Typography>

                {console.log(data.specialArrangements)}
                {data.specialArrangements &&
                  data.specialArrangements.length > 0 && (
                    <>
                      <Typography variant="h5" gutterBottom>
                        Special Arrangements:
                      </Typography>
                      {data.specialArrangements.map((item, index) => (
                        <ul key={index}>
                          <li> Name: {item[0]}</li>
                          <li>Quantity: {item[1]}</li>
                          <li>Price: {item[2]}</li>
                        </ul>
                      ))}
                    </>
                  )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
