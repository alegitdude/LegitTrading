import { Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
const GetStarted = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/signup");
  };
  return (
    <Container sx={{ textAlign: "center", mb: "12rem" }}>
      <Typography variant="h5">
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
  );
};
export default GetStarted;
