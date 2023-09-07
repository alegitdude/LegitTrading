import { createTheme, ThemeOptions } from "@mui/material";

const iPhoneInput = {
  styleOverrides: {
    root: {
      "*": {
        WebkitUserSelect: "text !important",
        MozUserSelect: "text !important",
        MsUserSelect: "text !important",
        UserSelect: "text !important",
      },
    },
  },
};

export const customTheme: ThemeOptions = createTheme({
  components: {
    MuiTextField: iPhoneInput,
    MuiInput: iPhoneInput,
    MuiFilledInput: iPhoneInput,
    MuiOutlinedInput: iPhoneInput,
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#2b8a3e",
      dark: "#0d2913",
      light: "#5d9166",
    },
    secondary: {
      main: "#0a284e",
      dark: "#1f232e",
      light: "#546983",
    },
    background: {
      default: "#0f1012",

      paper: "#474748",
    },
  },
  typography: {
    fontFamily: "Segoe UI",
  },
});
