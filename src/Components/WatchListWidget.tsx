import { Typography, Paper, Avatar, Grid, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { deleteTicker } from "../Features/Watchlist/watchlistSlice";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { WatchListChart } from ".";
import { useEffect, useState } from "react";
import {
  fetchCompProf2,
  fetchCandles,
  fetchQuote,
} from "../utils/fetchFinnData";
import dayjs from "dayjs";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { RootState } from "../store";
import { getUserProfile } from "../utils/apiAuth";
type Props = {
  ticker: string;
};
type Candle = {
  close: number;
  high: number;
  low: number;
  open: number;
  time: Date;
  volumeDate: number;
};

type Candles = Candle[];
interface iQuote {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  time: number;
}
interface iProfile {
  country: string;
  currency: string;
  estimateCurrency: string;
  exchange: string;
  finnhubIndustry: string;
  ipo: string;
  logo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOustanding: number;
  ticker: string;
  weburl: string;
}

const WatchListWidget = ({ ticker: propTicker }: Props) => {
  const { apiKey } = useSelector((store: RootState) => store.watchlist);
  const [quote, setQuote] = useState<iQuote>();
  const [compProf2, setCompProf2] = useState<iProfile>();
  const [candles, setCandles] = useState<Candles>([] as Candles);
  const dispatch = useDispatch();
  const theme = useTheme();
  let today = dayjs().unix();
  let yesterday = dayjs().subtract(1, "day").unix();
  if (dayjs(today * 1000).format("dd") == "Sa") {
    today = dayjs().hour(15).subtract(1, "day").unix();
    yesterday = dayjs().hour(15).subtract(2, "day").unix();
  }
  if (dayjs(today * 1000).format("dd") == "Su") {
    today = dayjs().hour(15).subtract(2, "day").unix();
    yesterday = dayjs().hour(15).subtract(3, "day").unix();
  } else yesterday = dayjs().subtract(1, "day").unix();
  const handleDelete = (propTicker: string) => {
    dispatch(deleteTicker(propTicker));
  };

  let currentPrice;
  let open;
  if (quote) {
    currentPrice = quote.c;
    open = quote.o;
  }
  let percentFromOpen;
  let symbol;
  if (currentPrice && open) {
    percentFromOpen = (((currentPrice - open) / open) * 100).toFixed(2);
    symbol = 0 < Number(percentFromOpen) ? "+" : "-";
  }

  const fetchItAll = async () => {
    const profile: iProfile = await fetchCompProf2(propTicker, apiKey);
    setCompProf2(profile);
    const data = await fetchCandles(propTicker, "5", yesterday, today, apiKey);
    if (data && data[1]) {
      if (!data || data == "Bad Inputs") {
        return;
      } else setCandles(data);
    }
    const instantQuote = await fetchQuote(propTicker, apiKey);
    setQuote(instantQuote);
  };

  useEffect(() => {
    fetchItAll();
    getUserProfile();
  }, [propTicker]);

  return (
    <Paper sx={{ width: "100%", position: "relative" }}>
      <Grid
        container
        height={"110px"}
        sx={{
          backgroundColor: theme.palette.background.default,
          border: `4px solid ${theme.palette.background.paper}`,
          padding: ".5rem",
        }}
      >
        {compProf2?.name ? (
          <Grid
            item
            display={"flex"}
            justifyContent={"space-evenly"}
            alignItems={"center"}
            xs={6}
          >
            <Avatar
              alt="Remy Sharp"
              sx={{ height: "3rem", width: "3rem" }}
              src={compProf2.logo}
            />

            <Grid
              item
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              textAlign={"center"}
              xs={3}
            >
              <Typography variant="h5">{compProf2.ticker}</Typography>
              <Typography>{compProf2.name}</Typography>
            </Grid>
          </Grid>
        ) : (
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">{propTicker.toUpperCase()}</Typography>
          </Grid>
        )}

        <Grid
          item
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          xs={3}
        >
          <WatchListChart candles={candles} />
        </Grid>
        <Grid
          item
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          textAlign="center"
          xs={3}
        >
          <Typography variant="h6">Current:</Typography>
          <Typography>
            {currentPrice} ({symbol}
            {percentFromOpen}%)
          </Typography>
        </Grid>
      </Grid>
      <IconButton
        onClick={() => handleDelete(propTicker)}
        sx={{ position: "absolute", bottom: "10%", left: "1%" }}
      >
        <DeleteForeverIcon sx={{ fontSize: "1rem" }} />
      </IconButton>
    </Paper>
  );
};
export default WatchListWidget;
