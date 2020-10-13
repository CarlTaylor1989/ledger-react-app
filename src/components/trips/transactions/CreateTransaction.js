import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import { firestoreConnect } from 'react-redux-firebase';

import pink from '@material-ui/core/colors/pink';
import grey from '@material-ui/core/colors/grey'; 
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import CloseButton from '../../navigation/CloseButton';
import { sections, spacing, typography } from '../../../styles/global';
import { createTransaction, editTransaction, deleteTransaction } from '../../../store/actions/transactionActions';

class CreateTransaction extends Component {
  state = {
    amount: this.props.location.transaction ? this.props.location.transaction.amount : '',
    description: this.props.location.transaction ? this.props.location.transaction.description : '',
    formStep: 1,
    formValidationMessage: '',
    subTransactionValidationMessage: '',
    subTransaction: this.props.location.transaction ? true : false, // Safer to show all trip users when editing a transaction. (A user could have been added to the trip since original transaction)
    clickedUserIds: this.setInitialClickedUserIds(),
    deleteIconClicked: false
  };

  setInitialClickedUserIds() {
    if (!this.props.location.transaction) {
      return [];
    }

    const { transaction } = this.props.location;

    const { auth } = this.props;

    let clickedUserIds;

    const userBeneficiary = transaction.beneficiaries.filter(beneficiary => beneficiary.id === auth.uid);

    // If currently logged in user was a beneficiary remove them from clickedUserIds
    if (userBeneficiary.length) {
      clickedUserIds = transaction.beneficiaries.filter(beneficiary => beneficiary.id !== auth.uid);

      clickedUserIds = clickedUserIds.map(beneficiary => beneficiary.id);
    } else {
      // Else add them to the clickedUserIds
      clickedUserIds = this.props.location.transaction.beneficiaries.map(beneficiary => beneficiary.id);

      clickedUserIds.push(auth.uid);    
    }

    return clickedUserIds; 
  } 

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleNextButtonClick = () => {
    const { auth } = this.props;

    if (!this.state.amount) {
      this.setState({ formValidationMessage: 'An amount is required' });
      return;
    }

    if (isNaN(this.state.amount)) {
      this.setState({ formValidationMessage: 'Please enter a valid amount' });
      return;
    }

    if (
      this.state.subTransaction &&
      (this.state.clickedUserIds.length === 0 || // Only logged in user selected
        (this.state.clickedUserIds.length === 1 &&
          this.state.clickedUserIds[0] === auth.uid)) // Logged in user un selected
    ) {
      this.setState({
        subTransactionValidationMessage: 'Who did you pay for?'
      });
      return;
    }

    this.setState({ formStep: 2, formValidationMessage: '' });
  };

  handleAddTransactionClick = () => {
    const { auth, location: { transaction } } = this.props;
   
    if (!this.state.description) {
      this.setState({
        formValidationMessage: 'Please enter a description',
        subTransactionValidationMessage: ''
      });
      return;
    }

    // Prevent duplicate entries
    if (this.state.transactionLoading) {
      return;
    }

    this.setState({ transactionLoading: true });

    // By default assume everybody benefited
    let beneficiaries = Object.values(this.props.trip.users);

    // If sub transaction filter out users who were not invloved
    if (this.state.subTransaction) {
      beneficiaries = beneficiaries.filter(user => {
        if (user.id === auth.uid) {
          // If it's the logged in user, we count them as a beneficiary if the have NOT been clicked
          return !this.state.clickedUserIds.includes(user.id);
        } else {
          return this.state.clickedUserIds.includes(user.id);
        }
      });
    }

    // Edit or create transaction
    if (transaction) {
      this.props.editTransaction({
        tripId: this.props.match.params.tripId,
        amount: this.state.amount,
        description: this.state.description,
        beneficiaries,
        previousTransaction: transaction
      });
    } else {
      this.props.createTransaction({
        tripId: this.props.match.params.tripId,
        amount: this.state.amount,
        description: this.state.description,
        beneficiaries
      });
    }
  };

  toggleSubTransaction = () => {
    const isSubTransaction = this.state.subTransaction ? false : true;

    this.setState({ subTransaction: isSubTransaction });
  };

  renderFormValidationMessage() {
    const { classes } = this.props;

    if (this.state.formValidationMessage) {
      return (
        <Typography
          variant="body1"
          className={`${classes.verticalPaddSmallTop} ${
            classes.formValidationMessage
          }`}
        >
          {this.state.formValidationMessage}
        </Typography>
      );
    }
  }

  setAvatarClasses(user) {
    const { classes, auth } = this.props;

    let avatarClasses = classes.avatar;

    if (user.id === auth.uid) {
      // Logged in user should be selected by default
      if (!this.state.clickedUserIds.includes(user.id)) {
        avatarClasses += ' ' + classes.avatarSelected;
      }
    } else {
      if (this.state.clickedUserIds.includes(user.id)) {
        avatarClasses += ' ' + classes.avatarSelected;
      }
    }

    return avatarClasses;
  }

  handleUserClick(user) {
    let userIds = [];

    if (this.state.clickedUserIds.includes(user.id)) {
      userIds = this.state.clickedUserIds.filter(id => id !== user.id);
    } else {
      userIds = [...this.state.clickedUserIds, user.id];
    }

    // Then udpate the state
    this.setState({ clickedUserIds: userIds });
  }

  handleDeleteIconClick = () => {
    // Toggle deletIconClicked
    this.setState(prevState => ({
      deleteIconClicked: !prevState.deleteIconClicked
    }));
  }

  handleDeleteButtonClick = () => {
    const { location: { transaction } } = this.props;

    this.props.deleteTransaction({
      tripId: this.props.match.params.tripId,
      transaction
    });
  }

  renderUsers() {
    const { classes, auth } = this.props;

    const { users } = this.props.trip;

    if (this.state.subTransaction) {
      return (
        <>
          <Typography variant="h6" className={`${classes.verticalPaddMedium}`}>
            Who did you pay for?
          </Typography>

          <Grid container spacing={32}>
            {/* The logged in user */}
            <Grow in={true}>
              <Grid item xs={4}>
                <Avatar
                  className={this.setAvatarClasses(users[auth.uid])}
                  onClick={() => this.handleUserClick(users[auth.uid])}
                >
                  {users[auth.uid].initials}
                </Avatar>
                <Typography variant="overline" align="center" className={`${classes.avatarName} ${classes.verticalMarginSmallTop}`}>
                  {users[auth.uid].username}
                </Typography>
              </Grid>
            </Grow>

            {/* The users on the trip */}
            {Object.keys(users).map((userId, index) => {
              if (userId === auth.uid) {
                return '';
              }

              return (
                <Grow in={true} key={userId} timeout={index + 1 * 500}>
                  <Grid item xs={4}>
                    <Avatar
                      className={this.setAvatarClasses(users[userId])}
                      onClick={() => this.handleUserClick(users[userId])}
                    >
                      {users[userId].initials}
                    </Avatar>
                    <Typography variant="overline" align="center" className={`${classes.avatarName} ${classes.verticalMarginSmallTop}`}>
                      {users[userId].username}
                    </Typography>
                  </Grid>
                </Grow>
              );
            })}
          </Grid>
        </>
      );
    }
  }

  renderDeleteSection() {
    const { classes, location: { transaction } } = this.props;

    if (!transaction) {
      return null;
    }

    let deleteIconClassNames = `${classes.avatar} ${classes.verticalMarginMediumBottom}`;

    deleteIconClassNames += !this.state.deleteIconClicked ? ` ${classes.deleteTransactionIconOff}` : '';

    return (
      <div className={classes.verticalMarginLargeBottom}>
        <Typography variant="h6" className={`${classes.verticalPaddMedium}`}>
          Delete transaction
        </Typography>
        
        <Avatar
          className={deleteIconClassNames}
          onClick={this.handleDeleteIconClick}
        >
          <DeleteOutlineIcon />
        </Avatar>

        {this.state.deleteIconClicked &&
          <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={this.handleDeleteButtonClick}
              fullWidth
            >
              Confirm delete
          </Button>
        }
      </div>
    );
  }

  renderContent() {
    const { classes, location: { transaction } } = this.props;

    if (this.state.formStep === 1) {
      return (
        <>
          <FormControl
            margin="normal"
            required
            fullWidth
            className={classes.verticalPaddLarge}
          >
            <TextField
              className={classes.formControl}
              variant="outlined"
              label="How much"
              value={this.state.amount}
              onChange={this.handleChange('amount')}
              id="formatted-numberformat-input"
              autoFocus={!transaction} // Don't autofocus when editing a transaction
              InputProps={{
                inputComponent: NumberFormatCustom
              }}
            />

            {this.renderFormValidationMessage()}

          </FormControl>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={this.handleNextButtonClick}
            fullWidth
          >
            Next
          </Button>

          <FormControlLabel
            control={
              <Switch
                checked={!this.state.subTransaction}
                onChange={this.toggleSubTransaction}
              />
            }
            label="Paid for everyone"
          />

          {this.renderUsers()}

          <Typography
            variant="body1"
            className={`${classes.verticalPaddMediumTop} ${
              classes.formValidationMessage
            }`}
          >
            {this.state.subTransactionValidationMessage}
          </Typography>

          {this.renderDeleteSection()}
        </>
      );
    } else if (this.state.formStep === 2) {
      return (
        <>
          <FormControl
            margin="normal"
            required
            fullWidth
            className={`${classes.verticalPaddLarge}`}
          >
            <TextField
              id="outlined-name"
              label="Description"
              value={this.state.description}
              onChange={this.handleChange('description')}
              autoFocus
              variant="outlined"
              autoComplete="off"
            />

            {this.renderFormValidationMessage()}
          </FormControl>

          {this.renderFormValidationMessage()}

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={this.handleAddTransactionClick}
            fullWidth
          >
            Done
          </Button>
        </>
      );
    }
  }

  render() {
    const { classes, profile, transactionError, trip } = this.props;

    if (!trip) {
      return <div>Loading...</div>;
    }

    let snackBar = null;

    if (transactionError) {
      snackBar = (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={true}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id="message-id">{transactionError}</span>}
        />
      );
    }

    return (
      <>
        <CloseButton
          location={`/trip-details/${this.props.match.params.tripId}`}
        />

        <div className={`${classes.section} ${classes.verticalPaddLargeTop}`}>
          <div className={classes.userWrap}>
            <Avatar className={classes.avatar}>{profile.initials}</Avatar>
          </div>

          {this.renderContent()}

          {snackBar}
        </div>
      </>
    );
  }
}

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      decimalScale={2}
      thousandSeparator
      prefix="£"
    />
  );
}

const styles = theme => {
  const styles = {
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
    avatarSelected: {
      backgroundColor: pink['A400'],
      color: '#fff',
      borderColor: '#fff'
    },
    avatarName: {
      overflowWrap: 'break-word',
      lineHeight: '20px'
    },
    deleteTransactionIconOff: {
      borderColor: grey[600],
      color: grey[600]
    }
  };

  return Object.assign(styles, sections(theme), spacing(theme), typography(theme));
};

const mapStateToProps = state => {
  const trips = state.firestore.ordered.trips;

  return {
    profile: state.firebase.profile,
    transactionError: state.transactions.transactionError,
    trip: trips ? trips[0] : null,
    auth: state.firebase.auth
  };
};

export default compose(
  connect(
    mapStateToProps,
    { createTransaction, editTransaction, deleteTransaction }
  ),
  withStyles(styles),
  firestoreConnect(props => {
    return [{ collection: 'trips', doc: props.match.params.tripId }];
  })
)(CreateTransaction);
