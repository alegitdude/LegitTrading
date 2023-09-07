import {
  Paper,
  CardContent,
  CardHeader,
  Typography,
  ListItem,
  Divider,
  List,
  CardMedia,
  Container,
} from "@mui/material";

type Props = {
  title: string;
  image: string;
  line1: string;
  icon1: JSX.Element;
  line2: string;
  icon2: JSX.Element;
  line3: string;
  icon3: JSX.Element;
};
const FeaturesCard = ({
  title,
  image,
  line1,
  icon1,
  line2,
  icon2,
  line3,
  icon3,
}: Props) => {
  return (
    <Paper
      elevation={6}
      sx={{
        height: "40rem",
        padding: "2rem",
        background:
          "linear-gradient(to bottom, #2b8a3e, #001510, #2b8a3e, #001510)",
      }}
    >
      <CardHeader
        title={title}
        sx={{ padding: "10px", marginBottom: "1rem" }}
      />
      <CardMedia component="div" image={image} sx={{ height: "12rem" }} />
      <CardContent>
        <List>
          <ListItem>
            <Container
              sx={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography mr="1rem" variant="h5">
                {line1}
              </Typography>
              {icon1}
            </Container>
          </ListItem>
          <Divider />
          <ListItem>
            <Container
              sx={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography mr="1rem" variant="h5">
                {line2}
              </Typography>
              {icon2}
            </Container>
          </ListItem>
          <Divider />
          <ListItem>
            <Container
              sx={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography mr="1rem" variant="h5">
                {line3}
              </Typography>
              {icon3}
            </Container>
          </ListItem>
        </List>
      </CardContent>
    </Paper>
  );
};
export default FeaturesCard;
