import history from '../../history';
import {
  TRANSACTION_CREATE_ERROR,
  TRANSACTION_CREATE_SUCCESS,
  TRANSACTION_EDIT_SUCCESS,
  TRANSACTION_EDIT_ERROR,
  TRANSACTION_DELETE_SUCCESS,
  TRANSACTION_DELETE_ERROR
} from './types';

export const createTransaction = transaction => {
  return (dispatch, getState, { getFirestore }) => {
    const { amount, description, beneficiaries, tripId } = transaction;

    const firestore = getFirestore();

    // Get the creator info
    const currentProfile = getState().firebase.profile;
    const currentUserId = getState().firebase.auth.uid;

    let transactionsCount = 0;

    let totalAmount = 0;

    // TODO turn this into a firestore db transaction

    firestore
      .collection('trips')
      .doc(tripId)
      .get()
      .then(function(doc) {
        transactionsCount = doc.data().transactionsCount
          ? doc.data().transactionsCount
          : 0;

        totalAmount = doc.data().totalAmount ? doc.data().totalAmount : 0;

        return firestore
          .collection('trips')
          .doc(tripId)
          .collection('transactions')
          .add({
            amount: parseFloat(amount),
            description,
            createdAt: new Date(),
            createdById: currentUserId,
            userName: currentProfile.username,
            userInitials: currentProfile.initials,
            beneficiaries
          });
      })
      .then(() => {
        return firestore
          .collection('trips')
          .doc(tripId)
          .set(
            {
              transactionsCount: transactionsCount + 1,
              totalAmount: totalAmount + Number(amount)
            },
            { merge: true }
          );
      })
      .then(() => {
        dispatch({ type: TRANSACTION_CREATE_SUCCESS });

        history.push(`/trip-details/${tripId}`);
      })
      .catch(err => {
        console.log('something went wrong');
        dispatch({ type: TRANSACTION_CREATE_ERROR, payload: err });
      });
  };
};

export const editTransaction = transaction => {
  return (dispatch, getState, { getFirestore }) => {
    const { amount, description, beneficiaries, tripId, previousTransaction } = transaction;

    const firestore = getFirestore();

    let newTotalAmount;

    firestore
      .collection('trips')
      .doc(tripId)
      .get()
      .then(function(doc) {
        // Calculate new total amount
        newTotalAmount = doc.data().totalAmount - previousTransaction.amount + Number(amount);
        
        return firestore
          .collection('trips')
          .doc(tripId)
          .collection('transactions')
          .doc(previousTransaction.id)
          .set(
            {
              amount: parseFloat(amount),
              description,
              updatedAt: new Date(),
              beneficiaries
            },
            { merge: true }
          )
          .then(() => {
            return firestore
            .collection('trips')
            .doc(tripId)
            .set( 
              {
                totalAmount: newTotalAmount
              },
              { merge: true }
            )
          })
      })
      .then(() => {
        dispatch({ type: TRANSACTION_EDIT_SUCCESS });

        history.push(`/trip-details/${tripId}`);
      }).catch(err => {
        console.log('something went wrong');
        dispatch({ type: TRANSACTION_EDIT_ERROR, payload: err });
      });
  };
};

export const deleteTransaction = transactionInfo => {
  return (dispatch, getState, { getFirestore }) => {
    const { tripId, transaction: { id: transactionId, amount } } = transactionInfo;

    const firestore = getFirestore();

    let newTotalAmount, newTransactionsCount;

    firestore
      .collection('trips')
      .doc(tripId)
      .get()
      .then(doc => {
        // Calculate new total amount and newTransactionsCount
        newTotalAmount = doc.data().totalAmount - Number(amount);

        newTransactionsCount = doc.data().transactionsCount - 1;

        return firestore
          .collection('trips')
          .doc(tripId)
          .collection('transactions')
          .doc(transactionId)
          .delete()
          .then(() => {
            return firestore
              .collection('trips')
              .doc(tripId)
              .set( 
                {
                  totalAmount: newTotalAmount,
                  transactionsCount: newTransactionsCount
                },
                { merge: true }
              );
          })
      })
      .then(() => {
        dispatch({ type: TRANSACTION_DELETE_SUCCESS });

        history.push(`/trip-details/${tripId}`);
      }).catch(err =>{
        console.log('something went wrong');

        dispatch({ type: TRANSACTION_DELETE_ERROR, payload: err });
      });
  };
}
