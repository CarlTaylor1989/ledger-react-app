import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import Fade from '@material-ui/core/Fade';
import Grow from '@material-ui/core/Grow';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Snackbar from '@material-ui/core/Snackbar';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';

import CloseButton from '../navigation/CloseButton';
import TransactionListItem from './transactions/TransactionListItem';
import TripSettledDetails from './TripSettledDetails';
import { sections, typography, spacing } from '../../styles/global';
import { settleTrip } from '../../store/actions/tripActions';
import history from '../../history';

class TripDetails extends Component {
  state = {
    switchChecked: null,
    loadingSettleTrip: false,
    dialogOpen: false,
    dialogTransaction: {beneficiaries: [], amount: 0}
  };

  handleAddTransactionClick = () => {
    history.push(`/trip-transaction-add/${this.props.match.params.tripId}`);
  };

  handleEditTransactionClick = (transaction) => {
    history.push({
      pathname: `/trip-transaction-add/${this.props.match.params.tripId}`,
      transaction: transaction
    });
  };

  goToTripMembers = () => {
    history.push({
      pathname: `/trip-members/${this.props.match.params.tripId}`,
      closeLocation: `/trip-details/${this.props.match.params.tripId}`,
      buttonText: 'Done'
    });
  };

  toggleSettleSwitch = () => {
    // If its off turn it on
    if (!this.setSwitchChecked()) {
      this.setState({ switchChecked: true });

      return;
    }

    // Turn it off, unless settle trip is currently loading
    if (!this.state.loadingSettleTrip) {
      this.setState({ switchChecked: false });
    }
  };

  setSettleExpanded = () => {
    // Also will be checking props here
    if (
      this.state.loadingSettleTrip === true ||
      this.props.trip.settling ||
      this.state.switchChecked
    ) {
      return true;
    }

    return false;
  };

  setSwitchChecked = () => {
    // Also will be checking props here
    if (
      this.state.loadingSettleTrip === true ||
      this.props.trip.settling ||
      this.state.switchChecked === true
    ) {
      return true;
    }

    return false;
  };

  handleSettleButtonClick = () => {
    this.props.settleTrip(this.props.match.params.tripId);

    this.setState({ loadingSettleTrip: true });
  };

  handleOpenDialogClick = (transaction) => {
    this.setState({ dialogOpen: true, dialogTransaction: transaction});
  };

  handleCloseDialogClick = () => {
    this.setState({ dialogOpen: false});
  };

  renderDialogBeneficiaries = () => {
    const { classes } = this.props;

    return (
      <Grid container spacing={0}>
        {this.state.dialogTransaction.beneficiaries.map((beneficiary) => {
          return (         
            <Grid item xs={4} className={classes.beneficiaryGridItem} key={beneficiary.id}>
              <Avatar className={`${classes.avatar} ${classes.beneficiaryAvatar}`}>
                {beneficiary.initials}
              </Avatar>
            </Grid>
          );
        })}
      </Grid>
    );
  }

  renderUsers() {
    const { classes } = this.props;

    const { users } = this.props.trip;

    return (
      <Grid container spacing={32}>
        {Object.keys(users).map((userId, index) => {
          return (
            <Grow in={true} key={userId} timeout={index * 500}>
              <Grid item xs={4}>
                <Avatar className={classes.avatar}>
                  {users[userId].initials}
                </Avatar>
              </Grid>
            </Grow>
          );
        })}

        {/* Link to edit trip members */}
        <Grow in={true} onClick={this.goToTripMembers}>
          <Grid item xs={4}>
            <Avatar className={`${classes.avatar} ${classes.addMemberButton}`}>
              <AddIcon />
            </Avatar>
          </Grid>
        </Grow>
      </Grid>
    );
  }

  renderTransactions = () => {
    if (!this.props.transactions) {
      return null;
    }

    const { trip } = this.props;

    return this.props.transactions.map(transaction => {
      return (
        <div onClick={() => this.handleOpenDialogClick(transaction)} key={transaction.id}>
          <TransactionListItem
            description={transaction.description}
            colour={trip.colour}
            initials={transaction.userInitials}
            amount={transaction.amount}
          />
        </div>
      );
    });
  };

  renderExpansionDetails = () => {
    const { classes, trip } = this.props;

    if (this.state.loadingSettleTrip || trip.settling) {
      return (
        <ExpansionPanelDetails className={`${classes.expansionDetails}`}>
          {/* TODO pick a nicer loading spinner */}
          <CircularProgress className={classes.settleLoadingSpinner} />
        </ExpansionPanelDetails>
      );
    } else {
      return (
        <ExpansionPanelDetails className={`${classes.expansionDetails}`}>
          <div className={`${classes.verticalPaddSmallBottom}`}>
            <div className={classes.settleTextWrap}>
              <Typography color="textSecondary">
                <span className={classes.warningText}>
                  This action cannot be undone.
                </span>{' '}
                Only click 'Settle Trip' once you are sure there are no more
                transactions to add.
              </Typography>
            </div>
            <Divider variant="middle" />
            <div className={classes.settleButtonWrap}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSettleButtonClick}
                fullWidth
              >
                Settle Trip
              </Button>
            </div>
          </div>
        </ExpansionPanelDetails>
      );
    }
  };

  render() {
    const { classes, trip, reimbursements, tripError, auth } = this.props;

    const beneficiarySubTitle = this.state.dialogTransaction.beneficiaries.length === 1 ? 'Beneficiary' : 'Beneficiaries';

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

    // Loading
    if (!trip || (trip.settled && !reimbursements)) {
      return (
        <div className={classes.section}>
          <LinearProgress variant="query" className={classes.verticalMarginMediumTop} />
        </div>
      );
    }

    if (trip.settled) {
      return <TripSettledDetails trip={trip} reimbursements={reimbursements} />;
    }

    return (
      <>
        <Dialog 
          aria-labelledby="beneficiaries-pop-up-title"
          onClose={this.handleCloseDialogClick}
          open={this.state.dialogOpen}
          fullWidth={true}
          maxWidth={'md'}
        >
          <DialogTitle id="beneficiaries-pop-up-title">£{this.state.dialogTransaction.amount.toFixed(2)} | {this.state.dialogTransaction.description}</DialogTitle>

          <div className={classes.section}>
            <Typography
              variant="subtitle1"
              className={classes.verticalPaddSmallBottom}
            >
              {beneficiarySubTitle}
            </Typography>

            {this.renderDialogBeneficiaries()}

            {/* Only show edit button if currently logged in user created the transaction */}
            {this.state.dialogTransaction.createdById === auth.uid &&
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => this.handleEditTransactionClick(this.state.dialogTransaction)}
                  fullWidth
                >
                  Edit
                </Button>
              </div>
            }
            <div className={classes.dialogSpacer}></div>            
          </div>
        </Dialog>

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

          <Grid container spacing={16}>
            <Grid item xs={9}>
              <Typography
                variant="h6"
                className={`${classes.verticalPaddMediumTop}`}
              >
                Transactions
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <Fade in={true}>
                <Fab
                  color="secondary"
                  aria-label="Add Transaction"
                  className={classes.addFab}
                >
                  <AddIcon onClick={this.handleAddTransactionClick} />
                </Fab>
              </Fade>
            </Grid>
          </Grid>

          <div className={classes.verticalPaddMedium}>
            {this.renderTransactions()}
          </div>

          <Typography variant="h6" className={`${classes.verticalPaddMedium}`}>
            Friends
          </Typography>

          {this.renderUsers()}

          <Typography variant="h6" className={`${classes.verticalPaddMedium}`}>
            Settle Up
          </Typography>

          <ExpansionPanel
            expanded={this.setSettleExpanded()}
            className={`${classes.expansionPanel}`}
            classes={{ expanded: classes.expansionPanelExpanded }}
          >
            <ExpansionPanelSummary>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.setSwitchChecked()}
                    onChange={this.toggleSettleSwitch}
                  />
                }
                label="Settle Trip"
              />
            </ExpansionPanelSummary>

            {this.renderExpansionDetails()}
          </ExpansionPanel>

          {snackBar}
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
      width: '70px',
      height: '70px',
      color: '#000',
      borderColor: '#000',
      transition: theme.transitions.create('all')
    },
    beneficiaryAvatar: {
      width: '55px',
      height: '55px'
    },
    beneficiaryGridItem: {
      marginBottom: `${theme.spacing.unit * 3}px`
    },
    dialogSpacer: {
      marginBottom: `${theme.spacing.unit * 3}px`
    },
    addMemberButton: {
      borderColor: grey[600],
      color: grey[600]
    },
    settleTextWrap: {
      margin: `0 ${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
        .spacing.unit * 2}px`
    },
    settleButtonWrap: {
      margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`
    },
    expansionPanel: {
      '&::before': {
        display: 'none'
      }
    },
    expansionPanelExpanded: {
      marginBottom: `${theme.spacing.unit * 3}px !important`
    },
    expansionDetails: {
      paddingBottom: 0,
      paddingTop: 0
    },
    warningText: {
      color: '#f50057'
    },
    settleLoadingSpinner: {
      margin: `0 auto ${theme.spacing.unit * 3}px auto`
    }
  };

  return Object.assign(
    styles,
    sections(theme),
    typography(theme),
    spacing(theme)
  );
};

const mapStateToProps = (state, ownProps) => {
  const trips = state.firestore.ordered.trips;

  const transactions = state.firestore.ordered.transactions;
  
  const reimbursements = state.firestore.ordered.reimbursements;

  return {
    trip: trips ? trips[0] : null,
    transactions: transactions ? transactions : null,
    reimbursements: reimbursements ? reimbursements : null,
    users: state.firestore.ordered.users, // Eventually this will be 'friends',
    tripError: state.trips.tripError,
    auth: state.firebase.auth,
  };
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { settleTrip }
  ),
  firestoreConnect(props => {
    return [
      { collection: 'trips', doc: props.match.params.tripId },
      {
        collection: 'trips',
        doc: props.match.params.tripId,
        subcollections: [{ collection: 'transactions' }],
        storeAs: 'transactions',
        orderBy: ['createdAt', 'desc']
      },
      {
        collection: 'trips',
        doc: props.match.params.tripId,
        subcollections: [{ collection: 'reimbursements' }],
        storeAs: 'reimbursements',
        orderBy: ['fromInitials', 'desc']
      }
    ];
  })
)(TripDetails);
