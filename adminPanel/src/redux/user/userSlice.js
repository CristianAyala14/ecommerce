import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  error: null,

  // 🔐 auth
  loading: false,
  isAuthenticated: false,
  accessToken: null,

  // 👤 profile
  profileLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /* ================= RESET ================= */

    defaultState: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
      state.profileLoading = false;
      state.isAuthenticated = false;
      state.accessToken = null;
    },

    errorStart: (state) => {
      state.error = null;
    },

    /* ================= AUTH ================= */

    signInStart: (state) => {
      state.loading = true;
    },

    signInSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = true;
    },

    signInFailure: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    /* ================= UPDATE USER ================= */

    updateUserStart: (state) => {
      state.profileLoading = true; // ✅ SOLO profile
    },

    updateUserSuccess: (state, action) => {
      state.user = action.payload;
      state.profileLoading = false;
      state.error = null;
      // ❌ NO tocar isAuthenticated
    },

    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.profileLoading = false;
    },

    /* ================= DELETE USER ================= */

    deleteUserStart: (state) => {
      state.loading = true;
    },

    deleteUserSuccess: (state) => {
      state.user = null;
      state.loading = false;
      state.profileLoading = false;
      state.error = null;
      state.isAuthenticated = false;
      state.accessToken = null;
    },

    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    /* ================= TOKEN ================= */

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const {
  signInFailure,
  signInSuccess,
  signInStart,
  errorStart,
  defaultState,
  setAccessToken,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
