import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axios';



export const fetchOrders = createAsyncThunk('order/fetchOrders', async (arg, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

export const updateOrderStatus = createAsyncThunk('order/updateOrderStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/orders/${id}/status`, { status });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
  }
});



const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        //state.orders = Array.isArray(payload) ? payload : payload?.data || payload?.orders || [];
        state.orders = action.payload.orders;
      })
      .addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.orders = []; state.error = action.payload || 'Failed to fetch orders'; })

      .addCase(updateOrderStatus.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        const order = action.payload.orders;
        const index = state.orders.findIndex(o => o._id === order._id);
        if (index !== -1) state.orders[index] = order;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Failed to update order status'; });
  },
});

export const { clearError } = orderSlice.actions;
export default orderSlice.reducer;
