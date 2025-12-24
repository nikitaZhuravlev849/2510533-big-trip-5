import dayjs from 'dayjs';
import { SortType } from '../consts.js';

export const pointsSorters = {
  [SortType.DAY]: (points) => points.sort((pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom))),
  [SortType.TIME]: (points) => points.sort((pointA, pointB) => dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom)) - dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom))),
  [SortType.PRICE]: (points) => points.sort((pointA, pointB) => pointB.basePrice - pointA.basePrice),
};
