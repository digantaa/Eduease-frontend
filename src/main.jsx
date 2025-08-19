import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ReactDOM from "react-dom/client";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "bootswatch/dist/lux/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
   <BrowserRouter>
      <App />
   </BrowserRouter>
);
