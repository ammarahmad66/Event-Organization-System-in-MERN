import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

const SpecialArrangements = ({ eventId, handleCloseModal }) => {
  //const [totalPrice, setTotalPrice] = useState(0);
  const [arrangements, setArrangements] = useState([]);
  const [selectedArrangements, setSelectedArrangements] = useState({});
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const getSpecialArrangements = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/events/getSpecialArrangements/${eventId}`
      );
      console.log(res.data.arrangements, "These are the arrangements returned");
      setArrangements(res.data.arrangements);
    };
    getSpecialArrangements();
  }, [eventId]);

  const handleCheckboxChange = (event, arrangementId) => {
    setSelectedArrangements({
      ...selectedArrangements,
      [arrangementId]: event.target.checked,
    });
  };

  const handleQuantityChange = (event, arrangementId) => {
    setQuantities({
      ...quantities,
      [arrangementId]: event.target.value,
    });
  };

  const handleAddToCart = async () => {
    const itemsToAddWithQuantity = arrangements.map((arrangement, index) => ({
      ...arrangement,
      quantity: quantities[index] || 0,
    }));
    // console.log(itemsToAddWithQuantity, "items to add");

    // send data to server to add to cart or do other processing

    let totalPrice = 0;
    for (let i in itemsToAddWithQuantity) {
      totalPrice =
        totalPrice +
        parseInt(itemsToAddWithQuantity[i][2]) *
          parseInt(itemsToAddWithQuantity[i].quantity);
    }
    console.log(totalPrice);
    console.log(itemsToAddWithQuantity);
    localStorage.setItem("arrangementsPrice", totalPrice);
    localStorage.setItem(
      "itemsToAddWithQuantity",
      JSON.stringify(itemsToAddWithQuantity)
    );
    handleCloseModal();
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="special arrangements table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Select Arrangement/Quantity</TableCell>
            {arrangements.length > 0 &&
              Object.keys(arrangements[0])
                .slice(3) // skip first 3 columns (name, quantity, price)
                .map((column) => (
                  <TableCell key={column} align="right">
                    Additional Detail
                  </TableCell>
                ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {arrangements.map((arrangement, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {arrangement[0]}
              </TableCell>
              <TableCell component="th" scope="row">
                {arrangement[1]}
              </TableCell>
              <TableCell component="th" scope="row">
                {arrangement[2]}
              </TableCell>

              <TableCell align="right">
                <Checkbox
                  checked={selectedArrangements[index] || false}
                  onChange={(event) => handleCheckboxChange(event, index)}
                />
                <TextField
                  label="Quantity"
                  type="number"
                  size="small"
                  defaultValue="1"
                  value={quantities[index] || ""}
                  onChange={(event) => handleQuantityChange(event, index)}
                  disabled={!selectedArrangements[index]}
                />
              </TableCell>
              {Object.keys(arrangement)
                .slice(3) // skip first 3 columns (name, quantity, price)
                .map((column) => (
                  <TableCell key={column} align="right">
                    {arrangement[column]}
                  </TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div style={{ textAlign: "center", margin: "1rem" }}>
        <Button variant="contained" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </div>
    </TableContainer>
  );
};

export default SpecialArrangements;
