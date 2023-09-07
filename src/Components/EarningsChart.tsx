import { useEffect, useRef, useState } from "react";
import { Box, Paper, Toolbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as d3 from "d3";
import dayjs from "dayjs";
import * as Plot from "@observablehq/plot";

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
type Props = {
  earnings: Earnings | undefined;
};
const EarningsChart = (props: Props) => {
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();
  const chartRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const { earnings } = props;
  const getSvgContainerSize = () => {
    if (containerRef.current) {
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
    if (!earnings || earnings[0] == undefined) {
      return;
    }

    const periods = earnings.map((d) => {
      return new Date(d.period);
    });
    const periodDates = periods.map((d) =>
      dayjs(d).subtract(3, "month").toDate()
    );

    const correctPeriodDates = periodDates.reverse();
    if (!width || !height) {
      return;
    }

    Plot.dot(earnings, { x: "period", y: "actual" });

    const actualExtent = d3.extent(earnings, (d) => d.actual);
    const estimateExtent = d3.extent(earnings, (d) => d.estimate);
    const yExtent = d3.extent([...actualExtent, ...estimateExtent], (d) => d);
    const yDomain = [Number(yExtent[0]) * 0.9, Number(yExtent[1]) * 1.1];

    const plot = Plot.plot({
      width: width,
      height: height,
      grid: true,
      marginLeft: 28,
      marginRight: 15,
      marginBottom: 90,
      marginTop: 24,
      inset: 15,
      x: {
        type: "point",
      },
      y: {
        domain: yDomain,
        label: `Earnings Per Share - Estimate = Red, Actual = Green`,
        labelArrow: "none",
      },
      marks: [
        Plot.dot(earnings, {
          x: correctPeriodDates,
          y: "estimate",
          stroke: `${theme.palette.error.light}`,
          strokeWidth: 10,
          strokeOpacity: 0.7,
        }),
        Plot.dot(earnings, {
          x: correctPeriodDates,
          y: "actual",
          stroke: `${theme.palette.success.main}`,
          strokeWidth: 10,
          strokeOpacity: 0.7,
        }),
      ],
    });
    if (chartRef.current) {
      chartRef.current.append(plot);
    }

    return () => plot.remove();
  }, [height, width, earnings, theme]);

  return (
    <Box sx={{ height: "300px" }}>
      <Toolbar
        sx={{
          minHeight: "2rem",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          backgroundColor: theme.palette.secondary.dark,
        }}
      >
        <Typography variant="h4">Earnings</Typography>
      </Toolbar>
      <Paper
        sx={{
          height: "100%",
          backgroundColor: theme.palette.background.default,
          border: "1px solid black",
        }}
      >
        <Box height={"100%"} ref={containerRef}>
          <svg ref={chartRef} style={{ width: "100%", height: "100%" }} />
        </Box>
      </Paper>
    </Box>
  );
};
export default EarningsChart;
