import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { sections, typography, spacing } from '../../styles/global';

class Welcome extends Component {
  render() {
    const { auth, classes } = this.props;

    if (auth.uid) return <Redirect to="/" />;

    return (
      <React.Fragment>
        <div className={`${classes.section} ${classes.black}`}>
          <Fade in={true}>
            <Fab color="primary" className={`${classes.fab} ${classes.black}`}>
              <Typography
                className={`${classes.logo} ${classes.textPrimaryInvert}`}
                variant="h3"
              >
                L
              </Typography>
            </Fab>
          </Fade>
        </div>

        <div className={`${classes.section} ${classes.verticalPaddLarge}`}>
          <Typography variant="h5" className={classes.bold}>
            Track group expenses,
          </Typography>

          <Typography variant="h5" className={classes.bold} gutterBottom>
            settle up fairly
          </Typography>

          <Typography
            variant="subtitle1"
            gutterBottom
            className={classes.verticalPaddMediumTop}
          >
            Join Ledgr today.
          </Typography>

          <Button
            component={Link}
            to="/sign-up"
            variant="contained"
            color="primary"
            size="large"
            className={classes.verticalMarginSmall}
            fullWidth
          >
            Sign Up
          </Button>

          <Button
            component={Link}
            to="/log-in"
            variant="outlined"
            color="secondary"
            size="large"
            className={classes.verticalMarginSmallTop}
            fullWidth
          >
            Log In
          </Button>
        </div>

        <div
          className={`${classes.section} ${classes.black} ${classes.banner} ${
            classes.verticalPaddMedium
          }`}
        >
          <Grid container spacing={24}>
            <Grid item xs={2}>
              <Grow in={true}>
                <AssignmentIcon className={classes.textPrimaryInvert} />
              </Grow>
            </Grid>
            <Grid item xs={10}>
              <Grow in={true}>
                <Typography
                  variant="body1"
                  className={`${classes.textPrimaryInvert} ${classes.bold}`}
                >
                  Keep track of group expenses
                </Typography>
              </Grow>
            </Grid>
            <Grid item xs={2}>
              <Grow in={true} timeout={1000}>
                <AccessibilityNewIcon className={classes.textPrimaryInvert} />
              </Grow>
            </Grid>
            <Grid item xs={10}>
              <Grow in={true} timeout={1000}>
                <Typography
                  variant="body1"
                  className={`${classes.textPrimaryInvert} ${classes.bold}`}
                >
                  Settle up fairly
                </Typography>
              </Grow>
            </Grid>
            <Grid item xs={2}>
              <Grow in={true} timeout={2000}>
                <AccountBalanceWalletIcon
                  className={classes.textPrimaryInvert}
                />
              </Grow>
            </Grid>
            <Grid item xs={10}>
              <Grow in={true} timeout={2000}>
                <Typography
                  variant="body1"
                  className={`${classes.textPrimaryInvert} ${classes.bold}`}
                >
                  Pay back efficiently
                </Typography>
              </Grow>
            </Grid>
          </Grid>
        </div>

        <div className={`${classes.section} ${classes.verticalPaddMediumTop}`}>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <Button
                component={Link}
                to="/sign-up"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Sign Up
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                component={Link}
                to="/log-in"
                variant="outlined"
                color="secondary"
                size="large"
                fullWidth
              >
                Log In
              </Button>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

const styles = theme => {
  const styles = {
    logo: {
      fontFamily: "'Shrikhand', cursive"
    },
    banner: {
      backgroundImage: 'url(/images/white-dots.jpg)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '205px 5px'
    },
    fab: {
      width: 80,
      height: 80
      // Think it looks more modern not pushed down...
      // top: theme.spacing.unit * 4
    },
    black: {
      backgroundColor: '#000000'
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

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth
  };
};

export default compose(
  connect(mapStateToProps),
  withStyles(styles)
)(Welcome);
