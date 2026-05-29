import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axios';



export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    const token = data.token || data.data?.token;
    const user = data.user || data.data?.user || data.data;
    if (!token) 
      {
        return rejectWithValue('No token received from server');
      }
    localStorage.setItem('token', token);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    return { token, user };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', formData);
    const token = data.token || data.data?.token;
    const user = data.user || data.data?.user || data.data;
    if (!token) {
      return rejectWithValue('No token received from server');
    }
    localStorage.setItem('token', token);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    return { token, user };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async (arg, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
  }
});





const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Login failed'; })

      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Registration failed'; })

      .addCase(fetchAuthMe.pending, (state) => { state.loading = true; })
      .addCase(fetchAuthMe.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
      
        state.user = payload.user;
        state.token = payload.token;
        state.isAuthenticated = true;
      })
      .addCase(fetchAuthMe.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Failed to fetch user'; });

  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
