import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
} from "@material-ui/core";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import DoneIcon from "@mui/icons-material/Done";
import Button from "@material-ui/core/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function OrderTable() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);
  const getBookedEvents = async () => {
    const vendorInfo = JSON.parse(localStorage.getItem("vendorInfo"));
    const res = await axios.get(
      `http://localhost:5000/api/orders/vendor/${vendorInfo._id}`
    );

    setBookings(res.data);
  };

  useEffect(() => {
    getBookedEvents();
  }, []);

  const handleRowClick = (booking) => {
    // console.log(booking);
    localStorage.setItem("bookingDetail", JSON.stringify(booking));
    navigate("/bookingDetail");
  };

  const handleMarkAsDone = async (event, booking) => {
    event.stopPropagation();
    console.log(booking);

    const dateString = "06/05/2023";
    const dateParts = booking.bookingDate.split("/");
    const day = dateParts[1];
    const month = dateParts[0] - 1; // months are zero-based in JavaScript
    const year = dateParts[2];
    const targetDate = new Date(year, month, day);

    if (Date.now() > targetDate.getTime()) {
      console.log("The current date is later than the target date.");
      const res = await axios.put(
        `http://localhost:5000/api/orders/${booking._id}/markAsDone/vendor`,
        {}
      );
    } else {
      setOpen(true);
    }

    //const res = await axios.put(
    getBookedEvents();
  };
  return (
    <Container
      style={{
        margin: "1rem",
        //padding: "px",
        fontWeight: "bold",
        color: "#000080",
        border: "1px solid #000080",
        width: "95%",
      }}
    >
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography variant="h6" color="error">
            Cannot mark as done before the event date
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Typography
        align="center"
        variant="h3"
        style={{ padding: "20px", fontWeight: "bold", color: "#000080" }}
      >
        Bookings
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="Order table">
          <TableHead
            style={{
              backgroundColor: "black",
              color: "white",
            }}
          >
            <TableRow>
              <TableCell
                style={{
                  color: "white",
                }}
              >
                Event
              </TableCell>

              <TableCell
                style={{
                  color: "white",
                }}
                align="center"
              >
                Payment Method
              </TableCell>

              <TableCell
                style={{
                  color: "white",
                }}
                align="center"
              >
                Total Price
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                }}
                align="center"
              >
                Client Name
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                }}
                align="center"
              >
                Is Paid
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                }}
                align="center"
              >
                Is Held
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                }}
                align="center"
              >
                Phone Number
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                }}
                align="center"
              >
                Booking Date
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                }}
                align="center"
              >
                Booking time
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                }}
                align="center"
              >
                Mark Done
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow
                key={booking._id}
                onClick={() => handleRowClick(booking)}
              >
                <TableCell>{booking.orderItems[0].title}</TableCell>

                <TableCell align="center">{booking.paymentMethod}</TableCell>
                <TableCell align="center">{booking.totalPrice}</TableCell>
                <TableCell align="center">
                  {booking.shippingAddress.fullName}
                </TableCell>
                {booking.isPaid ? (
                  <TableCell align="center">Yes</TableCell>
                ) : (
                  <TableCell align="center">No</TableCell>
                )}
                {booking.isDelivered ? (
                  <TableCell align="center">Yes</TableCell>
                ) : (
                  <TableCell align="center">No</TableCell>
                )}

                <TableCell align="center">
                  {booking.shippingAddress.postalCode}
                </TableCell>
                <TableCell align="center">{booking.bookingDate}</TableCell>
                <TableCell align="center">{booking.bookingTime}</TableCell>
                <TableCell align="center">
                  {" "}
                  {!booking.isDelivered ? (
                    <Button
                      size="small"
                      onClick={(event) => handleMarkAsDone(event, booking)}
                      style={{
                        backgroundColor: "#f5f5f5",
                        color: "#333",
                        borderRadius: "5px",
                        padding: "5px 10px",
                        boxShadow: "none",
                        transition: "background-color 0.2s ease-in-out",
                      }}
                    >
                      Mark done
                    </Button>
                  ) : (
                    <CheckIcon fontSize="large" color="primary" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default OrderTable;
