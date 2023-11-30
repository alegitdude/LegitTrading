import { useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers/";
import HistoryIcon from "@mui/icons-material/History";
import { MenuItem, Box, Button, Menu } from "@mui/material/";
import { useTheme } from "@mui/material/styles";

type Props = {
  startDate: number;
  endDate: number;
  setStartDate: (value: number) => void;
  setEndDate: (value: number) => void;
};

export default function DateTimeMenu(props: Props) {
  const { startDate, endDate, setStartDate, setEndDate } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tempStartTime, setTempStartTime] = useState<number>();
  const [tempEndTime, setTempEndTime] = useState<number>();

  const open = Boolean(anchorEl);
  const today = dayjs();
  const yearAgo = dayjs().subtract(1, "year").add(1, "day");
  const theme = useTheme();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (tempStartTime) {
      setStartDate(tempStartTime);
    }
    if (tempEndTime) {
      setEndDate(tempEndTime);
    }
    setAnchorEl(null);
  };
  function disableWeekends(date: dayjs.Dayjs) {
    return (
      Number(dayjs(date).format("d")) === 6 ||
      Number(dayjs(date).format("d")) === 0
    );
  }

  return (
    <Box>
      <Button
        id="basic-button"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          fontSize: "1rem",
          textTransform: "none",
          backgroundColor: theme.palette.background.default,
          minWidth: "48px",
          height: "38px",
          border: `1px solid ${theme.palette.primary.main}`,
        }}
      >
        <HistoryIcon />
      </Button>
      <Menu
        id="basic-menu"
        onClose={handleClose}
        anchorEl={anchorEl}
        open={open}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onMouseLeave={handleClose}
          onClick={() => {
            // setAnchorEl(null);
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{
                minWidth: "0rem",
                width: "12rem",
              }}
              minDate={yearAgo}
              shouldDisableDate={disableWeekends}
              maxDate={dayjs(endDate * 1000).subtract(1, "minute")}
              value={dayjs(startDate * 1000)}
              onAccept={(newValue) => {
                const start = dayjs(newValue).unix();
                setTempStartTime(start);
              }}
              onChange={(newValue) => {
                const start = dayjs(newValue).unix();
                setTempStartTime(start);
              }}
            />
            &nbsp; - &nbsp;
            <DatePicker
              sx={{
                minWidth: "0rem",
                width: "12rem",
              }}
              shouldDisableDate={disableWeekends}
              minDate={dayjs(startDate).add(1, "minute")}
              maxDate={today}
              value={dayjs(endDate * 1000)}
              onAccept={(newValue) => {
                console.log(endDate);
                const end = dayjs(newValue).unix();
                setEndDate(end);
              }}
              onChange={(newValue) => {
                console.log(newValue);
                const end = dayjs(newValue).unix();
                setTempEndTime(end);
              }}
              onClose={() => {
                if (tempEndTime) {
                  setEndDate(tempEndTime);
                }
              }}
            />
          </LocalizationProvider>
        </MenuItem>
      </Menu>
    </Box>
  );
}
