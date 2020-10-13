import { filterTrips } from './Dashboard';

test('filterTrips returns undefined if trips is undefined', () => {
  const filteredTrips = filterTrips(undefined, 1, false);

  expect(filteredTrips).toBe(undefined);
});

test('filterTrips returns an arry of trips where user in on the trip or created it', () => {
  const unfilteredTrips = [
    {
      createdById: 1,
      users: {1: {}}
    },
    {
      createdById: 2,
      users: [{2: {}}]
    },
    {
      createdById: 3,
      users: {1: {}}
    },
    {
      createdById: 3,
      users: {2: {}}
    },
    {
      createdById: 1,
      users: {2: {}, 3: {}}
    },
  ];

  const expectedTrips = [
    {
      createdById: 1,
      users: {1: {}}
    },
    {
      createdById: 3,
      users: {1: {}}
    },
    {
      createdById: 1,
      users: {2: {}, 3: {}}
    },
  ];

  const userId = 1;

  const filteredTrips = filterTrips(unfilteredTrips, userId, false);

  expect(filteredTrips).toEqual(expectedTrips);
});

test('filterTrips returns all trips if showAllTrips == true', () => {
  const unfilteredTrips = [
    {
      createdById: 1,
      users: {1: {}}
    },
    {
      createdById: 2,
      users: [{2: {}}]
    },
    {
      createdById: 3,
      users: {1: {}}
    },
    {
      createdById: 3,
      users: {2: {}}
    },
    {
      createdById: 1,
      users: {2: {}, 3: {}}
    },
  ];

  let expectedTrips = [
    {
      createdById: 1,
      users: {1: {}}
    },
    {
      createdById: 3,
      users: {1: {}}
    },
    {
      createdById: 1,
      users: {2: {}, 3: {}}
    },
  ];

  const userId = 1;

  let filteredTrips = filterTrips(unfilteredTrips, userId, false);

  expect(filteredTrips).toEqual(expectedTrips);

  expectedTrips = [
    {
      createdById: 1,
      users: {1: {}}
    },
    {
      createdById: 2,
      users: [{2: {}}]
    },
    {
      createdById: 3,
      users: {1: {}}
    },
    {
      createdById: 3,
      users: {2: {}}
    },
    {
      createdById: 1,
      users: {2: {}, 3: {}}
    },
  ];

  filteredTrips = filterTrips(unfilteredTrips, userId, true);

  expect(filteredTrips).toEqual(expectedTrips);
});
