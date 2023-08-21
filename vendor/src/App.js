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

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
} from "react-router-dom";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import { useContext } from "react";
import Home from "./screens/Home";
import AddEvent from "./screens/AddEvent";
import MessagePlatform from "./screens/MessagePlatform";
import { Store } from "./Store";
import { useNavigate } from "react-router-dom";
import SpecialArrangements from "./screens/SpecialArrangements";
import Bookings from "./screens/Bookings";
import ViewEvent from "./screens/ViewEvent";
import BookingDetail from "./screens/BookingDetails";
import VendorVerification from "./screens/VendorVerification";
import Navbar from "./components/Navbar";
import ViewBids from "./screens/ViewBids";
import EditEvent from "./screens/EditEvent";
import ViewSpecialArrangements from "./screens/ViewSpecialArrangements";
function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/addEvent" element={<AddEvent />} />
        <Route path="/bookingDetail" element={<BookingDetail />} />
        <Route
          path="/specialArrangements/:id"
          element={<SpecialArrangements />}
        />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/MessagePlatform" element={<MessagePlatform />} />
        <Route path="/viewEvent/:eventId" element={<ViewEvent />} />
        <Route path="/vendorverification" element={<VendorVerification />} />
        <Route path="/viewBids" element={<ViewBids />} />
        <Route path="/editEvent" element={<EditEvent />} />
        <Route
          path="viewArrangements/:id"
          element={<ViewSpecialArrangements />}
        />
      </Routes>
    </div>
  );
}

export default App;
