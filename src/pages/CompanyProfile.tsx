import { Box, Toolbar, Grid, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  NewsWidget,
  ProfileChart,
  ProfileWidget,
  EarningsChart,
  TickerSearch,
} from "../Components";
import { useState, useEffect } from "react";
import {
  fetchCompanyNews,
  fetchEarnings,
  fetchCompProfile,
} from "../utils/fetchFinnData";
import { useDispatch, useSelector } from "react-redux";
import { addTicker } from "../Features/Profile/profileSlice";
import { RootState } from "../store";

interface iEarning {
  actual: number;
  estimate: number;
  period: string;
  quarter: number;
  surprise: number;
  surprisePercent: number;
  symbol: string;
  year: number;
}

type Earnings = iEarning[];

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
type iMetric = [string, number | string];
type Metrics = iMetric[];
type Articles = iArticle[];
const CompanyProfile = () => {
  const { apiKey } = useSelector((store: RootState) => store.watchlist);
  const theme = useTheme();
  const [ticker, setTicker] = useState<string>("spy");
  const [news, setNews] = useState<Articles>();
  const [earnings, setEarnings] = useState<Earnings>();
  const [newProfile, setNewProfile] = useState<Metrics>([["", ""]]);
  const dispatch = useDispatch();
  const profile = useSelector((store: RootState) => store.profile);

  useEffect(() => {
    setNewProfile(profile.compProfile);
    setTicker(profile.ticker);
    setEarnings(profile.earningsData);
    setNews(profile.news);
  }, [profile]);

  const handleFetch = async () => {
    if (!ticker) {
      return;
    }
    let symbol;
    symbol = ticker;
    if (ticker.indexOf(":") !== -1) {
      symbol = ticker.substring(0, ticker.indexOf(":"));
    }
    const newEarnings: Earnings = await fetchEarnings(symbol, apiKey);
    const newNews = await fetchCompanyNews(symbol, apiKey);
    const compProfile: Metrics = await fetchCompProfile(symbol, apiKey);

    dispatch(addTicker(symbol, compProfile, newEarnings, newNews));
  };

  return (
    <Box>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "center",
          border: `1px solid ${theme.palette.secondary.dark}`,
        }}
      >
        <TickerSearch initialTicker={ticker} setTicker={setTicker} />
        <Button
          sx={{
            fontSize: "1rem",
            textTransform: "none",
            height: "38px",
            backgroundColor: theme.palette.background.default,
            minWidth: "48px",
            marginLeft: "1rem",
            border: `1px solid ${theme.palette.primary.main}`,
          }}
          onClick={handleFetch}
        >
          Fetch!
        </Button>
      </Toolbar>
      <Grid container sx={{ height: "300px" }}>
        <Grid item xs={6} sx={{ border: "1px solid black" }}>
          <ProfileChart ticker={ticker} chartNum={1} />
        </Grid>
        <Grid item xs={6} sx={{ border: "1px solid black" }}>
          <ProfileChart ticker={ticker} chartNum={2} />
        </Grid>
      </Grid>
      <ProfileWidget profile={newProfile} />
      <EarningsChart earnings={earnings} />
      <NewsWidget news={news} type={ticker} />
    </Box>
  );
};
export default CompanyProfile;
