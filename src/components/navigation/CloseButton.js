import React from 'react';

import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import Fade from '@material-ui/core/Fade';

const CloseButton = props => {
  const { classes } = props;

  return (
    <Link to={props.location ? props.location : '/'}>
      <Fade in={true}>
        <CloseIcon color="primary" className={classes.icon} />
      </Fade>
    </Link>
  );
};

const styles = theme => {
  return {
    icon: {
      fontSize: 30,
      position: 'absolute',
      top: theme.spacing.unit * 2,
      left: theme.spacing.unit * 2
    }
  };
};

export default withStyles(styles)(CloseButton);
