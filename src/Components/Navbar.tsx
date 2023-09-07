import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Toolbar,
  Menu,
  Container,
  Button,
  Typography,
  MenuItem,
  IconButton,
} from "@mui/material";
import logo from "../assets/logo-no-background (2).png";
import { useNavigate, useLocation } from "react-router-dom";

const pages = ["Dashboard", "Features", "Testimonials", "FAQ", "Login"];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const location = useLocation();
  let currentPath = false;
  if (location.pathname == "/signup" || location.pathname == "/login") {
    currentPath = true;
  }

  const handleCloseNavMenu = (page: string) => {
    setAnchorElNav(null);
    if (page !== "Login") {
      const element = document.getElementById(page);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else return navigate("/login");
  };

  return (
    <AppBar
      sx={{ backgroundColor: "#0f1012", backgroundImage: "none" }}
      position="static"
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters={false}>
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textTransform: "none",
            }}
          >
            <img src={logo} style={{ height: "6rem", padding: "1rem 0" }} />
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{
                textTransform: "none",
                display: currentPath ? "none" : "inline-block",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    return handleCloseNavMenu(page);
                  }}
                >
                  <Typography
                    textAlign="center"
                    sx={{
                      textTransform: "none",
                      fontSize: "1rem",
                    }}
                  >
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box
            component="div"
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              ":hover": {
                cursor: "pointer",
              },
            }}
          >
            <img src={logo} style={{ height: "3rem" }} />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: {
                xs: "none",
                md: "flex",
                justifyContent: "flex-end",
                marginRight: "1rem",
              },
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleCloseNavMenu(page)}
                sx={{
                  my: 2,
                  color: "white",

                  textTransform: "none",
                  fontSize: "1rem",
                  display: currentPath ? "none" : "block",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
