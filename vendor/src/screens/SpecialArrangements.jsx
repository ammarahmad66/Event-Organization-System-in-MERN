import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Grid,
  Slide,
  Grow,
  Container,
  Typography,
  Button,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { purple } from "@mui/material/colors";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomForm = () => {
  const [eventData, setEventData] = useState(
    JSON.parse(localStorage.getItem("eventToView"))
  );
  const [rows, setRows] = useState([]);

  const handleAddRow = () => {
    const newRow = [
      { label: "Name" },
      { label: "Quantity" },
      { label: "Price" },
    ];
    setRows([...rows, newRow]);
  };

  const handleAddColumn = (rowIndex) => {
    setRows(
      rows.map((row, index) => (index === rowIndex ? [...row, ""] : row))
    );
  };

  const handleChange = (rowIndex, colIndex, value) => {
    setRows(
      rows.map((row, rIndex) =>
        rIndex === rowIndex
          ? row.map((col, cIndex) =>
              cIndex === colIndex ? (value ? value : "") : col
            )
          : row
      )
    );
  };

  const ConfirmSpecialArrangments = async () => {
    console.log("Confirm Special Arrangments");
    console.log(rows);
    console.log(eventData._id);
    for (let i in rows) {
      if (typeof i === "object" && i !== null) {
        // code to execute if the condition is false
        alert("Please fill all the fields");
        alert("caught");
        return;
      }
    }
    await axios.put(
      `http://localhost:5000/api/events/addSpecialArrangements/${eventData._id}`,
      {
        arrangements: rows,
      }
    );
  };

  return (
    <>
      <Container maxWidth="md">
        <Typography
          variant={"h4"}
          textAlign={"center"}
          mt={"20px"}
          color={"purple"}
        >
          Select Special Arrangment
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          // justifyContent="center"
          minHeight="100vh"
        >
          <Box mb={2}>
            <Slide in direction="down" timeout={300}>
              <IconButton onClick={handleAddRow} color="primary">
                <AddCircleIcon fontSize="large" />
              </IconButton>
            </Slide>
          </Box>
          <Grid container spacing={2}>
            {rows.map((row, rowIndex) => (
              <Grid item xs={12} key={rowIndex}>
                <Box display="flex" alignItems="center">
                  {row.map((col, colIndex) => (
                    <Box mr={2} key={colIndex}>
                      <Grow in timeout={300}>
                        <TextField
                          label={col.label}
                          variant="outlined"
                          value={col.value}
                          required
                          onChange={(e) =>
                            handleChange(rowIndex, colIndex, e.target.value)
                          }
                        />
                      </Grow>
                    </Box>
                  ))}
                  <Slide in direction="right" timeout={300}>
                    <IconButton
                      onClick={() => handleAddColumn(rowIndex)}
                      color="primary"
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </Slide>
                </Box>
              </Grid>
            ))}
          </Grid>

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: "3rem", padding: "0.5rem" }}
              onClick={ConfirmSpecialArrangments}
            >
              Add special Arrangments
            </Button>
          </div>
        </Box>
      </Container>
    </>
  );
};

export default CustomForm;
