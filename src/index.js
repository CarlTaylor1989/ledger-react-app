import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import { reduxFirestore, getFirestore } from 'redux-firestore';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import App from './components/App';
import rootReducer from './store/reducers/rootReducer';
import fbConfig from './config/fbConfig';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(
    // Combine multiple store enhancers with compose()
    compose(
      applyMiddleware(
        reduxThunk.withExtraArgument({
          getFirebase,
          getFirestore
        })
      ),
      reduxFirestore(fbConfig),
      reactReduxFirebase(fbConfig, {
        useFirestoreForProfile: true,
        userProfile: 'users',
        attachAuthIsReady: true
      })
    )
  )
);

store.firebaseAuthIsReady.then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector('#root')
  );
});
