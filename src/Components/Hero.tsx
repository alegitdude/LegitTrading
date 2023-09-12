import { Button, Typography, Box } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";
import Container from "@mui/material/Container";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/signup");
  };
  return (
    <Box
      mb="12rem"
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url("/Hero-candlestick-background.jpg")`,
        // backgroundPosition: "left",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        xl={12}
        height="100%"
        width="100%"
        sx={{
          //   backdropFilter: "blur(3px)",
          backgroundImage: `linear-gradient(to right, rgb(18,18,18,.8), rgb(18,18,18,.8)) `,
          backgroundSize: "100% 100%",
        }}
      >
        <Container sx={{ textAlign: "center" }}>
          <Typography marginBottom={"1rem"} variant="h2">
            Premium Market Analytics
          </Typography>
          <Typography marginBottom={"1rem"} variant="h6">
            Giving you the tools to make smart decisions in all things trading
          </Typography>

          <Typography>
            Try it out for free!
            <Button
              onClick={handleClick}
              sx={{
                border: "2px solid",
                marginLeft: "1rem",
                boxShadow: "0px 0px 100px 7px rgba(43,138,62,0.83)",
              }}
            >
              Get Started
            </Button>
          </Typography>
        </Container>
      </Grid>
    </Box>
  );
};
export default Hero;
