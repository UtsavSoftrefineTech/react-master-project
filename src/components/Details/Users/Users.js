import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  addUser,
  updateUser,
  deleteUser,
} from "../../../store/Slices/userSlice";

const User = ({ userData }) => {
  const dispatch = useDispatch();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(""); // "add", "update"
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleOpenDialog = (mode, user) => {
    setDialogMode(mode);
    setSelectedUser(user);

    if (mode === "update") {
      reset({
        firstname: user.name.firstname,
        lastname: user.name.lastname,
        username: user.username,
        email: user.email,
        phone: user.phone,
        city: user.address.city,
        street: user.address.street,
        zipcode: user.address.zipcode,
      });
    }

    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    reset({
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      phone: "",
      city: "",
      street: "",
      zipcode: "",
    });
    setDialogMode("");
    setSelectedUser(null);
    setDialogOpen(false);
  };

  const handleAddUser = (data) => {
    setLoading(true);
    dispatch(addUser(data))
      .then(() => {
        setLoading(false);
        handleCloseDialog();
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        setLoading(false);
      });
  };

  const handleUpdateUser = (data) => {
    setLoading(true);
    dispatch(updateUser({ id: selectedUser.id, data }))
      .then(() => {
        setLoading(false);
        handleCloseDialog();
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        setLoading(false);
      });
  };

  const onSubmit = (data) => {
    if (dialogMode === "add") {
      handleAddUser(data);
    } else if (dialogMode === "update") {
      handleUpdateUser(data);
    }
  };

  const handleDeleteUser = (id) => {
    setLoading(true);
    dispatch(deleteUser(id))
      .then(() => {
        setLoading(false);
        alert(`User ${id} is successfully deleted!`);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        setLoading(false);
      });
  };

  const columnDefs = [
    { headerName: "ID", field: "id", sortable: true, filter: true },
    {
      headerName: "First Name",
      field: "name.firstname",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Last Name",
      field: "name.lastname",
      sortable: true,
      filter: true,
    },
    { headerName: "Username", field: "username", sortable: true, filter: true },
    { headerName: "Email", field: "email", sortable: true, filter: true },
    { headerName: "Phone", field: "phone", sortable: true, filter: true },
    { headerName: "City", field: "address.city", sortable: true, filter: true },
    {
      headerName: "Street",
      field: "address.street",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Zipcode",
      field: "address.zipcode",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Actions",
      sortable: false,
      filter: false,
      cellRenderer: (params) => (
        <div>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleOpenDialog("update", params.data)}
            sx={{
              marginRight: "8px",
            }}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => handleDeleteUser(params.data.id)}
          >
            Delete
          </Button>
        </div>
      ),
      width: 200,
    },
  ];

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          USERS
        </Typography>
        <Button
          sx={{
            marginBottom: "16px",
          }}
          variant="contained"
          onClick={() => handleOpenDialog("add", null)}
        >
          Add User
        </Button>
      </Box>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={userData}
          domLayout="autoHeight"
          pagination={true}
          paginationPageSize={5}
        />
      </div>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogMode === "add" ? "Add New User" : "Update User"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="firstname"
              control={control}
              defaultValue=""
              rules={{
                required: "First Name is required",
                pattern: {
                  value: /^[A-Za-z]+$/i,
                  message: "Invalid First Name",
                },
              }}
              render={({ field }) => (
                <TextField
                  label="First Name"
                  fullWidth
                  margin="normal"
                  {...field}
                  error={!!errors.firstname}
                  helperText={errors.firstname?.message}
                />
              )}
            />
            <Controller
              name="lastname"
              control={control}
              defaultValue=""
              rules={{
                required: "Last Name is required",
                pattern: {
                  value: /^[A-Za-z]+$/i,
                  message: "Invalid Last Name",
                },
              }}
              render={({ field }) => (
                <TextField
                  label="Last Name"
                  fullWidth
                  margin="normal"
                  {...field}
                  error={!!errors.lastname}
                  helperText={errors.lastname?.message}
                />
              )}
            />
            <Controller
              name="username"
              control={control}
              defaultValue=""
              rules={{
                required: "Username is required",
                pattern: {
                  value: /^[A-Za-z0-9_]+$/i,
                  message: "Invalid Username",
                },
              }}
              render={({ field }) => (
                <TextField
                  label="Username"
                  fullWidth
                  margin="normal"
                  {...field}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid Email",
                },
              }}
              render={({ field }) => (
                <TextField
                  label="Email"
                  fullWidth
                  margin="normal"
                  {...field}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              rules={{ required: "Phone is required", minLength: 10 }}
              render={({ field }) => (
                <TextField
                  label="Phone"
                  fullWidth
                  margin="normal"
                  {...field}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
            <Controller
              name="city"
              control={control}
              defaultValue=""
              rules={{
                required: "City is required",
                pattern: {
                  value: /^[A-Za-z ]+$/i,
                  message: "Invalid City",
                },
              }}
              render={({ field }) => (
                <TextField
                  label="City"
                  fullWidth
                  margin="normal"
                  {...field}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              )}
            />
            <Controller
              name="street"
              control={control}
              defaultValue=""
              rules={{
                required: "Street is required",
                pattern: {
                  value: /^[A-Za-z]+[ ][A-Za-z]+$/i,
                  message: "Invalid Street",
                },
              }}
              render={({ field }) => (
                <TextField
                  label="Street"
                  fullWidth
                  margin="normal"
                  {...field}
                  error={!!errors.street}
                  helperText={errors.street?.message}
                />
              )}
            />
            <Controller
              name="zipcode"
              control={control}
              defaultValue=""
              rules={{ required: "Zipcode is required", minLength: 5 }}
              render={({ field }) => (
                <TextField
                  label="Zipcode"
                  fullWidth
                  margin="normal"
                  {...field}
                  error={!!errors.zipcode}
                  helperText={errors.zipcode?.message}
                />
              )}
            />
            <DialogActions>
              <Button onClick={handleCloseDialog} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <CircularProgress size={20} /> : "Submit"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default User;
