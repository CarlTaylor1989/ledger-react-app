import {
  TRIP_CREATE_ERROR,
  TRIP_SET_MEMBER_ERROR,
  TRIP_SETTLE_ERROR
} from '../actions/types';

const initState = {
  tripError: null
};

const tripReducer = (state = initState, action) => {
  switch (action.type) {
    case TRIP_CREATE_ERROR:
    case TRIP_SET_MEMBER_ERROR:
    case TRIP_SETTLE_ERROR:
      return {
        ...state,
        tripError: action.payload.message
      };
    default:
      return state;
  }
};

export default tripReducer;
