import React from "react";
import { createRoot } from "react-dom/client";

import { ThemeOptions } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import BaseTheme from "./material.theme.json";

import App from "./App/App";

const Theme = createTheme(BaseTheme as ThemeOptions);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={Theme}>
    <App />
  </ThemeProvider>
);
