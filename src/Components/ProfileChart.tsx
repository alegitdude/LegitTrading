import { Paper, Grid, Button, Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { DateTimeMenu, TimeResMenu } from ".";
import { fetchCandles } from "../utils/fetchFinnData";
import * as Plot from "@observablehq/plot";
import { useDispatch, useSelector } from "react-redux";
import { addChartData } from "../Features/Profile/profileSlice";
import { RootState } from "../store";

type Props = {
  ticker: string | undefined;
  chartNum: number;
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

const ProfileChart = (props: Props) => {
  const { apiKey } = useSelector((store: RootState) => store.watchlist);
  const theme = useTheme();
  const chartRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fiveDaysAgo = dayjs().subtract(5, "day");
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();
  const today = dayjs();
  const [startDate, setStartDate] = useState(dayjs(fiveDaysAgo).unix());
  const [endDate, setEndDate] = useState(dayjs(today).unix());
  const [res, setRes] = useState<string>("60m");
  const [finnData, setFinnData] = useState<Candles>([] as Candles);
  const [badInputs, setBadInputs] = useState<boolean>(false);

  const { ticker, chartNum } = props;

  const storeChart = useSelector((store: RootState) =>
    chartNum === 1 ? store.profile.chart1 : store.profile.chart2
  );
  const storeTicker = useSelector((store: RootState) => store.profile.ticker);

  const dispatch = useDispatch();

  const handleFetch = async () => {
    if (!ticker) {
      return;
    }
    if (ticker) {
      let symbol;
      symbol = ticker;
      if (ticker && ticker.indexOf(":") !== -1) {
        symbol = ticker.substring(0, ticker.indexOf(":"));
      }
      setBadInputs(false);
      const newRes = res.replace("m", "");
      const someData = await fetchCandles(
        symbol,
        newRes,
        startDate,
        endDate,
        apiKey
      );
      if (someData == "Bad Inputs" || !someData) {
        setBadInputs(true);
        return;
      } else {
        dispatch(addChartData(chartNum, res, startDate, endDate, someData));
      }
    }
  };

  const handleClose = (item: string) => {
    setRes(item);
  };
  let svgWidth = width;
  if (finnData?.length && width) {
    svgWidth = finnData?.length * 10 < width ? width : finnData?.length * 10;
  }

  const getSvgContainerSize = () => {
    if (containerRef.current && containerRef.current.clientHeight) {
      const newWidth: number = containerRef.current.clientWidth;
      setWidth(newWidth);

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
    setFinnData(storeChart.data);
    if (!finnData) {
      return;
    }

    let frequency: number;
    if (width && width < 306) {
      frequency = 10;
    } else frequency = 5;

    const times = finnData.map((d: Candle) => d.time);
    const newTimes = times.filter((_: Date, i: number) => {
      return i == 0 || !(i % frequency);
    });

    const low = d3.min(finnData, (d) => d.low);
    const high = d3.max(finnData, (d) => d.high);
    if (!low || !high) {
      return;
    }
    const configure = (d: string) => {
      if (res == "D" || res == "W" || res == "M") {
        return dayjs(d).format("M/DD");
      } else return dayjs(d).format("h:mma");
    };

    const plot = Plot.plot({
      inset: -5,
      width: svgWidth,
      height: height,
      grid: true,
      marginLeft: 36,
      marginRight: 24,
      marginBottom: 100,
      marginTop: 24,

      x: {
        type: "band",
        domain: times,
        grid: true,
        padding: 1,
        label: null,
      },

      y: {
        domain: [low - (high - low) * 0.1, high + 0],
        label: storeChart.data[1]
          ? `${storeTicker.toUpperCase()} ${storeChart.res} ${dayjs(
              storeChart.startDate * 1000
            ).format("M-D-YY h:mma")} to ${dayjs(
              storeChart.endDate * 1000
            ).format("M-D-YY h:mma")}`
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
  }, [height, width, finnData, res, storeChart, storeTicker, svgWidth, theme]);

  return (
    <Paper
      ref={containerRef}
      sx={{
        height: "100%",
        width: "100%",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Grid
        container
        display="flex"
        alignItems="center"
        sx={{
          flexGrow: 1,
          height: "42px",
          paddingLeft: { xs: "1rem" },
          backgroundColor: theme.palette.background.paper,
        }}
        onKeyDown={(e) => {
          if (e.code == "Enter") {
            handleFetch();
          } else return;
        }}
      >
        <Grid item>
          <TimeResMenu handleClose={handleClose} time={res} />
        </Grid>
        <Grid
          sx={{
            paddingTop: "0",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: "1rem",
            marginTop: "0",
          }}
        >
          <DateTimeMenu
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </Grid>
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
          Update
        </Button>
      </Grid>
      <Box
        sx={{ overflowX: "scroll", overflowY: "hidden" }}
        height="252px"
        width="100%"
      >
        {badInputs ? (
          <Box sx={{ padding: "2rem" }}>
            <Typography variant="h5">
              Finnhub returned no data. Please check to make sure your symbol is
              a real ticker and your date range has the start date before the
              end date.
            </Typography>
          </Box>
        ) : (
          <svg
            ref={chartRef}
            style={{
              height: "100%",
              marginTop: "4px",
              paddingLeft: "8px",
              width: `${svgWidth}px`,
              overflow: "scroll",
            }}
          />
        )}
      </Box>
    </Paper>
  );
};
export default ProfileChart;
