export const getQuerySettings = query => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;
  const settings = { skip, limit };

  return settings;
};

export const getQueryFilter = request => {
  const { user, query } = request;

  const filter = { owner: user._id };

  if (Object.keys(query).includes('favorite')) {
    filter.favorite = query.favorite;
  }

  return filter;
};
