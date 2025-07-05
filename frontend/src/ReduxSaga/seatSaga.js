// src/seatSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
  fetchSeatsRequest,
  fetchSeatsSuccess,
  fetchSeatsFailure,
  bookSeatsRequest,
  bookSeatsSuccess,
  bookSeatsFailure,
} from './seatSlice';

function* fetchSeats(action) {
  try {
    const { from, to,journeyDate } = action.payload;
    const response = yield call(
      axios.get,
      `http://localhost:5000/api/seats?date=${action.payload}`,{ params: { from, to, journeyDate } }
    );
    yield put(fetchSeatsSuccess(response.data));
  } catch (error) {
    yield put(fetchSeatsFailure(error.message));
  }
}

function* bookSeats(action) {
  try {
    yield call(axios.post, 'http://localhost:5000/api/book', action.payload);
    yield put(bookSeatsSuccess());
    // Refetch seats after booking
     const { from, to ,journeyDate} = action.payload;
      yield put(fetchSeatsRequest({ from, to, journeyDate }));
    // yield put(fetchSeatsRequest(action.payload.journeyDate));
  } catch (error) {
    yield put(bookSeatsFailure(error.message));
  }
}

export default function* seatSaga() {
  yield takeLatest(fetchSeatsRequest.type, fetchSeats);
  yield takeLatest(bookSeatsRequest.type, bookSeats);
}
