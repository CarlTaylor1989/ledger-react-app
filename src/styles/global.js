import grey from '@material-ui/core/colors/grey';

export const sections = theme => {
  return {
    section: {
      width: 'auto',
      paddingLeft: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
        width: 1100,
        paddingLeft: 'auto',
        paddingRight: 'auto'
      }
    },
    verticalPaddSmall: {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit
    },
    verticalPaddSmallTop: {
      paddingTop: theme.spacing.unit
    },
    verticalPaddSmallBottom: {
      paddingBottom: theme.spacing.unit
    },
    verticalPaddMedium: {
      paddingTop: theme.spacing.unit * 3,
      paddingBottom: theme.spacing.unit * 3
    },
    verticalPaddMediumTop: {
      paddingTop: theme.spacing.unit * 3
    },
    verticalPaddMediumBottom: {
      paddingBottom: theme.spacing.unit * 3
    },
    verticalPaddLarge: {
      paddingTop: theme.spacing.unit * 6,
      paddingBottom: theme.spacing.unit * 6
    },
    verticalPaddLargeTop: {
      paddingTop: theme.spacing.unit * 6
    },
    verticalPaddLargeBottom: {
      paddingBottom: theme.spacing.unit * 6
    }
  };
};

export const spacing = theme => {
  return {
    verticalMarginSmall: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit
    },
    verticalMarginSmallTop: {
      marginTop: theme.spacing.unit
    },
    verticalMarginSmallBottom: {
      marginBottom: theme.spacing.unit
    },
    verticalMarginMedium: {
      marginTop: theme.spacing.unit * 3,
      marginBottom: theme.spacing.unit * 3
    },
    verticalMarginMediumTop: {
      marginTop: theme.spacing.unit * 3
    },
    verticalMarginMediumBottom: {
      marginBottom: theme.spacing.unit * 3
    },
    verticalMarginLarge: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6
    },
    verticalMarginLargeTop: {
      marginTop: theme.spacing.unit * 6
    },
    verticalMarginLargeBottom: {
      marginBottom: theme.spacing.unit * 6
    }
  };
};

export const typography = theme => {
  return {
    bold: {
      fontWeight: 'bold'
    },
    textPrimaryInvert: {
      color: grey[50]
    },
    textCenter: {
      textAlign: 'center'
    },
    formValidationMessage: {
      color: '#e91e63'
    }
  };
};

export const colours = theme => {
  return {
    contentBackgroundColour: {
      backgroundColor: grey[50]
    }
  };
};
