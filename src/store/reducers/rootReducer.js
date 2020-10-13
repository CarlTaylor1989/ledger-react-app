import { combineReducers } from 'redux';
import authReducer from './authReducer';
import tripReducer from './tripReducer';
import transactionReducer from './transactionReducer';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';

const rootReducer = combineReducers({
  auth: authReducer,
  trips: tripReducer,
  transactions: transactionReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

export default rootReducer;
