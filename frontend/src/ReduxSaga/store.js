import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import busesReducer from './busesSlice';
import seatReducer from "./seatSlice"
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    buses: busesReducer,
    seats: seatReducer,
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false  }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
