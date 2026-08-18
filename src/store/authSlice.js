import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginWithApi, registerWithApi } from "../services/authApi";
import {
  clearAuthSession,
  readAuthSession,
  saveAuthSession,
} from "../utils/authStorage";

const savedSession = readAuthSession();

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const session = await loginWithApi(email.trim().toLowerCase(), password);
      saveAuthSession(session);
      return session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      return await registerWithApi(name.trim(), email.trim().toLowerCase(), password);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedSession?.user ?? null,
    token: savedSession?.token ?? null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to sign in";
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to create account";
      });
  },
});

export const { clearAuth, clearAuthError } = authSlice.actions;

export function logoutUser() {
  return (dispatch) => {
    clearAuthSession();
    dispatch(clearAuth());
  };
}

export default authSlice.reducer;
