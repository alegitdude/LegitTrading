import {
  Toolbar,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardHeader,
  CardContent,
  Box,
  Paper,
} from "@mui/material";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { useTheme } from "@mui/material/styles";

type iArticle = {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
};

interface Props {
  news: iArticle[] | undefined;
  type: string | undefined;
}
const NewsWidget = (props: Props) => {
  const { news, type } = props;
  let display;
  if (type && type === "Market") {
    display = "Market";
  }
  if (type && type != "Market") {
    display = type.toUpperCase();
  }
  const theme = useTheme();

  return (
    <Paper sx={{ backgroundColor: `${theme.palette.background.default}` }}>
      <Grid container height={"100%"}>
        <Toolbar
          sx={{
            minHeight: "2rem",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            backgroundColor: theme.palette.secondary.dark,
          }}
        >
          <Typography variant="h4">{display} News</Typography>
        </Toolbar>
        {!news ? (
          <Box
            sx={{
              minHeight: "300px",
              border: "1px solid black",
              minWidth: "100%",
            }}
          ></Box>
        ) : (
          <Box sx={{ overflow: "hidden", height: "100%" }}>
            {news.map((item) => {
              const date = dayjs(item.datetime).format("h:mm:ss A");
              return (
                <Card
                  raised={true}
                  sx={{
                    width: "100%",
                    mb: "4px",
                    backgroundColor: theme.palette.primary.dark,
                  }}
                  key={nanoid()}
                >
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      sx={{
                        display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CardMedia
                        sx={{
                          width: "150",
                          padding: "16px",
                        }}
                        component="img"
                        height="194"
                        width="200"
                        image={item.image}
                        alt="News Image"
                      />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <CardHeader
                        title={item.headline}
                        subheader={`${date} - ${item.source}`}
                      />
                      <CardContent sx={{ paddingTop: "0" }}>
                        <Typography variant="subtitle1">Summary:</Typography>
                        <Typography variant="body1">
                          {item.summary}...<a href={item.url}>more</a>
                        </Typography>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              );
            })}
          </Box>
        )}
      </Grid>
    </Paper>
  );
};
export default NewsWidget;
