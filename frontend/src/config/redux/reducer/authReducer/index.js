import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  getAllUsers,
  registerUser,
  loginUser,
  getConnectionsRequest,
  getMyConnectionRequests,
} from "../../action/authAction";

const initialState = {
  user: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  isTokenThere: false,
  profileFetched: false,
  connections: [],
  connectionRequests: [],
  all_users: [],
  all_profiles_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Logging in...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;

        state.loggedIn = true;
        state.message = "login successfull ";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "registering";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isError = false;
        state.isSuccess = true;
        state.message = "Registration successfull";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload.profile;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profiles_fetched = true;
        state.all_users = action.payload.profiles;
      })
      .addCase(getConnectionsRequest.fulfilled, (state, action) => {
        state.connections = action.payload;
      })

      .addCase(getConnectionsRequest.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
        state.connectionRequests = action.payload;
       
      })
      .addCase(getMyConnectionRequests.rejected, (state, action) => {
        state.message = action.payload;
      });
  },
});
export const {
  reset,
  handleLoginUser,
  emptyMessage,
  setTokenIsThere,
  setTokenIsNotThere,
} = authSlice.actions;
export default authSlice.reducer;
