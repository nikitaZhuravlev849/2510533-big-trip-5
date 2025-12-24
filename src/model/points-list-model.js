import Observable from '../framework/observable.js';
import { updateItem } from '../utils/point.js';
import { adaptToClient } from '../utils/adapter.js';
import { UpdateType } from '../consts.js';

export default class PointsListModel extends Observable {
  #points = [];
  #offers = [];
  #destinations = [];
  #pointsApiService;

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    let isError = false;
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(adaptToClient);
      this.#destinations = await this.#pointsApiService.destinations;
      this.#offers = await this.#pointsApiService.offers;
    } catch(err) {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
      isError = true;
    }
    this._notify(UpdateType.INIT, { isError });
  }

  async updatePoint(updateType, point) {
    const response = await this.#pointsApiService.updatePoint(point);
    const updatedPoint = adaptToClient(response);
    this.#points = updateItem(this.#points, updatedPoint);
    this._notify(updateType, updatedPoint);
  }

  async addPoint(updateType, point) {
    const response = await this.#pointsApiService.addPoint(point);
    const newPoint = adaptToClient(response);
    this.#points = [newPoint, ...this.#points];
    this._notify(updateType, newPoint);
  }

  async deletePoint(updateType, point) {
    await this.#pointsApiService.deletePoint(point);
    this.#points = this.#points.filter((item) => item.id !== point.id);
    this._notify(updateType);
  }
}
