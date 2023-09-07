import {
  Container,
  Typography,
  Paper,
  CardHeader,
  CardContent,
  Rating,
  Avatar,
  Grid,
} from "@mui/material";

import Carousel from "react-material-ui-carousel";

import { useTheme } from "@mui/material/styles";

type iReviews = Review[];
const reviews: iReviews = [
  {
    name: "Warren Buffet",
    avatar: "./Avatar3.jpg",
    rating: 5,
    testimonial: "Legit Trading changed my life forever",
  },
  {
    name: "Ray Dalio",
    avatar: "./Avatar-1-Edit.jpg",
    rating: 5,
    testimonial: "I didn't know what trading was until Legit Trading",
  },
  {
    name: "Bill Ackman",
    avatar: "./Avatar-2-Edit.jpg",
    rating: 5,
    testimonial:
      "If you're trading without Legit Trading, you should probably just give up",
  },
];
type Review = {
  name: string;
  avatar: string;
  rating: number;
  testimonial: string;
};

const Testimonials = () => {
  const theme = useTheme();
  return (
    <Container
      id="Testimonials"
      maxWidth="sm"
      component="main"
      sx={{ pt: 8, pb: 6, mb: "12rem", textAlign: "center" }}
    >
      <Typography variant="h2" mb={"2rem"}>
        Testimonials
      </Typography>
      <Carousel
        stopAutoPlayOnHover={false}
        navButtonsAlwaysVisible={true}
        autoPlay={false}
        fullHeightHover={false}
        sx={{ width: "100%" }}
        animation="slide"
        duration={500}
      >
        {reviews.map((review, i) => (
          <Paper
            key={i}
            sx={{
              textAlign: "center",
              backgroundColor: theme.palette.secondary.dark,
              height: "320px",
            }}
            variant="outlined"
          >
            <Grid
              container
              flexDirection="column"
              alignItems="center"
              padding="2rem"
            >
              <Avatar
                src={review.avatar}
                sx={{ height: "5rem", width: "5rem" }}
              />
              <CardHeader title={review.name} />

              <Typography>
                <Rating name="read-only" value={review.rating} readOnly />
              </Typography>

              <CardContent>
                <Typography>"{review.testimonial}"</Typography>
              </CardContent>
            </Grid>
          </Paper>
        ))}
      </Carousel>
    </Container>
  );
};
export default Testimonials;
