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
  to: number
  // apikey: string
) => {
  const controller = new AbortController();
  let response: AxiosResponse;
  let sortedData: Candles;
  let formattedFrom;
  let formattedTo;
  const formattedSymbol = symbol.toUpperCase().trim();
  let formattedRes = res;
  let multiplier = "minute";
  if (to < 10000000000) {
    formattedTo = dayjs(to * 1000).format("YYYY-MM-DD");
  } else formattedTo = dayjs(to).format("YYYY-MM-DD");

  if (from < 10000000000) {
    formattedFrom = dayjs(from * 1000).format("YYYY-MM-DD");
  } else formattedFrom = dayjs(from).format("YYYY-MM-DD");
  console.log(res);
  switch (res) {
    case "D":
      multiplier = "day";
      formattedRes = "1";
      break;
    case "W":
      multiplier = "week";
      formattedRes = "1";
      break;
    case "M":
      multiplier = "month";
      formattedRes = "1";
      break;
  }
  console.log(formattedRes, multiplier);
  try {
    response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${formattedSymbol}/range/${formattedRes}/${multiplier}/${formattedFrom}/${formattedTo}?adjusted=true&sort=asc&limit=1000&apiKey=${
        import.meta.env.VITE_POLY_STRING
      }`,
      { signal: controller.signal }
    );
    controller.abort();

    if (response.data.s === "no_data") {
      return "Bad Inputs";
    }

    if (response?.data.results[1]) {
      if (res == "D" || res == "W" || res == "M") {
        sortedData = await response.data.results.map(
          (_: number, index: number) => {
            return {
              close: response.data.results[index].c,
              high: response.data.results[index].h,
              low: response.data.results[index].l,
              open: response.data.results[index].o,
              time: new Date(response.data.results[index].t),
              volumeDate: response.data.results[index].v,
            };
          }
        );
      } else {
        sortedData = await response.data.results.map(
          (_: number, index: number) => {
            return {
              close: response.data.results[index].c,
              high: response.data.results[index].h,
              low: response.data.results[index].l,
              open: response.data.results[index].o,
              time: new Date(response.data.results[index].t),
              volumeDate: response.data.results[index].v,
            };
          }
        );
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
      console.log(sortedCandles);
      return sortedCandles;
    }
  } catch (error) {
    console.log(error);
  }
};
