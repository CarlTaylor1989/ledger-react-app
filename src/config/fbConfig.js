import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyAMn6MSEJZlC5cXvAAOu0CsBtWJ2P6u-9E',
  authDomain: 'ledgr-2b5aa.firebaseapp.com',
  databaseURL: 'https://ledgr-2b5aa.firebaseio.com',
  projectId: 'ledgr-2b5aa',
  storageBucket: 'ledgr-2b5aa.appspot.com',
  messagingSenderId: '135745693722'
};

firebase.initializeApp(config);
// firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase;
