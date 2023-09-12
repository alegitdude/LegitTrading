import { styled } from "@mui/material/styles";
import axios from "axios";
import { Box, Autocomplete, TextField, Snackbar, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { RootState } from "../store";
import supabase from "../utils/supabase";

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
  const [finnSearchOptions, setFinnSearchOptions] = useState<string[]>([]);

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const controller = new AbortController();

    const options = async () => {
      try {
        const { data, error } = await supabase
          .from("Symbols")
          .select()
          .textSearch("title_description", `${value}`);

        if (value) {
          setTicker(value);
        }
        if (data) {
          const options = data.map((option) => {
            return `${option.Symbol} : ${option.Name}`;
          });
          setFinnSearchOptions(options);
        }
        if (error) {
          setError(error.message);
          setOpen(true);
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

  const isMobileIos = () => {
    if (window.navigator.userAgent.indexOf("iPhone") != -1) {
      return 12;
    } else return undefined;
  };
  const isIphone = isMobileIos();

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
            {isIphone ? (
              <TextField
                {...params}
                value={value}
                InputProps={{
                  style: {
                    fontSize: 12,
                  },
                }}
                placeholder={`${initialTicker ? initialTicker : "Ticker"}`}
                onChange={(e) => {
                  setTicker(e.target.value);
                  setValue(e.target.value);
                }}
              />
            ) : (
              <TextField
                {...params}
                value={value}
                placeholder={`${initialTicker ? initialTicker : "Ticker"}`}
                onChange={(e) => {
                  setTicker(e.target.value);
                  setValue(e.target.value);
                }}
              />
            )}
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
