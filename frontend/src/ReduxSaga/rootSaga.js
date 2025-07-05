import { all } from 'redux-saga/effects';
import busSaga from './busesSaga';
import seat from './seatSaga';


export default function* rootSaga() {
  yield all([
    busSaga(),
    seat(),
    
    
  ]);
}