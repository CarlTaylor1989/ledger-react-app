import {
  SIGN_UP_SUCCESS,
  SIGN_UP_ERROR,
  LOG_OUT_SUCCESS,
  LOG_IN_SUCCESS,
  LOG_IN_ERROR
} from './types';

export const signUp = newUser => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();

    const firestore = getFirestore();

    firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then(response => {
        return firestore
          .collection('users')
          .doc(response.user.uid)
          .set({
            username: newUser.username,
            initials: getInitialsFromUsername(newUser.username)
          });
      })
      .then(() => {
        dispatch({ type: SIGN_UP_SUCCESS });
      })
      .catch(err => {
        dispatch({ type: SIGN_UP_ERROR, payload: err });
      });
  };
};

const getInitialsFromUsername = function(username) {
  const letterNumber = /^[0-9a-zA-Z]+$/;
  let initalsString = '';

  var initialsArray = username.split(' ', 2).map(function(item) {
    return item[0];
  });

  // Make sure we only return alpha numeric characters
  for (let i = 0; i < initialsArray.length; i++) {
    initalsString += initialsArray[i].match(letterNumber)
      ? initialsArray[i]
      : '';
  }

  return initalsString;
};

export const logIn = credentials => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        dispatch({ type: LOG_IN_SUCCESS });
      })
      .catch(err => {
        dispatch({ type: LOG_IN_ERROR, payload: err });
      });
  };
};

export const logOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: LOG_OUT_SUCCESS });
      });
  };
};
