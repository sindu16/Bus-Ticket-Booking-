
import { createSlice } from '@reduxjs/toolkit';

const seatSlice = createSlice({
  name: 'seat',
  initialState: {
    seats: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchSeatsRequest: (state) => {
      state.loading = true;
    },
    fetchSeatsSuccess: (state, action) => {
      state.loading = false;
      state.seats = action.payload;
    },
    fetchSeatsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    bookSeatsRequest: (state) => {
      state.loading = true;
    },
    bookSeatsSuccess: (state) => {
      state.loading = false;
    },
    bookSeatsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchSeatsRequest,
  fetchSeatsSuccess,
  fetchSeatsFailure,
  bookSeatsRequest,
  bookSeatsSuccess,
  bookSeatsFailure,
} = seatSlice.actions;

export default seatSlice.reducer;
