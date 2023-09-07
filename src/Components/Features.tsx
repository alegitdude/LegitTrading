import { Container, Grid, Typography } from "@mui/material";
import { FeaturesCard } from "./index";
import {
  CurrencyBitcoin,
  RequestQuote,
  Language,
  AccessTime,
  SsidChart,
  QueryStats,
  Newspaper,
  ScatterPlot,
  Assessment,
} from "@mui/icons-material";

const Features = () => {
  return (
    <Container
      id="Features"
      sx={{
        textAlign: "center",
        marginBottom: "12rem",
      }}
    >
      <Typography mb="2rem" variant="h2">
        Features
      </Typography>
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: "2rem", padding: "2rem" }}
      >
        <Grid item md={4} sm={6} xs={12}>
          <FeaturesCard
            title="Total Market View"
            image="./TotalMarket.jpg"
            line1="Stocks"
            icon1={<RequestQuote sx={{ fontSize: "3rem" }} />}
            line2="Indices"
            icon2={<Language sx={{ fontSize: "3rem" }} />}
            line3="Crypto"
            icon3={<CurrencyBitcoin sx={{ fontSize: "3rem" }} />}
          />
        </Grid>

        <Grid item md={4} sm={6} xs={12}>
          <FeaturesCard
            title="Maximum Charting"
            image="./CandlestickImage.jpg"
            line1="Time Frames"
            icon1={<AccessTime sx={{ fontSize: "3rem" }} />}
            line2="Indicators"
            icon2={<QueryStats sx={{ fontSize: "3rem" }} />}
            line3="Comparison Charts"
            icon3={<SsidChart sx={{ fontSize: "3rem" }} />}
          />
        </Grid>

        <Grid item md={4} xs={12} sm={8}>
          <FeaturesCard
            title="In-Depth Analysis"
            image="./FinancialStatement.jpg"
            line1="Financial Reports"
            icon1={<Assessment sx={{ fontSize: "3rem" }} />}
            line2="Earnings"
            icon2={<ScatterPlot sx={{ fontSize: "3rem" }} />}
            line3="News"
            icon3={<Newspaper sx={{ fontSize: "3rem" }} />}
          />
        </Grid>
      </Grid>
    </Container>
  );
};
export default Features;
