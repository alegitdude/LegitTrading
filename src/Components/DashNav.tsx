import {
  Box,
  Grid,
  Typography,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useLogout } from "../utils/useLogout";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Logo from "../assets/logo-no-background (2).png";
import {
  Language,
  SsidChart,
  Analytics,
  Visibility,
  Person,
} from "@mui/icons-material";
import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { useUser } from "../utils/useUser";
import { useDispatch } from "react-redux";
import { setApiKey } from "../Features/Watchlist/watchlistSlice";
import { useGetProfile } from "../utils/useGetProfile";
const drawerWidth = 140;

type menuItem = {
  name: string;
  icon: React.ReactElement;
};
const menuItems: menuItem[] = [
  {
    name: "Market",
    icon: <Language />,
  },
  {
    name: "Company Profile",
    icon: <Analytics />,
  },
  {
    name: "Charts",
    icon: <SsidChart />,
  },
  {
    name: "WatchList",
    icon: <Visibility />,
  },
  {
    name: "Account",
    icon: <Person />,
  },
];
interface Props {
  outlet: React.ReactNode;
}

const DashNav = (props: Props) => {
  const { getProfile, isLoading: profileLoading } = useGetProfile();
  const { outlet } = props;
  const theme = useTheme();
  const [active, setActive] = useState<string>(
    window.location.pathname.slice(11)
  );
  const { logout, isLoading } = useLogout();
  const navigate = useNavigate();
  const handleClick = () => {
    logout();
  };
  const dispatch = useDispatch();
  const { user } = useUser();
  let key = "";
  if (user && user.user_metadata) {
    const { apikey } = user.user_metadata;
    key = apikey;
    dispatch(setApiKey(key));
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        padding: "0",
        margin: "0 ",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.secondary.dark,
          backgroundImage: "none",
          borderTop: "1px solid black",
          borderRight: "1px solid black",
          borderLeft: "1px solid black",
        }}
      >
        <Toolbar>
          <Grid container>
            <Grid item xs={9}>
              <Typography variant="h6" noWrap component="div">
                <img src={Logo} style={{ width: "15rem", marginTop: "8px" }} />
              </Typography>
            </Grid>
            <Grid
              item
              xs={3}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Button disabled={isLoading} onClick={handleClick}>
                Logout
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        position="fixed"
        sx={{ top: "auto", bottom: 0, display: { xs: "block", md: "none" } }}
      >
        <Toolbar>
          <BottomNavigation sx={{ width: "100%" }}>
            {menuItems.map((item) => {
              return (
                <BottomNavigationAction
                  key={nanoid()}
                  label="`${item.name}`"
                  onClick={() => {
                    navigate(`${item.name}`);
                    setActive(`${item.name}`);
                  }}
                  icon={item.icon}
                />
              );
            })}
          </BottomNavigation>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          flexDirection: "column",
          height: "100vh",
          display: { xs: "none", md: "block" },

          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            overflow: "hidden",
            backgroundColor: theme.palette.secondary.dark,
            borderLeft: "1px solid black",
          },
        }}
      >
        <Toolbar
          sx={{
            width: "140px",
            minHeight: "0",
          }}
        />
        <Box
          sx={{
            textAlign: "center",
            backgroundColor: theme.palette.secondary.dark,
            marginTop: "1rem",
          }}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem
                sx={{ boxShadow: theme.shadows[1] }}
                key={nanoid()}
                disablePadding
              >
                <ListItemButton
                  onClick={() => {
                    navigate(`${item.name}`);
                    setActive(`${item.name}`);
                  }}
                  selected={active === item.name}
                  sx={{
                    padding: "1rem",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "40px" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>

      <Box
        component={"main"}
        sx={{
          height: { xs: "calc(100vh - 143.1px)", md: "calc(100vh - 79.1px)" },
          width: { md: "calc(100vw - 140px)", xs: "100vw" },
          borderRight: "1px solid black",
          borderLeft: "1px solid black",
        }}
      >
        <Toolbar sx={{ height: "79.1px" }} />

        {outlet}
      </Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading || profileLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default DashNav;
