import React, { useState, useEffect } from "react";
import axios from "axios";
import Cart from "./Cart/Cart";
import Product from "./Product/Product";
import User from "./Users/Users";
import { Box, styled, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme(); // Create a default theme

const StyledMain = styled(Box)(({ theme }) => ({
  width: "80%",
  padding: "10px",
  [theme.breakpoints.down("sm")]: {
    // Apply styles when screen size is less than 700px
    width: "100%",
  },
}));

const Main = ({ selectedMenu }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://fakestoreapi.com/${selectedMenu}`
        );
        const data = response.data;
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedMenu]);

  return (
    <ThemeProvider theme={theme}>
      <StyledMain>
        {selectedMenu === "carts" && <Cart cartData={data} />}
        {selectedMenu === "products" && <Product productData={data} />}
        {selectedMenu === "users" && <User userData={data} />}
      </StyledMain>
    </ThemeProvider>
  );
};

export default Main;
