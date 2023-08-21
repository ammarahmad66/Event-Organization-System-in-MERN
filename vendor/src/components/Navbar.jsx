import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@material-ui/core";
import {
  AddCircleOutline,
  Message,
  ExitToApp,
  ViewList,
} from "@material-ui/icons";

import { useContext } from "react";
import axios from "axios";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Navbar() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const [vendorInfo, setVendorInfo] = useState({});
  const navigate = useNavigate();
  const signoutHandler = () => {
    ctxDispatch({ type: "VENDOR_SIGNOUT" });
    localStorage.removeItem("vendorInfo");
    navigate("/");
  };

  const getVendor = async () => {
    // console.log(state.vendorInfo, "testing");
    const vendorInfo = JSON.parse(localStorage.getItem("vendorInfo")) || null;
    console.log("yooooooooooo");
    if (vendorInfo) {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/vendor/${vendorInfo._id}`
        );
        setVendorInfo(res.data);
        //   console.log(res.data, "data");
      } catch (e) {
        console.log(e);
      }
    } else {
      setVendorInfo(vendorInfo);
    }
  };
  useEffect(() => {
    getVendor();
  }, [localStorage.getItem("vendorInfo")]);

  const getVerifiedHandler = () => {
    navigate("/vendorverification");
  };

  const handleMessageClick = () => {
    navigate("/MessagePlatform");
  };

  const handleAddEventClick = () => {
    navigate("/addEvent");
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  const bookingHandler = () => {
    navigate("/bookings");
  };

  const { userInfo } = state;
  const classes = useStyles();
  return (
    <div className="App">
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              className={classes.title}
              onClick={handleHomeClick}
            >
              Event Organization System
            </Typography>

            {vendorInfo && vendorInfo.status === "accepted" && (
              <>
                <Button
                  color="inherit"
                  endIcon={<ExitToApp />}
                  onClick={() => {
                    navigate("/viewBids");
                  }}
                >
                  View Bids
                </Button>
                <Button
                  color="inherit"
                  endIcon={<ExitToApp />}
                  onClick={bookingHandler}
                >
                  Bookings
                </Button>
                <IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMessageClick}
                >
                  <Message />
                </IconButton>
                <IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="menu"
                >
                  <ViewList />
                </IconButton>
                <IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="menu"
                  onClick={handleAddEventClick}
                >
                  <AddCircleOutline />
                </IconButton>
                <Button
                  color="inherit"
                  endIcon={<ExitToApp />}
                  onClick={signoutHandler}
                >
                  Sign Out
                </Button>
              </>
            )}

            {vendorInfo && vendorInfo.status === "rejected" && (
              <>
                <Button color="inherit" onClick={getVerifiedHandler}>
                  Get Verified
                </Button>
                <Button
                  color="inherit"
                  endIcon={<ExitToApp />}
                  onClick={signoutHandler}
                >
                  Sign Out
                </Button>
              </>
            )}
            {vendorInfo && vendorInfo.status === "pending" && (
              <>
                <Button
                  color="inherit"
                  endIcon={<ExitToApp />}
                  onClick={signoutHandler}
                >
                  Sign Out
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
      </div>
    </div>
  );
}

export default Navbar;
