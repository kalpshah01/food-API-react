import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import foodReducer from './foodSlice';
import orderReducer from './orderSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  food: foodReducer,
  order: orderReducer,
});

export default rootReducer;
