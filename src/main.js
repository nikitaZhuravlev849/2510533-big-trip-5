import PointsListPresenter from './presenter/points-list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import SortPresenter from './presenter/sort-presenter.js';
import NewPointButtonPresenter from './presenter/new-point-button-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsListModel from './model/points-list-model.js';
import FilterModel from './model/filter-model.js';
import SortModel from './model/sort-model.js';
import PointsApiService from './points-api-service.js';
import { AUTHORIZATION, END_POINT } from './consts.js';

const tripMainContainerElement = document.querySelector('.trip-main');
const tripEventsContainerElement = document.querySelector('.trip-events');
const filterContainerElement = document.querySelector('.trip-controls__filters');

const pointsListModel = new PointsListModel({pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)});
const filterModel = new FilterModel();
const sortModel = new SortModel();

new TripInfoPresenter({
  containerElement: tripMainContainerElement,
  pointsListModel: pointsListModel,
}).init();

const newPointButtonPresenter = new NewPointButtonPresenter({
  containerElement: tripMainContainerElement,
  pointsListModel,
});

const pointsListPresenter = new PointsListPresenter({
  containerElement: tripEventsContainerElement,
  filterModel,
  sortModel,
  pointsListModel,
  newPointButtonPresenter,
});

new SortPresenter({
  containerElement: tripEventsContainerElement,
  sortModel,
  pointsListModel,
  filterModel,
}).init();

new FilterPresenter({
  containerElement: filterContainerElement,
  filterModel,
  pointsListModel,
}).init();

newPointButtonPresenter.init({ buttonClickHandler: pointsListPresenter.newPointButtonClickHandler });
pointsListPresenter.init();
pointsListModel.init();
