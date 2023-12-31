import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://fakestoreapi.com/products";

// Async Thunk for adding a product
export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (data) => {
    const response = await axios.post(API_URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }
);

// Async Thunk for updating a product
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, data }) => {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }
);

// Async Thunk for deleting a product
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

const initialState = {
  products: [],
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Loading state management for all three actions
    builder
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedProduct = action.payload;
        const index = state.products.findIndex(
          (p) => p.id === updatedProduct.id
        );
        if (index !== -1) {
          state.products[index] = updatedProduct; // replace the old product with the updated one
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedProductId = action.payload;
        state.products = state.products.filter(
          (p) => p.id !== deletedProductId
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
