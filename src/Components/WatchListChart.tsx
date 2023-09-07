import { Box, Typography } from "@mui/material";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import * as Plot from "@observablehq/plot";

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
  candles: Candles;
};

const WatchListChart = (props: Props) => {
  const { candles: finnData } = props;

  const theme = useTheme();
  const chartRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

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
    if (finnData[0] && width) {
      const low = d3.min(finnData, (d) => d.low);
      const high = d3.max(finnData, (d) => d.high);
      if (!low || !high) {
        return;
      }
      const stroke =
        finnData[0].close > finnData[finnData.length - 1].close
          ? "red"
          : "green";

      const plot = Plot.plot({
        height: 100,
        marginBottom: 40,
        marginTop: 0,
        width: width,
        y: {
          label: null,
        },
        marks: [
          Plot.lineY(finnData, { x: "time", y: "close", stroke: `${stroke}` }),
          Plot.axisX({ tickSize: 0 }),
          Plot.axisY({ tickSize: 0, ticks: "" }),
          Plot.crosshairX(finnData, {
            x: "time",
            y: "close",
            textStrokeWidth: 1,
          }),
        ],
      });
      if (chartRef.current) {
        chartRef.current.append(plot);
      }

      return () => plot.remove();
    }
  }, [height, width, finnData]);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "90px",
        width: "100%",
        backgroundColor: theme.palette.background.default,
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <Typography>24hrs</Typography>
      <Box sx={{}} height="100%" maxWidth="100%" overflow="hidden">
        <svg
          ref={chartRef}
          style={{
            height: `100%`,
            width: "100%",
            overflow: "hidden",
            paddingRight: "0px",
          }}
        />
      </Box>
    </Box>
  );
};
export default WatchListChart;
