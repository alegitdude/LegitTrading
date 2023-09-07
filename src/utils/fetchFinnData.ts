import axios, { AxiosResponse } from "axios";
import dayjs from "dayjs";

export const fetchQuote = async (symbol: string, apikey: string) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${apikey}`
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchMarketNews = async (apikey: string) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/news?category=general&token=${apikey}`
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchEarnings = async (symbol: string, apikey: string) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/stock/earnings?symbol=${symbol}&token=${apikey}`
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchCompProfile = async (symbol: string, apikey: string) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&token=${apikey}`
    );

    return response.data.metric;
  } catch (error) {
    console.log(error);
  }
};

export const fetchCompProf2 = async (symbol: string, apikey: string) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apikey}`
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchCompanyNews = async (symbol: string, apikey: string) => {
  const from = dayjs().subtract(4, "days").format("YYYY-MM-DD");
  const to = dayjs().format("YYYY-MM-DD");
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${apikey}`
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

interface Candle {
  close: number;
  high: number;
  low: number;
  open: number;
  time: Date;
  volumeDate: number;
}

type Candles = Candle[];

export const fetchCandles = async (
  symbol: string,
  res: string,
  from: number,
  to: number,
  apikey: string
) => {
  const controller = new AbortController();
  let response: AxiosResponse;
  let sortedData: Candles;
  try {
    response = await axios.get(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol.toUpperCase()}&resolution=${res}&from=${from}&to=${to}&token=${apikey}`,
      { signal: controller.signal }
    );
    controller.abort();
    if (response.data.s === "no_data") {
      return "Bad Inputs";
    }

    if (response?.data.c[1]) {
      if (res == "D" || res == "W" || res == "M") {
        sortedData = await response.data.c.map((_: number, index: number) => {
          return {
            close: response.data.c[index],
            high: response.data.h[index],
            low: response.data.l[index],
            open: response.data.o[index],
            time: new Date(response.data.t[index] * 1000),
            volumeDate: response.data.v[index],
          };
        });
      } else {
        sortedData = await response.data.c.map((_: number, index: number) => {
          return {
            close: response.data.c[index],
            high: response.data.h[index],
            low: response.data.l[index],
            open: response.data.o[index],
            time: new Date(response.data.t[index] * 1000),
            volumeDate: response.data.v[index],
          };
        });
      }

      let sortedCandles: Candles;
      controller.abort();

      if (res !== "D" && res !== "W" && res !== "M") {
        const fixedHours = sortedData.filter((candle) => {
          const inputTime = dayjs(candle.time).unix();
          const morningTime = dayjs(candle.time).hour(8).minute(29).unix();
          const eveningTime = dayjs(candle.time).hour(15).minute(1).unix();
          if (inputTime > morningTime && inputTime < eveningTime) {
            return true;
          } else return false;
        });

        sortedCandles = fixedHours.map((candle) => {
          return { ...candle, time: new Date(candle.time) };
        });
      } else {
        sortedCandles = sortedData;
      }

      return sortedCandles;
    }
  } catch (error) {
    console.log(error);
  }
};
