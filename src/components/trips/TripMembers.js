import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import grey from '@material-ui/core/colors/grey';
import pink from '@material-ui/core/colors/pink';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import { sections, typography, spacing } from '../../styles/global';
import CloseButton from '../navigation/CloseButton';
import { setMembers } from '../../store/actions/tripActions';

class TripMembers extends Component {
  state = {
    clickedUserIds: []
  };

  hanldeSubmit = event => {
    event.preventDefault();

    const newTripMembers = this.props.users.filter(user => {
      // If they were already on the trip
      if (user.id in this.props.trip.users) {
        // And they have not been unselected
        return !this.state.clickedUserIds.includes(user.id);
      } else {
        // They were not on the trip but they have been c;licked on
        return this.state.clickedUserIds.includes(user.id);
      }
    });

    this.props.setMembers(this.props.match.params.tripId, newTripMembers);
  };

  handleUserClick = user => {
    // Its the creator
    if (user.id === this.props.trip.createdById) {
      return;
    }

    let userIds = [];

    // We are just recording which users have been clicked
    // Add or remove user id from array
    if (this.state.clickedUserIds.includes(user.id)) {
      userIds = this.state.clickedUserIds.filter(id => id !== user.id);
    } else {
      userIds = [...this.state.clickedUserIds, user.id];
    }

    // Then udpate the state
    this.setState({ clickedUserIds: userIds });
  };

  setAvatarClasses(user) {
    const { classes, trip } = this.props;

    let avatarClasses = classes.avatar;

    // Its the creator
    if (user.id === trip.createdById) {
      avatarClasses += ' ' + classes.avatarSelected;

      return avatarClasses;
    }

    // If they have not been clicked on
    if (!this.state.clickedUserIds.includes(user.id)) {
      // Check if they are a member
      if (user.id in trip.users) {
        avatarClasses += ' ' + classes.avatarSelected;
      }
    } else {
      // They have been click on, so if they are not a member, highlight them
      if (!(user.id in trip.users)) {
        avatarClasses += ' ' + classes.avatarSelected;
      }
    }

    return avatarClasses;
  }

  renderUsers() {
    const { classes } = this.props;

    return (
      <Grid className={`${classes.gridContainer}`} container spacing={32}>
        {this.props.users.map((user, index) => {
          return (
            <Grow in={true} key={user.id} timeout={index * 500}>
              <Grid
                className={classes.avatarGridItem}
                item
                xs={(index + 1) % 3 === 0 ? 12 : 6}
              >
                <Avatar
                  className={this.setAvatarClasses(user)}
                  onClick={() => this.handleUserClick(user)}
                >
                  {user.initials}
                </Avatar>
                <Typography variant="overline" align="center" className={classes.verticalMarginMediumBottom}>
                  {user.username}
                </Typography>
              </Grid>
            </Grow>
          );
        })}
      </Grid>
    );
  }

  render() {
    const { classes, trip, users, tripError } = this.props;

    if (!trip || !users) {
      return <div>Loading...</div>;
    }

    let snackBar = null;

    if (tripError) {
      snackBar = (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={true}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id="message-id">{tripError}</span>}
        />
      );
    }

    return (
      <React.Fragment>
        <CloseButton location={this.props.location.closeLocation} />

        <div className={`${classes.section} ${classes.verticalPaddMediumTop}`}>
          <div className={classes.centred}>
            <Typography className={classes.logo} variant="h5" gutterBottom>
              L
            </Typography>
          </div>

          <Typography
            variant="subtitle1"
            className={`${classes.bold} ${classes.verticalPaddMediumTop}`}
            gutterBottom
          >
            Who's with you?
          </Typography>

          {this.renderUsers()}

          <form onSubmit={this.hanldeSubmit}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              className={classes.verticalMarginMediumBottom}
              fullWidth
            >
              {this.props.location.buttonText
                ? this.props.location.buttonText
                : 'Create'}
            </Button>

            {snackBar}
          </form>
        </div>
      </React.Fragment>
    );
  }
}

const styles = theme => {
  const styles = {
    logo: {
      fontFamily: "'Shrikhand', cursive",
      color: grey[900]
    },
    centred: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    avatar: {
      margin: '0 auto',
      backgroundColor: 'transparent',
      border: '2px solid',
      width: '75px',
      height: '75px',
      color: '#000',
      borderColor: '#000',
      transition: theme.transitions.create('all')
    },
    avatarSelected: {
      backgroundColor: pink['A400'],
      color: '#fff',
      borderColor: '#fff'
    },
    gridContainer: {
      marginTop: theme.spacing.unit * 5,
      marginBottom: theme.spacing.unit * 3
    },
    avatarGridItem: {
      marginTop: -5,
      paddingTop: '0 !important',
      paddingBottom: '0 !important'
    }
  };

  // Add our 'global' section class to the styles object
  return Object.assign(
    styles,
    sections(theme),
    typography(theme),
    spacing(theme)
  );
};

const mapStateToProps = (state, ownProps) => {
  const trips = state.firestore.data.trips;

  let users = state.firestore.ordered.users
    ? state.firestore.ordered.users
    : null;

  // Ensure trip creator user is always first
  if (users && trips && trips[ownProps.match.params.tripId]) {
    // Get the creator
    const creator = users.filter(
      user => user.id === trips[ownProps.match.params.tripId].createdById
    )[0];

    if (creator) {
      // Take out the creator
      users = users.filter(
        user => user.id !== trips[ownProps.match.params.tripId].createdById
      );

      // Add the creator back on top
      users.unshift(creator);
    }
  }

  return {
    tripError: state.trips.tripError,
    trip: trips ? trips[ownProps.match.params.tripId] : null, // This is where we could add in the trip id as a key if we needed, (from ownProps)
    users: users // Eventually this will be 'friends'
  };
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { setMembers }
  ),
  firestoreConnect(props => {
    // Syncs all users and trip 'based on the doc params' to the component props
    return [
      { collection: 'trips', doc: props.match.params.tripId },
      { collection: 'users' }
    ];
  })
)(TripMembers);
