import { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import { MenuProps } from "@mui/base";
type Props = {
  handleClose: (item: string) => void;
  time: string;
};

export default function TimeResMenu(props: Props) {
  const { handleClose, time } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else setAnchorEl(event.currentTarget);
  };

  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      open={open}
      onClose={() => setAnchorEl(null)}
      anchorEl={anchorEl}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      sx={{ maxWidth: "100%" }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      {...props}
    />
  ))(() => ({
    "& .css-4yilq8-MuiPaper-root-MuiPopover-paper-MuiMenu-paper": {
      display: "flex",
    },
    "& .css-1ye7ez3-MuiModal-root-MuiPopover-root-MuiMenu-root .css-4yilq8-MuiPaper-root-MuiPopover-paper-MuiMenu-paper":
      {
        width: "2px",
      },
  }));
  return (
    <div>
      <Button
        id="basic-button"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          fontSize: "1rem",
          textTransform: "none",
          height: "38px",
          backgroundColor: theme.palette.background.default,
          minWidth: "48px",
          border: `1px solid ${theme.palette.primary.main}`,
        }}
      >
        {time}
      </Button>
      <StyledMenu id="basic-menu" sx={{ width: "8rem" }}>
        <MenuItem
          onClick={() => {
            handleClose("1m");
            setAnchorEl(null);
          }}
        >
          1m
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose("5m");
            setAnchorEl(null);
          }}
        >
          5m
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose("15m");
            setAnchorEl(null);
          }}
        >
          15m
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose("30m");
            setAnchorEl(null);
          }}
        >
          30m
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose("60m");
            setAnchorEl(null);
          }}
        >
          60m
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose("D");
            setAnchorEl(null);
          }}
        >
          D
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose("W");
            setAnchorEl(null);
          }}
        >
          W
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose("M");
            setAnchorEl(null);
          }}
        >
          M
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
