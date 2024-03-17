export function genMatch(query) {
  const match = {};

  if (query.search) {
    Object.assign(match, {
      search: {
        $in: query.search.split(' ').map((s) => new RegExp(s, 'i')),
      },
    });
  }

  if (query.status) {
    Object.assign(match, {
      status: query.status,
    });
  }

  if (query.date) {
    const startDate = new Date(query.date); // Start of the specified day
    startDate.setHours(0, 0, 0, 0); // Set time to start of day (midnight)

    const endDate = new Date(query.date); // End of the specified day
    endDate.setHours(23, 59, 59, 999); // Set time to end of day (just before midnight)

    console.log(query.date);
    Object.assign(match, {
      updatedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
  }

  if (query.military_number) {
    Object.assign(match, {
      'user.military_number': query.military_number,
    });
  }

  if (query.name) {
    Object.assign(match, {
      'user.name': {
        $in: query.name.split(' ').map((s) => new RegExp(s, 'i')),
      },
    });
  }

  return match;
}
