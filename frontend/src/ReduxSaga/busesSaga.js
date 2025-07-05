
import { call, put, takeLatest, all } from "redux-saga/effects";
import axios from "axios";
import {
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
} from "./busesSlice";


// WORKER SAGA

function* fetchBusesSaga() {
  try {
    const response = yield call(axios.get, 'http://localhost:5000/api/admin/buses/all');
    yield put(fetchBusesSuccess(response.data));
  } catch (error) {
    yield put(fetchBusesFailure(error.message));
  }
}

function* addBusSaga(action) {
  try {
    yield call(axios.post, 'http://localhost:5000/api/admin/buses/add', action.payload);
    yield put(addBusSuccess());
    yield put(fetchBusesRequest());
  } catch (error) {
    yield put(addBusFailure(error.message));
  }
}

function* updateBusSaga(action) {
  try {
    const { _id, ...data } = action.payload;
    yield call(axios.put, `${'http://localhost:5000/api/admin/buses/update'}/${_id}`, data);
    yield put(updateBusSuccess());
    yield put(fetchBusesRequest());
  } catch (error) {
    yield put(updateBusFailure(error.message));
  }
}

function* deleteBusSaga(action) {
  try {
    yield call(axios.delete, `${'http://localhost:5000/api/admin/buses/delete'}/${action.payload}`);
    yield put(deleteBusSuccess());
    yield put(fetchBusesRequest());
  } catch (error) {
    yield put(deleteBusFailure(error.message));
  }
}

// WATCHER SAGA

export default function* busSaga() {
  yield all([
    takeLatest(fetchBusesRequest.type, fetchBusesSaga),
    takeLatest(addBusRequest.type, addBusSaga),
    takeLatest(updateBusRequest.type, updateBusSaga),
    takeLatest(deleteBusRequest.type, deleteBusSaga),
  ]);
}
