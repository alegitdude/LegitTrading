import {
  Paper,
  Grid,
  Menu,
  MenuProps,
  Typography,
  Box,
  Button,
  MenuItem,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect, useRef, useState } from "react";
import { useTheme, styled } from "@mui/material/styles";
import { fetchCandles } from "../utils/fetchFinnData";
import { TimeResMenu, DateTimeMenu, TickerSearch } from "./index";
import ScienceIcon from "@mui/icons-material/Science";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { changeChartData } from "../Features/Charts/chartsSlice";

type Candle = {
  close: number;
  high: number;
  low: number;
  open: number;
  time: Date;
  volumeDate: number;
};
type Candles = Candle[];

type Props = {
  chart: string;
};

const CandleChart = (props: Props) => {
  const { apiKey } = useSelector((store: RootState) => store.watchlist);
  const { chart } = props;
  const thisChart = useSelector((store: RootState) => {
    if (chart == "chartsChart1") {
      return store.charts.chartsChart1;
    }
    if (chart == "chartsChart2") {
      return store.charts.chartsChart2;
    }
  });

  const theme = useTheme();
  const chartRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const yearAgo = dayjs().subtract(1, "year");
  const [width, setWidth] = useState<number>(100);
  const [height, setHeight] = useState<number>(100);
  const [ticker, setTicker] = useState<string>(thisChart?.symbol || "");
  const today = dayjs();

  const [startDate, setStartDate] = useState(dayjs(yearAgo).unix());
  const [endDate, setEndDate] = useState(dayjs(today).unix());
  const [res, setRes] = useState<string>("1m");
  const [finnData, setFinnData] = useState<Candles | undefined>(
    thisChart?.data
  );
  const [badInputs, setBadInputs] = useState<string>("");
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const open = Boolean(menuAnchorEl);
  const dispatch = useDispatch();
  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      sx={{ maxWidth: "100%" }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      {...props}
    />
  ))(() => ({
    "& .css-4yilq8-MuiPaper-root-MuiPopover-paper-MuiMenu-paper": {
      display: "flex",
    },
    "& .css-1ye7ez3-MuiModal-root-MuiPopover-root-MuiMenu-root .css-4yilq8-MuiPaper-root-MuiPopover-paper-MuiMenu-paper":
      {
        width: "2px",
      },
  }));

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleFetch = async () => {
    setIsLoading(true);

    let symbol;
    symbol = ticker;
    if (ticker.indexOf(":") !== -1) {
      symbol = ticker.substring(0, ticker.indexOf(":"));
    }

    const newRes = res.replace("m", "");
    const someData = await fetchCandles(
      symbol,
      newRes,
      startDate,
      endDate,
      apiKey
    );
    if (someData === "Bad Inputs") {
      setBadInputs("Bad Inputs");
      setIsLoading(false);
      return;
    }
    if (!someData) {
      setIsLoading(false);
      return;
    }
    dispatch(changeChartData(chart, symbol, res, startDate, endDate, someData));
    setIsLoading(false);
  };
  const handleClose = (item: string) => {
    setRes(item);
  };
  let svgWidth = 0;
  if (finnData && width) {
    svgWidth =
      finnData.length * 15 < width ? width : finnData?.length * 15 - 70;
  }

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
    setFinnData(thisChart?.data);

    if (!finnData) {
      return;
    }

    let frequency: number;
    if (width < 306) {
      frequency = 10;
    } else frequency = 5;

    const times = finnData.map((d) => d.time);
    const newTimes = times.filter((_, i: number) => {
      return i == 0 || !(i % frequency);
    });

    const low = d3.min(finnData, (d) => d.low);
    const high = d3.max(finnData, (d) => d.high);

    const configure = (d: string) => {
      if (res == "D" || res == "W" || res == "M") {
        return dayjs(d).format("M/DD");
      } else return dayjs(d).format("h:mma");
    };
    if (!thisChart || !low || !high) {
      return;
    }
    const plot = Plot.plot({
      inset: -5,
      width: svgWidth,
      height: height,
      grid: true,
      marginLeft: 34,
      marginRight: 5,
      marginBottom: 40,
      marginTop: 30,

      x: {
        type: "band",
        domain: times,
        grid: true,
        padding: 1,
        label: null,
      },

      y: {
        domain: [low - (high - low) * 0.1, high + 0],
        label: thisChart.data[1]
          ? `${thisChart.symbol.toUpperCase()} ${thisChart.res} from ${dayjs(
              Number(thisChart.startDate) * 1000
            ).format("M-D-YY h:mma")} to ${dayjs(
              Number(thisChart.endDate) * 1000
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
          x: (d) => {
            return dayjs(new Date(d.time));
          },
          y: "close",
          textStrokeWidth: 12,
          color: theme.palette.primary.main,
          ruleStroke: "white",
          textStrokeOpacity: 1,
          ruleStrokeWidth: 3,
        }),
      ],
    });
    if (chartRef.current) {
      chartRef.current.append(plot);
    }

    return () => plot.remove();
  }, [height, width, finnData, svgWidth, thisChart, res, theme]);

  return (
    <Paper
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
          height: "4rem",
          paddingLeft: { xs: "1rem", sm: "2rem" },
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Grid item>
          <TickerSearch
            setTicker={setTicker}
            initialTicker={thisChart?.symbol || ""}
          />
        </Grid>

        <Grid sx={{ display: width > 480 ? "none" : "" }}>
          <Button
            id="demo-customized-button"
            aria-controls={open ? "demo-customized-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            variant="contained"
            disableElevation
            onClick={handleMenuClick}
            sx={{
              fontSize: "1rem",
              textTransform: "none",
              height: "38px",
              backgroundColor: theme.palette.background.default,
              marginLeft: ".5rem",
              minWidth: "48px",
              border: `1px solid ${theme.palette.primary.main}`,
              color: theme.palette.primary.main,
            }}
          >
            <ScienceIcon />
          </Button>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={menuAnchorEl}
            open={open}
            onClose={handleMenuClose}
          >
            <MenuItem disableRipple>
              <TimeResMenu handleClose={handleClose} time={res} />
            </MenuItem>
            <MenuItem disableRipple>
              <DateTimeMenu
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />
            </MenuItem>
          </StyledMenu>
        </Grid>
        <Grid
          item
          sx={{ marginRight: ".5rem", display: width < 480 ? "none" : "" }}
        >
          <TimeResMenu handleClose={handleClose} time={res} />
        </Grid>
        <Grid item sx={{ display: width < 480 ? "none" : "" }}>
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
            marginLeft: ".5rem",
            border: `1px solid ${theme.palette.primary.main}`,
          }}
          onClick={handleFetch}
        >
          Fetch!
        </Button>
      </Grid>
      <Box
        ref={containerRef}
        sx={{ overflowY: "hidden" }}
        height="calc(100% - 62px)"
        maxWidth="100%"
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {badInputs === "Bad Inputs" ? (
          <Box sx={{ padding: "2rem" }}>
            <Typography variant="h5">
              Finnhub returned no data. Please check to make sure your symbol is
              a real ticker and your date range has the start date before the
              end date, and your end date is before this morning.
            </Typography>
          </Box>
        ) : (
          <svg
            ref={chartRef}
            style={{
              height: "100%",
              width: `${svgWidth}px`,
              paddingTop: "8px",
              paddingLeft: "24px",
            }}
          />
        )}
      </Box>
    </Paper>
  );
};
export default CandleChart;
