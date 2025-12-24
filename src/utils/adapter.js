export function adaptToServer(point) {
  const {
    dateFrom,
    dateTo,
    basePrice,
    isFavorite,
    ...rest
  } = point;

  return {
    ...rest,
    'date_from': dateFrom instanceof Date ? dateFrom.toISOString() : null,
    'date_to': dateTo instanceof Date ? dateTo.toISOString() : null,
    'base_price': basePrice,
    'is_favorite': isFavorite,
  };
}

export function adaptToClient(point) {
  const {
    'date_from': dateFromRaw,
    'date_to': dateToRaw,
    'base_price': basePrice,
    'is_favorite': isFavorite,
    ...rest
  } = point;

  return {
    ...rest,
    dateFrom: dateFromRaw ? new Date(dateFromRaw) : null,
    dateTo: dateToRaw ? new Date(dateToRaw) : null,
    basePrice,
    isFavorite,
  };
}
