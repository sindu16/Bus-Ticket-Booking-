import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    buses:[],
    loading:false,
    error:null,
    successMessage:null,
};

const busesSlice = createSlice({
    name:'buses',
    initialState,
    reducers:{

    // GET Buses

    fetchBusesRequest: (state) => {
      state.loading = true;
    },
    fetchBusesSuccess: (state, action) => {
      state.buses = action.payload;
      state.loading = false;
    },
    fetchBusesFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ADD Bus

    addBusRequest: (state) => {
      state.loading = true;
    },
    addBusSuccess: (state, action) => {
      state.successMessage = action.payload;
    },
    addBusFailure: (state, action) => {
      state.error = action.payload;
    },

    // UPDATE BUS

     updateBusRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateBusSuccess: (state) => {
      state.loading = false;
    },
    updateBusFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // DELETE BUS
    
    deleteBusRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteBusSuccess: (state) => {
      state.loading = false;
    },
    deleteBusFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    }

    
})

export const {
  fetchBusesRequest,
  fetchBusesSuccess,
  fetchBusesFailure,
  addBusRequest,
  addBusSuccess,
  addBusFailure,
  updateBusRequest,
  updateBusSuccess,
  updateBusFailure,
  deleteBusRequest,
  deleteBusSuccess,
  deleteBusFailure,
} = busesSlice.actions;

export default busesSlice.reducer