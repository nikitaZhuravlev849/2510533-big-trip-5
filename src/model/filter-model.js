import Observable from '../framework/observable.js';
import { FilterType } from '../consts.js';

export default class FilterModel extends Observable {
  #currentFilterType = FilterType.EVERYTHING;

  get currentFilterType() {
    return this.#currentFilterType;
  }

  setFilter(updateType, filterType) {
    this.#currentFilterType = filterType;
    this._notify(updateType, filterType);
  }
}
