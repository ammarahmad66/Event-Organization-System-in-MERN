import React, { useContext, useState } from "react";
import { TextField, Button, Grid, Container, Typography } from "@mui/material";
import TimePicker from "react-time-picker";
import { Store } from "../Store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Map from "../components/Maps";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const AddVenueForm = () => {
  const [name, setName] = useState("");
  const [slugs, setSlugs] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [opening, setOpening] = useState("");
  const [closing, setClosing] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { vendorInfo } = state;

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const vendorId = vendorInfo._id;
    // Create FormData to send the image file
    const formData = new FormData();
    formData.append("name", name);
    formData.append("slugs", slugs);
    formData.append("category", category);
    formData.append("image", image);
    formData.append("price", price);
    formData.append("vendorId", vendorId);
    formData.append("capacity", capacity);
    formData.append("rating", 0);
    formData.append("numberOfReviews", 0);
    formData.append("description", description);
    formData.append("opening", opening);
    formData.append("closing", closing);
    formData.append("location", JSON.stringify(location));
    formData.append("longitude", location.lng);
    formData.append("latitude", location.lat);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/events/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Event added successfully");
      setShowMap(false);
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };

  // Working for Google maps
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState(null);
  const [confirmLocation, setConfirmLocation] = useState(false);
  const handleShowMap = () => {
    setShowMap(!showMap);
    if (!showMap) {
      setLocation(null);
    }
  };

  const handleConfirmLocation = () => {
    setShowMap(false);
    setConfirmLocation(true);
  };

  return (
    // ...
    <>
      {showMap && (
        <Map
          location={location}
          setLocation={setLocation}
          handleConfirmLocation={handleConfirmLocation}
        />
      )}
      {console.log(location)}{" "}
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          Add Event
        </Typography>
        <Container
          maxWidth="sm"
          sx={{ border: 1, borderColor: "grey.300", p: 2, borderRadius: 1 }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Slugs"
                  value={slugs}
                  onChange={(event) => setSlugs(event.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <label htmlFor="image-upload" style={{ marginBottom: "8px" }}>
                  Image Upload
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImage(event.target.files[0])}
                  fullWidth
                  margin="normal"
                  required
                />

                <Grid item xs={6} sx={{ margin: "0.5rem" }}>
                  <div>
                    <button onClick={handleShowMap}>Toggle Map</button>
                    {location && <h4> Location Is Set </h4>}
                  </div>
                  <div style={{ marginBottom: "6px" }}>Opening Time</div>
                  <TimePicker
                    label="Opening Time"
                    value={opening}
                    onChange={(newValue) => {
                      setOpening(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        required
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  multiline
                  rows={4.5}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Price"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  fullWidth
                  margin="normal"
                  type="number"
                  required
                />
                <TextField
                  label="Event Duration in Minutes"
                  value={capacity}
                  onChange={(event) => setCapacity(event.target.value)}
                  fullWidth
                  margin="normal"
                  type="number"
                  required
                />

                <Grid item xs={6} sx={{ margin: "0.5rem" }}>
                  <div style={{ marginBottom: "6px" }}>Closing Time</div>
                  <TimePicker
                    label="Closing Time"
                    value={closing}
                    onChange={(newValue) => {
                      setClosing(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        required
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container justifyContent="center">
                  <Button
                    disabled={
                      !(
                        name &&
                        slugs &&
                        category &&
                        image &&
                        description &&
                        opening &&
                        closing &&
                        price &&
                        capacity &&
                        location
                      )
                    }
                    variant="contained"
                    type="submit"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Container>
    </>
  );
  // ...
};

export default AddVenueForm;
