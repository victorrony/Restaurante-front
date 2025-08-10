import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, LoginRequest, LoginResponse, User } from "../../types";
import { authAPI } from "../../services/api";

const storedToken = localStorage.getItem("token");
let storedUser: User | null = null;
try {
   const raw = localStorage.getItem("user");
   if (raw) storedUser = JSON.parse(raw);
} catch {}
const initialState: AuthState = {
   isAuthenticated: !!storedToken,
   user: storedUser,
   token: storedToken,
   loading: false,
   error: null,
};

// Async thunks
export const login = createAsyncThunk("auth/login", async (credentials: LoginRequest, { rejectWithValue }) => {
   try {
      const response = await authAPI.login(credentials);
      localStorage.setItem("token", response.token);
      return response;
   } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Erro no login");
   }
});

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async (_, { rejectWithValue }) => {
   try {
      const response = await authAPI.getCurrentUser();
      return response;
   } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Erro ao buscar usuário");
   }
});

export const register = createAsyncThunk(
   "auth/register",
   async (userData: Omit<User, "id" | "createdAt" | "active"> & { password: string }, { rejectWithValue }) => {
      try {
         const response = await authAPI.register(userData);
         return response;
      } catch (error: any) {
         return rejectWithValue(error.response?.data?.message || "Erro no registro");
      }
   }
);

const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      logout: (state) => {
         state.isAuthenticated = false;
         state.user = null;
         state.token = null;
         state.error = null;
         localStorage.removeItem("token");
         localStorage.removeItem("user");
      },
      clearError: (state) => {
         state.error = null;
      },
      setToken: (state, action: PayloadAction<string>) => {
         state.token = action.payload;
         state.isAuthenticated = true;
         localStorage.setItem("token", action.payload);
      },
   },
   extraReducers: (builder) => {
      builder
         // Login
         .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
            try {
               localStorage.setItem("user", JSON.stringify(action.payload.user));
            } catch {}
         })
         .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
         })
         // Get Current User
         .addCase(getCurrentUser.pending, (state) => {
            state.loading = true;
         })
         .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            try {
               localStorage.setItem("user", JSON.stringify(action.payload));
            } catch {}
         })
         .addCase(getCurrentUser.rejected, (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
         })
         // Register
         .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(register.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
         })
         .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
         });
   },
});

export const { logout, clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
