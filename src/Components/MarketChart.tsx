import {
  Paper,
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import dayjs from "dayjs";
import { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { changeChartData } from "../Features/Charts/chartsSlice";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { fetchCandles } from "../utils/fetchFinnData";
import { TickerSearch } from "./index";

import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

type Candle = {
  close: number;
  high: number;
  low: number;
  open: number;
  time: Date;
  volumeDate: number;
};
type Candles = Candle[];
type MarketChart = [[string, { symbol: string; data: [] }]];
type Props = {
  chart: string;
};

const MarketChart = (props: Props) => {
  const { chart } = props;
  const { apiKey } = useSelector((store: RootState) => store.watchlist);
  const thisChart = useSelector((store: RootState) => {
    if (chart == "marketChart1") {
      return store.charts.marketChart1;
    }
    if (chart == "marketChart2") {
      return store.charts.marketChart2;
    }
    if (chart == "marketChart3") {
      return store.charts.marketChart3;
    }
    if (chart == "marketChart4") {
      return store.charts.marketChart4;
    }
  });

  const theme = useTheme();
  const chartRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [width, setWidth] = useState<number>(100);
  const [height, setHeight] = useState<number>(100);
  const [ticker, setTicker] = useState<string>(thisChart?.symbol || "spy");
  const [finnData, setFinnData] = useState<Candles>(
    thisChart?.data || ([] as Candles)
  );
  const [badInputs, setBadInputs] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let today = dayjs().unix() * 1000;
  let threeDaysAgo = dayjs().subtract(3, "day").unix() * 1000;
  if (dayjs(today).format("dd") == "Sa") {
    today = dayjs().hour(15).subtract(1, "day").unix();
    threeDaysAgo = dayjs().hour(8).subtract(4, "day").unix();
  }
  if (dayjs(today).format("dd") == "Su") {
    today = dayjs().hour(15).subtract(2, "day").unix();
    threeDaysAgo = dayjs().hour(8).subtract(5, "day").unix();
  }
  if (
    dayjs(today).format("dd") == "Mo" &&
    Number(dayjs(today).format("H")) < 9
  ) {
    today = dayjs().hour(15).subtract(3, "day").unix();
    threeDaysAgo = dayjs().hour(8).subtract(7, "day").unix();
  } else threeDaysAgo = dayjs().subtract(1, "day").unix();

  const dispatch = useDispatch();

  const handleFetch = async () => {
    setIsLoading(true);
    let symbol;
    symbol = ticker;

    if (ticker.indexOf(":") !== -1) {
      symbol = ticker.substring(0, ticker.indexOf(":"));
    }

    const newRes = "30";
    const someData = await fetchCandles(
      symbol.trim(),
      newRes,
      threeDaysAgo,
      today,
      apiKey
    );

    if (!someData) {
      return;
    }

    if (someData == "Bad Inputs") {
      setBadInputs(true);
      setIsLoading(false);
      return;
    } else {
      dispatch(
        changeChartData(chart, symbol, newRes, threeDaysAgo, today, someData)
      );
    }

    setIsLoading(false);
  };

  const getSvgContainerSize = () => {
    if (containerRef.current != null) {
      const newWidth: number = containerRef.current.clientWidth;
      setWidth(newWidth);
    }
    if (containerRef.current != null) {
      const newHeight = containerRef.current.clientHeight;
      setHeight(newHeight);
    }
  };

  useEffect(() => {
    getSvgContainerSize();
    window.addEventListener("resize", getSvgContainerSize);
    return () => window.removeEventListener("resize", getSvgContainerSize);
  }, []);

  useEffect(() => {
    if (finnData.length == 0) {
      handleFetch();
    }

    if (thisChart && thisChart.data) {
      setFinnData(thisChart.data);
    }

    if (!finnData) {
      return;
    }

    if (badInputs) {
      return;
    }
    let frequency: number;
    if (width < 306) {
      frequency = 10;
    } else frequency = 5;

    const times = finnData.map((d) => dayjs(d.time));
    const newTimes = times.filter((_, i: number) => {
      return i == 0 || !(i % frequency);
    });

    const low = d3.min(finnData, (d) => d.low);
    const high = d3.max(finnData, (d) => d.high);

    const configure = (d: Date) => {
      return dayjs(d).format("h:mma");
    };

    const plot = Plot.plot({
      inset: -5,
      width: width,
      height: height,
      grid: true,
      marginLeft: 40,
      marginRight: 40,
      marginTop: 24,

      x: {
        type: "band",
        domain: times,
        grid: true,
        padding: 1,
        label: null,
      },

      y: {
        domain: low && high ? [low - (high - low) * 0.1, high + 0] : "",
        label: thisChart?.data[1]
          ? `${thisChart.symbol.toUpperCase()} 30m ${dayjs(
              Number(thisChart.startDate) * 1000
            ).format("M-D-YY h:mma")} to ${dayjs(
              Number(thisChart.endDate) * 1000
            ).format("M-D-YY h:mma")} `
          : null,
        labelArrow: "none",
      },

      color: { domain: [-1, 0, 1], range: ["#e41a1c", "#000000", "#4daf4a"] },
      marks: [
        Plot.ruleX(finnData, {
          x: "time",
          y1: "low",
          y2: "high",
        }),
        Plot.axisX({
          tickRotate: 0,
          ticks: newTimes,
          tickFormat: (d) => configure(d),
        }),

        Plot.ruleX(finnData, {
          x: "time",
          y1: "open",
          y2: "close",
          stroke: (d) => Math.sign(d.close - d.open),
          strokeWidth: 4,
          strokeLinecap: "round",
        }),

        Plot.crosshair(finnData, {
          x: (d: Candle) => {
            return dayjs(d.time);
          },
          y: "close",
          textStrokeWidth: 12,
          color: "white",
          ruleStroke: "white",
          textStroke: theme.palette.background.default,
          textStrokeOpacity: 1,
          ruleStrokeWidth: 3,
        }),
      ],
    });
    if (chartRef.current) {
      chartRef.current.append(plot);
    }

    return () => plot.remove();
  }, [height, width, finnData, thisChart, ticker, badInputs, theme]);

  return (
    <Paper
      sx={{
        height: "100%",
        width: "100%",
        backgroundColor: theme.palette.background.default,
        overflow: "hidden",
      }}
    >
      <Grid
        container
        display="flex"
        alignItems="center"
        sx={{
          flexGrow: 1,
          height: "3rem",
          paddingLeft: { xs: "1rem", sm: "2rem" },
          backgroundColor: theme.palette.background.paper,
          overflow: "hidden",
        }}
        onKeyDown={(e) => {
          if (e.code == "Enter") {
            handleFetch();
          } else return;
        }}
      >
        <Grid item>
          <TickerSearch
            setTicker={setTicker}
            initialTicker={thisChart?.symbol || "spy"}
          />
        </Grid>

        <Button
          sx={{
            fontSize: "1rem",
            textTransform: "none",
            height: "38px",
            backgroundColor: theme.palette.background.default,
            minWidth: "48px",
            marginLeft: ".5rem",
            border: `1px solid ${theme.palette.primary.main}`,
          }}
          onClick={handleFetch}
        >
          Update
        </Button>
      </Grid>
      <Box
        ref={containerRef}
        overflow={"hidden"}
        height="calc(100% - 50px)"
        maxWidth="100%"
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {badInputs ? (
          <Box sx={{ padding: "1rem" }}>
            <Typography variant="body2">
              Finnhub returned no data. Please make sure your symbol is a real
              ticker. If the market was closed for the past 3 days Finnhub will
              return no data.
            </Typography>
          </Box>
        ) : (
          <svg
            ref={chartRef}
            style={{
              marginTop: "4px",
              marginLeft: "4px",
              paddingLeft: "8px",
              paddingRight: "8px",
              height: "100%",
              width: `${width}px`,
              overflow: "scroll",
            }}
          />
        )}
      </Box>
    </Paper>
  );
};
export default MarketChart;
