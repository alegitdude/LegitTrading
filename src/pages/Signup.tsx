import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Typography,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useTheme } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { useSignup } from "../utils/useSignup";
import { useState } from "react";

function Copyright() {
  return (
    <Typography
      mt={"2rem"}
      variant="body2"
      color="text.secondary"
      align="center"
    >
      {"Copyright © "}
      <Link style={{ color: "white" }} to="/">
        Legit Trading
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Signup() {
  const { signup, isLoading } = useSignup();
  const theme = useTheme();
  const { register, formState, handleSubmit } = useForm<Props>();
  const { errors } = formState;
  const [errorOpen, setErrorOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [accountCreated, setAccountCreated] = useState<boolean>(false);
  const handleClose = () => {
    setErrorOpen(false);
    setSuccessOpen(false);
    setMessage("");
  };

  type Props = {
    email: string;
    password: string;
    apikey: string;
  };
  const onSubmit = ({ email, password, apikey }: Props) => {
    signup(
      { email, password, apikey },
      {
        onError: (err: unknown) => {
          if (err instanceof Error) {
            setMessage(err.message);
            setErrorOpen(true);
          }
        },
        onSuccess: () => {
          setMessage(
            "Account created! Look out for an email confirmation to start using Legit Trading"
          );
          setSuccessOpen(true);
          setAccountCreated(true);
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
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                disabled={isLoading || accountCreated}
                required
                fullWidth
                helperText={
                  errors?.email?.message ? "Please provide a valid email" : null
                }
                error={!!errors?.email?.message}
                id="email"
                label="Email Address"
                autoComplete="email"
                // disabled={isLoading}
                {...register("email", {
                  required: "This field is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Please provide a valid email address",
                  },
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                disabled={isLoading || accountCreated}
                fullWidth
                helperText={
                  errors?.password?.message
                    ? "Password must have at least 8 characters"
                    : null
                }
                id="password"
                error={!!errors?.password?.message}
                label="Password"
                autoComplete="new-password"
                {...register("password", {
                  required: "This field is required",
                  minLength: {
                    value: 8,
                    message: "Password needs a minimum of 8 characters",
                  },
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled={isLoading || accountCreated}
                required
                fullWidth
                label="Finnhub API Key"
                type="text"
                id="apikey"
                error={!!errors?.apikey?.message}
                helperText={
                  errors?.apikey?.message
                    ? "A valid api key wil be longer than that..."
                    : null
                }
                autoComplete="apikey"
                {...register("apikey", {
                  required: "This field is required",
                  minLength: {
                    value: 18,
                    message: "A valid  api key wil be longer than that...",
                  },
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={isLoading || accountCreated}
                    value="allowExtraEmails"
                    color="primary"
                  />
                }
                label="I want to receive viruses via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            disabled={isLoading || accountCreated}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="center">
            <Grid sx={{ mb: "1rem" }} item>
              <Link style={{ color: theme.palette.primary.main }} to="/login">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Grid item>
              <Link
                style={{ color: theme.palette.primary.main }}
                to="https://finnhub.io/register"
                target="_blank"
              >
                Don't have an API key? Get one free
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
        autoHideDuration={3000}
        open={successOpen}
        onClose={() => handleClose()}
      >
        <Alert severity={"success"}>{message}</Alert>
      </Snackbar>
    </Container>
  );
}
