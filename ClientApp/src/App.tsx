import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import { GameBoard } from "./components/GameBoard/GameBoard";
import "./styles/global.scss";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GameBoard />
    </ThemeProvider>
  );
}

export default App;
