import { createTheme } from "@mui/material";
import { ptBR } from "@mui/material/locale";
import darkScrollbar from "@mui/material/darkScrollbar";
import LightScrollbar from "./elements/LightScrollbar";

let theme = createTheme(
  {
    palette: {
      mode: "light",
      primary: {
        main: "#9AC0D8",
        light: "#16679A",
        // medium: "#EAF6FF",
        // font: "#8AB3CC",
      },
      secondary: {
        main: "#337EAD",
        light: "#F5FBFF",
        // medium: "#0899BA",
      },
    },
    shadows: [
      "none",
      "0px 0px 0px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
      "0px 2px 10px rgba(133, 157, 177,0.2);",
    ],
    typography: {
      fontFamily: ["Montserrat", "sans-serif"].join(","),
    },
  },
  ptBR
);
theme = createTheme(theme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body:
          theme.palette.mode === "dark" ? darkScrollbar() : LightScrollbar(),
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          maxHeight: "205px",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.primary.dark,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: theme.palette.primary.main,
          "&:hover": {
            borderColor: theme.palette.primary.main,
          },
        },
        input: {
          color: theme.palette.secondary.dark,
          "&::placeholder": {
            color: theme.palette.secondary.dark,
          },
        },
      },
    },
    MuiCalendarPicker: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.secondary.light,
          borderRadius: "20px",
          color: theme.palette.secondary.main,
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: theme.palette.primary.light,
          fontWeight: "medium",
          "&.Mui-disabled": {
            color: "#9AC0D8",
            backgroundColor: "rgba(216, 0, 0, 0.1)",
          },
          "&.Mui-selected": {
            color: "white",
            backgroundColor: theme.palette.primary.light,
          },
          "&.MuiPickersDay-today": {
            borderColor: theme.palette.secondary.main,
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {},
      },
    },
  },
});

export { theme };
