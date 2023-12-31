import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://fakestoreapi.com/carts";

// Async Thunk for adding a cart
export const addCart = createAsyncThunk("cart/addCart", async (data) => {
  const response = await axios.post(API_URL, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
});

// Async Thunk for updating a cart
export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ id, data }) => {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }
);

// Async Thunk for deleting a cart
export const deleteCart = createAsyncThunk("cart/deleteCart", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const initialState = {
  carts: [],
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.carts.push(action.payload);
      })
      .addCase(addCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedCart = action.payload;
        const index = state.carts.findIndex((c) => c.id === updatedCart.id);
        if (index !== -1) {
          state.carts[index] = updatedCart;
        }
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedCartId = action.payload;
        state.carts = state.carts.filter((c) => c.id !== deletedCartId);
      })
      .addCase(deleteCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
