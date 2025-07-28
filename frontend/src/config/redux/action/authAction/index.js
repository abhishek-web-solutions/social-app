import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";
export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/login", {
        email: user.email,
        password: user.password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    console.log(user);
    try {
      const response = await clientServer.post("/register", {
        username: user.username,
        name: user.name,
        password: user.password,
        email: user.email,
      })
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      console.log("inside catch");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_user_and_profile", {
        params: {
          token: user.token,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getAllUsers = createAsyncThunk(
  "user/getAllusers",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_all_users");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
