import React, { useState } from "react";
import { CssBaseline, Box } from "@mui/material";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Main from "./components/Details/Main";
import { Provider } from "react-redux";
import store from "./store/store";

function App() {
  const [selectedMenu, setSelectedMenu] = useState("products");

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <Provider store={store}>
      <div style={{ position: "relative" }}>
        <CssBaseline />
        <Navbar />
        <Box>
          <Box display="flex">
            <Sidebar handleMenuClick={handleMenuClick} />
            <Main selectedMenu={selectedMenu} />
          </Box>
        </Box>
      </div>
    </Provider>
  );
}

export default App;
