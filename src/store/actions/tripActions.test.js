import {
  getAmountSpentPerUser,
  updateUsersAmountTaken,
  calculateCreditOrDebt,
  calculateReimbursementRecords
} from './tripActions';

test('getAmountSpentPerUser returns a sorted array', () => {
  const users = {
    Did: { id: 'Did' },
    MJid: { id: 'MJid' },
    RPid: { id: 'RPid' }
  };

  const querySnapshot = [
    { data: () => ({ amount: 2, createdById: 'Did' }) },
    { data: () => ({ amount: 500, createdById: 'MJid' }) },
    { data: () => ({ amount: 250, createdById: 'RPid' }) }
  ];

  const usersAmountSpent = getAmountSpentPerUser(users, querySnapshot);

  // Assert that it returns an array
  expect(Array.isArray(usersAmountSpent)).toBeTruthy();

  // Assert that the least spent is at the start of the array
  expect(usersAmountSpent[0]).toEqual(
    expect.objectContaining({ userId: 'Did', amountSpent: 2 })
  );

  // Assert that the most spent is at the end of the array
  expect(usersAmountSpent[2]).toEqual(
    expect.objectContaining({ userId: 'MJid', amountSpent: 500 })
  );

  // Assert that it adds amountTaken property to users
  expect(users['Did']).toHaveProperty('amountTaken', 0);
});

test('updateUsersAmountTaken updates users amount taken', () => {
  // This example is good because it includes transactiosn where a user pays for the whole group, a
  // user just pays for another person, and contains amounts where it doesn't split equally between
  // the beneficiaries so we can test the penny rounding
  const querySnapshot = [
    {
      data: () => ({
        amount: 8,
        createdById: 'RPid',
        beneficiaries: [{ id: 'RPid' }, { id: 'Aid' }, { id: 'Bid' }]
      })
    },
    {
      data: () => ({
        amount: 12.45,
        createdById: 'Cid',
        beneficiaries: [
          { id: 'RPid' },
          { id: 'Aid' },
          { id: 'Bid' },
          { id: 'Cid' }
        ]
      })
    },
    {
      data: () => ({
        amount: 10,
        createdById: 'RPid',
        beneficiaries: [{ id: 'Bid' }]
      })
    },
    {
      data: () => ({
        amount: 6.5,
        createdById: 'Aid',
        beneficiaries: [{ id: 'Aid' }, { id: 'Bid' }]
      })
    },
    {
      data: () => ({
        amount: 2,
        createdById: 'Bid',
        beneficiaries: [{ id: 'Cid' }]
      })
    }
  ];

  const users = {
    RPid: { id: 'RPid', amountTaken: 0 },
    Aid: { id: 'Aid', amountTaken: 0 },
    Bid: { id: 'Bid', amountTaken: 0 },
    Cid: { id: 'Cid', amountTaken: 0 }
  };

  const usersAmountSpent = [
    { userId: 'Bid', amountSpent: 2 },
    { userId: 'Aid', amountSpent: 6.5 },
    { userId: 'Cid', amountSpent: 12.45 },
    { userId: 'RPid', amountSpent: 18 }
  ];

  updateUsersAmountTaken(users, usersAmountSpent, querySnapshot);

  // Assert that each user has the correct amount taken value
  expect(users).toEqual({
    RPid: { id: 'RPid', amountTaken: 5.77 },
    Aid: { id: 'Aid', amountTaken: 9.03 },
    Bid: { id: 'Bid', amountTaken: 19.04 },
    Cid: { id: 'Cid', amountTaken: 5.11 }
  });
});

test('calculateCreditOrDebt updated creditors and debtors array correctly', () => {
  const creditors = [];

  const debtors = [];

  const users = {
    RPid: { id: 'RPid', amountTaken: 5.77, amountSpent: 18 },
    Aid: { id: 'Aid', amountTaken: 9.03, amountSpent: 6.5 },
    Bid: { id: 'Bid', amountTaken: 19.04, amountSpent: 2 },
    Cid: { id: 'Cid', amountTaken: 5.11, amountSpent: 12.45 }
  };

  calculateCreditOrDebt(users, creditors, debtors);

  // Assert the length
  expect(creditors.length).toBe(2);

  // Asset the content
  expect(creditors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ id: 'RPid', calculatedCredit: 12.23 }),
      expect.objectContaining({ id: 'Cid', calculatedCredit: 7.34 })
    ])
  );

  // Assert that the biggest credit is at the start of the array
  expect(creditors[0]).toEqual(
    expect.objectContaining({ id: 'RPid', calculatedCredit: 12.23 })
  );

  // Asset the length
  expect(debtors.length).toBe(2);

  // Asset the content
  expect(debtors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ id: 'Aid', calculatedDebt: 2.53 }),
      expect.objectContaining({ id: 'Bid', calculatedDebt: 17.04 })
    ])
  );

  // Assert that the biggest debth is at the start of the array
  expect(debtors[0]).toEqual(
    expect.objectContaining({ id: 'Bid', calculatedDebt: 17.04 })
  );
});

test('calculateReimbursementRecords creates reimbursementRecords properley', () => {
  const creditors = [
    {
      id: 'RPid',
      initials: 'RP',
      username: 'Richy Pee',
      originalCredit: 12.23,
      calculatedCredit: 12.23,
      reimbursementsCalculated: false
    },
    {
      id: 'Cid',
      initials: 'C',
      username: 'Carlos Bee',
      originalCredit: 7.34,
      calculatedCredit: 7.34,
      reimbursementsCalculated: false
    }
  ];

  const debtors = [
    {
      id: 'Bid',
      initials: 'B',
      username: 'Bob Fry',
      originalDebt: 17.04,
      calculatedDebt: 17.04,
      reimbursementsCalculated: false
    },
    {
      id: 'Aid',
      initials: 'A',
      username: 'Anne Boe',
      originalCredit: 2.53,
      calculatedDebt: 2.53,
      reimbursementsCalculated: false
    }
  ];

  const reimbursementRecords = [];

  calculateReimbursementRecords(creditors, debtors, reimbursementRecords);

  expect(reimbursementRecords.length).toBe(3);

  expect(reimbursementRecords).toEqual(
    expect.arrayContaining([
      {
        fromInitials: 'B',
        fromUsername: 'Bob Fry',
        toInitials: 'RP',
        toUsername: 'Richy Pee',
        amount: 12.23
      },
      {
        fromInitials: 'B',
        fromUsername: 'Bob Fry',
        toInitials: 'C',
        toUsername: 'Carlos Bee',
        amount: 4.81
      },
      {
        fromInitials: 'A',
        fromUsername: 'Anne Boe',
        toInitials: 'C',
        toUsername: 'Carlos Bee',
        amount: 2.53
      }
    ])
  );
});
