import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

import { signUp } from '../../store/actions/authActions';
import CloseButton from '../navigation/CloseButton';
import { sections, typography, spacing } from '../../styles/global';

class SignUp extends Component {
  state = {
    email: '',
    password: '',
    username: '',
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

    // Anti patern for a component to update its own props but this is the only way
    // I can see to stop a snack showing existing error message on submit
    this.props.submitting.isSubmitting = true;

    this.props.signUp(this.state);
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
            Create your account
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

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                placeholder="E.g. Max Jennings"
                onChange={this.handleChange}
              />
            </FormControl>

            <Button
              color="secondary"
              size="large"
              type="submit"
              className={classes.verticalMarginMediumTop}
              fullWidth
            >
              Sign Up
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
    { signUp }
  ),
  withStyles(styles)
)(SignUp);
