import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { compose } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import grey from '@material-ui/core/colors/grey';

import CloseButton from '../navigation/CloseButton';
import { logIn } from '../../store/actions/authActions';
import { sections, typography, spacing } from '../../styles/global';

class LogIn extends Component {
  state = {
    email: '',
    password: '',
    snackOpen: true
  };

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  hanldeSubmit = e => {
    e.preventDefault();

    this.setState({ snackOpen: true });

    this.props.submitting.isSubmitting = true;

    this.props.logIn(this.state);
  };

  handleSnackClose = () => {
    this.setState({ snackOpen: false });
  };

  render() {
    const { auth, authError, classes, submitting } = this.props;

    // Go to Dashboard if logged in
    if (auth.uid) return <Redirect to="/" />;

    let snackBar = null;

    if (authError) {
      snackBar = (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={this.state.snackOpen && !submitting.isSubmitting}
          onClose={this.handleSnackClose}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id="message-id">{authError}</span>}
        />
      );
    }

    // Go to Dashboard if logged in
    if (auth.uid) return <Redirect to="/" />;

    return (
      <React.Fragment>
        <CloseButton />

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
            Log in to Ledgr
          </Typography>

          <form onSubmit={this.hanldeSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email" type="email">
                Email
              </InputLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                onChange={this.handleChange}
              />
            </FormControl>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={this.handleChange}
              />
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              className={classes.verticalMarginMediumTop}
              fullWidth
            >
              Log in
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
    auth: state.firebase.auth,
    authError: state.auth.authError,
    submitting: state.auth.submitting
      ? { isSubmitting: true }
      : { isSubmitting: false }
  };
};

export default compose(
  connect(
    mapStateToProps,
    { logIn }
  ),
  withStyles(styles)
)(LogIn);
