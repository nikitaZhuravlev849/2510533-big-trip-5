import dayjs from 'dayjs';
import { pointsSorters } from '../utils/sort.js';
import { SortType } from '../consts.js';

export const updateItem = (items, updated) => items.map((item) => item.id === updated.id ? updated : item);

export const getDateDifference = (date1, date2) => {
  const minutesInHour = 60;
  const minutesInDay = 24 * minutesInHour;
  const diffMinutes = Math.abs(dayjs(date2).diff(dayjs(date1), 'minute'));
  const days = Math.floor(diffMinutes / minutesInDay);
  const hours = Math.floor((diffMinutes - days * minutesInDay) / minutesInHour);
  const minutes = diffMinutes % minutesInHour;

  if (days > 0) {
    return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
  return `${String(minutes).padStart(2, '0')}M`;
};

export const getTime = (date) => dayjs(date).format('HH:mm');
export const getMonthAndDay = (date) => dayjs(date).format('MMM DD');
export const getDayAndMonth = (date) => dayjs(date).format('D MMM');
export const getFullDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

export const isSameDates = (date1, date2) => dayjs(date1).isSame(date2);

export const getOffersByType = (type, allOffers) => allOffers.find((offer) => offer.type === type)?.offers;
export const getOfferById = (id, allOffers) => allOffers.find((offer) => offer.id === id);
export const getDestinationById = (id, destinations) => destinations.find((destination) => destination.id === id);
export const getDestinationByName = (name, destinations) => destinations.find((destination) => destination.name === name);

export const getPointsDataRange = (points) => {
  if (!points.length) {
    return { startDate: '', endDate: '' };
  }
  const sortedPoints = pointsSorters[SortType.DAY]([...points]);
  return {
    startDate: getDayAndMonth(sortedPoints[0].dateFrom),
    endDate: getDayAndMonth(sortedPoints.at(-1).dateTo),
  };
};

export const getTripRoute = (points, destinations) => {
  if (!points.length) {
    return [];
  }
  const sortedPoints = pointsSorters[SortType.DAY]([...points]);
  return sortedPoints.map((point) => getDestinationById(point.destination, destinations).name);
};

export const getTripPrice = (points, allOffers) =>
  points.reduce((total, { type, basePrice, offers }) => {
    const availableOffers = getOffersByType(type, allOffers) || [];
    const offersCost = offers.reduce((sum, id) => sum + getOfferById(id, availableOffers).price, 0);
    return total + basePrice + offersCost;
  }, 0);
