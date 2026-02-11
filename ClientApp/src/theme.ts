import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1a1a1a",
    },
    secondary: {
      main: "#ffd700",
    },
    background: {
      default: "#0d5d0d",
      paper: "rgba(0, 0, 0, 0.3)",
    },
    warning: {
      main: "#f0ad4e",
    },
    success: {
      main: "#5cb85c",
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "12px 30px",
          fontSize: "18px",
          fontWeight: "bold",
          borderRadius: "6px",
          transition: "transform 0.1s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          },
        },
      },
    },
  },
});
