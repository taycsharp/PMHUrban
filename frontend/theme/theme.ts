"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#0f4f3f", dark: "#0a352b", light: "#dbe9e4" },
    secondary: { main: "#b88936", dark: "#7b5a23", light: "#f4e3c2" },
    background: { default: "#f6f7f5", paper: "#ffffff" },
    text: { primary: "#17211d", secondary: "#5f6b65" },
    divider: "#d9ded9"
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
    h1: { fontWeight: 700, letterSpacing: 0 },
    h2: { fontWeight: 700, letterSpacing: 0 },
    h3: { fontWeight: 700, letterSpacing: 0 },
    h4: { fontWeight: 700, letterSpacing: 0 },
    h5: { fontWeight: 700, letterSpacing: 0 },
    h6: { fontWeight: 700, letterSpacing: 0 },
    button: { textTransform: "none", fontWeight: 700 }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 8, boxShadow: "0 1px 2px rgba(15,79,63,.08)" }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, color: "#17211d", background: "#f2f5f2" }
      }
    }
  }
});

