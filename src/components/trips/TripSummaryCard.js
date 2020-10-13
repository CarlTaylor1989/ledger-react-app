import React, { Component } from 'react';
import CountUp from 'react-countup';

import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Fade from '@material-ui/core/Fade';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import grey from '@material-ui/core/colors/grey';

import { spacing, typography, sections } from '../../styles/global';
import history from '../../history';

class TripSummaryCard extends Component {
  handleClick = () => {
    history.push(`/trip-details/${this.props.trip.id}`);
  };

  render() {
    const { classes } = this.props;
    const { trip } = this.props;
    let { totalAmount, transactionsCount } = trip;
    const { title } = trip;
    let colour = trip.colour;

    if (trip.settled) {
      colour = 'grey';
    }

    // TODO could probably handle this better
    if (!totalAmount || typeof totalAmount === 'string') {
      totalAmount = 0;
    }

    if (!transactionsCount || typeof transactionsCount === 'string') {
      transactionsCount = 0;
    }

    return (
      <div className={`${classes.root}`}>
        <div
          className={`${classes.tripSummary} ${classes[colour]}`}
          onClick={this.handleClick}
        >
          <Grid container spacing={24}>
            <Grid item xs={6}>
              {/* TODO Champion indicator */}
              {/* Champion */}
              {/* <div className={classes.championWrap}> */}
              {/* TODO optimise this image */}
              {/* <img src="/images/trophy.png" alt="trophy" className={classes.championTrophy} /> */}
              {/* <Avatar className={`${classes.avatar} ${classes.avatarChampion} ${classes.textPrimaryInvert}`}>MJ</Avatar> */}
              {/* </div> */}

              {/* Other members */}
              <div
                className={`${classes.membersWrap} ${
                  classes.verticalPaddLargeBottom
                }`}
              >
                {Object.keys(trip.users).map((userId, index) => {
                  return (
                    <Avatar
                      key={userId}
                      className={`${classes.avatar} ${classes.avatarMember} ${
                        classes.textPrimaryInvert
                      }`}
                    >
                      {trip.users[userId].initials}
                    </Avatar>
                  );
                })}
              </div>
            </Grid>

            <Grid item xs={6}>
              <div className={classes.statsWrap}>
                <div className={classes.statWrap}>
                  <Typography
                    variant="h5"
                    className={`${classes.textPrimaryInvert} ${classes.stat}`}
                  >
                    <CountUp start={-10} end={transactionsCount} />
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    className={`${classes.textPrimaryInvert} ${
                      classes.statHeading
                    }`}
                  >
                    items
                  </Typography>
                </div>

                <div className={classes.statDivider} />

                <div className={classes.statWrap}>
                  <Typography
                    variant="h5"
                    className={`${classes.textPrimaryInvert} ${classes.stat}`}
                  >
                    <CountUp end={totalAmount} decimals={2} />
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    className={`${classes.textPrimaryInvert} ${
                      classes.statHeading
                    }`}
                  >
                    £ spent
                  </Typography>
                </div>
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={24}>
            <Grid item xs={8}>
              {/* Trip title */}
              <Typography
                variant="subtitle2"
                className={`${classes.textPrimaryInvert} ${
                  classes.verticalPaddSmallTop
                }`}
              >
                {title}
              </Typography>
            </Grid>

            <Grid item xs={4} className={classes.addWrap}>
              <Typography
                variant="subtitle2"
                className={`${classes.textPrimaryInvert} ${classes.addHeading}`}
              >
                Add transaction
              </Typography>

              <Fade in={true}>
                <Fab
                  color="secondary"
                  aria-label="Add Transaction"
                  className={classes.addFab}
                >
                  <AddIcon />
                </Fab>
              </Fade>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

const styles = theme => {
  const styles = {
    root: {
      position: 'relative',
      paddingTop: theme.spacing.unit * 3,
      paddingBottom: theme.spacing.unit * 4
    },
    tripSummary: {
      boxShadow:
        '0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.07), 0px 2px 1px -1px rgba(0,0,0,0.06)',
      borderRadius: '5px',
      backgroundColor: '#fff',
      paddingTop: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      paddingLeft: theme.spacing.unit * 2
    },
    blue: {
      backgroundImage: 'linear-gradient(180deg,#64b5f6,#3d5afe)'
    },
    orange: {
      backgroundImage: 'linear-gradient(180deg,#ffca28,#f57f17)'
    },
    red: {
      backgroundImage: 'linear-gradient(180deg,#ec407a,#e53935)'
    },
    purple: {
      backgroundImage: 'linear-gradient(180deg,#673ab7,#ba68c8)'
    },
    green: {
      backgroundImage: 'linear-gradient(180deg,#69f0ae,#26a69a)'
    },
    grey: {
      backgroundImage: 'linear-gradient(180deg,#757575,#757575)'
    },
    championWrap: {
      position: 'relative'
    },
    championTrophy: {
      width: '18px',
      position: 'absolute',
      left: 8,
      top: 25
    },
    avatar: {
      margin: 10,
      color: '#fff',
      backgroundColor: 'transparent',
      borderColor: grey[50],
      border: '2px solid'
    },
    avatarChampion: {
      width: '70px',
      height: '70px',
      margin: '0 auto'
    },
    membersWrap: {
      justifyContent: 'space-around',
      marginBottom: 60
    },
    avatarMember: {
      float: 'left',
      marginTop: '10px',
      marginRight: '5px',
      marginBottom: '0',
      marginLeft: '0',
      width: '40px',
      height: '40px',
      fontSize: '17px'
    },
    statsWrap: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    statWrap: {
      textAlign: 'center'
    },
    stat: {
      display: 'inline'
    },
    statDivider: {
      width: '1px',
      height: '1.5rem',
      backgroundColor: grey[50],
      opacity: 0.5
    },
    statHeading: {
      opacity: 0.5
    },
    addHeading: {
      opacity: 0.5
    },
    addWrap: {
      position: 'relative'
    },
    addFab: {
      position: 'absolute',
      right: theme.spacing.unit,
      bottom: 35
    }
  };

  return Object.assign(
    styles,
    spacing(theme),
    sections(theme),
    typography(theme)
  );
};

export default withStyles(styles)(TripSummaryCard);
