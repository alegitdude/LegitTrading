import { Grid } from "@mui/material";
import CandleChart from "../Components/CandleChart";
import { useTheme } from "@mui/material/styles";
const Charts = () => {
  const theme = useTheme();
  return (
    <Grid
      container
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Grid
        item
        border={`2px solid ${theme.palette.background.paper}`}
        height={{ md: "100%", xs: "50%" }}
        md={6}
        xs={12}
      >
        <CandleChart chart={"chartsChart1"} />
      </Grid>
      <Grid
        item
        height={{ md: "100%", xs: "50%" }}
        border={`2px solid ${theme.palette.background.paper}`}
        md={6}
        xs={12}
      >
        <CandleChart chart={"chartsChart2"} />
      </Grid>
    </Grid>
  );
};
export default Charts;
