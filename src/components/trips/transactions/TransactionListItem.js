import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';
import Avatar from '@material-ui/core/Avatar';

import { spacing, sections, typography } from '../../../styles/global';

class TransactionListItem extends Component {
  render() {
    const { classes, amount, colour, description, initials } = this.props;

    return (
      <div className={`${classes.verticalPaddSmallBottom}`}>
        <div className={`${classes.root} ${classes[colour]}`}>
          <Avatar className={`${classes.avatar} ${classes.textPrimaryInvert}`}>
            {initials}
          </Avatar>

          <Typography
            variant="subtitle2"
            className={`${classes.textPrimaryInvert} ${classes.title}`}
          >
            {description}
          </Typography>

          <div className={`${classes.amount}`}>
            <Typography variant="subtitle2">£{amount.toFixed(2)}</Typography>
          </div>
        </div>
      </div>
    );
  }
}

const styles = theme => {
  const styles = {
    root: {
      boxShadow:
        '0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.07), 0px 2px 1px -1px rgba(0,0,0,0.06)',
      borderRadius: '5px',
      backgroundColor: '#fff',
      position: 'relative',
      overflow: 'hidden',
      padding: theme.spacing.unit,
      display: 'flex',
      alignItems: 'center'
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
    avatar: {
      color: '#fff',
      backgroundColor: 'transparent',
      borderColor: grey[50],
      border: '2px solid',
      float: 'left',
      margin: 0,
      width: '30px',
      height: '30px',
      fontSize: '13px'
    },
    title: {
      display: 'inline',
      paddingLeft: theme.spacing.unit
    },
    amount: {
      backgroundColor: '#fff',
      position: 'absolute',
      right: '-9px',
      top: '-5px',
      padding: '18px',
      borderRadius: '30px'
    }
  };

  return Object.assign(
    styles,
    spacing(theme),
    sections(theme),
    typography(theme)
  );
};

export default withStyles(styles)(TransactionListItem);
