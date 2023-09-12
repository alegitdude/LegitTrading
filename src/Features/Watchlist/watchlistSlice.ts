import { createSlice } from "@reduxjs/toolkit";

let profile;
const potentialProfile = localStorage.getItem("profile");
if (typeof potentialProfile == "string" && potentialProfile !== null) {
  profile = JSON.parse(potentialProfile);
}

let list = ["aapl"];

if (profile !== undefined && profile[0] !== undefined) {
  list = profile[0].watchlist;
}
const initialState = {
  listItems: list,
  apiKey: "",
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addTicker(state, action) {
      if (state.listItems != null) {
        state.listItems = [...state.listItems, action.payload];
      } else state.listItems = action.payload;
    },
    deleteTicker(state, action) {
      const newList = state.listItems.filter((item: string) => {
        return item != action.payload;
      });
      state.listItems = newList;
    },

    setApiKey(state, action) {
      state.apiKey = action.payload;
    },
  },
});

export const { addTicker, deleteTicker, setApiKey } = watchlistSlice.actions;

export default watchlistSlice.reducer;
