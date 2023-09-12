import {
  Box,
  Toolbar,
  Typography,
  Button,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import supabase from "../utils/supabase";
import { addTicker } from "../Features/Watchlist/watchlistSlice";
import WatchListWidget from "../Components/WatchListWidget";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { RootState } from "../store";
import useUser from "../utils/useUser";
import TickerSearch from "../Components/TickerSearch";

const WatchList = () => {
  const [ticker, setTicker] = useState<string>("aapl");
  const [open, setOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const theme = useTheme();
  const { listItems } = useSelector((store: RootState) => store.watchlist);
  const dispatch = useDispatch();
  const { user } = useUser();

  const handleClick = () => {
    let symbol;
    symbol = ticker;
    if (ticker.indexOf(":") !== -1) {
      symbol = ticker.substring(0, ticker.indexOf(":"));
    }
    const contains = listItems?.includes(`${symbol.toLowerCase().trim()}`);

    if (contains) {
      setOpen(true);
      setErrorMessage("Symbol already in watchlist!");
      return;
    }
    if (symbol.length == 0) {
      setOpen(true);
      setErrorMessage("No ticker!");
      return;
    }
    dispatch(addTicker(symbol.toLowerCase().trim()));
    handleSave(symbol);
  };

  const handleSave = async (symbol: string) => {
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({ watchlist: [...listItems, symbol] })
        .eq("id", user.id)
        .select();
      if (error) {
        setErrorMessage(error.message);
        setOpen(true);
        return;
      }
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "2rem",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          backgroundColor: theme.palette.secondary.dark,
        }}
      >
        <Typography variant="h4">Watchlist</Typography>
      </Toolbar>

      {listItems != null
        ? listItems.map((mappedSymbol: string) => {
            return <WatchListWidget key={mappedSymbol} ticker={mappedSymbol} />;
          })
        : null}

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          width: "100%",
          height: "120px",
          marginTop: "2rem",
          marginBottom: "3rem",
          backgroundColor: theme.palette.background.default,
        }}
        onKeyDown={(e) => {
          if (e.code == "Enter") {
            handleClick();
          } else return;
        }}
      >
        <Paper sx={{ width: { sm: "200px", xs: "100px" } }}>
          <TickerSearch setTicker={setTicker} initialTicker="ticker" />
        </Paper>
        <Button
          sx={{
            height: "60px",
            backgroundColor: theme.palette.background.paper,
            width: "80px",
            borderRadius: "5rem",
            ml: "1rem",
          }}
          onClick={handleClick}
        >
          <AddIcon sx={{ fontSize: "3rem" }} />
        </Button>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={3000}
          open={open}
          onClose={() => handleClose()}
        >
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};
export default WatchList;
