const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

admin.initializeApp(functions.config().firebase);

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Richy ya ya ya!");
// });

// exports.onTripSettle = functions.firestore.document('/trips/{tripId}').onUpdate((change, context) => {
//     console.log('tes ting 12');
//     // Retrieve the current and previous value
//     const tripData = change.after.data();

//     const previousTripData = change.before.data();

//     console.log('data settling', tripData.settling);
//     console.log('data settled', tripData.settled);

//     // If not settling, or settled is already true
//     if (!tripData.settling || tripData.settled) {
//         console.log('Settling has not gone from false to true');

//         return null;
//     }

//     if (previousTripData.settlingAt) {
//         // Ensure at least one minute has passed since last attempt of settling
//         const lastAttempt = moment(previousTripData.settlingAt);

//         const nowMinusOneMinute = moment().subtract(1, 'm');  // Subtract one 'minute' from now

//         if (nowMinusOneMinute.isBefore(lastAttempt)) {
//             console.log('Settling at was less than one minute ago');

//             return null;
//         }
//     }

//     console.log('settling for...', context.params.tripId);

//     const users = tripData.users;

//     admin.firestore().collection('trips')
//         .doc(context.params.tripId)
//         .collection('transactions')
//         .get()
//         .then(querySnapshot => {
//             let totalTripAmount = 0;
//             // Calculate total spent for each user
//             querySnapshot.forEach(function(transaction) {
//                 if (users[transaction.data().createdById].totalSpent) {
//                     users[transaction.data().createdById].totalSpent += transaction.data().amount;
//                 } else {
//                     users[transaction.data().createdById].totalSpent = transaction.data().amount;
//                 }

//                 totalTripAmount += transaction.data().amount;
//             });

//             const numberOfUsers = Object.keys(users).length;

//             const fairSplitAmount = totalTripAmount / numberOfUsers;

//             console.log();

//             const debtors = [];

//             const creditors = [];

//             const reimbursementRecords = [];

//             for (var id in users) {
//                 if (users[id].totalSpent === undefined) {
//                     console.log(users[id].username + ' spent nothing');
//                     users[id].totalSpent = 0;
//                 }

//                 const creditOrDebtAmount = users[id].totalSpent - fairSplitAmount;

//                 console.log('credit or debt amount for ' + users[id].username + ' = ' + creditOrDebtAmount);

//                 if (creditOrDebtAmount > 0) {
//                     // Original is used for our records
//                     // Calculated is used when calculating reimbursementRecords
//                     users[id].originalCredit = creditOrDebtAmount;
//                     users[id].calculatedCredit = creditOrDebtAmount;
//                     users[id].reimbursementsCalculated = false;

//                     creditors.push(users[id]);

//                     console.log(users[id].username + ' added to creditors - ' + users[id].originalCredit);

//                     // Most credit on top
//                     creditors.sort((a, b) => (a.originalCredit < b.originalCredit) ? 1 : -1);
//                 } else {
//                     users[id].originalDebt = Math.abs(creditOrDebtAmount);
//                     users[id].calculatedDebt = Math.abs(creditOrDebtAmount);
//                     users[id].reimbursementsCalculated = false;

//                     debtors.push(users[id]);

//                     console.log(users[id].username + ' added to debtors - ' + users[id].originalDebt);

//                     // Most debt on top
//                     debtors.sort((a, b) => (a.originalDebt < b.originalDebt) ? 1 : -1);
//                 }
//             }

//             console.log('creditors', creditors);

//             console.log('debtors', debtors);

//             if (debtors.length > 0 && creditors.length > 0) {
//                 debtors.forEach(function(debtor) {
//                     console.log('Looping through debtors');

//                     while (debtor.reimbursementsCalculated === false) {
//                         // Find the first creditor where creditor.reimbursementsCalculated = false
//                         let creditor = creditors.find(creditor => creditor.reimbursementsCalculated === false);

//                         if (!creditor) {
//                             // There's no one else to pay. Not quite sure why we event get here but we do
//                             console.log('No creditors left to pay');

//                             break;
//                         }

//                         console.log('found a creditor ' + creditor.initials + ', calculated credit = ', creditor.calculatedCredit);

//                         // if debtor calculatedDebt is greater that the creditor calculatedCredit
//                         if (debtor.calculatedDebt >= creditor.calculatedCredit) {

//                             // create a reimbursement record
//                             reimbursementRecords.push({
//                                 fromInitials: debtor.initials,
//                                 toInitials: creditor.initials,
//                                 amount: creditor.calculatedCredit
//                             });

//                             debtor.calculatedDebt -= creditor.calculatedCredit;
//                             if (debtor.calculatedDebt <= 0) {
//                                 debtor.reimbursementsCalculated = true;
//                             }

//                             creditor.calculatedCredit = 0;
//                             creditor.reimbursementsCalculated = true;

//                             console.log('Done debtor debt was greater than creditor credit');
//                         } else {
//                             // Debtor calculated debt is less than the creditor calculated credit

//                             // create a reimbursement record
//                             reimbursementRecords.push({
//                                 fromInitials: debtor.initials,
//                                 toInitials: creditor.initials,
//                                 amount: debtor.calculatedDebt
//                             });

//                             creditor.calculatedCredit -= debtor.calculatedDebt;
//                             if (creditor.calculatedCredit <= 0) {
//                                 creditor.reimbursementsCalculated = true;
//                             }
//                             debtor.calculatedDebt = 0;
//                             debtor.reimbursementsCalculated = true;

//                             console.log('Done debtor debt was less that creditor credit');
//                         }
//                     }
//                 });
//             } else {
//                 console.log('There are either no creditors or not debtors');
//             }

//             console.log('Attempting to add reimbusement records', reimbursementRecords);

//             const promises = [];

//             reimbursementRecords.forEach(function(reimbursement) {
//                 console.log('in reimbusement for each ', reimbursement);
//                 const promise = admin.firestore().collection('trips')
//                     .doc(context.params.tripId)
//                     .collection('reimbursements')
//                     .add(
//                         reimbursement
//                     );

//                     promises.push(promise);
//             });

//             console.log('done reibusements for each.........');

//             Promise.all(promises).then(() => {
//                 console.log('setting settled to true and settling to false');

//                 // Return a promise of a set operation to update the settled and settling values
//                 return change.after.ref.set({
//                     settling: false,
//                     settled: true,
//                     settlingAt: new Date()
//                 }, {merge: true});
//             });

//         });
// })
