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
import { useLocation } from "react-router-dom";

const ViewSpecialArrangements = ({ eventId, handleCloseModal }) => {
  const { state } = useLocation();
  const [arrangements, setArrangements] = useState([]);

  useEffect(() => {
    const getSpecialArrangements = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/events/getSpecialArrangements/${state._id}`
      );
      console.log(res.data.arrangements, "These are the arrangements returned");
      setArrangements(res.data.arrangements);
    };
    getSpecialArrangements();
  }, [eventId]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="special arrangements table">
        <TableHead sx={{ bgcolor: "black" }}>
          <TableRow>
            <TableCell sx={{ color: "white" }}>Name</TableCell>
            <TableCell align="right" sx={{ color: "white" }}>
              Quantity
            </TableCell>
            <TableCell align="right" sx={{ color: "white" }}>
              Price
            </TableCell>
            <TableCell align="right" sx={{ color: "white" }}>
              Select Arrangement/Quantity
            </TableCell>
            {arrangements.length > 0 &&
              Object.keys(arrangements[0])
                .slice(3) // skip first 3 columns (name, quantity, price)
                .map((column) => (
                  <TableCell key={column} align="right" sx={{ color: "white" }}>
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
              {arrangement.length === 3 ? (
                <TableCell>-</TableCell>
              ) : (
                Object.keys(arrangement)
                  .slice(3) // skip first 3 columns (name, quantity, price)
                  .map((column) => (
                    <TableCell key={column} align="right">
                      {arrangement[column]}
                    </TableCell>
                  ))
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ViewSpecialArrangements;
