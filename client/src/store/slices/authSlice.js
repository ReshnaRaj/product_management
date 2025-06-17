import { createSlice } from "@reduxjs/toolkit";

// pull persisted state from localStorage (if any)
const storedAuth = JSON.parse(localStorage.getItem("authState") || "{}");

const initialState = {
  user: storedAuth.user || null,
  token: storedAuth.token || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      // persist to localStorage
      localStorage.setItem("authState", JSON.stringify(state));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("authState");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
