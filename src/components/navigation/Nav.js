import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';

import { colours, typography } from '../../styles/global';
import ProfileAvatar from '../profile/ProfileAvatar';
import { logOut } from '../../store/actions/authActions';

class Nav extends Component {
  state = {
    drawOpen: false
  };

  toggleDrawer = drawOpen => {
    this.setState({ drawOpen });
  };

  render() {
    const { classes, profile, logOut } = this.props;

    return (
      <>
        <AppBar position="sticky">
          <Toolbar>
            <Fade in={true}>
              <IconButton
                className={`${classes.menuButton} ${classes.textPrimaryInvert}`}
                color="primary"
                aria-label="Menu"
                onClick={() => this.toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            </Fade>

            <Typography
              className={`${classes.grow} ${classes.logo} ${
                classes.textPrimaryInvert
              }`}
              variant="h5"
            >
              L
            </Typography>

            <ProfileAvatar profile={profile} />
          </Toolbar>
        </AppBar>

        <Drawer
          // Have to style individual elements of the drawer component
          // i.e. paper. https://material-ui.com/api/drawer/
          classes={{paper: classes.drawer}}
          open={this.state.drawOpen}
          onClose={() => {
            this.toggleDrawer(false);
          }}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={() => this.toggleDrawer(false)}
            onKeyDown={() => this.toggleDrawer(false)}
          >
            <ListItem button>
              <ListItemIcon><ExitToAppIcon color="secondary"/></ListItemIcon>
              <ListItemText 
                primary={'Log out'}
                onClick={logOut}
                color="primary"
                classes={{primary: classes.listItemText}}
              />
            </ListItem>
          </div>
        </Drawer>
      </>
    );
  }
}

const styles = theme => {
  const styles = {
    logo: {
      fontFamily: "'Shrikhand', cursive",
      color: grey[900],
      textAlign: 'center'
    },
    appBar: {
      borderBottom: '1px solid rgb(235, 235, 235)'
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20
    },
    grow: {
      flexGrow: 1
    },
    drawer: {
      backgroundColor: 'black'
    },
    listItemText: {
      color: grey[50]
    }
  };

  // Add our 'global' section class to the styles object
  return Object.assign(styles, colours(theme), typography(theme));
};

const mapStateToProps = state => {
  return {
    profile: state.firebase.profile
  };
};

export default compose(
  connect(
    mapStateToProps,
    { logOut }
  ),
  withStyles(styles)
)(Nav);
