

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/axios";

const normalizeFood = (food) => ({
  ...food,
  availability: food.isAvailable,
});

export const fetchFoods = createAsyncThunk(
  "food/fetchFoods",
  async (arg, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/foods");
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch foods"
      );
    }
  }
);

export const addFood = createAsyncThunk(
  "food/addFood",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/foods", formData);
      return normalizeFood(data.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add food"
      );
    }
  }
);

export const updateFood = createAsyncThunk(
  "food/updateFood",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/foods/${id}`, formData);
      return normalizeFood(data.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update food"
      );
    }
  }
);

export const deleteFood = createAsyncThunk(
  "food/deleteFood",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/foods/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete food"
      );
    }
  }
);

const foodSlice = createSlice({
  name: "food",

  initialState: {
    foods: [],
    loading: false,
    error: null,
    selectedFood: null,
  },

  reducers: {
    setSelectedFood: (state, action) => {
      state.selectedFood = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.foods = action.payload.map(normalizeFood);
      })

      .addCase(fetchFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(addFood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addFood.fulfilled, (state, action) => {
        state.loading = false;
        state.foods.push(action.payload);
      })

      .addCase(addFood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(updateFood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateFood.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.foods.findIndex(
          (food) => food._id === action.payload._id
        );

        if (index !== -1) {
          state.foods[index] = action.payload;
        }
      })

      .addCase(updateFood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(deleteFood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteFood.fulfilled, (state, action) => {
        state.loading = false;

        state.foods = state.foods.filter(
          (food) => food._id !== action.payload
        );
      })

      .addCase(deleteFood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedFood, clearError } = foodSlice.actions;

export default foodSlice.reducer;
