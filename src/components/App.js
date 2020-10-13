import React, { Component } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dashboard from './dashboard/Dashboard';
import SignUp from './auth/SignUp';
import LogIn from './auth/LogIn';
import Welcome from './auth/Welcome';
import CreateTrip from './trips/CreateTrip';
import TripMembers from './trips/TripMembers';
import TripDetails from './trips/TripDetails';
import history from '../history';

// Mui
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

// Mui example
import Blog from './Blog';
import SignInExample from './SignInExample';
import CreateTransaction from './trips/transactions/CreateTransaction';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Router history={history}>
          <div>
            <Switch>
              {/* Auth */}
              <Route path="/welcome" exact component={Welcome} />
              <Route path="/sign-up" exact component={SignUp} />
              <Route path="/log-in" exact component={LogIn} />

              {/* Dashboard */}
              <Route path="/" exact component={Dashboard} />

              {/* Trips */}
              <Route path="/create-trip" exact component={CreateTrip} />
              <Route
                path="/trip-members/:tripId"
                exact
                component={TripMembers}
              />
              <Route
                path="/trip-details/:tripId"
                exact
                component={TripDetails}
              />
              <Route
                path="/trip-transaction-add/:tripId"
                exact
                component={CreateTransaction}
              />

              <Route path="/example-blog" exact component={Blog} />
              <Route path="/example-sign-in" exact component={SignInExample} />
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      light: grey[600],
      main: '#000000',
      dark: grey[900],
      contrastText: grey[50]
    }
  }
});

export default App;
