import _ from 'lodash';
import history from '../../history';
import {
  TRIP_CREATE_ERROR,
  TRIP_SET_MEMBER_ERROR,
  TRIP_SETTLE_ERROR
} from './types';

// TODO look into functors maybe to help with this - https://www.youtube.com/watch?v=YLIH8TKbAh4&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=10&t=0s
function currencyAddition(amountOne, amountTwo) {
  return (amountOne * 100 + amountTwo * 100) / 100;
}

function currencySubtraction(amountOne, amountTwo) {
  return (amountOne * 100 - amountTwo * 100) / 100;
}

export const createTrip = title => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    // Get the creator info
    const currentProfile = getState().firebase.profile;
    const currentUserId = getState().firebase.auth.uid;

    // TODO move colours out to config
    const colours = ['red', 'orange', 'purple', 'blue', 'green'];

    const colour = colours[Math.floor(Math.random() * colours.length)];

    firestore
      .collection('trips')
      .add({
        title,
        colour,
        createdAt: new Date(),
        createdById: currentUserId,
        users: {
          [currentUserId]: {
            username: currentProfile.username,
            initials: currentProfile.initials
          }
        }
      })
      .then(docRef => {
        // No need to dispatch an action at the moment as we're using
        // firebase connect in the component
        history.push(`/trip-members/${docRef.id}`);
      })
      .catch(err => {
        dispatch({ type: TRIP_CREATE_ERROR, payload: err });
      });
  };
};

export const setMembers = (tripId, members) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    // TODO refetch the users from firestore here so we dont let client change the data

    const userMap = {};

    members.forEach(member => {
      userMap[member.id] = _.pick(member, 'username', 'initials', 'id');
    });

    firestore
      .collection('trips')
      .doc(tripId)
      .update({
        users: userMap
      })
      .then(() => {
        history.push(`/trip-details/${tripId}`);
      })
      .catch(err => {
        dispatch({ type: TRIP_SET_MEMBER_ERROR, payload: err });
      });
  };
};

export const getAmountSpentPerUser = (users, querySnapshot) => {
  const usersAmountSpent = [];

  // Add some default props to the users
  for (var userId in users) {
    users[userId].amountSpent = 0;

    users[userId].amountTaken = 0;
  }

  // Inital loop to see who paid the least
  querySnapshot.forEach(function(transaction) {
    const { createdById, amount } = transaction.data();

    users[createdById].amountSpent = currencyAddition(
      users[createdById].amountSpent,
      amount
    );
  });

  Object.keys(users).forEach((userId, index) => {
    usersAmountSpent.push({ userId, amountSpent: users[userId].amountSpent });
  });

  // Sort usersAmountSpent array so that least spent is on top
  return usersAmountSpent.sort((a, b) =>
    a.amountSpent > b.amountSpent ? 1 : -1
  );
};

export const updateUsersAmountTaken = (
  users,
  usersAmountSpent,
  querySnapshot
) => {
  // For each transaction
  querySnapshot.forEach(function(transaction) {
    const { amount, beneficiaries, createdById } = transaction.data();

    const beneficiaryIds = beneficiaries.map(({ id }) => id);

    // Get the benifit amount rounded to two decimal places
    const benefitAmount =
      Math.round((amount / beneficiaries.length) * 1e2) / 1e2;

    // Update the users' amount taken
    beneficiaries.forEach(beneficiary => {
      users[beneficiary.id].amountTaken = currencyAddition(
        users[beneficiary.id].amountTaken,
        benefitAmount
      );
    });

    // Penny Rounding
    if (benefitAmount * beneficiaries.length > amount) {
      // Beneficiaries paid a penny too much, make it so whover paid has taken a penny less
      users[createdById].amountTaken = currencySubtraction(
        users[createdById].amountTaken,
        0.01
      );
    } else if (benefitAmount * beneficiaries.length < amount) {
      // Beneficiaries paid a penny too little
      // Find the beneficiary who has paid the least and make it so they have taken a penny more
      let leastSpentBeneficiary = usersAmountSpent.find(function(element) {
        return beneficiaryIds.includes(element.userId);
      });

      users[leastSpentBeneficiary.userId].amountTaken = currencyAddition(
        users[leastSpentBeneficiary.userId].amountTaken,
        0.01
      );
    }
  });
};

export const calculateCreditOrDebt = (users, creditors, debtors) => {
  // Calculate the debt or credit for each user
  for (var id in users) {
    // Credit or debt amount to 2 decimal places
    const creditOrDebtAmount =
      Math.round((users[id].amountSpent - users[id].amountTaken) * 1e2) / 1e2;

    if (creditOrDebtAmount > 0) {
      // Original is used for our records
      // Calculated is used when calculating reimbursementRecords
      users[id].originalCredit = creditOrDebtAmount;
      users[id].calculatedCredit = creditOrDebtAmount;
      users[id].reimbursementsCalculated = false;

      creditors.push(users[id]);
    } else if (creditOrDebtAmount < 0) {
      users[id].originalDebt = Math.abs(creditOrDebtAmount);
      users[id].calculatedDebt = Math.abs(creditOrDebtAmount);
      users[id].reimbursementsCalculated = false;

      debtors.push(users[id]);
    }

    // sort the creditors and debtors arrays so bigest values first
    creditors.sort((a, b) => (a.originalCredit < b.originalCredit ? 1 : -1));

    debtors.sort((a, b) => (a.originalDebt < b.originalDebt ? 1 : -1));
  }
};

// TODO this shouldn't be exported, I only exported it for testing
export const calculateReimbursementRecords = (
  creditors,
  debtors,
  reimbursementRecords
) => {
  debtors.forEach(function(debtor) {
    while (debtor.reimbursementsCalculated === false) {
      // Find the first creditor where creditor.reimbursementsCalculated = false
      let creditor = creditors.find(
        creditor => creditor.reimbursementsCalculated === false
      );

      if (!creditor) {
        // There's no one else to pay. Not quite sure why we even get here but we do
        console.log('No creditors left to pay');

        break;
      }

      // if debtor calculatedDebt is greater that the creditor calculatedCredit
      if (debtor.calculatedDebt >= creditor.calculatedCredit) {
        // create a reimbursement record
        reimbursementRecords.push({
          fromInitials: debtor.initials,
          fromUsername: debtor.username,
          toInitials: creditor.initials,
          toUsername: creditor.username,
          amount: creditor.calculatedCredit
        });

        debtor.calculatedDebt = currencySubtraction(
          debtor.calculatedDebt,
          creditor.calculatedCredit
        );

        if (debtor.calculatedDebt <= 0) {
          debtor.reimbursementsCalculated = true;
        }

        creditor.calculatedCredit = 0;

        // Mark the creditor as being paid up
        creditor.reimbursementsCalculated = true;
      } else {
        // Debtor calculated debt is less than the creditor calculated credit

        // create a reimbursement record
        reimbursementRecords.push({
          fromInitials: debtor.initials,
          fromUsername: debtor.username,
          toInitials: creditor.initials,
          toUsername: creditor.username,
          amount: debtor.calculatedDebt
        });

        creditor.calculatedCredit = currencySubtraction(
          creditor.calculatedCredit,
          debtor.calculatedDebt
        );

        if (creditor.calculatedCredit <= 0) {
          creditor.reimbursementsCalculated = true;
        }

        debtor.calculatedDebt = 0;

        // Mark the debtor as being paid up
        debtor.reimbursementsCalculated = true;
      }
    }
  });
};

export const settleTrip = tripId => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    let users;

    firestore
      .collection('trips')
      .doc(tripId)
      .get()
      .then(trip => {
        // Prevent any dupes
        if (trip.data().settling || trip.data().settled) {
          throw new Error();
        }

        // Get the users
        users = trip.data().users;

        // Set to settling
        return firestore
          .collection('trips')
          .doc(tripId)
          .update({
            settling: true,
            settlingAt: new Date()
          });
      })
      .then(() => {
        // Fetch the transactions
        return firestore
          .collection('trips')
          .doc(tripId)
          .collection('transactions')
          .get();
      })
      .then(querySnapshot => {
        // Set up the reimbursement records
        const debtors = [],
          creditors = [],
          reimbursementRecords = [],
          promises = [];

        const usersAmountSpent = getAmountSpentPerUser(users, querySnapshot);

        updateUsersAmountTaken(users, usersAmountSpent, querySnapshot);

        calculateCreditOrDebt(users, creditors, debtors);

        if (debtors.length > 0 && creditors.length > 0) {
          calculateReimbursementRecords(
            creditors,
            debtors,
            reimbursementRecords
          );
        } else {
          dispatch({
            type: TRIP_SETTLE_ERROR,
            payload: 'There are either no creditors or no debtors'
          });
        }

        reimbursementRecords.forEach(function(reimbursement) {
          const promise = firestore
            .collection('trips')
            .doc(tripId)
            .collection('reimbursements')
            .add(reimbursement);

          promises.push(promise);
        });

        // Execute all the promises
        return Promise.all(promises);
      })
      .then(() => {
        // Set the trip to settled
        firestore
          .collection('trips')
          .doc(tripId)
          .update({ settling: false, settled: true, settlingAt: new Date() });
      })
      .catch(err => {
        dispatch({ type: TRIP_SETTLE_ERROR, payload: err });
      });
  };
};
