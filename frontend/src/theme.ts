import { createTheme } from "@mui/material/styles";

const primary = "#6c42ff";
const primaryDark = "#3a1ebf";
const accent = "#ff9bd0";

const theme = createTheme({
  palette: {
    primary: { main: primary, dark: primaryDark },
    secondary: { main: accent },
  },
  typography: { fontFamily: '"Inter", "Noto Sans Myanmar", "Noto Sans JP", "Noto Sans SC", sans-serif' },
  shape: { borderRadius: 14 },
});

export default theme;
