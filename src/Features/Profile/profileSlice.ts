import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
type Articles = iArticle[];

type iMetric = [string, number | string];
type Metrics = iMetric[];
interface iProf {
  ticker: string;
  compProfile: Metrics;
  earningsData: Earnings;
  news: Articles;
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

interface iChartData {
  chartNum: number;
  res: string;
  startDate: number;
  endDate: number;
  data: Candles;
}

const initialState = {
  ticker: "",
  chart1: {
    res: "",
    startDate: 0,
    endDate: 0,
    data: [] as Candles,
  },
  chart2: {
    res: "",
    startDate: 0,
    endDate: 0,
    data: [] as Candles,
  },
  compProfile: [["", 0]] as Metrics,
  earningsData: [] as Earnings,
  news: [] as Articles,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    addTicker: {
      prepare(
        ticker: string,
        compProfile: Metrics,
        earningsData: Earnings,
        news: Articles
      ) {
        return {
          payload: {
            ticker,
            compProfile,
            earningsData,
            news,
          },
        };
      },
      reducer(state, action: PayloadAction<iProf>) {
        state.ticker = action.payload.ticker;
        state.compProfile = action.payload.compProfile;
        state.earningsData = action.payload.earningsData;
        state.news = action.payload.news;
      },
    },
    addChartData: {
      prepare(
        chartNum: number,
        res: string,
        startDate: number,
        endDate: number,
        data: Candles
      ) {
        return {
          payload: {
            chartNum,
            res,
            startDate,
            endDate,
            data,
          },
        };
      },
      reducer(state, action: PayloadAction<iChartData>) {
        if (action.payload.chartNum === 1) {
          state.chart1.res = action.payload.res;
          state.chart1.startDate = action.payload.startDate;
          state.chart1.endDate = action.payload.endDate;
          state.chart1.data = action.payload.data;
        }
        if (action.payload.chartNum === 2) {
          state.chart2.res = action.payload.res;
          state.chart2.startDate = action.payload.startDate;
          state.chart2.endDate = action.payload.endDate;
          state.chart2.data = action.payload.data;
        }
      },
    },
  },
});

export const { addTicker, addChartData } = profileSlice.actions;

export default profileSlice.reducer;
