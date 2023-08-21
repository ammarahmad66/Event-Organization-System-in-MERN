import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Bid from "../components/Bid";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
}));

const ViewBids = () => {
  const classes = useStyles();
  const [bids, setBids] = useState([]);
  const [selectedBid, setSelectedBid] = useState();

  const fetchData = async () => {
    const vendorInfo = JSON.parse(localStorage.getItem("vendorInfo"));
    const response = await axios.get(
      `http://localhost:5000/api/bid/vendor/${vendorInfo._id}`
    );
    // console.log(response.data, "data", vendorInfo._id);
    console.log(response.data);
    setBids(response.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // if (bids) {
    //   socket.emit("bidUpdate", props.bid._id);
    // }
    if (bids.length === 0) {
      console.log("correct");
    } else {
      socket.emit("bidUpdate", bids);
    }

    socket.on("updateBid", (updatedBid) => {
      // Update the local state with the updated bid information
      console.log("socket is working", updatedBid);
      fetchData();
    });

    // Clean up the event listener when the component is unmounted
    return () => {
      socket.off("updateBid");
    };
  }, []);

  const handlePersonSelect = (bid) => {
    //  console.log(bid);
    setSelectedBid(bid);
  };

  // Add a key variable that changes whenever selectedBid changes
  const key = selectedBid ? selectedBid._id : "none";

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Typography variant="h5">Bids List</Typography>

          <List>
            {bids.map((bid) => (
              <ListItem key={bid._id} onClick={() => handlePersonSelect(bid)}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>B</Avatar>
                </ListItemAvatar>
                <ListItemText primary={`Client: ${bid.user_id.name}`} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={9}>
          {/* Add a key prop to force re-render */}
          {selectedBid && (
            <Bid bid={selectedBid} fetchData={fetchData} key={key} />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewBids;
