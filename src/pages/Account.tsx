import {
  Container,
  Paper,
  Grid,
  Typography,
  Chip,
  TextField,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import supabase from "../utils/supabase";
import { useTheme } from "@mui/material/styles";
import { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { deleteTicker } from "../Features/Watchlist/watchlistSlice";
import { nanoid } from "nanoid";
import { useState } from "react";
import useUser from "../utils/useUser";
import { useGetProfile } from "../utils/useGetProfile";

const Account = () => {
  const { user } = useUser();
  const { getProfile } = useGetProfile();
  const [errorOpen, setErrorOpen] = useState<boolean>();
  const [message, setMessage] = useState<string>();
  const [successOpen, setSuccessOpen] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>();
  const { listItems, apiKey } = useSelector(
    (store: RootState) => store.watchlist
  );
  const { marketChart1, marketChart2, marketChart3, marketChart4 } =
    useSelector((store: RootState) => store.charts);
  const theme = useTheme();
  const dispatch = useDispatch();
  const handleDelete = (item: string) => {
    dispatch(deleteTicker(item));
  };

  const handleClose = () => {
    setErrorOpen(false);
    setSuccessOpen(false);
    setMessage("");
  };

  const handleSave = async () => {
    setIsLoading(true);
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({ watchlist: listItems })
        .eq("id", user.id)
        .select();
      if (error) {
        setMessage(error.message);
        return;
      }
      getProfile();
    }

    setIsLoading(false);
    setMessage("Profile Saved!");
    setSuccessOpen(true);
  };
  return (
    <Container sx={{ height: "100%", fontSize: "1rem" }}>
      <Paper
        sx={{
          mt: "20px",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Grid container padding={"2rem"} spacing={"2rem"}>
          <Grid item display={"flex"} sx={{ mb: "2rem" }}>
            <Typography variant="h4">API Key:</Typography>
            <TextField
              sx={{ ml: "1rem" }}
              id="outlined-basic"
              label="Key"
              variant="outlined"
              value={apiKey}
            />
          </Grid>

          <Grid
            item
            sx={{
              display: "flex",
              height: "5rem",
              alignItems: "center",
              width: "100%",
              mb: "2rem",
            }}
          >
            <Typography variant="h4">Market Overview Charts: </Typography>

            <Grid ml={"1rem"} display={"flex"} flexWrap={"wrap"}>
              <Typography
                variant="h6"
                sx={{ mr: "1rem" }}
                display={"inline-block"}
              >
                {marketChart1.symbol.toUpperCase()}
              </Typography>
              <Typography
                variant="h6"
                sx={{ mr: "1rem" }}
                display={"inline-block"}
              >
                {marketChart2.symbol.toUpperCase()}
              </Typography>
              <Typography
                variant="h6"
                sx={{ mr: "1rem" }}
                display={"inline-block"}
              >
                {marketChart3.symbol.toUpperCase()}
              </Typography>
              <Typography
                variant="h6"
                sx={{ mr: "1rem" }}
                display={"inline-block"}
              >
                {marketChart4.symbol.toUpperCase()}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            sx={{
              display: "flex",
              height: "5rem",
              alignItems: "center",
              width: "100%",
              mb: "2rem",
            }}
          >
            <Typography variant="h4" sx={{ lineHeight: "20" }}>
              Watchlist:
            </Typography>
            <Paper
              sx={{
                marginLeft: "1rem",
                width: "100%",

                padding: "8px",
              }}
            >
              <Grid>
                {listItems.map((item: string) => {
                  return (
                    <Chip
                      sx={{ mr: "4px", mb: "6px" }}
                      key={nanoid()}
                      label={item}
                      onDelete={() => handleDelete(item)}
                    />
                  );
                })}
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Button disabled={isLoading} onClick={handleSave}>
              Save watchlist and charts to profile
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={4000}
        open={errorOpen}
        onClose={() => handleClose()}
      >
        <Alert severity={"error"}>{message}</Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={4000}
        open={successOpen}
        onClose={() => handleClose()}
      >
        <Alert severity={"success"}>{message}</Alert>
      </Snackbar>
    </Container>
  );
};
export default Account;
