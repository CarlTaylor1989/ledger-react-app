import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import { sections, typography, spacing, colours } from '../../styles/global';
import TripSummaryCard from '../trips/TripSummaryCard';
import Nav from '../navigation/Nav';

class Dashboard extends Component {
  renderTripsList() {
    const { classes } = this.props;

    if(!this.props.trips.length) {
      return <LinearProgress variant="query" className={classes.verticalMarginMediumTop} />
    }

    return this.props.trips.map(trip => {
      return <TripSummaryCard key={trip.id} colour={trip} trip={trip} />;
    });
  }

  render() {
    const { auth, classes } = this.props;

    if (!auth.uid) return <Redirect to="/welcome" />;

    return (
      <React.Fragment>
        <Nav />

        <div className={`${classes.section} ${classes.verticalPaddMedium}`}>
          <div className={classes.textCenter}>
            <Typography variant="h5" gutterBottom>
              Are you going out out?
            </Typography>

            <Typography variant="h5" className={classes.bold} gutterBottom>
              Ledgr it
            </Typography>

            <Typography variant="body1" gutterBottom>
              Take the hassle out of tracking and calculating group expenses.
              Ledgr lets you concentrate on having fun!
            </Typography>

            <div className={classes.verticalPaddMedium}>
              <Button
                component={Link}
                to="/create-trip"
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
              >
                Add Trip
              </Button>
            </div>
          </div>

          {this.renderTripsList()}
        </div>
      </React.Fragment>
    );
  }
}

// TODO add authenticaed api layer to do this?
// Make this (and similar in other files) a private method
// and use rewire in the test instead - https://www.npmjs.com/package/rewire
// (Couldn't get to work so may need to find another solution)
export const filterTrips = (trips, uid, showAllTrips) => {
  if (showAllTrips) {
    return trips;
  }

  const filteredTrips = trips ? trips.filter(trip => {
    return trip.createdById === uid || (uid in trip.users);
  }) : trips;

  return filteredTrips;
}

const styles = theme => {
  const styles = {};

  // Add our 'global' section class to the styles object
  return Object.assign(
    styles,
    sections(theme),
    typography(theme),
    spacing(theme),
    colours(theme)
  );
};

const mapStateToProps = state => {
  const { ordered, data } = state.firestore;

  const { uid } = state.firebase.auth;

  const showAllTrips = data.config ? data.config["4Qc7hfGLfLW178xWgNSa"]["showAllTrips"] : false;

  const filteredTrips = filterTrips(ordered.trips, uid, showAllTrips);

  return {
    auth: state.firebase.auth,
    trips: filteredTrips || []
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'trips', orderBy: ['createdAt', 'desc'] },
    { collection: 'config' }
  ]),
  withStyles(styles)
)(Dashboard);
