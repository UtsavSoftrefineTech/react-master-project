import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { auth, db } from "./Auth/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, setDoc, doc } from "firebase/firestore";
import {
  setUser,
  setLoading,
  setError,
  clearError,
} from "../../store/Slices/authSlice";

const Navbar = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const { isLoading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleOpenLoginDialog = () => {
    setOpenLogin(true);
    dispatch(clearError());
  };

  const handleOpenSignUpDialog = () => {
    setOpenSignUp(true);
    dispatch(clearError());
  };

  const handleCloseDialog = () => {
    setOpenLogin(false);
    setOpenSignUp(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    dispatch(clearError());
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSignIn = async () => {
    try {
      dispatch(setLoading(true));
      await signInWithEmailAndPassword(auth, email, password);

      // Fetch user data after sign-in
      const currentUser = auth.currentUser;

      // Update login state
      dispatch(setUser(currentUser));

      handleCloseDialog();
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSignUp = async () => {
    try {
      dispatch(setLoading(true));
      // Ensure that password is not empty and matches confirm password
      if (!password || password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Fetch user data after sign-up
      const newUser = userCredential.user;

      // Store user data in Firestore user profiles collection
      if (newUser) {
        const usersCollection = collection(db, "user_profiles");

        // Use UID as the document ID
        await setDoc(doc(usersCollection, newUser.uid), {
          email: newUser.email,
          password: password,
        });
      }

      // Update login state
      dispatch(setUser(newUser));

      handleCloseDialog();
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      await signOut(auth);

      // Update login state
      dispatch(setUser(null));
    } catch (error) {
      console.error("Error signing out:", error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      dispatch(setLoading(true));
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      handleCloseDialog();
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold", color: "white" }}
          >
            React Master Project
          </Typography>
          <div>
            {user ? (
              <Button variant="contained" color="error" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="info"
                  sx={{ mr: 2 }}
                  onClick={handleOpenLoginDialog}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleOpenSignUpDialog}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>

      {/* LOGIN DIALOG */}
      <Dialog open={openLogin} onClose={handleCloseDialog}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={handleEmailChange}
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={handlePasswordChange}
            margin="normal"
          />
          <Button
            variant="contained"
            sx={{ mt: 2, width: "100%" }}
            color="info"
            onClick={handleSignInWithGoogle}
          >
            Sign In with Google
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSignIn} disabled={isLoading}>
            Sign In
          </Button>
        </DialogActions>
        {error && (
          <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
            {error}
          </Typography>
        )}
      </Dialog>

      {/* SIGNUP DIALOG */}
      <Dialog open={openSignUp} onClose={handleCloseDialog}>
        <DialogTitle>Sign Up</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={handleEmailChange}
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={handlePasswordChange}
            margin="normal"
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <Button
            variant="contained"
            sx={{ mt: 2, width: "100%" }}
            color="info"
            onClick={handleSignInWithGoogle}
          >
            Sign Up with Google
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSignUp}
            disabled={isLoading || password !== confirmPassword}
          >
            Sign Up
          </Button>
        </DialogActions>
        {error && (
          <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
            {error}
          </Typography>
        )}
      </Dialog>
    </>
  );
};

export default Navbar;
