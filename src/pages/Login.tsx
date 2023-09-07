import { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Snackbar,
  Alert,
  Container,
  Typography,
  Box,
  Grid,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Avatar,
} from "@mui/material";
import { useLogin } from "../utils/useLogin";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

function Copyright() {
  // const theme = useTheme();
  return (
    <Typography mt="2rem" variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link style={{ color: "white" }} to={"/"}>
        Legit Trading
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignIn() {
  const [errorOpen, setErrorOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const handleClose = () => {
    setErrorOpen(false);
    setMessage("");
  };

  const theme = useTheme();
  const { login, isLoading } = useLogin();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    if (!email || !password) {
      setMessage("Email & Password Required!");
      setErrorOpen(true);
      return;
    }

    login(
      { email, password },
      {
        onError: (err: Error) => {
          setMessage(err.message);
          setErrorOpen(true);
        },
      }
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main", color: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            disabled={isLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            disabled={isLoading}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                onClick={() => setAlertOpen(true)}
                style={{ color: theme.palette.primary.main }}
                to="/login"
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link style={{ color: theme.palette.primary.main }} to="/signup">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        open={errorOpen}
        onClose={() => handleClose()}
      >
        <Alert severity={"error"}>{message}</Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={4000}
        open={alertOpen}
        onClose={() => handleClose()}
      >
        <Alert severity={"error"}>{"Just make a new account"}</Alert>
      </Snackbar>
    </Container>
  );
}
