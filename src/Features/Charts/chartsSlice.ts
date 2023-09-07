import { PayloadAction, createSlice } from "@reduxjs/toolkit";

let profile;

profile = localStorage.getItem("profile");
if (typeof profile == "string") {
  profile = JSON.parse(profile);
}

let marketCharts;
if (profile) {
  marketCharts = profile[0];
}

type Candle = {
  close: number;
  high: number;
  low: number;
  open: number;
  time: Date;
  volumeDate: number;
};
type Candles = Candle[];

interface iChart {
  chart: string;
  symbol: string;
  res: string;
  startDate: number;
  endDate: number;
  data: Candles;
}
const initialState = {
  marketChart1: {
    symbol: marketCharts?.market_chart1 || "spy",
    res: "",
    startDate: 0,
    endDate: 0,
    data: [] as Candles,
  },
  marketChart2: {
    symbol: marketCharts?.market_chart2 || "qqq",
    res: "",
    startDate: 0,
    endDate: 0,
    data: [] as Candles,
  },
  marketChart3: {
    symbol: marketCharts?.market_chart3 || "iwm",
    res: "",
    startDate: 0,
    endDate: 0,
    data: [] as Candles,
  },
  marketChart4: {
    symbol: marketCharts?.market_chart4 || "tlt",
    res: "",
    startDate: 0,
    endDate: 0,
    data: [] as Candles,
  },
  chartsChart1: {
    symbol: "",
    res: "",
    startDate: 0,
    endDate: 0,
    data: [] as Candles,
  },
  chartsChart2: {
    symbol: "",
    res: "",
    startDate: 0,
    endDate: 0,
    data: [] as Candles,
  },
};

const chartsSlice = createSlice({
  name: "charts",
  initialState,
  reducers: {
    changeChartData: {
      prepare(
        chart: string,
        symbol: string,
        res: string,
        startDate: number,
        endDate: number,
        data: Candles
      ) {
        return {
          payload: {
            chart,
            symbol,
            res,
            startDate,
            endDate,
            data,
          },
        };
      },
      reducer(state, action: PayloadAction<iChart>) {
        const chart = action.payload.chart;
        if (chart == "marketChart1") {
          state.marketChart1.symbol = action.payload.symbol;
          state.marketChart1.res = action.payload.res;
          state.marketChart1.startDate = action.payload.startDate;
          state.marketChart1.endDate = action.payload.endDate;
          state.marketChart1.data = action.payload.data;
        }
        if (chart == "marketChart2") {
          state.marketChart2.symbol = action.payload.symbol;
          state.marketChart2.startDate = action.payload.startDate;
          state.marketChart2.endDate = action.payload.endDate;
          state.marketChart2.data = action.payload.data;
        }
        if (chart == "marketChart3") {
          state.marketChart3.symbol = action.payload.symbol;
          state.marketChart3.startDate = action.payload.startDate;
          state.marketChart3.endDate = action.payload.endDate;
          state.marketChart3.data = action.payload.data;
        }
        if (chart == "marketChart4") {
          state.marketChart4.symbol = action.payload.symbol;
          state.marketChart4.startDate = action.payload.startDate;
          state.marketChart4.endDate = action.payload.endDate;
          state.marketChart4.data = action.payload.data;
        }
        if (chart == "chartsChart1") {
          state.chartsChart1.symbol = action.payload.symbol;
          state.chartsChart1.res = action.payload.res;
          state.chartsChart1.startDate = action.payload.startDate;
          state.chartsChart1.endDate = action.payload.endDate;
          state.chartsChart1.data = action.payload.data;
        }
        if (chart == "chartsChart2") {
          state.chartsChart2.symbol = action.payload.symbol;
          state.chartsChart2.res = action.payload.res;
          state.chartsChart2.startDate = action.payload.startDate;
          state.chartsChart2.endDate = action.payload.endDate;
          state.chartsChart2.data = action.payload.data;
        }
      },
    },
  },
});

export const { changeChartData } = chartsSlice.actions;

export default chartsSlice.reducer;
