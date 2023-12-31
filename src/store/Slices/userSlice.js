import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/users";

// Async Thunk for adding a user
export const addUser = createAsyncThunk("user/addUser", async (data) => {
  const response = await axios.post(API_URL, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
});

// Async Thunk for updating a user
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, data }) => {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }
);

// Async Thunk for deleting a user
export const deleteUser = createAsyncThunk("user/deleteUser", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const initialState = {
  users: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedUser = action.payload;
        const index = state.users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedUserId = action.payload;
        state.users = state.users.filter((u) => u.id !== deletedUserId);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
