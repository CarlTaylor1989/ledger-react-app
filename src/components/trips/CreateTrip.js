import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

import { createTrip } from '../../store/actions/tripActions';
import { sections, typography, spacing } from '../../styles/global';
import CloseButton from '../navigation/CloseButton';

class CreateTrip extends Component {
  state = {
    title: ''
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  hanldeSubmit = event => {
    event.preventDefault();

    this.props.createTrip(this.state.title);
  };

  render() {
    const { classes, tripError } = this.props;

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
            Create a Trip
          </Typography>

          <form onSubmit={this.hanldeSubmit}>
            <FormControl margin="normal" required fullWidth>
              <TextField
                id="outlined-name"
                label="Title"
                value={this.state.title}
                margin="normal"
                variant="outlined"
                autoFocus
                required
                autoComplete="off"
                onChange={this.handleChange('title')}
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
              Next
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

  return Object.assign(
    styles,
    sections(theme),
    typography(theme),
    spacing(theme)
  );
};

const mapStateToProps = state => {
  return {
    tripError: state.trips.tripError
  };
};

export default compose(
  connect(
    mapStateToProps,
    { createTrip }
  ),
  withStyles(styles)
)(CreateTrip);
