import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { StoreProvider } from "./Store";
import { BrowserRouter } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <LoadScript googleMapsApiKey="AIzaSyCalQJiurg9JMSct3LPGrIxFiAA_hpjQ3I">
          <App />
        </LoadScript>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
