import mongoose from 'mongoose';

export function genMatch(query) {
  const match = {};

  if (query.search) {
    Object.assign(match, {
      search: {
        $in: query.search.split(' ').map((s) => new RegExp(s, 'i')),
      },
    });
  }

  if (query.categories || query.category) {
    const categories = query.categories ?? [query.category];
    Object.assign(match, {
      category: {
        $in: categories.map((id: string) => new mongoose.Types.ObjectId(id)),
      },
    });
  }

  if (query.brand) {
    const brand = [query.brand];
    Object.assign(match, {
      brand: {
        $in: brand.map((id: string) => new mongoose.Types.ObjectId(id)),
      },
    });
  }

  return match;
}
