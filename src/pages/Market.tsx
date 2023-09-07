import { Box, Toolbar, Typography, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { NewsWidget, MarketChart } from "../Components";
import { useEffect, useState } from "react";
import { fetchMarketNews } from "../utils/fetchFinnData";
import { RootState } from "../store";
import { useSelector } from "react-redux/es/hooks/useSelector";
const Market = () => {
  const theme = useTheme();
  const [news, setNews] = useState();
  const { apiKey } = useSelector((store: RootState) => store.watchlist);
  const handleFetch = async () => {
    const someNews = await fetchMarketNews(apiKey);
    setNews(someNews);
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <Box sx={{ overflow: "hidden" }}>
      <Toolbar
        sx={{
          height: "16px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          backgroundColor: theme.palette.secondary.dark,
        }}
      >
        <Typography variant="h4">Overview</Typography>
      </Toolbar>
      <Grid container width={"100%"} height={"430px"}>
        <Grid item xs={6} height={"215px"} overflow={"hidden"}>
          <MarketChart chart={"marketChart1"} />
        </Grid>
        <Grid item xs={6} height={"215px"}>
          <MarketChart chart={"marketChart2"} />
        </Grid>
        <Grid item xs={6} height={"215px"}>
          <MarketChart chart={"marketChart3"} />
        </Grid>
        <Grid item xs={6} height={"215px"}>
          <MarketChart chart={"marketChart4"} />
        </Grid>
      </Grid>
      {news && <NewsWidget news={news} type={"Market"} />}
    </Box>
  );
};
export default Market;
