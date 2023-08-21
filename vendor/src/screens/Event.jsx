import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { useNavigate } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { Rating } from "@material-ui/lab";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

const EventContainer = (props) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [canDelete, setCanDelete] = useState(true);
  const eventHandler = () => {
    const eventString = JSON.stringify(props.event);
    localStorage.setItem("eventToView", eventString);
    navigate(`/viewEvent/${props.event._id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate("/editEvent", { state: { event: props.event } });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (props.event.bookings.length > 0) {
      setCanDelete(false);
    }
    setDeleteDialogOpen(true);
    console.log(props.event);
  };

  const handleDeleteDialogClose = (e) => {
    e.stopPropagation();
    console.log(props.event.bookings.length);

    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async (e) => {
    e.stopPropagation();
    const vendorInfo = JSON.parse(localStorage.getItem("vendorInfo"));
    const res = await axios.delete(
      `http://localhost:5000/api/events/${props.event._id}/vendor/${vendorInfo._id}`
    );
    props.fetchData();
    setDeleteDialogOpen(false);
  };

  return (
    <Card className={classes.root} onClick={eventHandler}>
      {console.log(props.event)}
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={10}>
          <CardMedia
            className={classes.media}
            component="img"
            src={props.image}
            title="Arena 56"
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton onClick={handleEdit}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>

      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {props.event.title}
        </Typography>
        <Rating value={props.event.rating} readOnly />
        <Typography variant="body2" color="textSecondary" component="p">
          {props.event.description}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Date: june 6 , 2021
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Opening Time : {props.event.opening}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Closing Time : {props.event.closing}
        </Typography>
        {props.event.suspended ? (
          <Typography variant="body2" color="textSecondary" component="p">
            Bookings Status : Suspended
          </Typography>
        ) : (
          <Typography variant="body2" color="textSecondary" component="p">
            Booking Status : Allowed
          </Typography>
        )}
      </CardContent>

      {/* Delete Dialog */}
      {canDelete ? (
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteDialogClose}
          BackdropProps={{ invisible: true }}
        >
          <DialogTitle>Delete Event</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this event?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteDialogClose}
          BackdropProps={{ invisible: true }}
        >
          {" "}
          <DialogTitle>Unable to Delete</DialogTitle>
          <DialogContent>
            <Typography
              variant="subtitle1"
              style={{ backgroundColor: "#ffe4e4" }}
            >
              Event cannot be deleted as it has bookings
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Card>
  );
};

export default EventContainer;
