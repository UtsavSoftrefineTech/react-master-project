import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import "./Cart.css";
import {
  addCart,
  updateCart,
  deleteCart,
} from "../../../store/Slices/cartSlice";
import { CircularProgress } from "@mui/material";

const Cart = ({ cartData }) => {
  const dispatch = useDispatch();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(""); // "add", "update"
  const [selectedCart, setSelectedCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newCart, setNewCart] = useState({
    userId: "",
    date: "",
    products: [],
  });

  const handleOpenDialog = (mode, cart) => {
    setDialogMode(mode);
    setSelectedCart(cart);

    if (mode === "update") {
      setNewCart({
        userId: cart.userId,
        date: cart.date,
        products: cart.products.map((product) => ({
          productId: product.productId,
          quantity: product.quantity,
        })),
      });
    }

    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setNewCart({
      userId: "",
      date: "",
      products: [],
    });
    setDialogMode("");
    setSelectedCart(null);
    setDialogOpen(false);
  };

  const handleAddCart = () => {
    setLoading(true);
    dispatch(addCart(newCart))
      .then(() => {
        setLoading(false);
        handleCloseDialog();
      })
      .catch((error) => {
        console.error("Error adding cart:", error);
        setLoading(false);
      });
  };

  const handleUpdateCart = () => {
    setLoading(true);
    dispatch(updateCart({ id: selectedCart.id, data: newCart }))
      .then(() => {
        setLoading(false);
        handleCloseDialog();
      })
      .catch((error) => {
        console.error("Error updating cart:", error);
        setLoading(false);
      });
  };

  const handleDeleteCart = (id) => {
    setLoading(true);
    dispatch(deleteCart(id))
      .then(() => {
        setLoading(false);
        alert("Cart deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting cart:", error);
        setLoading(false);
      });
  };

  const handleProductInputChange = (e, index, field) => {
    const { value } = e.target;
    const updatedProducts = [...newCart.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };
    setNewCart((prevCart) => ({
      ...prevCart,
      products: updatedProducts,
    }));
  };

  const handleAddProductField = () => {
    setNewCart((prevCart) => ({
      ...prevCart,
      products: [...prevCart.products, { productId: "", quantity: "" }],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCart((prevCart) => ({
      ...prevCart,
      [name]: value,
    }));
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          CARTS
        </Typography>
        <Button
          sx={{
            marginBottom: "16px",
          }}
          variant="contained"
          onClick={() => handleOpenDialog("add", null)}
        >
          Add Cart
        </Button>
      </Box>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogMode === "add" ? "Add New Cart" : "Update Cart"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="User ID"
            name="userId"
            value={newCart.userId}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            value={newCart.date}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          {newCart.products.map((product, index) => (
            <div key={index}>
              <TextField
                label={`Product ${index + 1} ID`}
                name={`productId`}
                value={product.productId}
                onChange={(e) =>
                  handleProductInputChange(e, index, "productId")
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label={`Product ${index + 1} Quantity`}
                name={`quantity`}
                type="number"
                value={product.quantity}
                onChange={(e) => handleProductInputChange(e, index, "quantity")}
                fullWidth
                margin="normal"
              />
            </div>
          ))}

          <Button onClick={handleAddProductField}>Add Product</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          {dialogMode === "add" ? (
            <Button onClick={handleAddCart} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : "Add"}
            </Button>
          ) : (
            <Button onClick={handleUpdateCart} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : "Update"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <div className="custom-scroll">
        {cartData &&
          cartData.length > 0 &&
          cartData.map((cartItem) => (
            <Paper
              key={cartItem.id}
              elevation={3}
              sx={{ m: 4, p: 4, mr: "auto" }}
            >
              <Typography variant="subtitle1">
                <span style={{ fontWeight: "bold" }}>User ID:</span>{" "}
                {cartItem.userId || "N/A"}
              </Typography>
              <Typography variant="subtitle1">
                <span style={{ fontWeight: "bold" }}>Date:</span>{" "}
                {cartItem.date || "N/A"}
              </Typography>
              <Typography variant="subtitle1">
                <span style={{ fontWeight: "bold" }}>Products:</span>
              </Typography>
              {cartItem.products && cartItem.products.length > 0 ? (
                <List sx={{ padding: 0 }}>
                  {cartItem.products.map((product) => (
                    <ListItem key={product.productId} sx={{ padding: 0 }}>
                      <ListItemText
                        primary={`Product ID: ${product.productId}, Quantity: ${product.quantity}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2">
                  No products in the cart.
                </Typography>
              )}
              <Box
                sx={{
                  marginTop: "16px",
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    marginRight: "8px",
                  }}
                  onClick={() => handleOpenDialog("update", cartItem)}
                >
                  Update
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteCart(cartItem.id)}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          ))}
      </div>
    </>
  );
};

export default Cart;
