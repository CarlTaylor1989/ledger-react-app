import {
  TRANSACTION_CREATE_ERROR,
  TRANSACTION_CREATE_SUCCESS,
  TRANSACTION_EDIT_SUCCESS,
  TRANSACTION_EDIT_ERROR,
  TRANSACTION_DELETE_SUCCESS,
  TRANSACTION_DELETE_ERROR
} from '../actions/types';

const initState = {
  transactionError: null
};

const transactionReducer = (state = initState, action) => {
  switch (action.type) {
    case TRANSACTION_CREATE_SUCCESS:
    case TRANSACTION_EDIT_SUCCESS:
    case TRANSACTION_DELETE_SUCCESS:
      return {
        ...state,
        transactionLoading: null,
        transactionError: null
      };
    case TRANSACTION_CREATE_ERROR:
    case TRANSACTION_EDIT_ERROR:
    case TRANSACTION_DELETE_ERROR:
      return {
        ...state,
        transactionError: action.payload.message
      };
    default:
      return state;
  }
};

export default transactionReducer;
