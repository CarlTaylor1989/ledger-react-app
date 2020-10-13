import React, { Component } from 'react';

import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

import { typography } from '../../styles/global';

class ProfileAvatar extends Component {
  render() {
    const { profile, classes } = this.props;

    return (
      <Avatar className={`${classes.avatar} ${classes.textPrimaryInvert}`}>
        {profile.initials}
      </Avatar>
    );
  }
}

const styles = theme => {
  const styles = {
    avatar: {
      margin: 10,
      color: '#fff',
      backgroundColor: '#000000',
      border: '1px solid',
      borderColor: grey[50]
    }
  };

  return Object.assign(styles, typography(theme));
};

export default withStyles(styles)(ProfileAvatar);
