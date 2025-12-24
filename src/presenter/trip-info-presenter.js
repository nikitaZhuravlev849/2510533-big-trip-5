import TripInfoView from '../view/trip-info-view.js';
import { render, remove, replace, RenderPosition } from '../framework/render.js';
import { getPointsDataRange, getTripPrice, getTripRoute } from '../utils/point.js';

export default class TripInfoPresenter {
  #containerElement;
  #pointsListModel;
  #component;

  constructor({ containerElement, pointsListModel }) {
    this.#containerElement = containerElement;
    this.#pointsListModel = pointsListModel;
    this.#pointsListModel.addObserver(this.#modelChangeHandler);
  }

  init() {
    const points = this.#pointsListModel.points;

    if (points.length === 0) {
      if (this.#component) {
        remove(this.#component);
        this.#component = null;
      }
      return;
    }

    const dateRange = getPointsDataRange(points);
    const routeCities = getTripRoute(points, this.#pointsListModel.destinations);
    const totalPrice = getTripPrice(points, this.#pointsListModel.offers);

    const previousComponent = this.#component;
    this.#component = new TripInfoView(dateRange, routeCities, totalPrice);

    if (!previousComponent) {
      render(this.#component, this.#containerElement, RenderPosition.AFTERBEGIN);
    } else {
      replace(this.#component, previousComponent);
    }
  }

  #modelChangeHandler = () => this.init();
}
