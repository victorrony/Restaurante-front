import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import App from "./App";
import { store } from "./store/store";

const theme = createTheme({
   palette: {
      primary: {
         main: "#f97316",
         light: "#ffedd5",
         dark: "#c2410c",
      },
      secondary: {
         main: "#64748b",
         light: "#f1f5f9",
         dark: "#334155",
      },
      success: {
         main: "#10b981",
      },
      warning: {
         main: "#f59e0b",
      },
      error: {
         main: "#ef4444",
      },
   },
   typography: {
      fontFamily: [
         "-apple-system",
         "BlinkMacSystemFont",
         '"Segoe UI"',
         "Roboto",
         '"Helvetica Neue"',
         "Arial",
         "sans-serif",
      ].join(","),
   },
   components: {
      MuiButton: {
         styleOverrides: {
            root: {
               textTransform: "none",
               borderRadius: "8px",
            },
         },
      },
      MuiCard: {
         styleOverrides: {
            root: {
               borderRadius: "12px",
               boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            },
         },
      },
   },
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
   <React.StrictMode>
      <Provider store={store}>
         <BrowserRouter>
            <ThemeProvider theme={theme}>
               <CssBaseline />
               <App />
            </ThemeProvider>
         </BrowserRouter>
      </Provider>
   </React.StrictMode>
);
