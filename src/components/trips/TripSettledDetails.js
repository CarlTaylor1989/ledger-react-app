import React, { Component } from 'react';

import { withStyles } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

import CloseButton from '../navigation/CloseButton';
import { sections, typography } from '../../styles/global';

class TripSettledDetails extends Component {
  render() {
    const { classes, trip, reimbursements } = this.props;

    return (
      <>
        <CloseButton />

        <div className={`${classes.section} ${classes.verticalPaddMediumTop}`}>
          <div className={classes.centred}>
            <Typography className={classes.logo} variant="h5" gutterBottom>
              L
            </Typography>
          </div>

          <Typography
            variant="h5"
            className={`${classes.bold} ${classes.verticalPaddMediumTop}`}
            gutterBottom
          >
            {trip.title}
          </Typography>

          <Typography variant="h6" className={`${classes.verticalPaddMedium}`}>
            Settle Up
          </Typography>

          {Object.keys(reimbursements).map(index => {
            return (
              <Grid
                container
                spacing={8}
                key={index}
                className={classes.verticalPaddSmall}
              >
                <Grid item xs={5}>
                  <Avatar className={classes.avatar}>
                    {reimbursements[index].fromInitials}
                  </Avatar>

                  <Typography variant="overline" align="center">
                    {reimbursements[index].fromUsername}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={2}
                  className={`${classes.reimbursementAmountOuter}`}
                >
                  <div className={`${classes.reimbursementAmountInner}`}>
                    <Typography variant="body1">
                      £{reimbursements[index].amount.toFixed(2)}
                    </Typography>
                    <ArrowRightAltIcon />
                  </div>
                </Grid>

                <Grid item xs={5}>
                  <Avatar className={classes.avatar}>
                    {reimbursements[index].toInitials}
                  </Avatar>

                  <Typography variant="overline" align="center">
                    {reimbursements[index].toUsername}
                  </Typography>
                </Grid>
              </Grid>
            );
          })}
        </div>
      </>
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
      width: '60px',
      height: '60px',
      color: '#000',
      borderColor: '#000',
      transition: theme.transitions.create('all')
    },
    reimbursementAmountOuter: {
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center'
    },
    reimbursementAmountInner: {
      margin: '4px auto 0 auto'
    }
  };

  return Object.assign(styles, sections(theme), typography(theme));
};

export default withStyles(styles)(TripSettledDetails);
