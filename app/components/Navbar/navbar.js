import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Link from "next/link";

const NavbarContainer = styled(AppBar)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.primary.main,
}));

const NavbarLink = styled(Link)(({ theme }) => ({
  color: "#fff",
  textDecoration: "none",
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  "&:hover": {
    color: theme.palette.primary.light,
  },
}));

const NavbarTypography = styled(Typography)(({ theme }) => ({
  cursor: "pointer",
  color: "#fff",
  "&:hover": {
    color: theme.palette.primary.light,
  },
}));

const Navbar = () => {
  return (
    <NavbarContainer position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <NavbarLink href="/" passHref>
          <NavbarTypography variant="h6" component="div">
            CrowdFund
          </NavbarTypography>
        </NavbarLink>
        <NavbarLink href="/campaigns/new" passHref>
          <Button color="inherit">Create Campaign</Button>
        </NavbarLink>
      </Toolbar>
    </NavbarContainer>
  );
};

export default Navbar;
