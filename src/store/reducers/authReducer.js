import {
  SIGN_UP_SUCCESS,
  SIGN_UP_ERROR,
  LOG_OUT_SUCCESS,
  LOG_IN_SUCCESS,
  LOG_IN_ERROR
} from '../actions/types';

const initState = {
  authError: null
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        authError: null
      };
    case SIGN_UP_ERROR:
      return {
        ...state,
        authError: action.payload.message
      };
    case LOG_OUT_SUCCESS:
      return state;
    case LOG_IN_SUCCESS:
      return {
        ...state,
        authError: null
      };
    case LOG_IN_ERROR:
      return {
        ...state,
        authError: action.payload.message
      };
    default:
      return state;
  }
};

export default authReducer;
