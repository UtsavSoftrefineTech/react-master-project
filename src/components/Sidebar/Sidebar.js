import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { styled, ThemeProvider, createTheme } from "@mui/material";
import { FaProductHunt, FaShoppingCart, FaUser } from "react-icons/fa";

const theme = createTheme(); // Create a default theme

const StyledList = styled(List)(({ theme }) => ({
  bottom: 0,
  backgroundColor: "#212121",
  color: "white",
  height: "calc(100vh - 64px)",
  width: "20%",
  [theme.breakpoints.down("sm")]: {
    // Apply styles when screen size is less than 700px
    display: "flex",
    justifyContent: "space-between",
    position: "fixed",
    zIndex: 1,
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: "auto",
  },
}));

const StyledListItem = styled(ListItem)({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#424242",
  },
});

const Sidebar = ({ handleMenuClick }) => {
  return (
    <ThemeProvider theme={theme}>
      <StyledList>
        <StyledListItem onClick={() => handleMenuClick("products")}>
          <FaProductHunt style={{ marginRight: "8px" }} />
          <ListItemText primary="Product" />
        </StyledListItem>
        <StyledListItem onClick={() => handleMenuClick("carts")}>
          <FaShoppingCart style={{ marginRight: "8px" }} />
          <ListItemText primary="Cart" />
        </StyledListItem>
        <StyledListItem onClick={() => handleMenuClick("users")}>
          <FaUser style={{ marginRight: "8px" }} />
          <ListItemText primary="User" />
        </StyledListItem>
      </StyledList>
    </ThemeProvider>
  );
};

export default Sidebar;
