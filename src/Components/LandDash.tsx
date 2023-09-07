import { Container, Grid, Typography } from "@mui/material";

const LandDash = () => {
  return (
    <Container
      id="Dashboard"
      sx={{ marginBottom: "12rem", minHeight: "30rem" }}
    >
      <Grid
        spacing={4}
        container
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item textAlign="center" mb={"2rem"} lg={4} xs={12}>
          <Typography mb="2rem" variant="h2">
            Legit Dashboard
          </Typography>
          <Typography variant="h5">
            The ultimate visualization dashboard for trading analysis. Customize
            your charts, your watch-list, and your products
          </Typography>
        </Grid>
        <Grid item lg={8} xs={12}>
          <Container>
            <img src="./Dashboard.jpg" style={{ width: "100%" }} />
          </Container>
        </Grid>
      </Grid>
    </Container>
  );
};
export default LandDash;
