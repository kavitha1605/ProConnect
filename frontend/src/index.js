import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ClerkProvider publishableKey="pk_test_ZmluZXItc3RvcmstNDIuY2xlcmsuYWNjb3VudHMuZGV2JA">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);
