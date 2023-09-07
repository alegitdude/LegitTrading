import { styled } from "@mui/material/styles";
import axios from "axios";
import { Box, Autocomplete, TextField, Snackbar, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { RootState } from "../store";

type Option = {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
};

type Props = {
  setTicker: (value: string) => void;
  initialTicker: string;
};
const TickerSearch = (props: Props) => {
  const { setTicker, initialTicker } = props;
  const { apiKey } = useSelector((store: RootState) => store.watchlist);
  const [value, setValue] = useState<string>();
  const [error, setError] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
  const [finnSearchOptions, setFinnSearchOptions] = useState([
    "Loading..",
    "Loading...",
  ]);

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const controller = new AbortController();

    const options = async () => {
      try {
        const response = await axios.get(
          `https://finnhub.io/api/v1//search?q=${value}&token=${apiKey}`,
          { signal: controller.signal }
        );

        const searchOptions = response.data.result.map((option: Option) => {
          return `${option.symbol} : ${option.description}`;
        });
        const newOptions = searchOptions.filter((option: string) => {
          return option.indexOf(".") == -1;
        });
        setFinnSearchOptions(newOptions);
        if (value) {
          setTicker(value);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.name == "CanceledError") {
            return;
          }
          setError(error.response?.data.error);
          setOpen(true);
          return;
        }
        if (error instanceof Error) {
          setError("There was a problem getting the data");
          setOpen(true);
          return;
        } else {
          setError("There was a problem getting the data");
          setOpen(true);
        }
      }
    };
    if (value) {
      options();
    }

    return () => {
      controller.abort();
    };
  }, [value, setTicker, apiKey]);

  // const debounce = (changeValue:) => {
  //   let timeoutID: number;
  //   return (e) => {
  //     setValue(e.target.value);
  //     clearTimeout(timeoutID);
  //     timeoutID = setTimeout(() => {
  //     setValue(changeValue);
  //     }, 1000);
  //   };
  // };

  //   const optimizedDebounce = useMemo(() => debounce(), []);
  return (
    <Box sx={{ maxWidth: "200px" }}>
      <Autocomplete
        sx={{ width: { sm: "200px", xs: "100px" } }}
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={finnSearchOptions}
        onChange={(e) => {
          const target = e.target as HTMLElement;
          setTicker(target.innerText);
        }}
        renderInput={(params) => (
          <FieldWrapper>
            <TextField
              {...params}
              value={value}
              placeholder={`${initialTicker ? initialTicker : "Ticker"}`}
              onChange={(e) => {
                setTicker(e.target.value);
                setValue(e.target.value);
              }}
              InputProps={{
                ...params.InputProps,
                type: "search",
                style: {
                  WebkitUserSelect: "text",
                  MozUserSelect: "text",
                  msUserSelect: "text",
                  userSelect: "text",
                },
              }}
            />
          </FieldWrapper>
        )}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={5000}
        open={open}
        onClose={() => handleClose()}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
};
export default TickerSearch;
const FieldWrapper = styled("div")(() => ({
  "& #free-solo-2-demo": {
    height: "5px",
  },
  "& #free-solo-2-demo-label": {
    top: "-22%",
  },
}));
